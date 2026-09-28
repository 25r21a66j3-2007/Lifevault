import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, UserCheck, ShieldCheck, Zap, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter your email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      if (res.user.role === 'admin') navigate('/admin');
      else if (res.user.role === 'nominee') navigate('/nominee-portal');
      else navigate('/dashboard');
    } else {
      setErrorMsg(res.message || 'Invalid email or password.');
    }
  };

  const handleQuickDemo = async (role) => {
    setLoading(true);
    setErrorMsg('');
    const res = await demoLogin(role);
    setLoading(false);

    if (res.success) {
      if (role === 'admin') navigate('/admin');
      else if (role === 'nominee') navigate('/nominee-portal');
      else navigate('/dashboard');
    } else {
      setErrorMsg(res.message || 'Demo login failed.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center space-x-2.5 mb-3 group">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-emerald-400 shadow-md group-hover:scale-105 transition-transform">
            <Shield className="w-6 h-6" />
          </div>
        </Link>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Sign In to LifeVault
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Access your encrypted digital legacy vault
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        {/* Quick Demo Pill Card for Judges */}
        <div className="mb-4 bg-emerald-50/70 border border-emerald-200/90 rounded-2xl p-4 shadow-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center space-x-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>1-Click Hackathon Demo Login</span>
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold">No password needed</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('owner')}
              className="px-2.5 py-2 bg-white hover:bg-emerald-100/50 text-slate-800 text-xs font-bold rounded-xl border border-emerald-300 shadow-sm transition-all text-center"
            >
              👤 Owner (Ravi)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('nominee')}
              className="px-2.5 py-2 bg-white hover:bg-sky-100/50 text-slate-800 text-xs font-bold rounded-xl border border-sky-300 shadow-sm transition-all text-center"
            >
              👥 Nominee (Anjali)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="px-2.5 py-2 bg-white hover:bg-purple-100/50 text-slate-800 text-xs font-bold rounded-xl border border-purple-300 shadow-sm transition-all text-center"
            >
              🛡️ Admin
            </button>
          </div>
        </div>

        {/* Standard Login Box */}
        <div className="bg-white py-8 px-6 shadow-premium rounded-3xl border border-slate-200/80 sm:px-8">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="e.g. ravi@lifevault.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Demo Reset: You can use "Password123!" for demo accounts or use the 1-click Demo buttons above!')}
                  className="text-xs text-brand-600 hover:text-brand-700 font-semibold"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-between py-1">
              <label className="flex items-center space-x-2 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                <span>Remember me for 30 days</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Vault'}</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
            <span>Don&apos;t have a digital vault yet? </span>
            <Link to="/register" className="font-bold text-slate-900 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
