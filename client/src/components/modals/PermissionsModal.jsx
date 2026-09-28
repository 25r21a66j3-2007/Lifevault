import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Check, Lock, CheckSquare, Square } from 'lucide-react';
import { api } from '../../services/api';

export default function PermissionsModal({ isOpen, onClose, nominee, onSaved }) {
  const [matrix, setMatrix] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPermissions() {
      if (!nominee) return;
      setLoading(true);
      try {
        const res = await api.getNomineePermissions(nominee.id);
        if (res.success) {
          setMatrix(res.matrix || []);
        }
      } catch (err) {
        setError('Failed to load asset permissions.');
      } finally {
        setLoading(false);
      }
    }

    if (isOpen) {
      loadPermissions();
    }
  }, [isOpen, nominee]);

  if (!isOpen || !nominee) return null;

  const handleToggle = (assetId) => {
    setMatrix(matrix.map(m => {
      if (m.asset_id === assetId) {
        return { ...m, permission_granted: !m.permission_granted };
      }
      return m;
    }));
  };

  const handleLevelChange = (assetId, level) => {
    setMatrix(matrix.map(m => {
      if (m.asset_id === assetId) {
        return { ...m, access_level: level };
      }
      return m;
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = matrix.map(m => ({
        assetId: m.asset_id,
        permissionGranted: !!m.permission_granted,
        accessLevel: m.access_level || 'read_only',
        releaseCondition: m.release_condition || 'inactivity_verified'
      }));

      await api.updateNomineePermissions(nominee.id, payload);
      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update permissions.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Asset Access Permissions: {nominee.name}
              </h3>
              <p className="text-xs text-slate-500">
                {nominee.relationship} • {nominee.email} • {nominee.verification_status.toUpperCase()}
              </p>
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

        <div className="py-2 flex-shrink-0">
          <p className="text-xs text-slate-600">
            Specify which assets will be released to <strong>{nominee.name}</strong> upon emergency verification approval.
          </p>
        </div>

        {/* Matrix list */}
        <div className="flex-1 overflow-y-auto py-2 space-y-2.5 pr-1">
          {loading ? (
            <div className="text-center py-8 text-xs text-slate-500">Loading asset matrix...</div>
          ) : matrix.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">No assets cataloged yet.</div>
          ) : (
            matrix.map((item) => {
              const isGranted = !!item.permission_granted;
              return (
                <div
                  key={item.asset_id}
                  onClick={() => handleToggle(item.asset_id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isGranted
                      ? 'border-emerald-300 bg-emerald-50/50 hover:bg-emerald-50'
                      : 'border-slate-200 bg-white hover:bg-slate-50 opacity-80'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <button
                      type="button"
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                        isGranted
                          ? 'bg-emerald-600 text-white'
                          : 'border-2 border-slate-300 bg-white'
                      }`}
                    >
                      {isGranted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {item.asset_name}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                          {item.category_name}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        Valuation: ₹{Number(item.approx_value || 0).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  {isGranted && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center space-x-2 flex-shrink-0"
                    >
                      <select
                        value={item.access_level}
                        onChange={(e) => handleLevelChange(item.asset_id, e.target.value)}
                        className="text-xs font-semibold px-2 py-1 rounded-lg border border-emerald-300 bg-white text-emerald-900 focus:outline-none"
                      >
                        <option value="full">Full Access (Instructions & Credentials)</option>
                        <option value="read_only">Read Only (Overview & Details)</option>
                        <option value="emergency_only">Emergency Contact Protocol</option>
                      </select>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between flex-shrink-0">
          <span className="text-xs text-slate-500">
            {matrix.filter(m => m.permission_granted).length} of {matrix.length} assets permitted
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors shadow-sm disabled:opacity-50"
            >
              {saving ? 'Updating...' : 'Save Permissions'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
