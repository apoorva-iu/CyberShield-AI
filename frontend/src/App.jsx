import React, { useState } from "react";
import { Shield, Search, Briefcase, Hash } from "lucide-react";

import PhishingScanner from "./components/PhishingScanner";
import JobScanner from "./components/JobScanner";
import LedgerAudit from "./pages/LedgerAudit";

const BACKEND_URL = "http://127.0.0.1:5000";

export default function App() {
  const [activeTab, setActiveTab] = useState("scanner");

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
                Multimodal Threat Analysis &bull; Blockchain Ledger
              </p>
            </div>
          </div>

          <nav className="nav-tabs">
            <button
              onClick={() => setActiveTab("scanner")}
              className={`nav-btn ${activeTab === "scanner" ? "nav-btn-active" : ""}`}
            >
              <Search className="w-3.5 h-3.5" /> URL Scanner
            </button>
            <button
              onClick={() => setActiveTab("job-scanner")}
              className={`nav-btn ${activeTab === "job-scanner" ? "nav-btn-active" : ""}`}
            >
              <Briefcase className="w-3.5 h-3.5" /> Job Fraud
            </button>
            <button
              onClick={() => setActiveTab("ledger")}
              className={`nav-btn ${activeTab === "ledger" ? "nav-btn-active" : ""}`}
            >
              <Hash className="w-3.5 h-3.5" /> Ledger Audit
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === "scanner" && <PhishingScanner backendUrl={BACKEND_URL} />}
        {activeTab === "job-scanner" && <JobScanner backendUrl={BACKEND_URL} />}
        {activeTab === "ledger" && <LedgerAudit backendUrl={BACKEND_URL} />}
      </main>
    </div>
  );
}