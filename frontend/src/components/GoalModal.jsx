import React, { useState, useEffect } from 'react';
import { X, Target, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import api from '../services/api';

const GoalModal = ({ isOpen, onClose, goal, mode = 'create', onSaved }) => {
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    savedAmount: '',
    deadline: '',
  });
  const [depositAmount, setDepositAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (goal) {
      setFormData({
        title: goal.title || '',
        targetAmount: goal.targetAmount || '',
        savedAmount: goal.savedAmount || '',
        deadline: goal.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : '',
      });
    } else {
      setFormData({
        title: '',
        targetAmount: '',
        savedAmount: '0',
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
    }
    setDepositAmount('');
    setError('');
  }, [goal, isOpen, mode]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'deposit' && goal?._id) {
        await api.put(`/goals/${goal._id}`, { addAmount: Number(depositAmount) });
      } else if (goal?._id) {
        await api.put(`/goals/${goal._id}`, formData);
      } else {
        await api.post('/goals', formData);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving savings goal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-[#111c3a] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-6 overflow-hidden z-10">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {mode === 'deposit'
              ? `Deposit Funds: ${goal?.title}`
              : goal
              ? 'Edit Savings Goal'
              : 'Create Savings Goal'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {mode === 'deposit' ? (
            <div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Current Progress</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    ${goal?.savedAmount} / ${goal?.targetAmount} ({goal?.progressPercentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-brand-500 h-full rounded-full transition-all"
                    style={{ width: `${goal?.progressPercentage || 0}%` }}
                  />
                </div>
              </div>

              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                Deposit Amount ($)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="number"
                  step="1"
                  min="1"
                  required
                  autoFocus
                  placeholder="250"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  Goal Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Emergency Fund, New Laptop, Vacation"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                    Target Amount ($)
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="number"
                      step="1"
                      min="1"
                      required
                      placeholder="5000"
                      value={formData.targetAmount}
                      onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                    Initial Saved ($)
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="number"
                      step="1"
                      min="0"
                      placeholder="0"
                      value={formData.savedAmount}
                      onChange={(e) => setFormData({ ...formData, savedAmount: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  Target Deadline Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </>
          )}

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition disabled:opacity-50"
            >
              {loading
                ? 'Processing...'
                : mode === 'deposit'
                ? 'Confirm Deposit'
                : goal
                ? 'Update Goal'
                : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalModal;
