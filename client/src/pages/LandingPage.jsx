import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  Lock,
  Sparkles,
  Users,
  FileBox,
  Radio,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Landmark,
  Home,
  Globe,
  HeartHandshake,
  ShieldCheck,
  Zap,
  Key
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { demoLogin, user } = useAuth();
  const navigate = useNavigate();

  const handleQuickDemo = async (role) => {
    const res = await demoLogin(role);
    if (res.success) {
      if (role === 'admin') navigate('/admin');
      else if (role === 'nominee') navigate('/nominee-portal');
      else navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Banner & Nav */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 lg:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-emerald-400 shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">LIFEVAULT</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
                Digital Legacy Manager
              </p>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
            <a href="#why-lifevault" className="hover:text-slate-900 transition-colors">Why LifeVault</a>
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How It Works</a>
            <a href="#security" className="hover:text-slate-900 transition-colors">Security</a>
            <a href="#demo" className="text-emerald-600 hover:text-emerald-700 transition-colors">Demo Credentials</a>
          </div>

          <div className="flex items-center space-x-3">
            {user ? (
              <Link
                to="/dashboard"
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center space-x-1.5"
              >
                <span>Go to Vault</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs font-bold text-slate-700 hover:text-slate-900 px-3 py-2"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center space-x-1.5"
                >
                  <span>Create Vault</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-6 lg:px-12 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-50">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Tagline Badge */}
          <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200/80 px-4 py-1.5 rounded-full text-xs font-bold text-emerald-800 mb-6 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>AI-Powered Digital Legacy &amp; Asset Management Platform</span>
          </div>

          {/* Main Hero Header */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
            Your Legacy. Protected.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
              Organized. Ready.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-10 font-normal">
            Securely organize your digital and physical legacy, define who can access it, and prepare your important information for the future with hardware-grade AES-256 encryption.
          </p>

          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-premium transition-all hover:scale-[1.02] flex items-center justify-center space-x-2"
            >
              <span>Create Your Vault</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </Link>

            <button
              onClick={() => handleQuickDemo('owner')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 font-bold text-sm border border-slate-200 shadow-sm transition-all hover:border-slate-300 flex items-center justify-center space-x-2"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Explore Demo (Ravi Kumar)</span>
            </button>
          </div>

          {/* Interactive Demo Launcher Pills */}
          <div id="demo" className="max-w-2xl mx-auto bg-white/80 backdrop-blur-md rounded-3xl p-5 border border-slate-200/90 shadow-premium">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <Key className="w-3.5 h-3.5 text-emerald-600" />
                <span>Hackathon 1-Click Role Switcher</span>
              </span>
              <span className="text-[11px] text-slate-400">Pre-seeded demo accounts</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                onClick={() => handleQuickDemo('owner')}
                className="p-3 rounded-2xl border border-slate-200 hover:border-emerald-500 bg-slate-50/70 hover:bg-emerald-50/50 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">👤 Ravi Kumar</span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded">Owner</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Full vault, 7 assets, AI gaps &amp; readiness map</p>
              </button>

              <button
                onClick={() => handleQuickDemo('nominee')}
                className="p-3 rounded-2xl border border-slate-200 hover:border-sky-500 bg-slate-50/70 hover:bg-sky-50/50 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">👥 Anjali Kumar</span>
                  <span className="text-[10px] font-semibold text-sky-700 bg-sky-100/80 px-1.5 py-0.5 rounded">Nominee</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Daughter view, released records portal</p>
              </button>

              <button
                onClick={() => handleQuickDemo('admin')}
                className="p-3 rounded-2xl border border-slate-200 hover:border-purple-500 bg-slate-50/70 hover:bg-purple-50/50 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">🛡️ Administrator</span>
                  <span className="text-[10px] font-semibold text-purple-700 bg-purple-100/80 px-1.5 py-0.5 rounded">Admin</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Verification queue, release approvals</p>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Asset Coverage Grid */}
      <section className="py-12 border-y border-slate-200/80 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
            Comprehensive Asset Categorization
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
              <Landmark className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
              <h4 className="text-xs font-bold text-slate-800">Financial</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Banks, Insurance, Stocks</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
              <Home className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <h4 className="text-xs font-bold text-slate-800">Property</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Houses, Deeds, Land</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
              <Globe className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <h4 className="text-xs font-bold text-slate-800">Digital</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Cloud, Email, Accounts</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
              <FileBox className="w-6 h-6 text-amber-600 mx-auto mb-2" />
              <h4 className="text-xs font-bold text-slate-800">Documents</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Wills, Legal, Title</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center col-span-2 md:col-span-1">
              <HeartHandshake className="w-6 h-6 text-rose-600 mx-auto mb-2" />
              <h4 className="text-xs font-bold text-slate-800">Personal</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Wishes, Instructions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why LIFEVAULT? */}
      <section id="why-lifevault" className="py-20 px-6 lg:px-12 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">The Problem &amp; Solution</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">Why LIFEVAULT?</h2>
          <p className="text-sm text-slate-600 mt-3 leading-relaxed">
            After a person’s death or prolonged inactivity, family members struggle to locate bank accounts, insurance policies, and passwords. LifeVault ensures your legacy is organized, protected, and accessible when needed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-premium hover:border-emerald-300 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">Secure</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              AES-256-GCM encryption with cryptographic authentication tags ensures sensitive credentials and account numbers can never be viewed by unauthorized parties.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-premium hover:border-emerald-300 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <FileBox className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">Organized</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Consolidate physical real estate, digital cloud vaults, stock portfolios, and registered legal wills into one unified visual hierarchy.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-premium hover:border-emerald-300 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">Intelligent</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              AI Legacy Gap Detection audits your estate catalog in real-time, detecting missing beneficiaries on life insurance or missing title deeds before emergencies occur.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-premium hover:border-emerald-300 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">Controlled</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Configurable inactivity triggers and human verification safeguard release. Information is never automatically leaked without multi-tier confirmation.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 px-6 lg:px-12 bg-white border-t border-slate-200/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Simplicity By Design</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">How It Works</h2>
            <p className="text-sm text-slate-600 mt-3">Five straightforward steps to total legacy peace of mind</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { num: '01', title: 'Add Assets', desc: 'Catalog financial, property, and digital accounts with masked identifiers.' },
              { num: '02', title: 'Upload Documents', desc: 'Securely upload registered Wills, property deeds, and policy bonds.' },
              { num: '03', title: 'Assign Nominees', desc: 'Designate trusted family members and set granular asset permissions.' },
              { num: '04', title: 'Configure Rules', desc: 'Set inactivity check-ins, trusted contacts, and release protocols.' },
              { num: '05', title: 'Stay Ready', desc: 'Monitor your transparent Legacy Readiness Score and AI gap recommendations.' }
            ].map((s, idx) => (
              <div key={idx} className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
                <div>
                  <span className="text-2xl font-black text-emerald-600/80 font-mono">{s.num}</span>
                  <h4 className="text-sm font-bold text-slate-900 mt-2 mb-1">{s.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Architecture */}
      <section id="security" className="py-20 px-6 lg:px-12 max-w-6xl mx-auto">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Institutional Grade Protection</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 mb-4">
              Cryptographic Security Built From the Core
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              All private identifiers, access instructions, and notes are encrypted at rest using AES-256-GCM. Passwords are hash-protected with bcrypt. Granular role-based controls prevent even system administrators from reading private encrypted credentials.
            </p>

            <div className="grid grid-cols-2 gap-4 text-xs font-medium text-slate-300">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>AES-256-GCM Ciphering</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>HMAC-SHA256 JWT Sessions</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Immutable Audit Trails</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Granular Nominee Permissions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-10 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-emerald-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-sm">LIFEVAULT</span>
              <p className="text-xs text-slate-500">Your Legacy. Protected. Organized. Ready.</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleQuickDemo('owner')}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm"
            >
              Launch Demo Vault
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
