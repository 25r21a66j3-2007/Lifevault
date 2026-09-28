import React, { useState } from 'react';
import { X, Lock, Unlock, Eye, EyeOff, Shield, FileText, UserCheck, Calendar, DollarSign, Building } from 'lucide-react';
import { api } from '../../services/api';

export default function AssetDetailModal({ isOpen, onClose, asset, onEdit }) {
  const [revealed, setRevealed] = useState(false);
  const [decryptedData, setDecryptedData] = useState(null);
  const [loadingDecrypt, setLoadingDecrypt] = useState(false);

  if (!isOpen || !asset) return null;

  const handleToggleReveal = async () => {
    if (revealed) {
      setRevealed(false);
      return;
    }

    setLoadingDecrypt(true);
    try {
      const res = await api.getAssetById(asset.id);
      if (res.success && res.asset) {
        setDecryptedData(res.asset);
        setRevealed(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDecrypt(false);
    }
  };

  const current = (revealed && decryptedData) ? decryptedData : asset;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {asset.categoryName} {asset.subCategory ? `• ${asset.subCategory}` : ''}
              </span>
              <h3 className="text-base font-bold text-slate-900 leading-tight">{asset.name}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {/* Institution & Value banner */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block">Institution / Provider</span>
              <span className="text-xs font-bold text-slate-800 flex items-center space-x-1 mt-0.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>{asset.institution || 'Direct Ownership'}</span>
              </span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block">Estimated Valuation</span>
              <span className="text-xs font-bold text-emerald-700 block mt-0.5">
                ₹{Number(asset.approxValue || 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Account Number / Identifier with Decryption Toggle */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-subtle">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700">Account / Policy Identifier</span>
              <button
                onClick={handleToggleReveal}
                disabled={loadingDecrypt}
                className="flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
              >
                {revealed ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                    <span>Mask</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{loadingDecrypt ? 'Decrypting...' : 'Reveal (AES-256)'}</span>
                  </>
                )}
              </button>
            </div>

            <div className="font-mono text-sm px-3 py-2 bg-slate-900 text-emerald-400 rounded-xl flex items-center justify-between">
              <span>
                {revealed ? (current.accountNumber || '[No account number registered]') : (asset.accountNumberMasked || '•••• •••• ••••')}
              </span>
              <span className="text-[10px] uppercase font-sans tracking-wide text-slate-400 font-medium">
                {revealed ? 'Decrypted (GCM Validated)' : 'Masked (AES-256-GCM)'}
              </span>
            </div>
          </div>

          {/* Assigned Nominee */}
          <div className="p-3.5 rounded-2xl border border-slate-200 bg-white">
            <span className="text-xs font-bold text-slate-700 block mb-1">Designated Nominee</span>
            {asset.nomineeName ? (
              <div className="flex items-center space-x-2 text-xs text-slate-700">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">
                  {asset.nomineeName[0]}
                </div>
                <span className="font-semibold">{asset.nomineeName}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500">{asset.nomineeRelationship || 'Beneficiary'}</span>
              </div>
            ) : (
              <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 inline-block">
                ⚠️ No nominee assigned yet (AI Gap Flag)
              </span>
            )}
          </div>

          {/* Access / Claim Instructions */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-700">Access & Claim Instructions</span>
              <span className="text-[10px] text-slate-400">Emergency Protocol</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-sans whitespace-pre-line">
              {revealed ? (current.accessInstructions || 'No private instructions recorded.') : (
                asset.hasInstructions ? '🔒 Private claim instructions are AES-256 encrypted. Click "Reveal" above to inspect.' : 'No instructions recorded.'
              )}
            </p>
          </div>

          {/* Private Notes */}
          {(revealed || current.hasNotes) && (
            <div className="p-3.5 rounded-2xl border border-slate-100 bg-white">
              <span className="text-xs font-bold text-slate-700 block mb-1">Private Notes</span>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                {revealed ? (current.notes || 'None') : '🔒 Private notes encrypted.'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between flex-shrink-0">
          <span className="text-[11px] text-slate-400">ID: #{asset.id}</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onClose();
                onEdit(asset);
              }}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Edit Asset
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
