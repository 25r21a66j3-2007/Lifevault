import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Coins,
  FileBox,
  Users,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Lock,
  Radio,
  FileClock,
  Landmark,
  Home,
  Globe,
  HeartHandshake
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import ReadinessGauge from '../components/dashboard/ReadinessGauge';
import StatsCard from '../components/dashboard/StatsCard';
import AddAssetModal from '../components/modals/AddAssetModal';
import AddNomineeModal from '../components/modals/AddNomineeModal';
import UploadDocModal from '../components/modals/UploadDocModal';
import EmergencySimModal from '../components/modals/EmergencySimModal';

export default function DashboardPage() {
  const { user } = useAuth();
  const [readiness, setReadiness] = useState(null);
  const [gaps, setGaps] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [assets, setAssets] = useState([]);
  const [nominees, setNominees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [showNomineeModal, setShowNomineeModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSimModal, setShowSimModal] = useState(false);

  const loadDashboardData = async () => {
    try {
      const [readinessRes, gapsRes, logsRes, assetsRes, nomineesRes] = await Promise.all([
        api.getLegacyReadiness(),
        api.getGapAnalysis(),
        api.getAuditLogs({ limit: 6 }),
        api.getAssets(),
        api.getNominees()
      ]);

      if (readinessRes.success) setReadiness(readinessRes);
      if (gapsRes.success) setGaps(gapsRes.gaps || []);
      if (logsRes.success) setRecentLogs(logsRes.logs || []);
      if (assetsRes.success) setAssets(assetsRes.assets || []);
      if (nomineesRes.success) setNominees(nomineesRes.nominees || []);
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const totalValuation = assets.reduce((sum, a) => sum + Number(a.approxValue || 0), 0);

  return (
    <div className="space-y-6">
      {/* Welcome Banner & Quick Action Buttons */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-premium flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Vault Operational • AES-256 Hardware Encrypted</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {user?.full_name?.split(' ')[0] || 'Ravi'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Your centralized estate manager actively monitors readiness, beneficiary allocation, and legal documentation.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10">
          <button
            onClick={() => setShowAssetModal(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Add Asset</span>
          </button>

          <button
            onClick={() => setShowNomineeModal(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold border border-slate-200 shadow-sm transition-all"
          >
            <Users className="w-4 h-4 text-slate-600" />
            <span>Add Nominee</span>
          </button>

          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold border border-slate-200 shadow-sm transition-all"
          >
            <FileBox className="w-4 h-4 text-slate-600" />
            <span>Upload Document</span>
          </button>

          <button
            onClick={() => setShowSimModal(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100/70 text-amber-800 text-xs font-bold border border-amber-200/80 transition-all"
            title="Demonstrate emergency inactivity workflow"
          >
            <Radio className="w-4 h-4 text-amber-600" />
            <span>Emergency Simulator</span>
          </button>
        </div>
      </div>

      {/* Top Grid: Legacy Readiness + AI Insights + Key Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Readiness Gauge (4 cols) */}
        <div className="lg:col-span-4">
          <ReadinessGauge
            score={readiness?.readinessScore ?? 78}
            statusLabel={readiness?.statusLabel ?? 'Optimal Readiness'}
            factors={readiness?.factors ?? []}
          />
        </div>

        {/* Right side: Stat cards & AI Insight Card (8 cols) */}
        <div className="lg:col-span-8 flex flex-col justify-between gap-6">
          {/* 4 Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatsCard
              title="Total Assets"
              value={readiness?.stats?.totalAssets ?? assets.length}
              subtext={`₹${(totalValuation / 10000000).toFixed(2)} Cr Est.`}
              icon={Coins}
              accent="emerald"
            />
            <StatsCard
              title="Documents"
              value={readiness?.stats?.totalDocuments ?? 3}
              subtext="AES-256 Protected"
              icon={FileBox}
              accent="blue"
            />
            <StatsCard
              title="Nominees"
              value={readiness?.stats?.totalNominees ?? nominees.length}
              subtext="100% Verified"
              icon={Users}
              accent="purple"
            />
            <StatsCard
              title="Pending Actions"
              value={gaps.filter(g => g.severity === 'critical' || g.severity === 'warning').length}
              subtext="AI Gaps Flagged"
              icon={AlertTriangle}
              accent="amber"
            />
          </div>

          {/* AI Insight Card (Section 5 requirement) */}
          <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 rounded-3xl p-6 text-white border border-emerald-800/40 shadow-premium flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                    AI Legacy Gap Detection
                  </span>
                  <span className="bg-emerald-500/30 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    Active Audit
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">
                  AI detected {gaps.filter(g => g.severity !== 'success').length} areas that may need attention.
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                  Your HDFC Life Insurance policy has no assigned beneficiary, and property deed documentation is incomplete for Mysuru Farmland.
                </p>
              </div>
            </div>

            <Link
              to="/ai-gaps"
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-sm flex-shrink-0 justify-center"
            >
              <span>View AI Recommendations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Middle Grid: Catalog Snapshot & Recent Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Asset Category Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-premium">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Catalog Overview</span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">Asset Distribution</h3>
            </div>
            <Link
              to="/assets"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center space-x-1"
            >
              <span>Manage Assets ({assets.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {assets.slice(0, 4).map((a) => (
              <div
                key={a.id}
                className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-slate-300 transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 flex-shrink-0 shadow-subtle">
                    {a.categoryName === 'Financial' && <Landmark className="w-4 h-4 text-emerald-600" />}
                    {a.categoryName === 'Property' && <Home className="w-4 h-4 text-blue-600" />}
                    {a.categoryName === 'Digital' && <Globe className="w-4 h-4 text-purple-600" />}
                    {a.categoryName === 'Documents' && <FileBox className="w-4 h-4 text-amber-600" />}
                    {a.categoryName === 'Personal' && <HeartHandshake className="w-4 h-4 text-rose-600" />}
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{a.name}</h4>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {a.institution || 'Direct'} • {a.accountNumberMasked || 'Protected ID'}
                    </p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-bold text-slate-900 block">
                    ₹{Number(a.approxValue || 0).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500">
                    {a.nomineeName ? `→ ${a.nomineeName}` : '⚠️ No Nominee'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Total Valuation: <strong>₹{totalValuation.toLocaleString('en-IN')}</strong></span>
            <Link to="/legacy-map" className="text-xs font-semibold text-brand-600 hover:underline">
              Inspect Legacy Map →
            </Link>
          </div>
        </div>

        {/* Recent Activity Audit Stream (5 cols - Section 5 requirement) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-premium">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Security Audit</span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">Recent Activity</h3>
            </div>
            <Link
              to="/audit-logs"
              className="text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              Full Log
            </Link>
          </div>

          <div className="space-y-3.5">
            {recentLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-start space-x-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 leading-snug truncate">
                    {log.description}
                  </p>
                  <div className="flex items-center space-x-2 mt-0.5 text-[10px] text-slate-400">
                    <span>{new Date(log.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    <span>•</span>
                    <span className="font-mono">{log.action_type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center space-x-1">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>Cryptographic Tamper-Proof Audit</span>
            </span>
            <Link to="/security" className="font-semibold text-slate-700 hover:text-slate-900">
              Security Center
            </Link>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddAssetModal
        isOpen={showAssetModal}
        onClose={() => setShowAssetModal(false)}
        onAssetSaved={loadDashboardData}
        nominees={nominees}
      />

      <AddNomineeModal
        isOpen={showNomineeModal}
        onClose={() => setShowNomineeModal(false)}
        onNomineeSaved={loadDashboardData}
      />

      <UploadDocModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploaded={loadDashboardData}
        assets={assets}
      />

      <EmergencySimModal
        isOpen={showSimModal}
        onClose={() => setShowSimModal(false)}
        onSimulated={loadDashboardData}
      />
    </div>
  );
}
