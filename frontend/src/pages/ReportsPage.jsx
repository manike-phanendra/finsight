import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Printer,
  CheckCircle,
  BarChart,
} from 'lucide-react';
import api from '../services/api';

const ReportsPage = () => {
  const [reportMonth, setReportMonth] = useState(new Date().getMonth() + 1);
  const [reportYear, setReportYear] = useState(new Date().getFullYear());
  const [transactions, setTransactions] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const startOfMonth = new Date(reportYear, reportMonth - 1, 1).toISOString();
      const endOfMonth = new Date(reportYear, reportMonth, 0, 23, 59, 59, 999).toISOString();

      const [txRes, catRes] = await Promise.all([
        api.get(`/transactions?startDate=${startOfMonth}&endDate=${endOfMonth}&limit=500`),
        api.get(`/analytics/categories?month=${reportMonth}&year=${reportYear}`),
      ]);

      if (txRes.data.success) {
        setTransactions(txRes.data.transactions);
      }
      if (catRes.data.success) {
        setCategoryData(catRes.data.data);
      }
    } catch (err) {
      console.error('Failed to load report data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();

    const handleDataChanged = () => {
      fetchReportData();
    };

    window.addEventListener('finsight_data_changed', handleDataChanged);
    return () => window.removeEventListener('finsight_data_changed', handleDataChanged);
  }, [reportMonth, reportYear]);

  // Aggregate metrics for this report period
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

  const handleExportCSV = () => {
    if (transactions.length === 0) return alert('No transactions for this reporting period.');

    const headers = ['Date', 'Title', 'Type', 'Category', 'Payment Method', 'Amount', 'Description'];
    const rows = transactions.map((t) => [
      `"${new Date(t.date).toISOString().split('T')[0]}"`,
      `"${(t.title || '').replace(/"/g, '""')}"`,
      `"${t.type}"`,
      `"${t.category}"`,
      `"${t.paymentMethod || 'Card'}"`,
      t.amount,
      `"${(t.description || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `FinSight_Financial_Report_${monthNames[reportMonth - 1]}_${reportYear}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Financial Reports
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Official monthly financial statements, category expenditure breakdown, and CSV data export
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Period selector */}
          <div className="flex items-center space-x-2 bg-white dark:bg-[#111c3a] border border-slate-200 dark:border-slate-800 p-1.5 rounded-2xl text-xs">
            <select
              value={reportMonth}
              onChange={(e) => setReportMonth(parseInt(e.target.value))}
              className="bg-transparent font-semibold text-slate-800 dark:text-white focus:outline-none px-2 py-1"
            >
              {monthNames.map((name, i) => (
                <option key={i} value={i + 1}>
                  {name}
                </option>
              ))}
            </select>
            <select
              value={reportYear}
              onChange={(e) => setReportYear(parseInt(e.target.value))}
              className="bg-transparent font-semibold text-slate-800 dark:text-white focus:outline-none px-2 py-1"
            >
              <option value={2026}>2026</option>
              <option value={2025}>2025</option>
            </select>
          </div>

          <button
            onClick={handlePrint}
            className="hidden sm:inline-flex px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold items-center space-x-1.5 transition"
            title="Print Statement"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white text-xs font-semibold shadow-md shadow-brand-500/20 flex items-center space-x-1.5 transition"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV</span>
          </button>
        </div>
      </div>

      {/* Statement Summary Card */}
      <div className="bg-white dark:bg-[#111c3a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 gap-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-600 dark:text-brand-400">
              Executive Statement
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              {monthNames[reportMonth - 1]} {reportYear} Financial Statement
            </h2>
            <p className="text-xs text-slate-400 mt-1">Generated by FinSight (QUANTORA)</p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500">
              Verified Reconciliation
            </span>
          </div>
        </div>

        {/* 3 Metrics Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-6">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Monthly Inflow</span>
            <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
              +₹{totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {transactions.filter((t) => t.type === 'income').length} income events
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Monthly Outflow</span>
            <p className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
              -₹{totalExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {transactions.filter((t) => t.type === 'expense').length} expense transactions
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Net Retained Cash Flow</span>
            <p
              className={`text-2xl font-extrabold mt-1 ${
                netSavings >= 0 ? 'text-brand-600 dark:text-brand-400' : 'text-rose-500'
              }`}
            >
              ₹{netSavings.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
            <span className="text-[11px] font-semibold text-emerald-500 mt-1 block">
              {savingsRate}% Savings Efficiency
            </span>
          </div>
        </div>

        {/* Category Breakdown Table */}
        <div className="mt-8">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
            Category-wise Expenditure Breakdown
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 dark:bg-slate-800/50 text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Expense Category</th>
                  <th className="py-2.5 px-3 text-right">Transactions Count</th>
                  <th className="py-2.5 px-3 text-right">Total Amount</th>
                  <th className="py-2.5 px-3 text-right">% of Total Expenses</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {categoryData.length > 0 ? (
                  categoryData.map((cat, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200 flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span>{cat.name}</span>
                      </td>
                      <td className="py-3 px-3 text-right text-slate-500">{cat.count}</td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-white">
                        ₹{Number(cat.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-slate-500">
                        {cat.percentage}%
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-slate-400">
                      No expense data recorded in this period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly Ledger Details */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Period Transaction Itemization ({transactions.length})
            </h3>
            <button
              onClick={handleExportCSV}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center space-x-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Raw CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto max-h-72 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 dark:bg-slate-800/50 text-slate-400 font-semibold sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Payee / Title</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Method</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <tr key={tx._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2 px-3 text-slate-500 whitespace-nowrap">
                        {new Date(tx.date).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-3 font-medium text-slate-800 dark:text-slate-200">
                        {tx.title}
                      </td>
                      <td className="py-2 px-3 text-slate-500">{tx.category}</td>
                      <td className="py-2 px-3 text-slate-500">{tx.paymentMethod || 'Card'}</td>
                      <td
                        className={`py-2 px-3 text-right font-bold ${
                          tx.type === 'income' ? 'text-emerald-500' : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {tx.type === 'income' ? '+' : '-'}₹{Number(tx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-slate-400">
                      No transactions recorded in this period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
