import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
} from 'recharts';
import StatCard from '../components/StatCard';
import api from '../services/api';

const DashboardPage = () => {
  const [summaryData, setSummaryData] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
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
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800/60 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 bg-slate-200 dark:bg-slate-800/60 rounded-2xl" />
          <div className="h-80 bg-slate-200 dark:bg-slate-800/60 rounded-2xl" />
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
  };

  const recentTransactions = summaryData?.recentTransactions || [];
  const budgetProgress = summaryData?.budgetProgress || [];
  const savingsGoals = summaryData?.savingsGoals || [];

  return (
    <div className="space-y-8">
      {/* Financial Cards (Section 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Balance"
          amount={cards.totalBalance}
          subtitle="Net Available Wealth"
          icon={Wallet}
          color="blue"
        />
        <StatCard
          title="Total Income"
          amount={cards.totalIncome}
          change={cards.incomeGrowth}
          changeType={cards.incomeGrowth >= 0 ? 'positive' : 'negative'}
          subtitle="All-time Inflows"
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          title="Total Expenses"
          amount={cards.totalExpenses}
          change={cards.expenseGrowth}
          changeType={cards.expenseGrowth <= 0 ? 'positive' : 'negative'}
          subtitle="All-time Outflows"
          icon={TrendingDown}
          color="rose"
        />
        <StatCard
          title="Total Savings"
          amount={cards.totalSavings}
          subtitle={`Savings Rate: ${cards.savingsRate || 0}%`}
          icon={PiggyBank}
          color="violet"
        />
      </div>

      {/* Middle Section: Charts (Section 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Income vs Expense Graph */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111c3a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Monthly Income vs Expenses
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Financial performance trends over the last 6 months
              </p>
            </div>
            <Link
              to="/analytics"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center space-x-1"
            >
              <span>Detailed Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickFormatter={(val) => `$${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, '']}
                />
                <Legend
                  wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                  iconType="circle"
                />
                <Bar dataKey="income" name="Income" fill="#2563EB" radius={[6, 6, 0, 0]} barSize={20} />
                <Bar dataKey="expense" name="Expense" fill="#8B5CF6" radius={[6, 6, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Category Pie Chart */}
        <div className="bg-white dark:bg-[#111c3a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Expense Categories</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Top expenditure distribution</p>
            </div>
            <Link
              to="/budgets"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Budgets
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
                    formatter={(val) => [`$${Number(val).toLocaleString()}`, 'Amount']}
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
        </div>
      </div>

      {/* Bottom Section: Recent Transactions, Budget Progress, Savings Goals (Section 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white dark:bg-[#111c3a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <ReceiptText className="w-4 h-4 text-brand-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Transactions</h2>
            </div>
            <Link
              to="/transactions"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((tx) => (
                <div
                  key={tx._id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{tx.title}</p>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className="text-[10px] text-slate-400">
                        {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {tx.category}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-extrabold whitespace-nowrap ${
                      tx.type === 'income' ? 'text-emerald-500' : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'}${Number(tx.amount).toFixed(2)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">No recent transactions.</p>
            )}
          </div>
        </div>

        {/* Budget Progress */}
        <div className="bg-white dark:bg-[#111c3a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <PieIcon className="w-4 h-4 text-violet-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Monthly Budgets</h2>
            </div>
            <Link
              to="/budgets"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Manage
            </Link>
          </div>

          <div className="space-y-4">
            {budgetProgress.length > 0 ? (
              budgetProgress.slice(0, 4).map((b) => (
                <div key={b._id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{b.category}</span>
                      {b.isOverBudget && (
                        <span className="px-1.5 py-0.2 text-[9px] font-bold bg-rose-500/10 text-rose-500 rounded">
                          OVER
                        </span>
                      )}
                    </div>
                    <span className="text-slate-400 text-[11px]">
                      ${b.spentAmount} / ${b.amount}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        b.isOverBudget
                          ? 'bg-rose-500'
                          : b.percentage >= 80
                          ? 'bg-amber-500'
                          : 'bg-brand-500'
                      }`}
                      style={{ width: `${Math.min(100, b.percentage)}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">No active budgets for this month.</p>
            )}
          </div>
        </div>

        {/* Savings Goals Progress */}
        <div className="bg-white dark:bg-[#111c3a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-emerald-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Savings Goals</h2>
            </div>
            <Link
              to="/goals"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              View Goals
            </Link>
          </div>

          <div className="space-y-4">
            {savingsGoals.length > 0 ? (
              savingsGoals.map((g) => (
                <div key={g._id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{g.title}</span>
                    <span className="text-[11px] font-semibold text-brand-600 dark:text-brand-400">
                      {g.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden mb-2">
                    <div
                      className="bg-gradient-to-r from-brand-500 to-accent-500 h-full rounded-full transition-all"
                      style={{ width: `${g.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Saved: ${g.savedAmount}</span>
                    <span>Target: ${g.targetAmount}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">No savings goals created.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
