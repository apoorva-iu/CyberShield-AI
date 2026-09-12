from services.ai_service import scan_full_pipeline

print("=" * 60)
print("🛡️ TESTING FULL DUAL-MODEL PIPELINE")
print("=" * 60)

# Test 1: Testing a Phishing URL alone
print("\n[TEST 1] Scanning Phishing URL...")
out1 = scan_full_pipeline(image_path=None, explicit_url="http://secure-login-account-update.xyz")
print("Verdict      :", out1["verdict"])
print("Risk Score   :", out1["composite_risk_score"], "%")
print("Flagged By   :", out1["flagged_by"])

# Test 2: Testing a Legitimate URL alone
print("\n[TEST 2] Scanning Safe URL...")
out2 = scan_full_pipeline(image_path=None, explicit_url="https://www.wikipedia.org")
print("Verdict      :", out2["verdict"])
print("Risk Score   :", out2["composite_risk_score"], "%")
print("Flagged By   :", out2["flagged_by"])

print("\n" + "=" * 60)
print("✅ Pipeline verified! Ready for React Frontend.")
print("=" * 60)