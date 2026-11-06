import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ArrowUpRight,
  ArrowRight,
  Plus,
  AlertTriangle,
  CheckCircle,
  ReceiptText,
  Target,
  PieChart as PieIcon,
  Sparkles,
  BarChart2,
  Calendar,
  Layers,
  ChevronRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import StatCard from '../components/StatCard';
import api from '../services/api';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Custom Glassmorphic Tooltip for Recharts
const CustomChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 5 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-slate-900/95 dark:bg-[#070d1e]/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-3 shadow-2xl text-xs space-y-1.5 min-w-[140px]"
      >
        <p className="font-bold text-slate-200 border-b border-slate-800 pb-1 flex items-center justify-between">
          <span>{label}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-ping" />
        </p>
        {payload.map((entry, index) => (
          <div key={`tooltip-${index}`} className="flex items-center justify-between space-x-3">
            <span className="flex items-center space-x-1.5 text-slate-400">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
              <span className="capitalize">{entry.name}:</span>
            </span>
            <span className="font-extrabold text-white">
              ₹{Number(entry.value).toLocaleString('en-IN')}
            </span>
          </div>
        ))}
      </motion.div>
    );
  }
  return null;
};

const DashboardPage = () => {
  const [summaryData, setSummaryData] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chartMode, setChartMode] = useState('bars'); // 'bars' or 'area'

  const fetchDashboardData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const [sumRes, monthRes, catRes] = await Promise.all([
        api.get('/analytics/summary'),
        api.get('/analytics/monthly?months=6'),
        api.get('/analytics/categories?type=expense'),
      ]);

      if (sumRes.data.success) {
        setSummaryData(sumRes.data.data);
      }
      if (monthRes.data.success) {
        setMonthlyData(monthRes.data.data);
      }
      if (catRes.data.success) {
        setCategoryData(catRes.data.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
      setError('Failed to fetch dashboard data. Please try again.');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(true);

    const handleDataChanged = () => {
      fetchDashboardData(false);
    };

    window.addEventListener('finsight_data_changed', handleDataChanged);
    return () => window.removeEventListener('finsight_data_changed', handleDataChanged);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800/60 rounded-3xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 bg-slate-200 dark:bg-slate-800/60 rounded-3xl" />
          <div className="h-80 bg-slate-200 dark:bg-slate-800/60 rounded-3xl" />
        </div>
      </div>
    );
  }

  const cards = summaryData?.financialCards || {
    totalBalance: 0,
    totalIncome: 0,
    totalExpenses: 0,
    totalSavings: 0,
    incomeGrowth: 0,
    expenseGrowth: 0,
    savingsRate: 0,
  };

  const recentTransactions = summaryData?.recentTransactions || [];
  const budgetProgress = summaryData?.budgetProgress || [];
  const savingsGoals = summaryData?.savingsGoals || [];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Top Banner / Live Status Pill */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-bold text-emerald-500 tracking-wide uppercase">
              Live Ledger Analytics
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">
            Executive Financial Overview
          </h1>
        </div>

        {/* Quick Action Button with glowing pulse */}
        <div className="flex items-center space-x-3">
          <Link
            to="/transactions/add"
            className="group relative inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white text-xs font-bold shadow-lg shadow-brand-500/25 transition-all duration-300 hover:shadow-brand-500/40 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300" />
            <span>Add Transaction</span>
          </Link>
        </div>
      </motion.div>

      {/* Financial KPI Cards (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Balance"
          amount={cards.totalBalance}
          subtitle="Net Available Wealth"
          icon={Wallet}
          color="blue"
          delay={0.05}
        />
        <StatCard
          title="Total Income"
          amount={cards.totalIncome}
          change={cards.incomeGrowth}
          changeType={cards.incomeGrowth >= 0 ? 'positive' : 'negative'}
          subtitle="All-time Inflows"
          icon={TrendingUp}
          color="emerald"
          delay={0.12}
        />
        <StatCard
          title="Total Expenses"
          amount={cards.totalExpenses}
          change={cards.expenseGrowth}
          changeType={cards.expenseGrowth <= 0 ? 'positive' : 'negative'}
          subtitle="All-time Outflows"
          icon={TrendingDown}
          color="rose"
          delay={0.19}
        />
        <StatCard
          title="Total Savings"
          amount={cards.totalSavings}
          subtitle={`Discipline Rate: ${cards.savingsRate || 0}%`}
          icon={PiggyBank}
          color="violet"
          delay={0.26}
        />
      </div>

      {/* Middle Section: Animated Financial Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Income vs Expense Graph */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 bg-white dark:bg-[#111c3a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden"
        >
          {/* Ambient Corner Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-brand-500/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center space-x-2">
                <BarChart2 className="w-4 h-4 text-brand-500" />
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Cash Flow Velocity (Last 6 Months)
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Comparative analysis of earned income against monthly category expenditures
              </p>
            </div>

            {/* View Mode Toggle Pill (Dribbble style) */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200 dark:border-slate-700/60 self-start sm:self-auto text-xs">
              <button
                onClick={() => setChartMode('bars')}
                className={`relative px-3 py-1.5 rounded-xl font-bold transition-all duration-200 ${
                  chartMode === 'bars'
                    ? 'text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {chartMode === 'bars' && (
                  <motion.div
                    layoutId="chartTogglePill"
                    className="absolute inset-0 bg-brand-600 rounded-xl shadow-md shadow-brand-500/30"
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  />
                )}
                <span className="relative z-10">Bars</span>
              </button>
              <button
                onClick={() => setChartMode('area')}
                className={`relative px-3 py-1.5 rounded-xl font-bold transition-all duration-200 ${
                  chartMode === 'area'
                    ? 'text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {chartMode === 'area' && (
                  <motion.div
                    layoutId="chartTogglePill"
                    className="absolute inset-0 bg-brand-600 rounded-xl shadow-md shadow-brand-500/30"
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  />
                )}
                <span className="relative z-10">Flow</span>
              </button>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartMode === 'bars' ? (
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="incomeBarGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={1} />
                      <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0.85} />
                    </linearGradient>
                    <linearGradient id="expenseBarGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#A855F7" stopOpacity={1} />
                      <stop offset="100%" stopColor="#6D28D9" stopOpacity={0.85} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.18} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                  />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                    iconType="circle"
                  />
                  <Bar
                    dataKey="income"
                    name="Income"
                    fill="url(#incomeBarGrad)"
                    radius={[6, 6, 0, 0]}
                    barSize={20}
                    animationDuration={1200}
                  />
                  <Bar
                    dataKey="expense"
                    name="Expense"
                    fill="url(#expenseBarGrad)"
                    radius={[6, 6, 0, 0]}
                    barSize={20}
                    animationDuration={1400}
                  />
                </BarChart>
              ) : (
                <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="incomeAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expenseAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A855F7" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#A855F7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.18} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                  />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} iconType="circle" />
                  <Area
                    type="monotone"
                    dataKey="income"
                    name="Income"
                    stroke="#3B82F6"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#incomeAreaGrad)"
                    animationDuration={1200}
                  />
                  <Area
                    type="monotone"
                    dataKey="expense"
                    name="Expense"
                    stroke="#A855F7"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#expenseAreaGrad)"
                    animationDuration={1400}
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Expense Category Pie Chart */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-[#111c3a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Category Split
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Top expenditure distribution
              </p>
            </div>
            <Link
              to="/budgets"
              className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center space-x-1"
            >
              <span>Budgets</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-64 w-full">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="amount"
                    animationDuration={1000}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || '#3b82f6'} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#070d1e',
                      borderColor: '#1e293b',
                      borderRadius: '16px',
                      color: '#fff',
                      fontSize: '12px',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4)',
                    }}
                    formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Amount']}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '11px', maxHeight: '60px', overflowY: 'auto' }}
                    layout="horizontal"
                    align="center"
                    verticalAlign="bottom"
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs">
                <PieIcon className="w-8 h-8 mb-2 opacity-40" />
                <p>No expense data recorded yet.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Bottom Section: Recent Transactions, Budget Progress, Savings Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-[#111c3a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-2">
              <ReceiptText className="w-4 h-4 text-brand-500" />
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Recent Ledger
              </h2>
            </div>
            <Link
              to="/transactions"
              className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center space-x-0.5"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((tx, idx) => (
                <motion.div
                  key={tx._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + idx * 0.05 }}
                  whileHover={{ x: 4, transition: { duration: 0.15 } }}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-transparent hover:border-slate-200 dark:hover:border-slate-700/60 transition-all duration-200 cursor-pointer"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {tx.title}
                    </p>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className="text-[10px] text-slate-400">
                        {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                        {tx.category}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-extrabold whitespace-nowrap ${
                      tx.type === 'income'
                        ? 'text-emerald-500 font-mono'
                        : 'text-slate-900 dark:text-white font-mono'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'}₹
                    {Number(tx.amount).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </motion.div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">No recent transactions.</p>
            )}
          </div>
        </motion.div>

        {/* Budget Progress with Animated Indicator Bars */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-[#111c3a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-2">
              <PieIcon className="w-4 h-4 text-violet-500" />
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Monthly Budgets
              </h2>
            </div>
            <Link
              to="/budgets"
              className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center space-x-0.5"
            >
              <span>Manage</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {budgetProgress.length > 0 ? (
              budgetProgress.slice(0, 4).map((b, idx) => (
                <div key={b._id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{b.category}</span>
                      {b.isOverBudget && (
                        <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-rose-500/10 text-rose-500 rounded border border-rose-500/20">
                          OVER
                        </span>
                      )}
                    </div>
                    <span className="text-slate-400 text-[11px] font-mono">
                      ₹{Number(b.spentAmount).toLocaleString('en-IN')} / ₹{Number(b.amount).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800/80 h-2.5 rounded-full overflow-hidden p-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, b.percentage)}%` }}
                      transition={{ duration: 0.8, delay: 0.2 + idx * 0.1, ease: 'easeOut' }}
                      className={`h-full rounded-full transition-all ${
                        b.isOverBudget
                          ? 'bg-rose-500 shadow-sm shadow-rose-500/50'
                          : b.percentage >= 80
                          ? 'bg-amber-500 shadow-sm shadow-amber-500/50'
                          : 'bg-gradient-to-r from-brand-600 to-cyan-400 shadow-sm shadow-brand-500/50'
                      }`}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">No active budgets for this month.</p>
            )}
          </div>
        </motion.div>

        {/* Savings Goals Progress */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-[#111c3a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-emerald-500" />
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Savings Goals
              </h2>
            </div>
            <Link
              to="/goals"
              className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center space-x-0.5"
            >
              <span>View Goals</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {savingsGoals.length > 0 ? (
              savingsGoals.map((g, idx) => (
                <motion.div
                  key={g._id}
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                      {g.title}
                    </span>
                    <span className="text-[11px] font-extrabold text-brand-600 dark:text-brand-400">
                      {g.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700/80 h-2 rounded-full overflow-hidden mb-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, g.percentage)}%` }}
                      transition={{ duration: 0.8, delay: 0.3 + idx * 0.1, ease: 'easeOut' }}
                      className="bg-gradient-to-r from-brand-500 via-blue-500 to-accent-500 h-full rounded-full"
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                    <span>Saved: ₹{Number(g.savedAmount).toLocaleString('en-IN')}</span>
                    <span>Target: ₹{Number(g.targetAmount).toLocaleString('en-IN')}</span>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">No savings goals created.</p>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
