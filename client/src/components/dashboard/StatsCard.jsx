import React from 'react';

export default function StatsCard({ title, value, subtext, icon: Icon, badge, accent = 'emerald' }) {
  const getAccentStyles = () => {
    switch (accent) {
      case 'blue':
        return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' };
      case 'amber':
        return { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' };
      case 'purple':
        return { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100' };
      default:
        return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' };
    }
  };

  const styles = getAccentStyles();

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-premium flex flex-col justify-between hover:border-slate-300 transition-all">
      <div className="flex items-start justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</span>
        <div className={`w-9 h-9 rounded-xl ${styles.bg} ${styles.text} border ${styles.border} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            {value}
          </span>
          {badge && (
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {badge}
            </span>
          )}
        </div>
        {subtext && (
          <p className="text-xs text-slate-500 mt-1 font-medium">{subtext}</p>
        )}
      </div>
    </div>
  );
}
