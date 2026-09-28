import React, { useState } from 'react';
import { ShieldCheck, ChevronRight, CheckCircle2, AlertTriangle, AlertCircle, Sparkles, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ReadinessGauge({ score = 78, statusLabel = 'Optimal Readiness', factors = [] }) {
  const [showModal, setShowModal] = useState(false);

  // SVG Circular Gauge calculations
  const size = 180;
  const strokeWidth = 14;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (s) => {
    if (s >= 80) return '#10b981'; // emerald-500
    if (s >= 60) return '#3b82f6'; // blue-500
    if (s >= 40) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  };

  const ringColor = getColor(score);

  return (
    <>
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-premium flex flex-col justify-between relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -right-8 -top-8 w-36 h-36 bg-emerald-50 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Readiness Index</span>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">Legacy Readiness</h3>
          </div>
          <span className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-semibold border border-emerald-200/70 flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{statusLabel}</span>
          </span>
        </div>

        {/* Circular Gauge */}
        <div className="flex flex-col items-center justify-center my-2">
          <div className="relative flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
              {/* Background track */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                stroke="#e2e8f0"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              {/* Progress track */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                stroke={ringColor}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
                {score}%
              </span>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5">
                Legacy Ready
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-500 text-center mt-3 max-w-[220px]">
            {score >= 80
              ? 'Your estate records, nominees, and activation safeguards are robustly configured.'
              : 'Add missing nominees and title deeds to boost your readiness score.'}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center space-x-1"
          >
            <span>Readiness Factors ({factors.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <Link
            to="/ai-gaps"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center space-x-1 bg-brand-50 hover:bg-brand-100/70 px-2.5 py-1.5 rounded-xl transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Insights</span>
          </Link>
        </div>
      </div>

      {/* Breakdown Factors Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Legacy Readiness Breakdown</h3>
                  <p className="text-xs text-slate-500">Scored across 5 foundational estate dimensions</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-5 space-y-3.5 max-h-96 overflow-y-auto pr-1">
              {factors.map((f, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-3"
                >
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5">
                      {f.status === 'passed' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      ) : f.status === 'warning' ? (
                        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{f.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{f.description}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-bold text-slate-900">
                      {f.score} / {f.maxScore}
                    </span>
                    <span className="block text-[10px] text-slate-400">pts</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">
                Total Score: <strong className="text-slate-900 font-bold">{score}%</strong>
              </span>
              <Link
                to="/ai-gaps"
                onClick={() => setShowModal(false)}
                className="inline-flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm"
              >
                <span>Resolve Gaps with AI</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
