import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Coins,
  FileBox,
  Users,
  Radio
} from 'lucide-react';
import { api } from '../services/api';

export default function AIGapsPage() {
  const [gaps, setGaps] = useState([]);
  const [readiness, setReadiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    try {
      const [gapsRes, readinessRes] = await Promise.all([
        api.getGapAnalysis(),
        api.getLegacyReadiness()
      ]);
      if (gapsRes.success) setGaps(gapsRes.gaps || []);
      if (readinessRes.success) setReadiness(readinessRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'critical':
        return (
          <span className="flex items-center space-x-1 text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span>Critical Gap</span>
          </span>
        );
      case 'warning':
        return (
          <span className="flex items-center space-x-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Warning</span>
          </span>
        );
      case 'info':
        return (
          <span className="flex items-center space-x-1 text-xs font-bold text-yellow-800 bg-yellow-50 border border-yellow-200 px-2.5 py-0.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
            <span>Recommendation</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center space-x-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Safeguard Active</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white border border-slate-700 shadow-premium flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Intelligent Estate Sentinel</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">AI Legacy Gap Detection</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Real-time heuristic &amp; legal compliance analysis auditing your vault assets, nominee assignments, and document verification.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Re-scan Vault</span>
          </button>

          <Link
            to="/assistant"
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-sm"
          >
            <span>Ask LifeVault AI</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Readiness Score</span>
            <span className="text-2xl font-extrabold text-slate-900 block mt-0.5">
              {readiness?.readinessScore ?? 78}%
            </span>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {readiness?.statusLabel ?? 'Optimal'}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Action Items</span>
            <span className="text-2xl font-extrabold text-amber-600 block mt-0.5">
              {gaps.filter(g => g.severity !== 'success').length}
            </span>
          </div>
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            Attention Needed
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Verified Controls</span>
            <span className="text-2xl font-extrabold text-emerald-600 block mt-0.5">
              {gaps.filter(g => g.severity === 'success').length}
            </span>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Protected
          </span>
        </div>
      </div>

      {/* Gaps List (Matches Section 9 of requirements) */}
      {loading ? (
        <div className="text-center py-16 text-xs text-slate-500">Running AI diagnostic algorithms...</div>
      ) : (
        <div className="space-y-4">
          {gaps.map((gap) => (
            <div
              key={gap.id}
              className={`bg-white rounded-3xl p-6 border transition-all shadow-premium flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                gap.severity === 'critical'
                  ? 'border-red-200/90 hover:border-red-300'
                  : gap.severity === 'warning'
                  ? 'border-amber-200/90 hover:border-amber-300'
                  : gap.severity === 'info'
                  ? 'border-yellow-200/90 hover:border-yellow-300'
                  : 'border-emerald-200/90 hover:border-emerald-300 bg-emerald-50/20'
              }`}
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center space-x-3">
                  {getSeverityBadge(gap.severity)}
                  <h3 className="text-base font-bold text-slate-900">{gap.title}</h3>
                </div>

                <div className="space-y-1.5 pt-1 text-xs">
                  <div>
                    <strong className="text-slate-700 font-semibold">Problem: </strong>
                    <span className="text-slate-600">{gap.problem}</span>
                  </div>

                  <div>
                    <strong className="text-slate-700 font-semibold">Importance: </strong>
                    <span className="text-slate-600 leading-relaxed">{gap.importance}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex-shrink-0 flex items-center space-x-2">
                <Link
                  to={gap.actionLink}
                  className={`inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                    gap.severity === 'critical'
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : gap.severity === 'warning'
                      ? 'bg-amber-600 hover:bg-amber-700 text-white'
                      : gap.severity === 'info'
                      ? 'bg-slate-900 hover:bg-slate-800 text-white'
                      : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300'
                  }`}
                >
                  <span>{gap.suggestedAction}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
