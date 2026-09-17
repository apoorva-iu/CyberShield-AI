import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Hash,
  Database,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
} from "lucide-react";
import { ThreatBadge } from "../components/CommonUI";

const LedgerAudit = ({ backendUrl = "http://127.0.0.1:5000" }) => {
  // Input form state (Manual only - no auto filling)
  const [verificationId, setVerificationId] = useState("");
  const [resultHash, setResultHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // History table state
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Manual fetch function with cache buster
  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/history`, {
        params: { _t: Date.now() },
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });
      setHistory(res.data.history || []);
    } catch (err) {
      console.error("Failed to fetch scan records:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Initial load only - NO background intervals or polling
  useEffect(() => {
    fetchHistory();
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!verificationId.trim() || !resultHash.trim()) {
      setErrorMessage("Please enter both Verification ID and SHA-256 Result Hash.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setVerificationResult(null);

    try {
      const response = await axios.post(`${backendUrl}/api/blockchain/verify`, {
        verification_id: verificationId.trim(),
        result_hash: resultHash.trim(),
      });
      setVerificationResult(response.data);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to connect to blockchain verification service."
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const isConfirmed =
    verificationResult &&
    verificationResult.exists !== false &&
    verificationResult.is_tampered !== true &&
    verificationResult.tamper_detected !== true &&
    (verificationResult.is_valid === true || verificationResult.is_valid === undefined);

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto px-4 py-4">
      {/* 1. Manual Cryptographic Verification Panel */}
      <div className="panel panel-pad flex flex-col gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Hash className="w-4 h-4 text-teal-700" /> Cryptographic Integrity Check
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Verify that an on-chain receipt matches the stored scan hash without database alterations.
          </p>
        </div>

        <form onSubmit={handleVerify} className="flex flex-col gap-3.5">
          <div>
            <label className="field-label">Verification ID</label>
            <input
              type="text"
              value={verificationId}
              onChange={(e) => setVerificationId(e.target.value)}
              placeholder="e.g. CS-JOB-XXXXXXXX or CS-SCAN-XXXXXXXX"
              className="field-input font-mono-data"
              required
            />
          </div>

          <div>
            <label className="field-label">SHA-256 Result Hash</label>
            <input
              type="text"
              value={resultHash}
              onChange={(e) => setResultHash(e.target.value)}
              placeholder="Paste the mined SHA-256 hash"
              className="field-input font-mono-data"
              required
            />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? "Verifying Cryptographic Proof..." : "Verify Hash Integrity"}
            </button>
            {(verificationId || resultHash || verificationResult || errorMessage) && (
              <button
                type="button"
                onClick={() => {
                  setVerificationId("");
                  setResultHash("");
                  setVerificationResult(null);
                  setErrorMessage("");
                }}
                className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {errorMessage && (
          <div className="alert-error text-xs">
            {errorMessage}
          </div>
        )}

        {verificationResult && (
          <div
            className={`p-4 rounded-xl border transition-all ${
              isConfirmed
                ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                : "bg-rose-50 border-rose-300 text-rose-900"
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              {isConfirmed ? (
                <>
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                  <span>Integrity Confirmed — Block Verified</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 shrink-0 text-rose-600" />
                  <span>TAMPERING DETECTED / CRYPTOGRAPHIC MISMATCH</span>
                </>
              )}
            </div>

            <p className="text-xs font-medium mt-1.5 leading-relaxed pl-7">
              {verificationResult.message ||
                (isConfirmed
                  ? `Cryptographic signature matches ledger block #${verificationResult.block_index} without any database alterations.`
                  : "Database values have been modified post-mining, breaking SHA-256 block integrity!")}
            </p>

            {!isConfirmed &&
              (verificationResult.recalculated_hash || verificationResult.stored_hash) && (
                <div className="mt-3 ml-7 p-2.5 bg-white/95 border border-rose-200 rounded-lg text-xs font-mono text-slate-800 space-y-1.5">
                  {verificationResult.recalculated_hash && (
                    <div className="break-all">
                      <span className="font-bold text-rose-700">Recalculated from Live DB: </span>
                      {verificationResult.recalculated_hash}
                    </div>
                  )}
                  {verificationResult.stored_hash && (
                    <div className="break-all">
                      <span className="font-bold text-slate-600">Original Mined Hash: </span>
                      {verificationResult.stored_hash}
                    </div>
                  )}
                </div>
              )}
          </div>
        )}
      </div>

      {/* 2. Manual Scan Records Panel */}
      <div className="panel panel-pad flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="panel-title flex items-center gap-1.5">
              <Database className="w-4 h-4 text-teal-700" /> Recent Scan Records
            </h2>
            <p className="text-[11px] text-slate-500 mt-1">
              Showing verified threat scans logged in MongoDB.
            </p>
          </div>
          <button
            onClick={fetchHistory}
            disabled={historyLoading}
            className="panel-link flex items-center gap-1.5 font-bold cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${historyLoading ? "animate-spin" : ""}`} /> Refresh Records
          </button>
        </div>

        {history.length === 0 && !historyLoading && (
          <div className="text-center py-12 text-xs font-semibold text-slate-500">
            No scans recorded yet. Run a scan in the URL or Job Scanner tab!
          </div>
        )}

        {history.length > 0 && (
          <div className="overflow-x-auto">
            <table className="data-table w-full">
              <thead>
                <tr>
                  <th>Verification ID</th>
                  <th>Type</th>
                  <th>Target / Entity</th>
                  <th>Verdict</th>
                  <th>Risk %</th>
                  <th>Block #</th>
                  <th>Timestamp</th>
                  <th className="text-right">Hash Copy</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, idx) => {
                  const isJob =
                    item.scan_type === "job" ||
                    item.verification_id?.startsWith("CS-JOB-");

                  const targetDisplay =
                    item.input_metadata?.target ||
                    item.input_metadata?.company_name ||
                    item.input_metadata?.title ||
                    item.input_metadata?.explicit_url ||
                    (isJob ? "Job Posting" : "Direct Input");

                  const itemHash =
                    item.blockchain_audit?.result_hash ||
                    item.blockchain_audit?.block_hash ||
                    item.result_hash ||
                    "";

                  return (
                    <tr
                      key={item._id || item.verification_id || idx}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="cell-mono font-mono-data font-bold text-teal-800">
                        {item.verification_id}
                      </td>
                      <td>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                            isJob
                              ? "bg-amber-50 text-amber-800 border-amber-300"
                              : "bg-indigo-50 text-indigo-800 border-indigo-300"
                          }`}
                        >
                          {isJob ? "JOB FRAUD" : "URL / PHISH"}
                        </span>
                      </td>
                      <td className="cell-muted max-w-[160px] truncate" title={targetDisplay}>
                        {targetDisplay}
                      </td>
                      <td>
                        <ThreatBadge
                          level={
                            item.ai_analysis?.threat_level ||
                            item.ai_analysis?.risk_level ||
                            (item.ai_analysis?.is_fraudulent ? "CRITICAL" : "SAFE")
                          }
                        />
                      </td>
                      <td className="font-bold font-mono-data">
                        {item.ai_analysis?.composite_risk_score ??
                          item.ai_analysis?.risk_score ??
                          0}%
                      </td>
                      <td className="cell-mono font-mono-data text-slate-700">
                        #{item.blockchain_audit?.block_index ?? "—"}
                      </td>
                      <td className="text-slate-500 text-[11px] whitespace-nowrap">
                        {item.blockchain_audit?.timestamp || item.timestamp || "—"}
                      </td>
                      <td className="text-right">
                        {itemHash ? (
                          <button
                            type="button"
                            onClick={() => copyToClipboard(itemHash, item.verification_id)}
                            className="inline-flex items-center gap-1 text-[11px] text-slate-600 hover:text-teal-700 font-medium cursor-pointer p-1 rounded hover:bg-slate-100 transition"
                            title="Copy SHA-256 Hash"
                          >
                            {copiedId === item.verification_id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" /> Copy Hash
                              </>
                            )}
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[11px]">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LedgerAudit;