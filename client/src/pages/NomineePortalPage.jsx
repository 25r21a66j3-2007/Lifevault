import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  ShieldCheck,
  Lock,
  Unlock,
  FileBox,
  Coins,
  Download,
  AlertCircle,
  Clock,
  ArrowRight,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function NomineePortalPage() {
  const { user } = useAuth();
  const [portalData, setPortalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submittingReq, setSubmittingReq] = useState(false);
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.getNomineeReleasedData();
      if (res.success) setPortalData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmitEmergencyClaim = async (e) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setSubmittingReq(true);
    setMessage('');
    try {
      const res = await api.submitVerification({
        vaultOwnerEmail: 'ravi@lifevault.com',
        requesterName: user?.full_name || 'Anjali Kumar',
        requesterEmail: user?.email || 'anjali@lifevault.com',
        requesterRelationship: 'Daughter',
        reason
      });
      if (res.success) {
        setMessage('Emergency verification request submitted for Administrator review.');
        setReason('');
        loadData();
      }
    } catch (err) {
      setMessage('Failed to submit request: ' + err.message);
    } finally {
      setSubmittingReq(false);
    }
  };

  const handleDownloadDoc = (id) => {
    const url = api.getDownloadUrl(id);
    const token = localStorage.getItem('lifevault_token');
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.blob())
      .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `released-doc-${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch(err => alert('Download error: ' + err.message));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-sky-800/40 shadow-premium flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-sky-400 mb-1">
            <UserCheck className="w-4 h-4" />
            <span>Beneficiary Gateway</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Nominee Portal</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Authorized beneficiary console for <strong>{user?.full_name || 'Anjali Kumar'}</strong>. Access is restricted to records explicitly permitted by the vault owner.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
            portalData?.isReleased
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
          }`}>
            Status: {portalData?.vaultStatus?.toUpperCase() || 'NORMAL'}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-xs text-slate-500">Checking nominee credentials and permissions...</div>
      ) : portalData?.isReleased ? (
        /* RELEASED STATE: Authorized Nominee Views Decrypted Records */
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <strong className="font-bold">Legacy Information Released &amp; Authorized</strong>
                <p className="text-emerald-700 mt-0.5">
                  The estate release for <strong>{portalData.ownerName}</strong> has been officially approved by the System Administrator.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold bg-white text-emerald-800 px-3 py-1 rounded-xl border border-emerald-300">
              AES-256 Decrypted
            </span>
          </div>

          {/* Released Assets */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center space-x-2">
              <Coins className="w-4 h-4 text-emerald-600" />
              <span>Permitted Assets ({portalData.releasedAssets?.length || 0})</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {portalData.releasedAssets?.map((asset) => (
                <div
                  key={asset.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-premium space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {asset.category} {asset.subCategory ? `• ${asset.subCategory}` : ''}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-0.5">{asset.name}</h4>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      ₹{Number(asset.approxValue || 0).toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Decrypted Credentials */}
                  <div className="p-3.5 rounded-2xl bg-slate-900 text-white font-mono text-xs space-y-1.5">
                    <div className="flex justify-between text-slate-400 text-[10px] font-sans">
                      <span>PROVIDER / IDENTIFIER</span>
                      <span className="text-emerald-400 font-bold">DECRYPTED</span>
                    </div>
                    <p className="text-emerald-300 font-bold">
                      {asset.institution}: {asset.accountNumber || '[Direct Record]'}
                    </p>
                  </div>

                  {/* Access instructions */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs">
                    <strong className="text-slate-700 block mb-1">Claim &amp; Succession Instructions:</strong>
                    <p className="text-slate-600 leading-relaxed font-sans">
                      {asset.accessInstructions || 'Standard statutory transmission procedure.'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Released Documents */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center space-x-2">
              <FileBox className="w-4 h-4 text-emerald-600" />
              <span>Released Legal Documents ({portalData.releasedDocuments?.length || 0})</span>
            </h3>

            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-premium overflow-hidden">
              <div className="divide-y divide-slate-100 text-xs">
                {portalData.releasedDocuments?.map((doc) => (
                  <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="font-bold text-slate-900">{doc.name}</p>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {doc.original_filename} • Category: {doc.category}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDownloadDoc(doc.id)}
                      className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* PENDING OR NORMAL STATE: Explain Release Rules and Allow Emergency Verification Submission */
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-premium">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Access Restricted</span>
              <h2 className="text-xl font-bold text-slate-900 mt-1 mb-3">
                Vault Status: {portalData?.vaultStatus === 'inactivity_detected' ? 'Inactivity Detected' : 'Active & Protected'}
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Under LifeVault&apos;s privacy protocol, sensitive asset credentials, passwords, and private legal documents remain securely encrypted and inaccessible until prolonged inactivity has been confirmed and verified by the System Administrator.
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 mb-6">
                <div className="flex items-center justify-between text-slate-700">
                  <span>Designated Vault Owner:</span>
                  <strong className="font-bold text-slate-900">{portalData?.ownerName || 'Ravi Kumar'}</strong>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span>Configured Inactivity Window:</span>
                  <span className="font-semibold text-slate-900">90 Days</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span>Release Verification Mode:</span>
                  <span className="font-semibold text-slate-900">Medical Confirmation / Death Certificate</span>
                </div>
              </div>
            </div>

            {/* Emergency Verification Form */}
            <div className="pt-6 border-t border-slate-100 max-w-xl">
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                File Emergency Verification Request
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                If the vault owner is hospitalized, incapacitated, or deceased, submit a verification notice for Administrator review.
              </p>

              {message && (
                <div className="mb-4 p-3 rounded-xl bg-blue-50 text-blue-800 text-xs border border-blue-200 font-medium">
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmitEmergencyClaim} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Emergency Situation &amp; Reason for Access *
                  </label>
                  <textarea
                    required
                    rows="3"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g. Hospital admission protocol. Need access to medical directives and real estate authorization due to father hospitalization."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReq || !reason.trim()}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm disabled:opacity-50 flex items-center space-x-2"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{submittingReq ? 'Submitting Notice...' : 'Submit Verification for Review'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
