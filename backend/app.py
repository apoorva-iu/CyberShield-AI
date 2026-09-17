import os
import uuid
import copy
import datetime
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS

from services.job_detector import scan_job
from services.ai_service import scan_full_pipeline
from services.blockchain_service import blockchain, ledger_collection
from services.db_service import (
    save_scan_record,
    save_job_scan_record,
    get_scan_by_id,
    get_job_scan_by_id,
    get_recent_scans,
    get_recent_job_scans,
    get_blockchain_ledger
)

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


def _no_cache_response(data, status_code=200):
    """Enforces strict HTTP headers to prevent browsers from caching stale ledger records."""
    resp = make_response(jsonify(data), status_code)
    resp.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    resp.headers["Pragma"] = "no-cache"
    resp.headers["Expires"] = "0"
    return resp


@app.route("/", methods=["GET"])
def health_check():
    return _no_cache_response({
        "status": "online",
        "service": "CyberShield AI Threat Engine",
        "blockchain_height": len(blockchain.chain)
    })


@app.route("/api/scan/phishing", methods=["POST"])
def scan_phishing():
    saved_img_path = None
    try:
        json_data = request.get_json(silent=True) or {}
        explicit_url = request.form.get("url") or json_data.get("url") or request.args.get("url")

        if explicit_url:
            explicit_url = str(explicit_url).strip("[]'\" <>").strip()
            if not explicit_url:
                explicit_url = None

        uploaded_file = request.files.get("image", None)
        original_filename = None

        if uploaded_file and uploaded_file.filename != '':
            original_filename = uploaded_file.filename
            unique_name = f"{uuid.uuid4().hex}_{uploaded_file.filename}"
            saved_img_path = os.path.join(app.config["UPLOAD_FOLDER"], unique_name)
            uploaded_file.save(saved_img_path)

        if not explicit_url and not saved_img_path:
            return jsonify({"error": "Please provide either a URL or an image screenshot to scan."}), 400

        ai_result = scan_full_pipeline(image_path=saved_img_path, explicit_url=explicit_url)

        verification_id = f"CS-SCAN-{uuid.uuid4().hex[:8].upper()}"
        timestamp_str = datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

        audit_data = {
            "verdict": ai_result.get("verdict"),
            "threat_level": ai_result.get("threat_level"),
            "risk_score": ai_result.get("composite_risk_score"),
            "target_url": explicit_url
        }
        blockchain_receipt = blockchain.add_scan_record(
            verification_id=verification_id, 
            scan_data=audit_data, 
            scan_type="url"
        )

        target_display = explicit_url or original_filename or "URL Scan"
        full_record = {
            "verification_id": verification_id,
            "scan_type": "url",
            "input_metadata": {
                "explicit_url": explicit_url,
                "filename": original_filename,
                "has_screenshot": saved_img_path is not None,
                "target": target_display,
                "title": target_display
            },
            "ai_analysis": ai_result,
            "blockchain_audit": blockchain_receipt,
            "timestamp": timestamp_str
        }

        db_audit_meta = save_scan_record(copy.deepcopy(full_record))
        if db_audit_meta:
            full_record["db_ledger_receipt"] = db_audit_meta

        if saved_img_path and os.path.exists(saved_img_path):
            os.remove(saved_img_path)

        return _no_cache_response(full_record, 200)

    except Exception as e:
        if saved_img_path and os.path.exists(saved_img_path):
            os.remove(saved_img_path)
        return jsonify({"error": f"Internal scan processing error: {str(e)}"}), 500


@app.route("/api/scan/job", methods=["POST"])
def scan_job_endpoint():
    try:
        json_data = request.get_json(silent=True) or {}

        # Accept whichever text property is sent by the frontend
        raw_text_input = (
            json_data.get("raw_text") or 
            json_data.get("text") or 
            json_data.get("description") or 
            ""
        ).strip()

        if not raw_text_input:
            return jsonify({"error": "Please provide job details in the request body."}), 400

        # Step A: Run YOUR existing scan_job function directly
        ai_result = scan_job({"raw_text": raw_text_input})

        # Step B: Log to blockchain ledger
        verification_id = f"CS-JOB-{uuid.uuid4().hex[:8].upper()}"
        timestamp_str = datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

        extracted_signals = ai_result.get("extracted_signals", {})
        company_name = (
            extracted_signals.get("company_name") or
            json_data.get("title") or
            "Job Posting"
        )

        audit_data = {
            "verdict": ai_result.get("verdict"),
            "threat_level": ai_result.get("risk_level"),
            "risk_score": ai_result.get("risk_score"),
            "company_name": company_name
        }
        blockchain_receipt = blockchain.add_scan_record(
            verification_id=verification_id, 
            scan_data=audit_data, 
            scan_type="job"
        )

        # Step C: Save to MongoDB job_fraud_history collection
        full_record = {
            "verification_id": verification_id,
            "scan_type": "job",
            "input_metadata": {
                "title": json_data.get("title", ""),
                "company_name": company_name,
                "target": company_name,
                "snippet": raw_text_input[:250]
            },
            "ai_analysis": ai_result,
            "blockchain_audit": blockchain_receipt,
            "timestamp": timestamp_str
        }

        db_audit_meta = save_job_scan_record(copy.deepcopy(full_record))
        if db_audit_meta:
            full_record["db_ledger_receipt"] = db_audit_meta

        # Step D: Response structured with ai_analysis so JobScanner.jsx renders properly
        response_payload = {
            "verification_id": verification_id,
            "blockchain_audit": blockchain_receipt,
            "scan_type": "job",
            "ai_analysis": ai_result,
            **ai_result
        }

        return _no_cache_response(response_payload, 200)

    except Exception as e:
        return jsonify({"error": f"Internal job scan processing error: {str(e)}"}), 500


