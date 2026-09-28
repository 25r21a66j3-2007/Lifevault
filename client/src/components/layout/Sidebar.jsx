import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Coins,
  FileBox,
  Users,
  GitFork,
  Sparkles,
  Bot,
  ShieldCheck,
  FileClock,
  Radio,
  SlidersHorizontal,
  LogOut,
  X,
  ExternalLink,
  Lock,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Assets', path: '/assets', icon: Coins },
    { name: 'Documents', path: '/documents', icon: FileBox },
    { name: 'Nominees', path: '/nominees', icon: Users },
    { name: 'Legacy Map', path: '/legacy-map', icon: GitFork, badge: 'Visual' },
    { name: 'AI Insights', path: '/ai-gaps', icon: Sparkles, badge: 'Gaps' },
    { name: 'LifeVault Assistant', path: '/assistant', icon: Bot, badge: 'AI' },
    { name: 'Security Center', path: '/security', icon: ShieldCheck },
    { name: 'Audit Logs', path: '/audit-logs', icon: FileClock },
    { name: 'Activation Settings', path: '/activation', icon: Radio },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/80">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-wider text-white">LIFEVAULT</span>
              <p className="text-[10px] text-slate-400 font-medium">Digital Legacy Manager</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Role Callout */}
        {user?.role === 'nominee' && (
          <div className="mx-4 mt-4 p-3 rounded-xl bg-sky-950/50 border border-sky-800/60 text-sky-200">
            <div className="flex items-center space-x-2 text-xs font-semibold text-sky-300 mb-1">
              <UserCheck className="w-4 h-4 text-sky-400" />
              <span>Nominee Access Active</span>
            </div>
            <p className="text-[11px] text-sky-300/80 leading-snug">
              You are authorized to review released estate records.
            </p>
            <NavLink
              to="/nominee-portal"
              onClick={onClose}
              className="mt-2.5 inline-flex items-center space-x-1.5 text-xs font-medium text-white bg-sky-600 hover:bg-sky-500 px-3 py-1.5 rounded-lg w-full justify-center transition-colors shadow-sm"
            >
              <span>Open Nominee Portal</span>
              <ExternalLink className="w-3 h-3" />
            </NavLink>
          </div>
        )}

        {user?.role === 'admin' && (
          <div className="mx-4 mt-4 p-3 rounded-xl bg-purple-950/50 border border-purple-800/60 text-purple-200">
            <div className="flex items-center space-x-2 text-xs font-semibold text-purple-300 mb-1">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Admin Center Active</span>
            </div>
            <NavLink
              to="/admin"
              onClick={onClose}
              className="mt-2 inline-flex items-center space-x-1.5 text-xs font-medium text-white bg-purple-600 hover:bg-purple-500 px-3 py-1.5 rounded-lg w-full justify-center transition-colors shadow-sm"
            >
              <span>Verification Queue</span>
              <ExternalLink className="w-3 h-3" />
            </NavLink>
          </div>
        )}

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-2">
            Main Navigation
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/20'
                      : 'text-slate-200 hover:text-white hover:bg-slate-800/70'
                  }`
                }
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded-md font-semibold border border-slate-700">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}

          {/* Conditional Portals */}
          {user?.role === 'nominee' && (
            <NavLink
              to="/nominee-portal"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-sky-500/20 text-sky-400 font-semibold border border-sky-500/30'
                    : 'text-sky-300 hover:text-white hover:bg-slate-800/70'
                }`
              }
            >
              <div className="flex items-center space-x-3">
                <UserCheck className="w-4 h-4 flex-shrink-0 text-sky-400" />
                <span>Nominee Portal</span>
              </div>
              <span className="text-[10px] bg-sky-900/60 text-sky-300 px-1.5 py-0.5 rounded-md font-semibold border border-sky-700/50">
                Released
              </span>
            </NavLink>
          )}

          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-purple-500/20 text-purple-400 font-semibold border border-purple-500/30'
                    : 'text-purple-300 hover:text-white hover:bg-slate-800/70'
                }`
              }
            >
              <div className="flex items-center space-x-3">
                <ShieldCheck className="w-4 h-4 flex-shrink-0 text-purple-400" />
                <span>Admin Portal</span>
              </div>
              <span className="text-[10px] bg-purple-900/60 text-purple-300 px-1.5 py-0.5 rounded-md font-semibold border border-purple-700/50">
                Queue
              </span>
            </NavLink>
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-medium text-slate-300">Vault Protected</span>
            </div>
            <span className="text-[10px] text-slate-400">AES-256</span>
          </div>

          <button
            onClick={logout}
            className="flex items-center justify-center space-x-2 w-full py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-red-950/40 text-slate-300 hover:text-red-300 text-xs font-medium transition-colors border border-slate-700/60 hover:border-red-800/60"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
