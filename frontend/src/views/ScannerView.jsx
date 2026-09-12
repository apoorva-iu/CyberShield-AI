import React, { useState } from "react";
import {
  Globe,
  Image as ImageIcon,
  UploadCloud,
  Loader2,
  ShieldCheck,
  ShieldAlert,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info,
  Hash,
} from "lucide-react";
import { scanThreat } from "../api/client";
import ThreatBadge from "../components/ThreatBadge";
import BlockchainCard from "../components/BlockchainCard";

const ScannerView = () => {
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scanResult, setScanResult] = useState(null);

  const handleFile = (selected) => {
    if (selected && selected.type.startsWith("image/")) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setError(null);
    } else {
      setError("Please select a valid image file (PNG, JPG, WebP).");
    }
  };

  const handleClear = () => {
    setUrl("");
    setFile(null);
    setPreview(null);
    setScanResult(null);
    setError(null);
  };

  const handleScanSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim() && !file) {
      setError("Please provide a target URL or upload a webpage screenshot.");
      return;
    }

    setLoading(true);
    setError(null);
    setScanResult(null);

    const formData = new FormData();
    if (url.trim()) formData.append("url", url.trim());
    if (file) formData.append("image", file);

    try {
      const response = await scanThreat(formData);
      setScanResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Connection error to the scan service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Input Section */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        <div className="bg-[#11131a] border border-[#232736] rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Inspection Parameters
            </h2>
            {(url || file) && (
              <button onClick={handleClear} className="text-xs text-slate-500 hover:text-slate-300 transition">
                Clear
              </button>
            )}
          </div>

          <form onSubmit={handleScanSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 flex items-center gap-1.5 font-medium">
                <Globe className="w-3.5 h-3.5 text-slate-400" /> Target URL
              </label>
              <input
                type="text"
                placeholder="https://example-security-update.com/login"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-[#090a0f] border border-[#232736] rounded-lg px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-slate-500 transition"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1.5 flex items-center gap-1.5 font-medium">
                <ImageIcon className="w-3.5 h-3.5 text-slate-400" /> Page Screenshot
              </label>
              {!preview ? (
                <div
                  onClick={() => document.getElementById("file-input").click()}
                  className="border border-dashed border-[#232736] hover:border-slate-500 bg-[#090a0f] rounded-lg p-5 flex flex-col items-center justify-center cursor-pointer transition text-center group"
                >
                  <UploadCloud className="w-6 h-6 text-slate-500 group-hover:text-slate-300 transition mb-1.5" />
                  <span className="text-xs text-slate-300 font-medium">Click to upload screenshot</span>
                  <span className="text-[10px] text-slate-600 mt-0.5">Scans layout structure and embedded links</span>
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files[0])}
                  />
                </div>
              ) : (
                <div className="relative border border-[#232736] rounded-lg overflow-hidden bg-[#090a0f]">
                  <img src={preview} alt="Upload Preview" className="w-full h-36 object-cover object-top" />
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                    }}
                    className="absolute top-2 right-2 bg-black/80 hover:bg-black text-[11px] px-2.5 py-1 rounded text-slate-300 transition"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-slate-100 hover:bg-white text-slate-950 font-semibold text-xs rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-900" /> Analyzing Visuals & Syntax...
                </>
              ) : (
                "Run Security Audit"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Right Detailed Analysis Panel */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        {!scanResult && !loading && (
          <div className="h-full min-h-[360px] bg-[#11131a] border border-dashed border-[#232736] rounded-xl flex flex-col items-center justify-center p-8 text-center text-slate-500">
            <Info className="w-8 h-8 text-slate-600 mb-2" />
            <span className="text-xs font-medium text-slate-400">Ready for Scan</span>
            <p className="text-[11px] text-slate-600 mt-1 max-w-xs">
              Provide a target URL or screenshot on the left to evaluate threat probabilities and view dynamic diagnostic reasoning.
            </p>
          </div>
        )}

        {loading && (
          <div className="h-full min-h-[360px] bg-[#11131a] border border-[#232736] rounded-xl flex flex-col items-center justify-center p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400 mb-3" />
            <span className="text-xs font-medium text-slate-300">Processing Diagnostic Pipeline</span>
            <p className="text-[11px] text-slate-500 mt-1">
              Extracting OCR text vectors, computing syntactic features, and signing audit block...
            </p>
          </div>
        )}

        {scanResult && !loading && (
          <div className="flex flex-col gap-4">
            {/* Top Verdict Overview Card */}
            <div className="bg-[#11131a] border border-[#232736] rounded-xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                {scanResult.ai_analysis.threat_level === "CRITICAL" ||
                scanResult.ai_analysis.threat_level === "HIGH" ? (
                  <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                ) : (
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Assessment Result</span>
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    {scanResult.ai_analysis.verdict}
                  </h3>
                </div>
              </div>

              <div className="text-right flex items-center gap-3.5">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Threat Probability</div>
                  <div className="text-lg font-bold text-slate-100">
                    {scanResult.ai_analysis.composite_risk_score}%
                  </div>
                </div>
                <ThreatBadge level={scanResult.ai_analysis.threat_level} />
              </div>
            </div>

            {/* Diagnostic Sub-Scores */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {scanResult.ai_analysis.input_types?.has_url && (
                <div className="bg-[#11131a] border border-[#232736] rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-slate-400" /> Domain Risk Assessment
                      </span>
                      <span className="text-xs font-semibold text-slate-200">
                        {scanResult.ai_analysis.domain_risk_score}%
                      </span>
                    </div>
                    <div className="w-full bg-[#1c202d] rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-slate-300 rounded-full transition-all duration-500"
                        style={{ width: `${scanResult.ai_analysis.domain_risk_score}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2.5 truncate font-mono">
                    {scanResult.ai_analysis.input_types?.is_url_from_ocr ? "OCR Extracted: " : "Target: "}
                    <span className="text-slate-300">{scanResult.ai_analysis.analyzed_url}</span>
                  </p>
                </div>
              )}

              {scanResult.ai_analysis.input_types?.has_image && (
                <div className="bg-[#11131a] border border-[#232736] rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-slate-400" /> Visual & Form Assessment
                      </span>
                      <span className="text-xs font-semibold text-slate-200">
                        {scanResult.ai_analysis.visual_risk_score}%
                      </span>
                    </div>
                    <div className="w-full bg-[#1c202d] rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-slate-300 rounded-full transition-all duration-500"
                        style={{ width: `${scanResult.ai_analysis.visual_risk_score}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2.5 truncate">
                    Analyzed layout structure & visual tokens
                  </p>
                </div>
              )}
            </div>

            {/* Dynamic Findings Section */}
            {scanResult.ai_analysis.diagnostic_insights?.length > 0 && (
              <div className="bg-[#11131a] border border-[#232736] rounded-xl p-5 flex flex-col gap-3">
                <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-slate-400" /> Detailed Threat Intelligence & Findings
                </span>

                <div className="flex flex-col gap-2.5">
                  {scanResult.ai_analysis.diagnostic_insights.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-[#090a0f] p-3.5 rounded-lg border border-[#232736]/80 flex flex-col gap-1"
                    >
                      <div className="flex items-center gap-2">
                        {item.type === "threat" ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        )}
                        <span className="text-[11px] font-semibold text-slate-200">{item.title}</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed pl-3.5">{item.description}</p>
                    </div>
                  ))}

                  {scanResult.ai_analysis.ocr_detected_text && (
                    <div className="bg-[#090a0f] p-3 rounded-lg border border-[#232736]/80 flex flex-col gap-1">
                      <span className="text-[11px] font-semibold text-slate-400">Extracted Screenshot Text</span>
                      <p className="text-xs font-mono text-slate-400 line-clamp-3 leading-relaxed">
                        "{scanResult.ai_analysis.ocr_detected_text}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Cryptographic Ledger Audit Block */}
            <BlockchainCard
              auditData={scanResult.blockchain_audit}
              verificationId={scanResult.verification_id}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ScannerView;