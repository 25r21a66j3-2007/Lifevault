import React, { useState, useEffect } from 'react';
import { X, Lock, Shield, Plus, Landmark, Home, Globe, FileText, HeartHandshake } from 'lucide-react';
import { api } from '../../services/api';

export default function AddAssetModal({ isOpen, onClose, onAssetSaved, editAsset = null, nominees = [] }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    categoryId: 1,
    name: '',
    subCategory: '',
    institution: '',
    approxValue: '',
    currency: 'INR',
    accountNumber: '',
    accessInstructions: '',
    nomineeId: '',
    notes: ''
  });

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await api.getCategories();
        if (res.success) setCategories(res.categories);
      } catch (err) {
        console.error(err);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    if (editAsset) {
      setFormData({
        categoryId: editAsset.categoryId || 1,
        name: editAsset.name || '',
        subCategory: editAsset.subCategory || '',
        institution: editAsset.institution || '',
        approxValue: editAsset.approxValue || '',
        currency: editAsset.currency || 'INR',
        accountNumber: editAsset.accountNumber || '',
        accessInstructions: editAsset.accessInstructions || '',
        nomineeId: editAsset.nomineeId || '',
        notes: editAsset.notes || ''
      });
    } else {
      setFormData({
        categoryId: 1,
        name: '',
        subCategory: '',
        institution: '',
        approxValue: '',
        currency: 'INR',
        accountNumber: '',
        accessInstructions: '',
        nomineeId: '',
        notes: ''
      });
    }
  }, [editAsset, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Please provide an asset title.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (editAsset) {
        await api.updateAsset(editAsset.id, formData);
      } else {
        await api.createAsset(formData);
      }
      onAssetSaved();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save asset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {editAsset ? 'Edit Vault Asset' : 'Add New Legacy Asset'}
              </h3>
              <p className="text-xs text-slate-500">Sensitive credentials are AES-256 encrypted at rest</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
            {error}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              Asset Category *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, categoryId: c.id })}
                  className={`p-2.5 rounded-xl border text-center flex flex-col items-center justify-center space-y-1 transition-all text-xs font-semibold ${
                    formData.categoryId === c.id
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-[11px] truncate w-full">{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Asset Name & Subcategory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Asset Name / Description *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. HDFC Life Term Insurance"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sub-Type
              </label>
              <input
                type="text"
                placeholder="e.g. Life Insurance, House, Stocks"
                value={formData.subCategory}
                onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Institution & Approximate Value */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Institution / Provider
              </label>
              <input
                type="text"
                placeholder="e.g. HDFC Bank, Zerodha, Registrar"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Estimated Value (₹)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="e.g. 5000000"
                value={formData.approxValue}
                onChange={(e) => setFormData({ ...formData, approxValue: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Account Number / Identifier (Masked / Encrypted) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Account Number / Policy ID / Identifier
              </label>
              <span className="flex items-center space-x-1 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <Lock className="w-3 h-3" />
                <span>AES-256 Masked</span>
              </span>
            </div>
            <input
              type="text"
              placeholder="e.g. 9928174521 or Survey-118"
              value={formData.accountNumber}
              onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none font-mono"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Will be masked as &quot;•••• •••• 4521&quot; on general screens and fully encrypted in MySQL.
            </p>
          </div>

          {/* Primary Nominee */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Assign Primary Nominee / Beneficiary
            </label>
            <select
              value={formData.nomineeId}
              onChange={(e) => setFormData({ ...formData, nomineeId: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none bg-white"
            >
              <option value="">-- No Nominee Assigned (Triggers AI Gap Alert) --</option>
              {nominees.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.name} ({n.relationship}) - {n.email}
                </option>
              ))}
            </select>
          </div>

          {/* Access / Claim Instructions (AES Encrypted) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Private Claim & Access Instructions
              </label>
              <span className="text-[10px] text-slate-400">Released only to authorized nominee</span>
            </div>
            <textarea
              rows="2"
              placeholder="e.g. Original physical bond stored in Home Safe #2. Claim branch is Indiranagar Bangalore with death cert."
              value={formData.accessInstructions}
              onChange={(e) => setFormData({ ...formData, accessInstructions: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none resize-none"
            />
          </div>

          {/* Private Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Private Notes (Encrypted)
            </label>
            <textarea
              rows="2"
              placeholder="e.g. Annual premium auto-debit on 15th April every year."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none resize-none"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors shadow-sm disabled:opacity-50 flex items-center space-x-1.5"
          >
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>{loading ? 'Encrypting & Saving...' : (editAsset ? 'Save Changes' : 'Encrypt & Save Asset')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
