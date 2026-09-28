import React, { useState, useEffect } from 'react';
import { X, UserPlus, Users, Mail, Phone, Heart } from 'lucide-react';
import { api } from '../../services/api';

export default function AddNomineeModal({ isOpen, onClose, onNomineeSaved, editNominee = null }) {
  const [formData, setFormData] = useState({
    name: '',
    relationship: 'Daughter',
    email: '',
    phone: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const relationships = [
    'Daughter', 'Son', 'Spouse', 'Sister', 'Brother', 'Mother', 'Father', 'Legal Executor', 'Business Partner', 'Trusted Contact'
  ];

  useEffect(() => {
    if (editNominee) {
      setFormData({
        name: editNominee.name || '',
        relationship: editNominee.relationship || 'Daughter',
        email: editNominee.email || '',
        phone: editNominee.phone || '',
        notes: editNominee.notes || ''
      });
    } else {
      setFormData({
        name: '',
        relationship: 'Daughter',
        email: '',
        phone: '',
        notes: ''
      });
    }
  }, [editNominee, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Name and email are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (editNominee) {
        await api.updateNominee(editNominee.id, formData);
      } else {
        await api.createNominee(formData);
      }
      onNomineeSaved();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save nominee.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {editNominee ? 'Edit Nominee' : 'Add Trusted Nominee'}
              </h3>
              <p className="text-xs text-slate-500">Beneficiary for legacy asset release</p>
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
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Legal Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Anjali Kumar"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Relationship *
              </label>
              <select
                value={formData.relationship}
                onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none bg-white"
              >
                {relationships.map((rel) => (
                  <option key={rel} value={rel}>{rel}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="+91 98765 43211"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="anjali@lifevault.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Nominee can sign in with this email to view authorized release records.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Role & Beneficiary Notes
            </label>
            <textarea
              rows="2"
              placeholder="e.g. Primary beneficiary for real estate and business ventures."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none resize-none"
            />
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
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? 'Saving...' : (editNominee ? 'Save Changes' : 'Add Nominee')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
