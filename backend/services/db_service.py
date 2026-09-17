from pymongo import MongoClient, DESCENDING, ASCENDING
from datetime import datetime, timezone

MONGO_URI = "mongodb://localhost:27017"
DB_NAME = "cybershield_ai"

try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
    db = client[DB_NAME]
    
    # URL Scanner Collection
    scans_collection = db["scan_history"]
    
    # Job Fraud Scanner Collection
    job_scans_collection = db["job_fraud_history"]
    
    # Blockchain Ledger Collection
    ledger_collection = db["blockchain_ledger"]
    
    client.server_info()
    print("✅ Connected to MongoDB successfully.")
except Exception as e:
    print(f"⚠️ MongoDB connection notice: {e}")
    db = None
    scans_collection = None
    job_scans_collection = None
    ledger_collection = None


def _sanitize_document(obj):
    """
    Recursively converts NumPy types, non-standard primitives, and ensures
    the dictionary is fully serializable by PyMongo/BSON without exceptions.
    """
    if isinstance(obj, dict):
        return {str(k): _sanitize_document(v) for k, v in obj.items()}
    elif isinstance(obj, (list, tuple)):
        return [_sanitize_document(v) for v in obj]
    elif hasattr(obj, "item"):
        val = obj.item()
        return round(val, 4) if isinstance(val, float) else val
    elif isinstance(obj, float):
        return round(obj, 4)
    return obj


# ===========================================================================
# Job Fraud Storage & Retrieval Functions
# ===========================================================================

def save_job_scan_record(record_data):
    """
    Saves job fraud scan results into the dedicated 'job_fraud_history' collection.
    Preserves existing blockchain timestamps to avoid hash mismatches.
    """
    if not record_data or job_scans_collection is None:
        return None

    try:
        # Sanitize any NumPy/tensor types from the ML detector
        doc_to_save = _sanitize_document(dict(record_data))

        # Do NOT overwrite existing blockchain timestamp if present
        if "timestamp" not in doc_to_save or not doc_to_save["timestamp"]:
            doc_to_save["timestamp"] = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")

        res = job_scans_collection.insert_one(doc_to_save)
        print(f"💾 [MongoDB] Saved Job Scan: {doc_to_save.get('verification_id')} (ID: {res.inserted_id})")
        return str(res.inserted_id)
    except Exception as e:
        print(f"❌ MongoDB write error (job_fraud_history): {e}")
        return None


def get_job_scan_by_id(verification_id):
    """Retrieves a single job scan record by verification ID from 'job_fraud_history'."""
    if job_scans_collection is not None and verification_id:
        try:
            clean_id = str(verification_id).strip()
            return job_scans_collection.find_one({"verification_id": clean_id}, {"_id": 0})
        except Exception as e:
            print(f"❌ MongoDB read error (get_job_scan_by_id): {e}")
    return None


def get_recent_job_scans(limit=10):
    """
    Retrieves recent job fraud scans sorted by blockchain block_index descending.
    Falls back to natural insertion order if block_index is missing.
    """
    if job_scans_collection is not None:
        try:
            records = list(
                job_scans_collection.find({}, {"_id": 0})
                .sort([("blockchain_audit.block_index", DESCENDING), ("_id", DESCENDING)])
                .limit(limit)
            )
            return records
        except Exception as e:
            print(f"❌ MongoDB read error (get_recent_job_scans): {e}")
    return []


# ===========================================================================
# URL Scanner Storage & Retrieval Functions
# ===========================================================================

def save_scan_record(record_data):
    """Saves URL scan results into the 'scan_history' collection."""
    if not record_data or scans_collection is None:
        return None

    try:
        doc_to_save = _sanitize_document(dict(record_data))

        if "timestamp" not in doc_to_save or not doc_to_save["timestamp"]:
            doc_to_save["timestamp"] = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")

        res = scans_collection.insert_one(doc_to_save)
        print(f"💾 [MongoDB] Saved URL Scan: {doc_to_save.get('verification_id')} (ID: {res.inserted_id})")
        return str(res.inserted_id)
    except Exception as e:
        print(f"❌ MongoDB write error (scan_history): {e}")
        return None


def get_scan_by_id(verification_id):
    """Retrieves a single URL scan record by its verification ID."""
    if scans_collection is not None and verification_id:
        try:
            clean_id = str(verification_id).strip()
            return scans_collection.find_one({"verification_id": clean_id}, {"_id": 0})
        except Exception as e:
            print(f"❌ MongoDB read error (get_scan_by_id): {e}")
    return None


def get_recent_scans(limit=10):
    """
    Retrieves recent URL scans sorted by blockchain block_index descending.
    Falls back to natural insertion order if block_index is missing.
    """
    if scans_collection is not None:
        try:
            records = list(
                scans_collection.find({}, {"_id": 0})
                .sort([("blockchain_audit.block_index", DESCENDING), ("_id", DESCENDING)])
                .limit(limit)
            )
            return records
        except Exception as e:
            print(f"❌ MongoDB read error (get_recent_scans): {e}")
    return []


# ===========================================================================
# Blockchain Ledger Functions
# ===========================================================================

def get_blockchain_ledger():
    """Retrieves all immutable blocks stored sequentially by block index."""
    if ledger_collection is not None:
        try:
            return list(ledger_collection.find({}, {"_id": 0}).sort("block_index", ASCENDING))
        except Exception as e:
            print(f"❌ MongoDB read error (get_blockchain_ledger): {e}")
    return []