import hashlib
import json
from datetime import datetime, timezone
from pymongo import MongoClient

MONGO_URI = "mongodb://localhost:27017"
DB_NAME = "cybershield_ai"

try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
    db = client[DB_NAME]
    ledger_collection = db["blockchain_ledger"]
    job_scans_collection = db["job_fraud_history"]
    scans_collection = db["scan_history"]
    client.server_info()
    print("✅ [Blockchain] Connected to MongoDB blockchain_ledger & scan databases.")
except Exception as e:
    print(f"⚠️ [Blockchain] MongoDB connection notice: {e}")
    ledger_collection = None
    job_scans_collection = None
    scans_collection = None


def _sanitize_for_json(obj):
    """
    Recursively converts NumPy types, floats, and non-standard objects
    into deterministic JSON-serializable primitives.
    """
    if isinstance(obj, dict):
        return {str(k): _sanitize_for_json(v) for k, v in sorted(obj.items())}
    elif isinstance(obj, (list, tuple)):
        return [_sanitize_for_json(v) for v in obj]
    elif hasattr(obj, "item"):
        val = obj.item()
        return round(val, 4) if isinstance(val, float) else val
    elif isinstance(obj, float):
        return round(obj, 4)
    return obj


def _compute_canonical_block_hash(index, timestamp, verification_id, scan_type, scan_data, previous_hash):
    """
    Produces a deterministic SHA-256 hash with compact separators (no whitespace differences).
    """
    payload = {
        "index": int(index),
        "timestamp": str(timestamp),
        "verification_id": str(verification_id),
        "scan_type": str(scan_type),
        "scan_data": _sanitize_for_json(scan_data),
        "previous_hash": str(previous_hash)
    }
    canonical_string = json.dumps(payload, sort_keys=True, separators=(',', ':'))
    return hashlib.sha256(canonical_string.encode('utf-8')).hexdigest()


class CyberShieldBlock:
    def __init__(self, index, timestamp, verification_id, scan_data, previous_hash, scan_type="url", result_hash=None):
        self.index = int(index)
        self.timestamp = str(timestamp)
        self.verification_id = str(verification_id)
        self.scan_type = str(scan_type)
        self.scan_data = _sanitize_for_json(scan_data)
        self.previous_hash = str(previous_hash)
        self.result_hash = result_hash or self.compute_hash()

    def compute_hash(self):
        return _compute_canonical_block_hash(
            index=self.index,
            timestamp=self.timestamp,
            verification_id=self.verification_id,
            scan_type=self.scan_type,
            scan_data=self.scan_data,
            previous_hash=self.previous_hash
        )

    def to_dict(self):
        return {
            "block_index": self.index,
            "timestamp": self.timestamp,
            "verification_id": self.verification_id,
            "scan_type": self.scan_type,
            "scan_data": self.scan_data,
            "previous_hash": self.previous_hash,
            "result_hash": self.result_hash
        }


