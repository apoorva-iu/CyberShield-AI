import os
import uuid
import copy
from flask import Flask, request, jsonify
from flask_cors import CORS

from services.job_service import scan_job
from services.ai_service import scan_full_pipeline
from services.blockchain_service import blockchain
from services.db_service import (
    save_scan_record,
    get_scan_by_id,
    get_recent_scans,
    get_blockchain_ledger
)

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


@app.route("/", methods=["GET"])
def health_check():
    return jsonify({
        "status": "online",
        "service": "CyberShield AI Threat Engine",
        "blockchain_height": len(blockchain.chain)
    }), 200


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

        # Step A: Multimodal AI Analysis
        ai_result = scan_full_pipeline(image_path=saved_img_path, explicit_url=explicit_url)

        # Step B: Blockchain Audit Logging
        verification_id = f"CS-SCAN-{uuid.uuid4().hex[:8].upper()}"
        audit_data = {
            "verdict": ai_result.get("verdict"),
            "threat_level": ai_result.get("threat_level"),
            "risk_score": ai_result.get("composite_risk_score"),
        }
        blockchain_receipt = blockchain.add_scan_record(verification_id, audit_data)

        # Step C: MongoDB Storage Payload
        full_record = {
            "verification_id": verification_id,
            "input_metadata": {
                "explicit_url": explicit_url,
                "filename": original_filename,
                "has_screenshot": saved_img_path is not None
            },
            "ai_analysis": ai_result,
            "blockchain_audit": blockchain_receipt
        }

        # Step D: Save Scan & Mine Block to MongoDB
        db_audit_meta = save_scan_record(copy.deepcopy(full_record))
        if db_audit_meta:
            full_record["db_ledger_receipt"] = db_audit_meta

        # Cleanup temporary image file from disk
        if saved_img_path and os.path.exists(saved_img_path):
            os.remove(saved_img_path)

        return jsonify(full_record), 200

    except Exception as e:
        if saved_img_path and os.path.exists(saved_img_path):
            os.remove(saved_img_path)
        return jsonify({"error": f"Internal scan processing error: {str(e)}"}), 500


@app.route("/api/blockchain/verify", methods=["POST"])
def verify_hash():
    data = request.get_json(silent=True) or {}
    verification_id = data.get("verification_id")
    claimed_hash = data.get("result_hash")

    if not verification_id or not claimed_hash:
        return jsonify({"error": "Missing verification_id or result_hash in JSON payload."}), 400

    verification_report = blockchain.verify_integrity(verification_id, claimed_hash)
    return jsonify(verification_report), 200


@app.route("/api/blockchain/ledger", methods=["GET"])
@app.route("/api/ledger", methods=["GET"])
def get_ledger():
    blocks = get_blockchain_ledger()
    return jsonify({"ledger": blocks, "total_blocks": len(blocks)}), 200


@app.route("/api/scan/report/<verification_id>", methods=["GET"])
def get_report(verification_id):
    record = get_scan_by_id(verification_id)
    if record:
        if "_id" in record:
            record["_id"] = str(record["_id"])
        return jsonify(record), 200
    return jsonify({"error": "Scan record not found on database"}), 404


@app.route("/api/history", methods=["GET"])
def history():
    records = get_recent_scans(limit=20)
    for r in records:
        if "_id" in r:
            r["_id"] = str(r["_id"])
    return jsonify({"history": records}), 200


if __name__ == "__main__":
    print("CyberShield AI Backend Running on http://127.0.0.1:5000")
    app.run(host="0.0.0.0", port=5000, debug=False)