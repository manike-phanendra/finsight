import React, { useState, useEffect } from 'react';
import {
  Plus,
  PieChart,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  DollarSign,
  TrendingUp,
  Trash2,
  Edit2,
  Info,
} from 'lucide-react';
import api from '../services/api';
import BudgetModal from '../components/BudgetModal';

const BudgetsPage = () => {
  const [budgets, setBudgets] = useState([]);
  const [summary, setSummary] = useState({ totalBudgeted: 0, totalSpentInBudgets: 0, overallPercentage: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/budgets?month=${selectedMonth}&year=${selectedYear}`);
      if (res.data.success) {
        setBudgets(res.data.budgets);
        setSummary({
          totalBudgeted: res.data.totalBudgeted || 0,
          totalSpentInBudgets: res.data.totalSpentInBudgets || 0,
          overallPercentage: res.data.overallPercentage || 0,
        });
      }
    } catch (err) {
      console.error('Failed to load budgets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [selectedMonth, selectedYear]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category budget limit?')) {
      try {
        await api.delete(`/budgets/${id}`);
        fetchBudgets();
      } catch (err) {
        alert('Failed to delete budget.');
      }
    }
  };

  const handleEdit = (b) => {
    setSelectedBudget(b);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setSelectedBudget(null);
    setIsModalOpen(true);
  };

  const overBudgetItems = budgets.filter((b) => b.isOverBudget);
  const warningItems = budgets.filter((b) => b.isWarning);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Budget Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Set monthly category spending caps, track actual spending, and avoid overspending
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Month/Year selector */}
          <div className="flex items-center space-x-2 bg-white dark:bg-[#111c3a] border border-slate-200 dark:border-slate-800 p-1.5 rounded-2xl text-xs">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="bg-transparent font-semibold text-slate-800 dark:text-white focus:outline-none px-2 py-1"
            >
              {monthNames.map((name, i) => (
                <option key={i} value={i + 1}>
                  {name}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="bg-transparent font-semibold text-slate-800 dark:text-white focus:outline-none px-2 py-1"
            >
              <option value={2026}>2026</option>
              <option value={2025}>2025</option>
            </select>
          </div>

          <button
            onClick={handleNew}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white text-xs font-semibold shadow-md shadow-brand-500/20 flex items-center space-x-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Budget</span>
          </button>
        </div>
      </div>

      {/* Overspending Alerts Section */}
      {overBudgetItems.length > 0 && (
        <div className="p-4 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-xs">
              <p className="font-bold text-sm">
                Attention: You have exceeded budget limits in {overBudgetItems.length} categor{overBudgetItems.length > 1 ? 'ies' : 'y'}!
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                {overBudgetItems.map((item) => (
                  <li key={item._id}>
                    <span className="font-semibold">{item.category}:</span> Spent ${item.spentAmount} of ${item.amount} limit (
                    <span className="font-extrabold text-rose-500">
                      ${(item.spentAmount - item.amount).toFixed(2)} over budget ({item.percentage}%)
                    </span>)
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Warning Alerts Section (80%-99%) */}
      {warningItems.length > 0 && (
        <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-xs">
              <p className="font-bold text-sm">
                Budget Caution: {warningItems.length} categor{warningItems.length > 1 ? 'ies are' : 'y is'} nearing limits (80%+).
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {warningItems.map((item) => (
                  <span
                    key={item._id}
                    className="px-2.5 py-1 rounded-xl bg-amber-500/20 font-medium text-[11px]"
                  >
                    {item.category}: {item.percentage}% used
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Monthly Budget Performance Header Card */}
      <div className="bg-white dark:bg-[#111c3a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">
              {monthNames[selectedMonth - 1]} {selectedYear} Aggregate Overview
            </span>
            <div className="flex items-baseline space-x-3 mt-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                ${summary.totalSpentInBudgets.toLocaleString()}
              </h2>
              <span className="text-xs text-slate-400">
                spent of ${summary.totalBudgeted.toLocaleString()} limit
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400">Overall Budget Burn</span>
            <p className="text-xl font-bold text-brand-600 dark:text-brand-400">
              {summary.overallPercentage}%
            </p>
          </div>
        </div>

        <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden mt-4">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              summary.overallPercentage > 100
                ? 'bg-rose-500'
                : summary.overallPercentage >= 80
                ? 'bg-amber-500'
                : 'bg-gradient-to-r from-brand-600 to-accent-600'
            }`}
            style={{ width: `${Math.min(100, summary.overallPercentage)}%` }}
          />
        </div>
      </div>

      {/* Budget Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {budgets.length > 0 ? (
          budgets.map((b) => (
            <div
              key={b._id}
              className={`p-6 rounded-3xl bg-white dark:bg-[#111c3a] border transition-all ${
                b.isOverBudget
                  ? 'border-rose-500/40 shadow-rose-500/5'
                  : b.isWarning
                  ? 'border-amber-500/40'
                  : 'border-slate-200 dark:border-slate-800'
              } shadow-sm hover:shadow-md flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{b.category}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {monthNames[b.month - 1]} {b.year}
                    </p>
                  </div>

                  {b.isOverBudget ? (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-500/10 text-rose-500 rounded-lg flex items-center space-x-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Overspent</span>
                    </span>
                  ) : b.isWarning ? (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/10 text-amber-500 rounded-lg">
                      {b.percentage}% Limit
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-500 rounded-lg flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>On Track</span>
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-baseline justify-between">
                  <div>
                    <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                      ${b.spentAmount.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">/ ${b.amount.toLocaleString()}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-500">{b.percentage}%</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      b.isOverBudget
                        ? 'bg-rose-500'
                        : b.percentage >= 80
                        ? 'bg-amber-500'
                        : 'bg-brand-500'
                    }`}
                    style={{ width: `${Math.min(100, b.percentage)}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-400 mt-2">
                  <span>
                    {b.isOverBudget
                      ? `Exceeded by $${(b.spentAmount - b.amount).toFixed(2)}`
                      : `Remaining: $${b.remainingAmount.toFixed(2)}`}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end space-x-2 pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/60">
                <button
                  onClick={() => handleEdit(b)}
                  className="p-1.5 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                  title="Edit Budget Limit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(b._id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                  title="Delete Budget"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white dark:bg-[#111c3a] border border-slate-200 dark:border-slate-800 rounded-3xl">
            <PieChart className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-semibold text-slate-600 dark:text-slate-300">No category budgets for this month.</p>
            <p className="text-xs mt-1">Click "Create Budget" above to set category spending limits.</p>
          </div>
        )}
      </div>

      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        budget={selectedBudget}
        onSaved={fetchBudgets}
      />
    </div>
  );
};

export default BudgetsPage;
