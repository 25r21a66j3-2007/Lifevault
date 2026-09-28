import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  FileBox,
  Coins,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Lock,
  Eye,
  Check,
  X,
  FileClock
} from 'lucide-react';
import { api } from '../services/api';
import StatsCard from '../components/dashboard/StatsCard';

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [reviewModalRequest, setReviewModalRequest] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, reqsRes, logsRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminUsers(),
        api.getVerificationRequests(),
        api.getAdminAuditLogs({ limit: 15 })
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (usersRes.success) setUsers(usersRes.users || []);
      if (reqsRes.success) setRequests(reqsRes.requests || []);
      if (logsRes.success) setSystemLogs(logsRes.logs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleReview = async (id, status) => {
    setActionLoading(true);
    try {
      const res = await api.reviewVerificationRequest(id, {
        status,
        adminNotes: adminNotes || (status === 'approved' ? 'Verified medical authorization credentials.' : 'Documentation insufficient.')
      });
      if (res.success) {
        setReviewModalRequest(null);
        setAdminNotes('');
        loadAdminData();
      }
    } catch (err) {
      alert('Error updating request: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-purple-800/40 shadow-premium flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-purple-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Administrative Governance Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">System Administration</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Monitor system-wide vault health, review emergency verification queues, and authorize estate releases without accessing private encrypted user data.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-purple-300 bg-purple-900/60 border border-purple-700/60 px-3.5 py-1.5 rounded-xl">
            Admin Privileges Active
          </span>
        </div>
      </div>

      {/* 4 Admin Stat Cards (Section 15 requirement) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatsCard
          title="Total Users"
          value={stats?.totalUsers ?? 3}
          subtext="Registered Accounts"
          icon={Users}
          accent="purple"
        />
        <StatsCard
          title="Active Vaults"
          value={stats?.activeVaults ?? 1}
          subtext="Owner Accounts"
          icon={Coins}
          accent="emerald"
        />
        <StatsCard
          title="Verification Queue"
          value={stats?.pendingVerifications ?? 1}
          subtext="Pending Review"
          icon={Clock}
          accent="amber"
        />
        <StatsCard
          title="Released Vaults"
          value={stats?.releasedVaults ?? 0}
          subtext="Post-Verification"
          icon={CheckCircle2}
          accent="blue"
        />
      </div>

      {/* Verification Queue (Section 15 requirement) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-premium space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Emergency Authorization</span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">Verification Requests Queue</h3>
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            {requests.filter(r => r.status === 'pending').length} Pending Requests
          </span>
        </div>

        {requests.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">No verification requests submitted.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {requests.map((req) => (
              <div
                key={req.id}
                className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm">{req.requester_name}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-xs text-slate-600">Relationship: <strong>{req.requester_relationship}</strong></span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      req.status === 'pending'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : req.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      {req.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    <strong>Reason:</strong> {req.reason}
                  </p>

                  <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                    <span>Target Vault: <strong>{req.owner_name}</strong> ({req.owner_email})</span>
                    <span>•</span>
                    <span>Requested: {new Date(req.requested_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {req.status === 'pending' ? (
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <button
                      onClick={() => handleReview(req.id, 'approved')}
                      disabled={actionLoading}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve Release</span>
                    </button>
                    <button
                      onClick={() => handleReview(req.id, 'rejected')}
                      disabled={actionLoading}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-200 text-xs font-bold transition-all"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic font-medium">
                    Reviewed by {req.reviewer_name || 'Admin'}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Management & System Audit Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* User Directory (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-premium space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Directory</span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">Platform Users</h3>
            </div>
            <span className="text-xs text-slate-400">{users.length} Total Users</span>
          </div>

          <div className="space-y-3">
            {users.map((u) => (
              <div
                key={u.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-emerald-400 font-bold flex items-center justify-center text-xs">
                    {u.full_name[0]}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-bold text-slate-900">{u.full_name}</p>
                      <span className="text-[10px] font-mono uppercase bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-semibold">
                        {u.role}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">{u.email}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-semibold text-slate-700 block">
                    {u.asset_count || 0} Assets • {u.nominee_count || 0} Nominees
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold">
                    Status: {u.vault_status || 'Active'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Audit Monitor (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-premium space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Security Stream</span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">System Audit Surveillance</h3>
            </div>
            <FileClock className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3 text-xs">
            {systemLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{log.action_type}</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed truncate">
                  {log.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
