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
    client.server_info()
except Exception as e:
    print(f"⚠️ MongoDB connection notice in BlockchainService: {e}")
    ledger_collection = None


class CyberShieldBlock:
    def __init__(self, index, timestamp, verification_id, scan_data, previous_hash, result_hash=None):
        self.index = index
        self.timestamp = timestamp
        self.verification_id = verification_id
        self.scan_data = scan_data
        self.previous_hash = previous_hash
        self.result_hash = result_hash or self.compute_hash()

    def compute_hash(self):
        block_string = json.dumps({
            "index": self.index,
            "timestamp": self.timestamp,
            "verification_id": self.verification_id,
            "scan_data": self.scan_data,
            "previous_hash": self.previous_hash
        }, sort_keys=True)
        return hashlib.sha256(block_string.encode('utf-8')).hexdigest()

    def to_dict(self):
        return {
            "block_index": self.index,
            "timestamp": self.timestamp,
            "verification_id": self.verification_id,
            "scan_data": self.scan_data,
            "previous_hash": self.previous_hash,
            "result_hash": self.result_hash
        }


class BlockchainService:
    def __init__(self):
        self.ensure_genesis_block()

    def ensure_genesis_block(self):
        if ledger_collection is not None and ledger_collection.count_documents({}) == 0:
            genesis = CyberShieldBlock(
                index=0,
                timestamp="2026-01-01 00:00:00",
                verification_id="GENESIS-BLOCK",
                scan_data={"status": "initialized", "network": "CyberShield AI Ledger"},
                previous_hash="0" * 64
            )
            ledger_collection.insert_one(genesis.to_dict())
            print("🧱 Genesis Block #0 created in MongoDB.")

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
                    scan_data=doc["scan_data"],
                    previous_hash=doc["previous_hash"],
                    result_hash=doc["result_hash"]
                )
        return CyberShieldBlock(0, "2026-01-01 00:00:00", "GENESIS-BLOCK", {"status": "init"}, "0" * 64)

    def add_scan_record(self, verification_id, scan_data):
        self.ensure_genesis_block()
        timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
        
        last = self.last_block
        next_index = last.index + 1
        prev_hash = last.result_hash

        new_block = CyberShieldBlock(
            index=next_index,
            timestamp=timestamp,
            verification_id=verification_id,
            scan_data=scan_data,
            previous_hash=prev_hash
        )

        if ledger_collection is not None:
            ledger_collection.insert_one(new_block.to_dict())

        return {
            "block_index": new_block.index,
            "verification_id": new_block.verification_id,
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

        doc = ledger_collection.find_one({"verification_id": verification_id}, {"_id": 0})
        if not doc:
            return {
                "exists": False,
                "is_tampered": True,
                "is_valid": False,
                "message": "Verification ID not found on blockchain ledger"
            }

        # Dynamically compute hash directly from the database's current fields
        block_string = json.dumps({
            "index": doc["block_index"],
            "timestamp": doc["timestamp"],
            "verification_id": doc["verification_id"],
            "scan_data": doc["scan_data"],
            "previous_hash": doc["previous_hash"]
        }, sort_keys=True)
        
        recalculated_hash = hashlib.sha256(block_string.encode('utf-8')).hexdigest()
        stored_hash = str(doc.get("result_hash", "")).strip().lower()
        cleaned_claimed = str(claimed_hash).strip().lower()

        # Check if database fields were edited OR if the user provided an incorrect hash
        is_database_tampered = (recalculated_hash != stored_hash)
        is_claim_matching = (recalculated_hash == cleaned_claimed)

        is_valid = (not is_database_tampered) and is_claim_matching

        return {
            "exists": True,
            "is_tampered": not is_valid,
            "is_valid": is_valid,
            "block_index": doc["block_index"],
            "timestamp": doc["timestamp"],
            "stored_hash": stored_hash,
            "recalculated_hash": recalculated_hash,
            "message": "Integrity Confirmed" if is_valid else "TAMPERING DETECTED: Data payload in database does not match cryptographic hash signature!"
        }


blockchain = BlockchainService()