import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react';
import AnimatedNumber from './AnimatedNumber';

const StatCard = ({
  title,
  amount,
  change,
  changeType,
  icon: Icon,
  color = 'blue',
  subtitle,
  delay = 0,
}) => {
  const colorMap = {
    blue: {
      bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
      glow: 'group-hover:border-blue-500/40 group-hover:shadow-blue-500/10',
      bar: 'from-blue-600 to-cyan-400',
      accent: 'bg-blue-500',
    },
    emerald: {
      bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
      glow: 'group-hover:border-emerald-500/40 group-hover:shadow-emerald-500/10',
      bar: 'from-emerald-600 to-teal-400',
      accent: 'bg-emerald-500',
    },
    rose: {
      bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
      glow: 'group-hover:border-rose-500/40 group-hover:shadow-rose-500/10',
      bar: 'from-rose-600 to-amber-400',
      accent: 'bg-rose-500',
    },
    violet: {
      bg: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
      badge: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20',
      glow: 'group-hover:border-violet-500/40 group-hover:shadow-violet-500/10',
      bar: 'from-violet-600 to-fuchsia-400',
      accent: 'bg-violet-500',
    },
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.45,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{
        y: -4,
        scale: 1.015,
        transition: { duration: 0.2, ease: 'easeOut' },
      }}
      whileTap={{ scale: 0.98 }}
      className={`group relative overflow-hidden bg-white dark:bg-[#111c3a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 ${scheme.glow}`}
    >
      {/* Ambient Gradient Glow overlay on hover */}
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-brand-500/10 to-accent-500/0 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <motion.div
          whileHover={{ rotate: 12, scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className={`p-2.5 rounded-2xl border ${scheme.bg} shadow-sm`}
        >
          <Icon className="w-5 h-5" />
        </motion.div>
      </div>

      {/* Amount and Subtitle */}
      <div className="flex items-baseline justify-between gap-2">
        <div>
          <h3 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center">
            <AnimatedNumber value={amount} />
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center space-x-1">
              <span>{subtitle}</span>
            </p>
          )}
        </div>

        {/* Change Badge */}
        {change !== undefined && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: delay + 0.2 }}
            className={`inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm ${
              changeType === 'positive'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
            }`}
          >
            {changeType === 'positive' ? (
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
            )}
            {Math.abs(change)}%
          </motion.div>
        )}
      </div>

      {/* Decorative Micro-bar Line */}
      <div className="w-full h-1 bg-slate-100 dark:bg-slate-800/80 rounded-full mt-4 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 0.8, delay: delay + 0.1, ease: 'easeOut' }}
          className={`h-full bg-gradient-to-r ${scheme.bar} opacity-75 group-hover:opacity-100 transition-opacity`}
        />
      </div>
    </motion.div>
  );
};

export default StatCard;
