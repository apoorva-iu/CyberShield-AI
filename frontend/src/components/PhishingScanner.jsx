import React, { useState } from "react";
import axios from "axios";
import {
  Activity,
  Globe,
  UploadCloud,
  Image as ImageIcon,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  Layers,
  FileText,
} from "lucide-react";
import { ThreatBadge, RiskMetricCard, BlockchainCard } from "./CommonUI";

export default function PhishingScanner({ backendUrl }) {
  const [urlInput, setUrlInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

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
      const response = await axios.post(`${backendUrl}/api/scan/phishing`, formData, {
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

  const isHighRisk =
    result?.ai_analysis?.threat_level === "CRITICAL" ||
    result?.ai_analysis?.threat_level === "HIGH";

  return (
    <div className="balanced-grid">
      {/* Left Column: Input Form */}
      <div className="column-wrapper">
        <div className="panel panel-pad">
          <div className="flex items-center justify-between mb-4">
            <h2 className="panel-title flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-teal-700" /> Phishing Parameters
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
  );
}