class BlockchainService:
    def __init__(self):
        self.ensure_genesis_block()

    def ensure_genesis_block(self):
        if ledger_collection is not None:
            try:
                if ledger_collection.count_documents({}) == 0:
                    genesis = CyberShieldBlock(
                        index=0,
                        timestamp="2026-01-01 00:00:00",
                        verification_id="GENESIS-BLOCK",
                        scan_type="system",
                        scan_data={"status": "initialized", "network": "CyberShield AI Ledger"},
                        previous_hash="0" * 64
                    )
                    ledger_collection.insert_one(genesis.to_dict())
                    print("🧱 Genesis Block #0 created in MongoDB.")
            except Exception as e:
                print(f"⚠️ [Blockchain] Genesis check error: {e}")

    @property
    def chain(self):
        if ledger_collection is not None:
            return list(ledger_collection.find({}, {"_id": 0}).sort("block_index", 1))
        return []

    @property
    def last_block(self):
        if ledger_collection is not None:
            doc = ledger_collection.find_one(sort=[("block_index", -1)])
            if doc:
                return CyberShieldBlock(
                    index=doc["block_index"],
                    timestamp=doc["timestamp"],
                    verification_id=doc["verification_id"],
                    scan_type=doc.get("scan_type", "url"),
                    scan_data=doc.get("scan_data", {}),
                    previous_hash=doc.get("previous_hash", "0" * 64),
                    result_hash=doc.get("result_hash")
                )
        return CyberShieldBlock(0, "2026-01-01 00:00:00", "GENESIS-BLOCK", {"status": "init"}, "0" * 64, scan_type="system")

    def add_scan_record(self, verification_id, scan_data, scan_type="url"):
        self.ensure_genesis_block()
        timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")

        last = self.last_block
        next_index = last.index + 1
        prev_hash = last.result_hash

        new_block = CyberShieldBlock(
            index=next_index,
            timestamp=timestamp,
            verification_id=verification_id,
            scan_type=scan_type,
            scan_data=scan_data,
            previous_hash=prev_hash
        )

        block_payload = new_block.to_dict()

        if ledger_collection is not None:
            try:
                ledger_collection.insert_one(dict(block_payload))
                print(f"✅ [Blockchain] Block #{new_block.index} ({scan_type}) stored in MongoDB!")
            except Exception as e:
                print(f"❌ [Blockchain] Ledger insert error: {e}")

        return {
            "block_index": new_block.index,
            "verification_id": new_block.verification_id,
            "scan_type": new_block.scan_type,
            "result_hash": new_block.result_hash,
            "previous_hash": new_block.previous_hash,
            "timestamp": new_block.timestamp
        }

    def verify_integrity(self, verification_id, claimed_hash):
        if ledger_collection is None:
            return {
                "exists": False,
                "is_tampered": True,
                "is_valid": False,
                "message": "Database disconnected"
            }

        clean_v_id = str(verification_id).strip()
        cleaned_claimed = str(claimed_hash).strip().lower()

        # 1. Fetch the exact block from MongoDB
        doc = ledger_collection.find_one({"verification_id": clean_v_id}, {"_id": 0})
        if not doc:
            return {
                "exists": False,
                "is_tampered": True,
                "is_valid": False,
                "message": f"Verification ID '{clean_v_id}' not found on blockchain ledger"
            }

        # 2. Recompute the block's SHA-256 hash using the current live data in the block
        recalculated_hash = _compute_canonical_block_hash(
            index=doc["block_index"],
            timestamp=doc["timestamp"],
            verification_id=doc["verification_id"],
            scan_type=doc.get("scan_type", "job"),
            scan_data=doc.get("scan_data", {}),
            previous_hash=doc.get("previous_hash", "0" * 64)
        )

        stored_hash = str(doc.get("result_hash", "")).strip().lower()

        # Check A: Has the block's payload been altered from what was originally mined?
        is_payload_tampered = (recalculated_hash != stored_hash)

        # Check B: Does the user's claimed hash match the mined hash?
        is_hash_mismatch = (stored_hash != cleaned_claimed)

        # Check C: Cross-verify with Application DB (job_fraud_history or scan_history)
        db_discrepancy = None
        target_col = job_scans_collection if doc.get("scan_type") == "job" else scans_collection
        if target_col is not None:
            app_doc = target_col.find_one({"verification_id": clean_v_id})
            if app_doc:
                ai = app_doc.get("ai_analysis") or {}
                app_threat = str(ai.get("threat_level") or ai.get("risk_level") or "").strip().upper()
                ledger_threat = str(doc.get("scan_data", {}).get("threat_level", "")).strip().upper()

                if app_threat and ledger_threat and app_threat != ledger_threat:
                    db_discrepancy = f"Discrepancy: Ledger says '{ledger_threat}' but Application DB says '{app_threat}'"

        # Check D: Blockchain Chain Continuity Check (Does next block point to this block?)
        chain_broken = False
        next_block = ledger_collection.find_one({"block_index": doc["block_index"] + 1}, {"_id": 0})
        if next_block:
            if next_block.get("previous_hash") != stored_hash:
                chain_broken = True

        # Final Verdict
        is_tampered = is_payload_tampered or is_hash_mismatch or bool(db_discrepancy) or chain_broken
        is_valid = not is_tampered

        # Construct specific error messages
        if is_payload_tampered:
            message = (
                f"TAMPERING DETECTED: Data payload in Block #{doc['block_index']} was modified! "
                f"Recalculated hash does not match original mined signature."
            )
        elif db_discrepancy:
            message = f"TAMPERING DETECTED: {db_discrepancy}!"
        elif chain_broken:
            message = f"BLOCKCHAIN INTEGRITY BROKEN: Next Block #{next_block['block_index']} does not link to this block!"
        elif is_hash_mismatch:
            message = "CRYPTOGRAPHIC MISMATCH: Provided hash does not match stored block hash!"
        else:
            message = f"Cryptographic signature matches ledger block #{doc['block_index']} without any database alterations."

        return {
            "exists": True,
            "is_tampered": is_tampered,
            "tamper_detected": is_tampered,
            "is_valid": is_valid,
            "block_index": doc["block_index"],
            "scan_type": doc.get("scan_type", "job"),
            "timestamp": doc["timestamp"],
            "stored_hash": stored_hash,
            "recalculated_hash": recalculated_hash,
            "message": message
        }


blockchain = BlockchainService()