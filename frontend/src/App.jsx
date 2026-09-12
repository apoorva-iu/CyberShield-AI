import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  UploadCloud,
  Globe,
  Hash,
  Database,
  RefreshCw,
  Search,
  Image as ImageIcon,
  FileText,
  AlertTriangle,
  History,
  CheckCircle2,
  XCircle,
  Activity,
  Layers,
  Wifi,
  WifiOff,
} from "lucide-react";

const BACKEND_URL = "http://127.0.0.1:5000";

// High-contrast, scannable threat status badge
const ThreatBadge = ({ level = "LOW" }) => {
  const getBadgeClass = () => {
    switch (level) {
      case "CRITICAL":
      case "HIGH":
        return "badge-critical";
      case "MODERATE":
      case "MEDIUM":
        return "badge-moderate";
      default:
        return "badge-low";
    }
  };

  return <span className={`badge ${getBadgeClass()}`}>{level}</span>;
};

// Dynamic fill classes based on risk threshold
const scoreToFillClass = (score = 0) => {
  if (score >= 35) return "metric-fill-threat";
  if (score >= 20) return "metric-fill-moderate";
  return "metric-fill-safe";
};

const RiskMetricCard = ({ title, score, subtitle, icon: Icon, liveCheck }) => (
  <div className="metric-card">
    <div className="metric-head">
      <span className="metric-title">
        {Icon && <Icon className="w-3.5 h-3.5 text-teal-700" />} {title}
      </span>
      <span className="metric-score font-mono-data">{score}% Risk</span>
    </div>

    <div className="metric-track">
      <div
        className={`metric-fill ${scoreToFillClass(score)}`}
        style={{ width: `${Math.min(100, Math.max(0, score || 0))}%` }}
      />
    </div>

    {subtitle && <p className="metric-subtitle font-mono-data">{subtitle}</p>}

    {liveCheck && (
      <div
        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-bold border mt-1 w-fit ${
          liveCheck.exists
            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
            : "bg-amber-50 text-amber-900 border-amber-300"
        }`}
      >
        {liveCheck.exists ? (
          <Wifi className="w-3 h-3 text-emerald-600 shrink-0" />
        ) : (
          <WifiOff className="w-3 h-3 text-amber-600 shrink-0" />
        )}
        <span>Status: {liveCheck.status_label}</span>
      </div>
    )}
  </div>
);

const BlockchainCard = ({ auditData, verificationId }) => {
  if (!auditData) return null;

  return (
    <div className="ledger-card">
      <div className="ledger-head">
        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-teal-800" />
          <span className="panel-title">Audit Ledger Block</span>
        </div>
        <span className="ledger-block-tag font-mono-data">
          Block #{auditData.block_index}
        </span>
      </div>

      <div className="ledger-grid">
        <div>
          <div className="ledger-field-label">Verification ID</div>
          <div className="ledger-field-value font-mono-data">{verificationId}</div>
        </div>
        <div>
          <div className="ledger-field-label">Audit Timestamp</div>
          <div className="ledger-field-value">{auditData.timestamp}</div>
        </div>
      </div>

      <div>
        <div className="ledger-field-label">SHA-256 Result Hash (Immutable Record)</div>
        <div className="ledger-hash font-mono-data">{auditData.result_hash}</div>
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState("scanner");
  const [urlInput, setUrlInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const [scanHistory, setScanHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [verifyId, setVerifyId] = useState("");
  const [verifyHash, setVerifyHash] = useState("");
  const [verifyResult, setVerifyResult] = useState(null);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const handleFileChange = (file) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    } else {
      setError("Please select a valid image file (PNG, JPG, JPEG, WebP).");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const clearForm = () => {
    setUrlInput("");
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
  };

  const handleScan = async (e) => {
    e.preventDefault();
    if (!urlInput.trim() && !selectedFile) {
      setError("Please provide a target URL or upload a webpage screenshot.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    if (urlInput.trim()) formData.append("url", urlInput.trim());
    if (selectedFile) formData.append("image", selectedFile);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/scan/phishing`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
          "Failed to connect to backend engine. Ensure backend app.py is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/history`);
      setScanHistory(res.data.history || []);
    } catch (err) {
      console.error(err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleVerifyIntegrity = async (e) => {
    e.preventDefault();
    if (!verifyId.trim() || !verifyHash.trim()) return;

    setVerifyLoading(true);
    setVerifyResult(null);

    try {
      const res = await axios.post(`${BACKEND_URL}/api/blockchain/verify`, {
        verification_id: verifyId.trim(),
        result_hash: verifyHash.trim(),
      });
      setVerifyResult(res.data);
    } catch (err) {
      setVerifyResult({
        is_tampered: true,
        is_valid: false,
        message: err.response?.data?.error || "Failed to verify hash on ledger.",
      });
    } finally {
      setVerifyLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "history") {
      fetchHistory();
    }
  }, [activeTab]);

  const isHighRisk =
    result?.ai_analysis?.threat_level === "CRITICAL" ||
    result?.ai_analysis?.threat_level === "HIGH";

  // Evaluates tampering across various backend response schemas
  const isIntegrityConfirmed =
    verifyResult &&
    verifyResult.exists !== false &&
    verifyResult.is_tampered !== true &&
    verifyResult.tamper_detected !== true &&
    (verifyResult.is_valid === true || verifyResult.is_valid === undefined);

  return (
    <div className="app-shell">
      {/* Top Header */}
      <header className="top-nav">
        <div className="top-nav-inner">
          <div className="brand-mark">
            <div className="brand-icon">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="brand-title">CyberShield Engine</h1>
              <p className="brand-subtitle">
                Visual &amp; Domain Analysis &bull; Blockchain Ledger
              </p>
            </div>
          </div>

          <nav className="nav-tabs">
            <button
              onClick={() => setActiveTab("scanner")}
              className={`nav-btn ${activeTab === "scanner" ? "nav-btn-active" : ""}`}
            >
              <Search className="w-3.5 h-3.5" /> Scanner
            </button>
            <button
              onClick={() => setActiveTab("blockchain")}
              className={`nav-btn ${activeTab === "blockchain" ? "nav-btn-active" : ""}`}
            >
              <Hash className="w-3.5 h-3.5" /> Ledger Audit
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`nav-btn ${activeTab === "history" ? "nav-btn-active" : ""}`}
            >
              <History className="w-3.5 h-3.5" /> Scan History
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        {/* ================= TAB 1: SCANNER ================= */}
        {activeTab === "scanner" && (
          <div className="balanced-grid">
            {/* Left Column: Input Form */}
            <div className="column-wrapper">
              <div className="panel panel-pad">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="panel-title flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-teal-700" /> Inspection Parameters
                  </h2>
                  {(urlInput || selectedFile) && (
                    <button onClick={clearForm} className="panel-link font-bold text-rose-700 hover:text-rose-900">
                      Clear
                    </button>
                  )}
                </div>

                <form onSubmit={handleScan} className="flex flex-col gap-4 flex-1">
                  <div>
                    <label className="field-label">
                      <Globe className="w-3.5 h-3.5 text-teal-700" /> Target Website URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://example-security-portal.com/login"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className="field-input"
                    />
                  </div>

                  <div>
                    <label className="field-label">
                      <ImageIcon className="w-3.5 h-3.5 text-teal-700" /> Webpage Screenshot
                    </label>
                    {!previewUrl ? (
                      <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById("file-upload").click()}
                        className="dropzone"
                      >
                        <UploadCloud className="w-6 h-6 text-slate-500 mb-1.5" />
                        <span className="text-xs text-slate-800 font-bold">
                          Click to upload or drag screenshot
                        </span>
                        <span className="text-[11px] text-slate-500 mt-0.5">
                          Scans visual composition, buttons &amp; embedded text tokens
                        </span>
                        <input
                          id="file-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileChange(e.target.files[0])}
                        />
                      </div>
                    ) : (
                      <div className="relative border border-slate-300 rounded-lg overflow-hidden bg-slate-900">
                        <img
                          src={previewUrl}
                          alt="Screenshot Preview"
                          className="w-full h-36 object-cover object-top"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            setPreviewUrl(null);
                          }}
                          className="absolute top-2 right-2 bg-slate-900/90 hover:bg-rose-700 text-[11px] font-bold px-2.5 py-1 rounded text-white transition shadow"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  {error && (
                    <div className="alert-error">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary mt-auto"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing Visuals &amp; Syntax...
                      </>
                    ) : (
                      "Run Security Audit"
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Diagnostic Intelligence */}
            <div className="column-wrapper">
              {!result && !loading && (
                <div className="state-panel state-panel-empty">
                  <ShieldCheck className="w-10 h-10 text-teal-700 mb-2" />
                  <span className="state-title">Ready for Scan</span>
                  <p className="state-desc">
                    Provide a target URL or upload a webpage screenshot on the left to evaluate
                    threat probabilities and view dynamic diagnostic reasoning.
                  </p>
                </div>
              )}

              {loading && (
                <div className="state-panel state-panel-loading">
                  <RefreshCw className="w-10 h-10 animate-spin text-teal-700 mb-2" />
                  <span className="state-title">Processing Diagnostic Pipeline</span>
                  <p className="state-desc">
                    Querying live web reachability, computing lexical entropy, and analyzing visual hierarchy...
                  </p>
                </div>
              )}

              {result && !loading && (
                <div className="flex flex-col gap-4">
                  {/* Verdict Card */}
                  <div className="verdict-card">
                    <div className="flex items-center gap-3.5">
                      {isHighRisk ? (
                        <div className="verdict-icon-threat">
                          <ShieldAlert className="w-6 h-6" />
                        </div>
                      ) : (
                        <div className="verdict-icon-safe">
                          <ShieldCheck className="w-6 h-6" />
                        </div>
                      )}
                      <div>
                        <span className="verdict-eyebrow">Assessment Result</span>
                        <h3 className="verdict-title">{result.ai_analysis.verdict}</h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-3.5">
                      <div className="text-right">
                        <div className="verdict-score-label">Threat Probability</div>
                        <div className="verdict-score-value font-mono-data">
                          {result.ai_analysis.composite_risk_score}%
                        </div>
                      </div>
                      <ThreatBadge level={result.ai_analysis.threat_level} />
                    </div>
                  </div>

                  {/* Multi-modal Risk Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {result.ai_analysis.input_types?.has_url && (
                      <RiskMetricCard
                        title="Domain Analysis"
                        score={result.ai_analysis.domain_risk_score}
                        subtitle={`${
                          result.ai_analysis.input_types?.is_url_from_ocr
                            ? "OCR Extracted: "
                            : "Target: "
                        }${result.ai_analysis.analyzed_url}`}
                        icon={Globe}
                        liveCheck={result.ai_analysis.live_url_check}
                      />
                    )}

                    {result.ai_analysis.input_types?.has_image && (
                      <RiskMetricCard
                        title="Visual & Layout Analysis"
                        score={result.ai_analysis.visual_risk_score}
                        subtitle="Layout structure, form placement & visual cues"
                        icon={Layers}
                      />
                    )}
                  </div>

                  {/* Diagnostic Findings */}
                  {result.ai_analysis.diagnostic_insights?.length > 0 && (
                    <div className="panel panel-pad flex flex-col gap-3">
                      <span className="panel-title flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-teal-700" /> Detailed Threat Intelligence &amp; Findings
                      </span>

                      <div className="flex flex-col gap-2.5">
                        {result.ai_analysis.diagnostic_insights.map((item, idx) => (
                          <div key={idx} className="finding-item">
                            <div className="finding-head">
                              <span
                                className={`finding-dot ${
                                  item.type === "threat"
                                    ? "finding-dot-threat"
                                    : "finding-dot-safe"
                                }`}
                              />
                              <span className="finding-title">{item.title}</span>
                            </div>
                            <p className="finding-desc">{item.description}</p>
                          </div>
                        ))}

                        {result.ai_analysis.ocr_detected_text && (
                          <div className="ocr-block">
                            <span className="ocr-label">Extracted Screenshot Text</span>
                            <p className="ocr-text font-mono-data">
                              "{result.ai_analysis.ocr_detected_text}"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tamper-Proof Audit Block */}
                  <BlockchainCard
                    auditData={result.blockchain_audit}
                    verificationId={result.verification_id}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 2: BLOCKCHAIN VERIFIER ================= */}
        {activeTab === "blockchain" && (
          <div className="max-w-xl mx-auto panel panel-pad flex flex-col gap-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Hash className="w-4 h-4 text-teal-700" /> Cryptographic Integrity Check
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Verify that an on-chain receipt matches the stored scan hash without database alterations.
              </p>
            </div>

            <form onSubmit={handleVerifyIntegrity} className="flex flex-col gap-3.5">
              <div>
                <label className="field-label">Verification ID</label>
                <input
                  type="text"
                  placeholder="CS-SCAN-XXXXXXXX"
                  value={verifyId}
                  onChange={(e) => setVerifyId(e.target.value)}
                  className="field-input font-mono-data"
                  required
                />
              </div>

              <div>
                <label className="field-label">SHA-256 Result Hash</label>
                <input
                  type="text"
                  placeholder="Paste SHA-256 result hash"
                  value={verifyHash}
                  onChange={(e) => setVerifyHash(e.target.value)}
                  className="field-input font-mono-data"
                  required
                />
              </div>

              <button type="submit" disabled={verifyLoading} className="btn-primary">
                {verifyLoading ? "Verifying On-Chain..." : "Verify Hash Integrity"}
              </button>
            </form>

            {verifyResult && (
              <div
                className={`p-4 rounded-xl border transition-all ${
                  isIntegrityConfirmed
                    ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                    : "bg-rose-50 border-rose-300 text-rose-900"
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  {isIntegrityConfirmed ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                      <span>Integrity Confirmed</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 shrink-0 text-rose-600" />
                      <span>TAMPERING DETECTED / INVALID RECORD</span>
                    </>
                  )}
                </div>

                <p className="text-xs font-medium mt-1.5 leading-relaxed pl-7">
                  {verifyResult.message}
                </p>

                {/* Show cryptographic hash comparison if tampered */}
                {!isIntegrityConfirmed && (verifyResult.recalculated_hash || verifyResult.stored_hash) && (
                  <div className="mt-3 ml-7 p-2.5 bg-white/90 border border-rose-200 rounded text-xs font-mono text-slate-800 space-y-1">
                    {verifyResult.recalculated_hash && (
                      <div className="break-all">
                        <span className="font-semibold text-rose-700">Recalculated (Live DB): </span>
                        {verifyResult.recalculated_hash}
                      </div>
                    )}
                    {verifyResult.stored_hash && (
                      <div className="break-all">
                        <span className="font-semibold text-slate-600">Original Mined Hash: </span>
                        {verifyResult.stored_hash}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: SCAN HISTORY ================= */}
        {activeTab === "history" && (
          <div className="panel panel-pad flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="panel-title flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-teal-700" /> Recent Scan Records
                </h2>
                <p className="text-[11px] text-slate-500 mt-1">
                  Showing last 20 verified threat scans from database.
                </p>
              </div>
              <button onClick={fetchHistory} className="panel-link flex items-center gap-1.5 font-bold">
                <RefreshCw className={`w-3.5 h-3.5 ${historyLoading ? "animate-spin" : ""}`} /> Refresh
              </button>
            </div>

            {scanHistory.length === 0 && !historyLoading && (
              <div className="text-center py-12 text-xs font-semibold text-slate-500">
                No scans recorded yet. Run a scan in the first tab!
              </div>
            )}

            {scanHistory.length > 0 && (
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Verification ID</th>
                      <th>Target</th>
                      <th>Verdict</th>
                      <th>Risk %</th>
                      <th>Block #</th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scanHistory.map((item, idx) => (
                      <tr key={idx}>
                        <td className="cell-mono font-mono-data font-bold text-teal-800">
                          {item.verification_id}
                        </td>
                        <td className="cell-muted">
                          {item.input_metadata?.explicit_url ||
                            item.input_metadata?.filename ||
                            "Direct File"}
                        </td>
                        <td>
                          <ThreatBadge level={item.ai_analysis?.threat_level} />
                        </td>
                        <td className="font-bold font-mono-data">
                          {item.ai_analysis?.composite_risk_score}%
                        </td>
                        <td className="cell-mono font-mono-data">
                          #{item.blockchain_audit?.block_index}
                        </td>
                        <td className="text-slate-500 text-[11px]">
                          {item.blockchain_audit?.timestamp}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}