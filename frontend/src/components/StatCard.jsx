import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, amount, change, changeType, icon: Icon, color = 'blue', subtitle }) => {
  const colorMap = {
    blue: {
      bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      badge: 'bg-blue-500/10 text-blue-500',
    },
    emerald: {
      bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      badge: 'bg-emerald-500/10 text-emerald-500',
    },
    rose: {
      bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      badge: 'bg-rose-500/10 text-rose-500',
    },
    violet: {
      bg: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
      badge: 'bg-violet-500/10 text-violet-500',
    },
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white dark:bg-[#111c3a] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</span>
        <div className={`p-2.5 rounded-xl border ${scheme.bg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <div>
          <h3 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            ${Number(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
          )}
        </div>

        {change !== undefined && (
          <div
            className={`inline-flex items-center text-xs font-semibold px-2 py-1 rounded-full ${
              changeType === 'positive'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
            }`}
          >
            {changeType === 'positive' ? (
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
            )}
            {Math.abs(change)}%
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
