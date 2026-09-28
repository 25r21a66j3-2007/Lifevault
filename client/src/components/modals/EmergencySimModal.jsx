import React, { useState } from 'react';
import { X, Play, ShieldAlert, CheckCircle2, UserCheck, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function EmergencySimModal({ isOpen, onClose, onSimulated }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { demoLogin } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleTriggerInactivity = async () => {
    setLoading(true);
    try {
      const res = await api.simulateInactivity();
      if (res.success) {
        setMessage('Step 1 Complete: 90 days inactivity simulated. Status set to "Inactivity Detected".');
        setStep(2);
      }
    } catch (err) {
      setMessage('Error triggering inactivity: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitVerification = async () => {
    setLoading(true);
    try {
      const res = await api.submitVerification({
        vaultOwnerEmail: 'ravi@lifevault.com',
        requesterName: 'Anjali Kumar',
        requesterEmail: 'anjali@lifevault.com',
        requesterRelationship: 'Daughter',
        reason: 'Emergency hospital admission protocol. Legal verification submitted for asset access.'
      });
      if (res.success) {
        setMessage('Step 2 & 3 Complete: Verification request queued for Administrator review.');
        setStep(3);
      }
    } catch (err) {
      setMessage('Error submitting verification: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToAdmin = async () => {
    onClose();
    await demoLogin('admin');
    navigate('/admin');
  };

  const handleResetCheckIn = async () => {
    setLoading(true);
    try {
      await api.checkIn();
      setStep(1);
      setMessage('Inactivity reset! Vault returned to normal active standing.');
      if (onSimulated) onSimulated();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Inactivity & Emergency Simulator</h3>
              <p className="text-xs text-slate-500">Live Hackathon Demonstration Workflow</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workflow Diagram */}
        <div className="my-5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="space-y-3">
            <div className={`flex items-center space-x-3 text-xs ${step >= 1 ? 'font-bold text-slate-900' : 'text-slate-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                step > 1 ? 'bg-emerald-600 text-white' : (step === 1 ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600')
              }`}>
                1
              </div>
              <span>Inactivity Detected (90-day trigger simulated)</span>
            </div>

            <div className={`flex items-center space-x-3 text-xs ${step >= 2 ? 'font-bold text-slate-900' : 'text-slate-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                step > 2 ? 'bg-emerald-600 text-white' : (step === 2 ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600')
              }`}>
                2
              </div>
              <span>Trusted Contact Notified & Verification Request Filed</span>
            </div>

            <div className={`flex items-center space-x-3 text-xs ${step >= 3 ? 'font-bold text-slate-900' : 'text-slate-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                step === 3 ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                3
              </div>
              <span>Administrator Review & Approval of Release</span>
            </div>

            <div className="flex items-center space-x-3 text-xs text-slate-400">
              <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[11px] font-bold">
                4
              </div>
              <span>Authorized Nominee Receives Decrypted Assets</span>
            </div>
          </div>
        </div>

        {message && (
          <div className="mb-4 p-3 rounded-xl bg-slate-100 text-slate-800 text-xs border border-slate-200 font-medium">
            {message}
          </div>
        )}

        {/* Step Actions */}
        <div className="space-y-3">
          {step === 1 && (
            <button
              onClick={handleTriggerInactivity}
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs transition-colors flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50"
            >
              <Play className="w-4 h-4" />
              <span>{loading ? 'Simulating...' : 'Step 1: Trigger Simulated 90-Day Inactivity'}</span>
            </button>
          )}

          {step === 2 && (
            <button
              onClick={handleSubmitVerification}
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50"
            >
              <UserCheck className="w-4 h-4" />
              <span>{loading ? 'Submitting...' : 'Step 2: Submit Verification Request as Anjali Kumar'}</span>
            </button>
          )}

          {step === 3 && (
            <div className="space-y-2">
              <button
                onClick={handleSwitchToAdmin}
                className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-colors flex items-center justify-center space-x-2 shadow-sm"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Step 3: Switch to Admin Dashboard to Review & Approve</span>
              </button>
              <p className="text-[11px] text-slate-500 text-center">
                In the Admin portal, you will see Anjali&apos;s request in the queue ready for 1-click release approval!
              </p>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <button
              onClick={handleResetCheckIn}
              disabled={loading}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center space-x-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset to Normal Standing</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
