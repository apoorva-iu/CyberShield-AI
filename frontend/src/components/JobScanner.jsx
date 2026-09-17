import React, { useState } from "react";
import axios from "axios";
import {
  Briefcase,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  Activity,
  Layers,
  FileText,
  Building2,
  Mail,
  PhoneCall,
  MessageSquare,
  DollarSign,
  AlertCircle,
  FormInput,
  Sparkles,
} from "lucide-react";
import { ThreatBadge, RiskMetricCard, BlockchainCard } from "./CommonUI";

function findingDotStyle(type) {
  if (type === "threat") return { className: "finding-dot finding-dot-threat" };
  if (type === "safe") return { className: "finding-dot finding-dot-safe" };
  return { className: "finding-dot", style: { backgroundColor: "#94a3b8" } };
}

export default function JobScanner({ backendUrl = "http://127.0.0.1:5000" }) {
  const [rawText, setRawText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!rawText.trim()) {
      setError("Please paste a job description or recruitment message to analyze.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(`${backendUrl}/api/scan/job`, {
        raw_text: rawText.trim(),
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to analyze job posting on backend.");
    } finally {
      setLoading(false);
    }
  };

  const isHighRisk =
    result?.ai_analysis?.risk_level === "CRITICAL" ||
    result?.ai_analysis?.is_fraudulent === true;

  const signals = result?.ai_analysis?.extracted_signals;
  const isCalibrated = result?.ai_analysis?.semantic_score_calibrated === true;

  const hasAnyFeeSignal =
    signals?.has_deposit_flag || signals?.has_implicit_fee_flag || signals?.has_semantic_fee_signal;

  return (
    <div className="balanced-grid">
      {/* Left Input Column */}
      <div className="column-wrapper">
        <div className="panel panel-pad">
          <div className="flex items-center justify-between mb-4">
            <h2 className="panel-title flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-teal-700" /> Job Listing Input
            </h2>
            {rawText && (
              <button
                type="button"
                onClick={() => {
                  setRawText("");
                  setResult(null);
                  setError(null);
                }}
                className="panel-link font-bold text-rose-700 hover:text-rose-900"
              >
                Clear
              </button>
            )}
          </div>

          <form onSubmit={handleScan} className="flex flex-col gap-3 flex-1">
            <label className="field-label">
              <FileText className="w-3.5 h-3.5 text-teal-700" /> Complete Job Description / Message
            </label>
            <textarea
              rows={14}
              placeholder="Paste the full job posting from LinkedIn, email, WhatsApp, or job boards..."
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              className="field-input text-xs leading-relaxed"
            />

            {error && (
              <div className="alert-error">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary mt-2">
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing Semantics &amp; Signals...
                </>
              ) : (
                "Scan Job for Fraud"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Right Intelligence Column */}
      <div className="column-wrapper">
        {!result && !loading && (
          <div className="state-panel state-panel-empty">
            <Briefcase className="w-10 h-10 text-teal-700 mb-2" />
            <span className="state-title">Ready for Multi-Layer Verification</span>
            <p className="state-desc">
              Paste a posting on the left. The engine strips boilerplate, extracts recruiter contact
              entities via NER, and computes transformer embeddings across the full document — including
              a semantic check for paraphrased fee-evasion language.
            </p>
          </div>
        )}

        {loading && (
          <div className="state-panel state-panel-loading">
            <RefreshCw className="w-10 h-10 animate-spin text-teal-700 mb-2" />
            <span className="state-title">Running Multi-Stage Verification</span>
            <p className="state-desc">
              Extracting candidate entities, applying negation-aware heuristics, and calculating
              dense transformer embeddings...
            </p>
          </div>
        )}

        {result && !loading && (
          <div className="flex flex-col gap-4">
            {/* Primary Verdict Card */}
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
                  <h3 className="verdict-title">
                    {result.ai_analysis?.verdict === "FRAUDULENT"
                      ? "🚨 FRAUDULENT LISTING"
                      : "✅ GENUINE LISTING"}
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-3.5">
                <div className="text-right">
                  <div className="verdict-score-label">Scam Probability</div>
                  <div className="verdict-score-value font-mono-data">
                    {result.ai_analysis?.risk_score}%
                  </div>
                </div>
                <ThreatBadge level={result.ai_analysis?.risk_level} />
              </div>
            </div>

            {/* Metric Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <RiskMetricCard
                title="Composite Threat"
                score={result.ai_analysis?.risk_score}
                subtitle="Semantic + Forensic Fusion"
                icon={Activity}
              />
              <RiskMetricCard
                title={isCalibrated ? "Calibrated Neural Risk" : "Model Confidence Score"}
                score={result.ai_analysis?.semantic_risk || 0}
                subtitle={
                  isCalibrated
                    ? "MiniLM Transformer Vector (calibrated)"
                    : "MiniLM Transformer Vector (uncalibrated estimate)"
                }
                icon={Layers}
              />
            </div>

            {/* Extracted Entity Signals */}
            {signals && (
              <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs space-y-2.5">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-teal-700" /> Extracted Forensic Signals
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {signals.company_name && (
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300 text-[11px] font-mono-data flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-slate-500" /> {signals.company_name}
                    </span>
                  )}
                  {signals.emails?.map((e, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-0.5 rounded border text-[11px] font-mono-data flex items-center gap-1 ${
                        signals.has_free_email
                          ? "bg-amber-50 text-amber-900 border-amber-300"
                          : "bg-slate-100 text-slate-700 border-slate-300"
                      }`}
                    >
                      <Mail className="w-3 h-3 text-slate-500" /> {e}
                    </span>
                  ))}
                  {signals.phones?.map((p, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300 text-[11px] font-mono-data flex items-center gap-1"
                    >
                      <PhoneCall className="w-3 h-3 text-slate-500" /> {p}
                    </span>
                  ))}
                  {signals.telegram_detected && (
                    <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-300 text-[11px] font-mono-data flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 text-rose-600" /> Telegram Channel Detected
                    </span>
                  )}
                  {signals.has_deposit_flag && (
                    <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-300 text-[11px] font-mono-data flex items-center gap-1 font-bold">
                      <AlertCircle className="w-3 h-3 text-rose-600" /> Advance Fee Hook
                    </span>
                  )}
                  {signals.has_implicit_fee_flag && !signals.has_deposit_flag && (
                    <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-300 text-[11px] font-mono-data flex items-center gap-1 font-bold">
                      <AlertCircle className="w-3 h-3 text-rose-600" /> Implicit Advance Payment
                    </span>
                  )}
                  {signals.has_semantic_fee_signal && (
                    <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-300 text-[11px] font-mono-data flex items-center gap-1 font-bold">
                      <Sparkles className="w-3 h-3 text-amber-600" /> Paraphrased Fee Request
                    </span>
                  )}
                  {signals.has_reimbursement_framing && (
                    <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-300 text-[11px] font-mono-data flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-amber-600" /> 'Refundable Later' Framing
                    </span>
                  )}
                  {signals.has_unrealistic_pay && (
                    <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-300 text-[11px] font-mono-data flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-amber-600" /> High-Compensation Lure
                    </span>
                  )}
                  {signals.has_whatsapp_only && (
                    <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-300 text-[11px] font-mono-data flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 text-amber-600" /> WhatsApp-Only Contact
                    </span>
                  )}
                  {signals.has_google_form_interview && (
                    <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-300 text-[11px] font-mono-data flex items-center gap-1">
                      <FormInput className="w-3 h-3 text-amber-600" /> Google-Form-Only Interview
                    </span>
                  )}
                  {!signals.company_name &&
                    !signals.emails?.length &&
                    !signals.phones?.length &&
                    !hasAnyFeeSignal && (
                      <span className="text-slate-400 italic">No external contact credentials detected</span>
                    )}
                </div>
              </div>
            )}

            {/* Forensic Intelligence Breakdown */}
            {result.ai_analysis?.diagnostic_insights?.length > 0 && (
              <div className="panel panel-pad flex flex-col gap-2.5">
                <span className="panel-title flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-teal-700" /> Forensic Intelligence Breakdown
                </span>
                {result.ai_analysis.diagnostic_insights.map((item, idx) => {
                  const dot = findingDotStyle(item.type);
                  return (
                    <div key={idx} className="finding-item">
                      <div className="finding-head">
                        <span className={dot.className} style={dot.style} />
                        <span className="finding-title">{item.title}</span>
                      </div>
                      <p className="finding-desc">{item.description}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Blockchain Audit Block */}
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