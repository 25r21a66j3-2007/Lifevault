import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Menu, Lock, UserCheck, ShieldAlert, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';

export default function Navbar({ onToggleSidebar }) {
  const { user, logout, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleRoleSwitch = async (role) => {
    const res = await demoLogin(role);
    if (res.success) {
      if (role === 'admin') navigate('/admin');
      else if (role === 'nominee') navigate('/nominee-portal');
      else navigate('/dashboard');
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <span className="bg-purple-100 text-purple-700 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-purple-200">Admin</span>;
      case 'nominee':
        return <span className="bg-sky-100 text-sky-700 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-sky-200">Nominee</span>;
      default:
        return <span className="bg-emerald-100 text-emerald-800 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200">Vault Owner</span>;
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3 transition-all">
      <div className="flex items-center justify-between">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center space-x-3 lg:space-x-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/dashboard" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-emerald-400 shadow-md group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 font-sans">LIFEVAULT</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <p className="text-[10px] text-slate-600 font-medium tracking-wide uppercase hidden sm:block">Digital Legacy Platform</p>
            </div>
          </Link>
        </div>

        {/* Center: Security Badge & Hackathon Demo Switcher */}
        <div className="hidden md:flex items-center space-x-3">
          {/* AES Status Pill */}
          <div className="flex items-center space-x-1.5 bg-slate-100/90 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>AES-256 Encrypted</span>
          </div>

          {/* Demo Quick Role Switcher */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <span className="text-slate-600 text-[11px] font-semibold px-2">Demo Role:</span>
            <button
              onClick={() => handleRoleSwitch('owner')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                user?.role === 'owner'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Switch to Ravi Kumar (Vault Owner)"
            >
              👤 Owner (Ravi)
            </button>
            <button
              onClick={() => handleRoleSwitch('nominee')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                user?.role === 'nominee'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Switch to Anjali Kumar (Nominee)"
            >
              👥 Nominee (Anjali)
            </button>
            <button
              onClick={() => handleRoleSwitch('admin')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                user?.role === 'admin'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Switch to System Administrator"
            >
              🛡️ Admin
            </button>
          </div>
        </div>

        {/* Right: Notifications & User Profile */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <NotificationDropdown />

          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

          {user ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2.5 text-left">
                <img
                  src={user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.full_name)}`}
                  alt={user.full_name}
                  className="w-8 h-8 rounded-full border border-slate-200 object-cover shadow-sm"
                />
                <div className="hidden sm:block">
                  <div className="flex items-center space-x-1.5">
                    <p className="text-xs font-bold text-slate-800 leading-tight">{user.full_name}</p>
                    {getRoleBadge(user.role)}
                  </div>
                  <p className="text-[11px] text-slate-600 truncate max-w-[140px]">{user.email}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="p-2 rounded-xl text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Log out"
                aria-label="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium px-4 py-2 rounded-xl shadow-sm transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
