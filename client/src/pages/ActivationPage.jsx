import React, { useState, useEffect } from 'react';
import {
  Radio,
  Shield,
  ShieldCheck,
  UserCheck,
  Clock,
  Play,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Phone,
  Mail,
  RefreshCw,
  Bell
} from 'lucide-react';
import { api } from '../services/api';
import EmergencySimModal from '../components/modals/EmergencySimModal';

export default function ActivationPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showSimModal, setShowSimModal] = useState(false);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await api.getActivationSettings();
      if (res.success) setSettings(res.settings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await api.updateActivationSettings(settings);
      if (res.success) {
        setMessage('Activation safeguards updated successfully.');
        setSettings(res.settings);
      }
    } catch (err) {
      setMessage('Failed to update settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      const res = await api.checkIn();
      if (res.success) {
        setMessage('Check-in confirmed! Inactivity timer has been reset.');
        loadSettings();
      }
    } catch (err) {
      alert('Check-in failed: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Emergency Protocol</span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Legacy Activation Settings</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure inactivity duration, designated trusted contacts, and emergency release validation rules.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCheckIn}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm Check-In (Reset Timer)</span>
          </button>

          <button
            onClick={() => setShowSimModal(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm"
          >
            <Play className="w-4 h-4 text-amber-400" />
            <span>Launch Simulation</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-200 font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-xs text-slate-500">Loading activation parameters...</div>
      ) : (
        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Configuration Card (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-premium space-y-6">
            {/* Inactivity Threshold */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Inactivity Trigger Period
                </label>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {settings.inactivity_days || 90} Days Inactivity
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-3">
                If no login or check-in is detected within this window, the system initiates contact with your designated trusted contact.
              </p>

              <div className="grid grid-cols-4 gap-2.5">
                {[30, 60, 90, 180].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setSettings({ ...settings, inactivity_days: days })}
                    className={`py-3 rounded-2xl border text-center font-bold text-xs transition-all ${
                      settings.inactivity_days === days
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20 shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{days} Days</span>
                    <span className="block text-[10px] font-normal text-slate-400 mt-0.5">
                      {days === 90 ? 'Recommended' : `${Math.round(days / 30)} Months`}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Trusted Contact Information */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Designated Trusted Contact</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  A physician, family lawyer, or secondary confidant contacted prior to initiating estate release.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={settings.trusted_contact_name || ''}
                    onChange={(e) => setSettings({ ...settings, trusted_contact_name: e.target.value })}
                    placeholder="Dr. Arvind Sharma"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={settings.trusted_contact_email || ''}
                    onChange={(e) => setSettings({ ...settings, trusted_contact_email: e.target.value })}
                    placeholder="arvind.sharma@medcare.org"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={settings.trusted_contact_phone || ''}
                    onChange={(e) => setSettings({ ...settings, trusted_contact_phone: e.target.value })}
                    placeholder="+91 98450 11223"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Verification Requirement Level */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Verification Requirement</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Legal evidence threshold required before Administrator reviews and releases vault data.
                </p>
              </div>

              <div className="space-y-2">
                {[
                  {
                    id: 'death_certificate_or_confirmation',
                    title: 'Medical Death Certificate or Hospital Confirmation (Recommended)',
                    desc: 'Requires certified death certificate or official hospital medical report upload.'
                  },
                  {
                    id: 'double_signoff',
                    title: 'Double Sign-Off (Trusted Contact + Primary Nominee)',
                    desc: 'Both Dr. Arvind Sharma and Anjali Kumar must mutually verify emergency state.'
                  },
                  {
                    id: 'trusted_contact_only',
                    title: 'Trusted Contact Direct Confirmation',
                    desc: 'Physician or legal executor sign-off alone initiates verification review.'
                  }
                ].map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-start space-x-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      settings.verification_requirement === option.id
                        ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="verification_req"
                      checked={settings.verification_requirement === option.id}
                      onChange={() => setSettings({ ...settings, verification_requirement: option.id })}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{option.title}</span>
                      <span className="text-[11px] text-slate-500 leading-relaxed block mt-0.5">{option.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Activation Settings'}
              </button>
            </div>
          </div>

          {/* Workflow Explanation & Status (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-premium">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Vault Protocol Standing</span>
              <div className="flex items-center space-x-2 mt-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-base font-extrabold text-slate-900 uppercase">
                  {settings.status === 'normal' ? 'Normal / Protected' : settings.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Last proof-of-life activity recorded: <strong className="text-slate-800">{new Date(settings.last_check_in).toLocaleDateString()}</strong>.
              </p>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSimModal(true)}
                  className="w-full py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Test Inactivity Workflow</span>
                </button>
              </div>
            </div>

            {/* Workflow Diagram Card */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-premium">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Safety Architecture</span>
              <h4 className="text-sm font-bold mt-1 mb-4">Fail-Safe Release Pipeline</h4>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-[10px] font-bold">1</div>
                  <span>Inactivity detected ({settings.inactivity_days || 90} days)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-[10px] font-bold">2</div>
                  <span>Trusted contact &amp; owner notified</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-[10px] font-bold">3</div>
                  <span>Verification request submitted</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-[10px] font-bold">4</div>
                  <span>Administrator review &amp; confirmation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-[10px] font-bold">5</div>
                  <span>Authorized records released to nominees</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Simulation Modal */}
      <EmergencySimModal
        isOpen={showSimModal}
        onClose={() => setShowSimModal(false)}
        onSimulated={loadSettings}
      />
    </div>
  );
}