@app.route("/api/blockchain/verify", methods=["POST"])
def verify_hash():
    data = request.get_json(silent=True) or {}
    verification_id = str(data.get("verification_id", "")).strip()
    claimed_hash = str(data.get("result_hash", "")).strip().lower()

    if not verification_id or not claimed_hash:
        return jsonify({"error": "Missing verification_id or result_hash in JSON payload."}), 400

    # 1. Cryptographic check on the blockchain ledger block
    verification_report = blockchain.verify_integrity(verification_id, claimed_hash)

    # 2. Cross-verify with Application DB
    app_doc = get_job_scan_by_id(verification_id) or get_scan_by_id(verification_id)
    if app_doc and ledger_collection is not None:
        block_doc = ledger_collection.find_one({"verification_id": verification_id}, {"_id": 0})
        if block_doc:
            db_threat = str(
                app_doc.get("ai_analysis", {}).get("threat_level") or 
                app_doc.get("ai_analysis", {}).get("risk_level") or ""
            ).strip().upper()

            block_threat = str(
                block_doc.get("scan_data", {}).get("threat_level") or 
                block_doc.get("scan_data", {}).get("risk_level") or ""
            ).strip().upper()

            if db_threat and block_threat and (db_threat != block_threat):
                verification_report["is_valid"] = False
                verification_report["is_tampered"] = True
                verification_report["tamper_detected"] = True
                verification_report["message"] = (
                    f"TAMPERING DETECTED: Discrepancy between Blockchain Ledger ('{block_threat}') "
                    f"and Application Database ('{db_threat}')!"
                )

    return _no_cache_response(verification_report, 200)


@app.route("/api/blockchain/ledger", methods=["GET"])
@app.route("/api/ledger", methods=["GET"])
def get_ledger():
    blocks = get_blockchain_ledger()
    return _no_cache_response({"ledger": blocks, "total_blocks": len(blocks)}, 200)


@app.route("/api/scan/report/<verification_id>", methods=["GET"])
def get_report(verification_id):
    record = get_job_scan_by_id(verification_id) or get_scan_by_id(verification_id)
    if record:
        if "_id" in record:
            record["_id"] = str(record["_id"])
        return _no_cache_response(record, 200)
    return jsonify({"error": "Scan record not found on database"}), 404


@app.route("/api/history", methods=["GET"])
def history():
    try:
        limit = int(request.args.get("limit", 10))
        url_scans = get_recent_scans(limit=20) or []
        job_scans = get_recent_job_scans(limit=20) or []

        combined = url_scans + job_scans

        for r in combined:
            if "_id" in r:
                r["_id"] = str(r["_id"])

        def resolve_sort_key(item):
            audit = item.get("blockchain_audit") or {}
            idx = audit.get("block_index")
            if idx is not None and isinstance(idx, (int, float)):
                return int(idx)
            return 0

        combined.sort(key=resolve_sort_key, reverse=True)
        recent_ten = combined[:limit]

        return _no_cache_response({"history": recent_ten}, 200)
    except Exception as e:
        return jsonify({"history": [], "error": f"Failed to retrieve history: {str(e)}"}), 500


@app.route("/api/history/jobs", methods=["GET"])
def job_history():
    records = get_recent_job_scans(limit=10) or []
    for r in records:
        if "_id" in r:
            r["_id"] = str(r["_id"])
    return _no_cache_response({"history": records}, 200)


if __name__ == "__main__":
    print("CyberShield AI Backend Running on http://127.0.0.1:5000")
    app.run(host="0.0.0.0", port=5000, debug=False)
    