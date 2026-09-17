import React from "react";
import { Hash, Wifi, WifiOff } from "lucide-react";

export const ThreatBadge = ({ level = "LOW" }) => {
  const getBadgeClass = () => {
    switch (level) {
      case "CRITICAL":
      case "HIGH":
        return "badge-critical";
      case "MODERATE":
      case "MEDIUM":
      case "SUSPICIOUS":
        return "badge-moderate";
      default:
        return "badge-low";
    }
  };

  return <span className={`badge ${getBadgeClass()}`}>{level}</span>;
};

const scoreToFillClass = (score = 0) => {
  if (score >= 40) return "metric-fill-threat";
  if (score >= 20) return "metric-fill-moderate";
  return "metric-fill-safe";
};

export const RiskMetricCard = ({ title, score, subtitle, icon: Icon, liveCheck }) => (
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

export const BlockchainCard = ({ auditData, verificationId }) => {
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