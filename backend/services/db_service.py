from pymongo import MongoClient
from datetime import datetime, timezone

MONGO_URI = "mongodb://localhost:27017"
DB_NAME = "cybershield_ai"

try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
    db = client[DB_NAME]
    scans_collection = db["scan_history"]
    ledger_collection = db["blockchain_ledger"]
    client.server_info()
    print("✅ Connected to MongoDB successfully.")
except Exception as e:
    print(f"⚠️ MongoDB connection notice: {e}")
    db = None
    scans_collection = None
    ledger_collection = None


def save_scan_record(record_data):
    """
    Saves the scan diagnostic report into the scan_history collection.
    Attaches both 'timestamp' and 'created_at' ISO timestamps for sorting consistency.
    """
    if not record_data:
        return None

    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
    record_data["created_at"] = now_iso
    record_data["timestamp"] = now_iso

    if scans_collection is not None:
        try:
            # Insert a copy to prevent mutation of the original dictionary with ObjectId
            doc_to_save = dict(record_data)
            res = scans_collection.insert_one(doc_to_save)
            return str(res.inserted_id)
        except Exception as e:
            print(f"❌ MongoDB write error (scan_history): {e}")
    return None


def get_scan_by_id(verification_id):
    """Retrieves a single scan record by its verification ID without BSON ObjectId."""
    if scans_collection is not None and verification_id:
        try:
            return scans_collection.find_one({"verification_id": verification_id}, {"_id": 0})
        except Exception as e:
            print(f"❌ MongoDB read error (get_scan_by_id): {e}")
    return None


def get_recent_scans(limit=20):
    """
    Retrieves recent scans sorted in descending order (newest first)
    using the natural document insertion ID (_id: -1).
    """
    if scans_collection is not None:
        try:
            # Natural reverse order ensures the most recently scanned item is always on top
            return list(scans_collection.find({}, {"_id": 0}).sort([("_id", -1)]).limit(limit))
        except Exception as e:
            print(f"❌ MongoDB read error (get_recent_scans): {e}")
    return []


def get_blockchain_ledger():
    """Retrieves all immutable blocks stored in MongoDB sorted sequentially by block index."""
    if ledger_collection is not None:
        try:
            return list(ledger_collection.find({}, {"_id": 0}).sort("block_index", 1))
        except Exception as e:
            print(f"❌ MongoDB read error (get_blockchain_ledger): {e}")
    return []