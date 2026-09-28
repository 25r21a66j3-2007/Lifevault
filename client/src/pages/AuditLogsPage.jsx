import React, { useState, useEffect } from 'react';
import {
  FileClock,
  Search,
  Filter,
  Shield,
  Lock,
  ArrowUpDown,
  Download,
  Calendar,
  UserCheck
} from 'lucide-react';
import { api } from '../services/api';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const actionTypes = [
    'All',
    'USER_LOGIN',
    'ASSET_CREATED',
    'ASSET_UPDATED',
    'NOMINEE_ADDED',
    'PERMISSION_CONFIGURED',
    'DOCUMENT_UPLOADED',
    'INACTIVITY_TRIGGERED',
    'VERIFICATION_REQUESTED',
    'RELEASE_APPROVED'
  ];

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await api.getAuditLogs({
        actionType: actionFilter !== 'All' ? actionFilter : undefined,
        search: searchQuery || undefined,
        limit: 100
      });
      if (res.success) setLogs(res.logs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [actionFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Compliance &amp; Governance</span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Audit Trail</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable, append-only chronological log of all cryptographic and estate administration actions.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl text-xs text-slate-700 shadow-subtle">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Tamper-Resistant Log</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Action Filter */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 max-w-full">
          {actionTypes.slice(0, 6).map((type) => (
            <button
              key={type}
              onClick={() => setActionFilter(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                actionFilter === type
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {type === 'All' ? 'All Events' : type.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search action, actor, or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none shadow-subtle"
          />
        </div>
      </div>

      {/* Logs Table */}
      {loading ? (
        <div className="text-center py-16 text-xs text-slate-500">Querying immutable audit logs...</div>
      ) : logs.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-premium">
          <FileClock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No logs found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            No events match the selected filter.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-premium overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Timestamp</th>
                  <th className="py-3.5 px-4">Actor</th>
                  <th className="py-3.5 px-4">Action Type</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-6 text-right">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })} | {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>

                    <td className="py-4 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {log.actor_name || 'System Daemon'}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-slate-100 text-slate-800 border border-slate-200">
                        {log.action_type}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-slate-700 leading-relaxed font-sans max-w-md">
                      {log.description}
                    </td>

                    <td className="py-4 px-6 text-right font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {log.ip_address}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
