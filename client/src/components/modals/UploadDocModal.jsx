import React, { useState } from 'react';
import { X, UploadCloud, FileText, Lock, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';

export default function UploadDocModal({ isOpen, onClose, onUploaded, assets = [] }) {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Legal');
  const [assetId, setAssetId] = useState('');
  const [accessStatus, setAccessStatus] = useState('nominee_permitted');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const docCategories = [
    'Will', 'Legal', 'Property Deed', 'Insurance', 'Certificate', 'Identity', 'Financial', 'Other'
  ];

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      if (!name) {
        setName(selected.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a document to upload.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', name || file.name);
      formData.append('category', category);
      if (assetId) formData.append('assetId', assetId);
      formData.append('accessStatus', accessStatus);

      await api.uploadDocument(formData);
      onUploaded();
      onClose();
    } catch (err) {
      setError(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-emerald-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Upload to Document Vault</h3>
              <p className="text-xs text-slate-500">Stored with hardware-grade AES-256 encryption</p>
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

        <form onSubmit={handleSubmit} className="py-4 space-y-3.5">
          {/* File Picker Drag-drop */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Document File (PDF, Image, Doc) *
            </label>
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-5 text-center hover:border-emerald-500 transition-colors bg-slate-50/50">
              <input
                type="file"
                id="doc-upload-file"
                onChange={handleFileChange}
                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                className="hidden"
              />
              <label htmlFor="doc-upload-file" className="cursor-pointer block">
                <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                {file ? (
                  <div>
                    <span className="text-xs font-bold text-slate-900 block truncate max-w-[260px] mx-auto">
                      {file.name}
                    </span>
                    <span className="text-[11px] text-emerald-600 font-medium">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • Ready for encryption
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="text-xs font-semibold text-slate-700 block">
                      Click to choose file
                    </span>
                    <span className="text-[11px] text-slate-400">PDFs, Deeds, Wills, Scans up to 25MB</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Document Display Name
            </label>
            <input
              type="text"
              placeholder="e.g. Registered Last Will & Testament 2025"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none bg-white"
              >
                {docCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Link to Asset (Optional)
              </label>
              <select
                value={assetId}
                onChange={(e) => setAssetId(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none bg-white"
              >
                <option value="">-- None (Standalone) --</option>
                {assets.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Access Status Rule
            </label>
            <select
              value={accessStatus}
              onChange={(e) => setAccessStatus(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none bg-white"
            >
              <option value="nominee_permitted">Nominee Permitted (Released on verification)</option>
              <option value="private">Private (Vault Owner Only)</option>
              <option value="released">Directly Released</option>
            </select>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors shadow-sm disabled:opacity-50 flex items-center space-x-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>{uploading ? 'Encrypting & Uploading...' : 'Upload & Encrypt'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
