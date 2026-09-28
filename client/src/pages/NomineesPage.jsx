import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Edit2,
  Trash2,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  Coins
} from 'lucide-react';
import { api } from '../services/api';
import AddNomineeModal from '../components/modals/AddNomineeModal';
import PermissionsModal from '../components/modals/PermissionsModal';

export default function NomineesPage() {
  const [nominees, setNominees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingNominee, setEditingNominee] = useState(null);
  const [selectedForPermissions, setSelectedForPermissions] = useState(null);

  const loadNominees = async () => {
    setLoading(true);
    try {
      const res = await api.getNominees();
      if (res.success) setNominees(res.nominees || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNominees();
  }, []);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove nominee "${name}"? Associated permissions will be revoked.`)) {
      try {
        await api.deleteNominee(id);
        loadNominees();
      } catch (err) {
        alert(err.message || 'Failed to remove nominee.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Beneficiaries</span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Nominee Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure verified trustees and define exact asset release permissions for emergency situations.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingNominee(null);
            setShowAddModal(true);
          }}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Add New Nominee</span>
        </button>
      </div>

      {/* Nominees Grid */}
      {loading ? (
        <div className="text-center py-16 text-xs text-slate-500">Loading nominees and permission matrices...</div>
      ) : nominees.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-premium">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No nominees registered</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            Assign trusted beneficiaries (such as your daughter, sister, spouse, or legal executor) to receive access rules.
          </p>
          <button
            onClick={() => {
              setEditingNominee(null);
              setShowAddModal(true);
            }}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
          >
            + Add First Nominee
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {nominees.map((nominee) => (
            <div
              key={nominee.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-premium flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              <div>
                {/* Header: Avatar, Name, Relationship, Actions */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 font-extrabold flex items-center justify-center text-base border border-emerald-200 shadow-sm">
                      {nominee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-bold text-slate-900">{nominee.name}</h3>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{nominee.verification_status.toUpperCase()}</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">Relationship: {nominee.relationship}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => {
                        setEditingNominee(nominee);
                        setShowAddModal(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      title="Edit Nominee"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(nominee.id, nominee.name)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Remove Nominee"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Contact info pill */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs mb-4">
                  <div className="flex items-center space-x-2 text-slate-600 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{nominee.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{nominee.phone || '+91 98765 00000'}</span>
                  </div>
                </div>

                {/* Notes */}
                {nominee.notes && (
                  <p className="text-xs text-slate-500 italic mb-4 leading-relaxed">
                    &quot;{nominee.notes}&quot;
                  </p>
                )}

                {/* Granted Permissions List (Matches Section 7 Example) */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Asset Permissions ({nominee.permissions?.length || 0})
                    </span>
                    <span className="text-[11px] text-slate-400">Release: Inactivity Verified</span>
                  </div>

                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {nominee.permissions && nominee.permissions.length > 0 ? (
                      nominee.permissions.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/60 text-xs"
                        >
                          <div className="flex items-center space-x-2 truncate">
                            <span className="text-emerald-600 font-bold">☑</span>
                            <span className="font-semibold text-slate-800 truncate">{p.asset_name}</span>
                            <span className="text-[10px] text-slate-400">({p.category_name})</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {p.access_level}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-center text-xs text-amber-600 bg-amber-50 rounded-xl border border-amber-200">
                        No asset permissions configured yet. Click below to grant permissions.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Last updated {new Date(nominee.updated_at).toLocaleDateString()}
                </span>

                <button
                  onClick={() => setSelectedForPermissions(nominee)}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Configure Permissions</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <AddNomineeModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingNominee(null);
        }}
        onNomineeSaved={loadNominees}
        editNominee={editingNominee}
      />

      <PermissionsModal
        isOpen={!!selectedForPermissions}
        onClose={() => setSelectedForPermissions(null)}
        nominee={selectedForPermissions}
        onSaved={loadNominees}
      />
    </div>
  );
}
