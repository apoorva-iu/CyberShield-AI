import React, { useState } from 'react';
import axios from 'axios';

const LedgerAudit = () => {
  const [verificationId, setVerificationId] = useState('');
  const [resultHash, setResultHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!verificationId.trim() || !resultHash.trim()) {
      setErrorMessage('Please enter both Verification ID and SHA-256 Result Hash.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setVerificationResult(null);

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/blockchain/verify', {
        verification_id: verificationId.trim(),
        result_hash: resultHash.trim()
      });
      setVerificationResult(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setErrorMessage(err.response.data.error);
      } else {
        setErrorMessage('Failed to connect to blockchain verification service.');
      }
    } finally {
      setLoading(false);
    }
  };

  const isTampered =
    verificationResult &&
    (verificationResult.is_tampered === true ||
      verificationResult.is_valid === false ||
      !verificationResult.exists);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Verification Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-2 text-teal-800 font-bold text-lg">
          <span>#</span>
          <h2>Cryptographic Integrity Check</h2>
        </div>
        <p className="text-xs text-slate-500 mb-6">
          Verify that an on-chain receipt matches the stored scan hash without database alterations.
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Verification ID
            </label>
            <input
              type="text"
              value={verificationId}
              onChange={(e) => setVerificationId(e.target.value)}
              placeholder="CS-SCAN-XXXXXXXX"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              SHA-256 Result Hash
            </label>
            <input
              type="text"
              value={resultHash}
              onChange={(e) => setResultHash(e.target.value)}
              placeholder="Paste SHA-256 result hash"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-teal-800 hover:bg-teal-900 text-white font-medium text-sm rounded-lg transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying Cryptographic Proof...' : 'Verify Hash Integrity'}
          </button>
        </form>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="mt-4 p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
            {errorMessage}
          </div>
        )}

        {/* Dynamic Verification Diagnostic Output */}
        {verificationResult && (
          <div className="mt-6 transition-all duration-200">
            {!isTampered ? (
              /* SUCCESS STATE: Intact & Authenticated */
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/90 shadow-sm">
                <div className="flex items-center gap-2 font-semibold text-emerald-800 text-sm">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-600 text-white text-xs">
                    ✓
                  </span>
                  <span>Integrity Confirmed — Block Verified</span>
                </div>
                <p className="text-xs text-emerald-700 mt-1 pl-7 leading-relaxed">
                  Cryptographic signature matches MongoDB ledger block #{verificationResult.block_index} without any database alterations.
                </p>
              </div>
            ) : (
              /* TAMPERED / INVALID STATE */
              <div className="p-4 rounded-xl border border-rose-300 bg-rose-50/90 shadow-sm">
                <div className="flex items-center gap-2 font-bold text-rose-700 text-sm">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-rose-600 text-white text-xs">
                    ✕
                  </span>
                  <span>TAMPERING DETECTED / CRYPTOGRAPHIC MISMATCH</span>
                </div>

                <p className="text-xs text-rose-700 font-medium mt-1.5 pl-7 leading-relaxed">
                  {verificationResult.message || 'Database values have been modified post-mining, breaking SHA-256 block integrity!'}
                </p>

                {/* Hash Comparison Details */}
                <div className="mt-3 ml-7 p-3 bg-white/95 border border-rose-200 rounded-lg text-xs font-mono space-y-1.5 text-slate-800 shadow-inner">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="font-semibold text-rose-800">Recalculated from Live DB:</span>
                    <span className="text-rose-600 break-all select-all">{verificationResult.recalculated_hash || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 border-t border-slate-100 pt-1">
                    <span className="font-semibold text-slate-700">Original Mined Hash:</span>
                    <span className="text-slate-600 break-all select-all">{verificationResult.stored_hash || 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LedgerAudit;