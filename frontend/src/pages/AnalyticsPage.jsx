import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Calendar,
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
} from 'lucide-react';
import api from '../services/api';

const AnalyticsPage = () => {
  const [monthsCount, setMonthsCount] = useState(6);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const [mRes, cRes, sRes] = await Promise.all([
        api.get(`/analytics/monthly?months=${monthsCount}`),
        api.get('/analytics/categories?type=expense'),
        api.get('/analytics/summary'),
      ]);

      if (mRes.data.success) setMonthlyData(mRes.data.data);
      if (cRes.data.success) setCategoryData(cRes.data.data);
      if (sRes.data.success) setSummary(sRes.data.data);
    } catch (err) {
      console.error('Failed to load analytics data:', err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(true);

    const handleDataChanged = () => {
      fetchData(false);
    };

    window.addEventListener('finsight_data_changed', handleDataChanged);
    return () => window.removeEventListener('finsight_data_changed', handleDataChanged);
  }, [monthsCount]);

  const cards = summary?.financialCards || {};

  return (
    <div className="space-y-6">
      {/* Header and timeframe toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Financial Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Visual breakdown of cash flow trends, savings patterns, and category spending
          </p>
        </div>

        {/* 6 vs 12 months toggle */}
        <div className="flex items-center space-x-1 p-1 bg-white dark:bg-[#111c3a] border border-slate-200 dark:border-slate-800 rounded-2xl text-xs">
          <button
            onClick={() => setMonthsCount(6)}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              monthsCount === 6
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Last 6 Months
          </button>
          <button
            onClick={() => setMonthsCount(12)}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              monthsCount === 12
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Last 12 Months
          </button>
        </div>
      </div>

      {/* Top Quick Analytics Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-white dark:bg-[#111c3a] border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-400">Total Net Savings</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            ₹{(cards.totalSavings || 0).toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] font-bold text-emerald-500 mt-1 inline-block">
            Savings Rate: {cards.savingsRate || 0}% of total income
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#111c3a] border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-400">Current Month Net Flow</span>
          <p
            className={`text-2xl font-extrabold mt-1 ${
              (cards.thisMonthBalance || 0) >= 0 ? 'text-emerald-500' : 'text-rose-500'
            }`}
          >
            ₹{(cards.thisMonthBalance || 0).toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 inline-block">
            ₹{(cards.thisMonthIncome || 0).toLocaleString('en-IN')} In vs ₹{(cards.thisMonthExpenses || 0).toLocaleString('en-IN')} Out
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#111c3a] border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-400">Top Expenditure Driver</span>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1 truncate">
            {categoryData[0]?.name || 'N/A'}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 inline-block">
            ₹{(categoryData[0]?.amount || 0).toLocaleString('en-IN')} ({categoryData[0]?.percentage || 0}% of expenses)
          </span>
        </div>
      </div>

      {/* Chart 1: Income vs Expense Bar Chart */}
      <div className="bg-white dark:bg-[#111c3a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Income vs Expenses Comparison
            </h2>
            <p className="text-xs text-slate-400">Side-by-side cash inflow and outflow tracking</p>
          </div>
          <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">
            Recharts Interactive
          </span>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#1e293b',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
                formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} iconType="circle" />
              <Bar dataKey="income" name="Total Inflow" fill="#2563EB" radius={[6, 6, 0, 0]} barSize={24} />
              <Bar dataKey="expense" name="Total Outflow" fill="#8B5CF6" radius={[6, 6, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Line Chart (Monthly Spending Trend) & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Spending Trend (Line Chart) */}
        <div className="bg-white dark:bg-[#111c3a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Monthly Spending & Savings Trends
            </h2>
            <p className="text-xs text-slate-400">Expense velocity and retained savings trajectory</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, '']}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="expense"
                  name="Monthly Spending"
                  stroke="#EF4444"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="savings"
                  name="Net Saved"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Category Pie Chart & Breakdown */}
        <div className="bg-white dark:bg-[#111c3a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Category Expenditure Breakdown
            </h2>
            <p className="text-xs text-slate-400">Proportional budget consumption across sectors</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="amount"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#3b82f6'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Spent']}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', maxHeight: '70px', overflowY: 'auto' }}
                  layout="horizontal"
                  align="center"
                  verticalAlign="bottom"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
