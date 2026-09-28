import React, { useState, useEffect } from 'react';
import {
  FileBox,
  Plus,
  Download,
  Trash2,
  FileText,
  Lock,
  Eye,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HardDrive
} from 'lucide-react';
import { api } from '../services/api';
import UploadDocModal from '../components/modals/UploadDocModal';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [assets, setAssets] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const docCategories = [
    'All', 'Will', 'Legal', 'Property Deed', 'Insurance', 'Certificate', 'Identity', 'Other'
  ];

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const [docsRes, assetsRes] = await Promise.all([
        api.getDocuments(categoryFilter),
        api.getAssets()
      ]);
      if (docsRes.success) setDocuments(docsRes.documents || []);
      if (assetsRes.success) setAssets(assetsRes.assets || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [categoryFilter]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Permanently delete document "${name}" from encrypted storage?`)) {
      try {
        await api.deleteDocument(id);
        loadDocuments();
      } catch (err) {
        alert(err.message || 'Failed to delete document.');
      }
    }
  };

  const handleDownload = (id) => {
    const url = api.getDownloadUrl(id);
    const token = localStorage.getItem('lifevault_token');
    
    // Fetch with authorization header and download blob
    fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.blob())
      .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `lifevault-doc-${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch(err => alert('Download error: ' + err.message));
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Encrypted Repository</span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Document Vault</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Store critical deeds, registered wills, certificates, and insurance bonds under AES-256 hardware encryption.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center space-x-1 overflow-x-auto pb-1 max-w-full">
        {docCategories.map((cat) => {
          const isSelected = categoryFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Documents List */}
      {loading ? (
        <div className="text-center py-16 text-xs text-slate-500">Decrypting document metadata...</div>
      ) : documents.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-premium">
          <FileBox className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No documents in this category</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            Upload your registered Will, property title deed, or insurance policies to protect claim validity.
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
          >
            + Upload Document
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-premium overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Document Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Linked Asset</th>
                  <th className="py-3.5 px-4">File Size</th>
                  <th className="py-3.5 px-4">Access Status</th>
                  <th className="py-3.5 px-4">Uploaded</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 flex-shrink-0">
                          <FileText className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{doc.name}</p>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {doc.original_filename}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {doc.category}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-slate-600">
                      {doc.asset_name ? (
                        <span className="font-medium text-slate-800">{doc.asset_name}</span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Direct Legal File</span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-slate-500 font-mono text-[11px]">
                      {formatBytes(doc.file_size)}
                    </td>

                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        doc.access_status === 'nominee_permitted'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : doc.access_status === 'released'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        <Lock className="w-2.5 h-2.5" />
                        <span>{doc.access_status === 'nominee_permitted' ? 'Nominee Permitted' : doc.access_status.toUpperCase()}</span>
                      </span>
                    </td>

                    <td className="py-4 px-4 text-slate-500 text-[11px]">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleDownload(doc.id)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          title="Download Decrypted File"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id, doc.name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete Document"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      <UploadDocModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploaded={loadDocuments}
        assets={assets}
      />
    </div>
  );
}
