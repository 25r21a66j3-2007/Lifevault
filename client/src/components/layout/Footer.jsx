import React from 'react';
import { Shield, Lock, HeartHandshake } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white/50 backdrop-blur-sm py-6 px-4 lg:px-8 text-xs text-slate-500">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded-md bg-slate-900 flex items-center justify-center text-emerald-400">
            <Shield className="w-3 h-3" />
          </div>
          <span className="font-semibold text-slate-700">LIFEVAULT</span>
          <span className="text-slate-300">|</span>
          <span>Your Legacy. Protected. Organized. Ready.</span>
        </div>

        <div className="flex items-center space-x-6 text-[11px]">
          <span className="flex items-center space-x-1 text-slate-600">
            <Lock className="w-3 h-3 text-emerald-600" />
            <span>AES-256-GCM Hardware Encrypted</span>
          </span>
          <span className="text-slate-400">Hackathon Edition 2026</span>
        </div>
      </div>
    </footer>
  );
}
