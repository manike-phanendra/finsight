import React, { useState, useEffect } from 'react';
import {
  Target,
  Plus,
  IndianRupee,
  Calendar,
  CheckCircle2,
  Clock,
  Trash2,
  Edit2,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import api from '../services/api';
import GoalModal from '../components/GoalModal';

const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [summary, setSummary] = useState({ totalTarget: 0, totalSaved: 0, overallProgress: 0 });
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'deposit'

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await api.get('/goals');
      if (res.data.success) {
        setGoals(res.data.goals);
        setSummary({
          totalTarget: res.data.totalTarget || 0,
          totalSaved: res.data.totalSaved || 0,
          overallProgress: res.data.overallProgress || 0,
        });
      }
    } catch (err) {
      console.error('Failed to load goals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this savings goal?')) {
      try {
        await api.delete(`/goals/${id}`);
        fetchGoals();
      } catch (err) {
        alert('Failed to delete goal.');
      }
    }
  };

  const handleDeposit = (goal) => {
    setSelectedGoal(goal);
    setModalMode('deposit');
    setIsModalOpen(true);
  };

  const handleEdit = (goal) => {
    setSelectedGoal(goal);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setSelectedGoal(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Savings Goals
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Build discipline, target milestones, and monitor your long-term savings progress
          </p>
        </div>

        <button
          onClick={handleNew}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white text-xs font-semibold shadow-md shadow-brand-500/20 flex items-center space-x-1.5 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Savings Goal</span>
        </button>
      </div>

      {/* Aggregate Savings Target Banner */}
      <div className="bg-white dark:bg-[#111c3a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">
              Total Goals Portfolio
            </span>
            <div className="flex items-baseline space-x-3 mt-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                ₹{summary.totalSaved.toLocaleString('en-IN')}
              </h2>
              <span className="text-xs text-slate-400">
                accumulated of ₹{summary.totalTarget.toLocaleString('en-IN')} target
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400">Total Completion</span>
            <p className="text-xl font-bold text-emerald-500">
              {summary.overallProgress}%
            </p>
          </div>
        </div>

        <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden mt-4">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-600 via-blue-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${Math.min(100, summary.overallProgress)}%` }}
          />
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {goals.length > 0 ? (
          goals.map((goal) => (
            <div
              key={goal._id}
              className={`p-6 rounded-3xl bg-white dark:bg-[#111c3a] border transition-all ${
                goal.isCompleted
                  ? 'border-emerald-500/40 shadow-emerald-500/5'
                  : 'border-slate-200 dark:border-slate-800'
              } shadow-sm hover:shadow-md flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-1.5">
                      <span>{goal.title}</span>
                      {goal.isCompleted && <Sparkles className="w-4 h-4 text-emerald-500" />}
                    </h3>
                    <div className="flex items-center space-x-1 text-[11px] text-slate-400 mt-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>
                        {goal.isCompleted
                          ? 'Goal Completed!'
                          : goal.daysRemaining > 0
                          ? `${goal.daysRemaining} days left`
                          : 'Target deadline reached'}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 text-xs font-bold rounded-xl ${
                      goal.isCompleted
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : 'bg-brand-500/10 text-brand-500'
                    }`}
                  >
                    {goal.progressPercentage}%
                  </span>
                </div>

                <div className="mt-5 flex items-baseline justify-between">
                  <div>
                    <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                      ₹{Number(goal.savedAmount).toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">
                      / ₹{Number(goal.targetAmount).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {goal.isCompleted
                      ? 'Target Hit'
                      : `₹${Number(goal.remainingAmount).toLocaleString('en-IN')} to go`}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mt-2.5">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      goal.isCompleted
                        ? 'bg-emerald-500'
                        : 'bg-gradient-to-r from-brand-600 to-accent-600'
                    }`}
                    style={{ width: `${goal.progressPercentage}%` }}
                  />
                </div>

                <p className="text-[10px] text-slate-400 mt-2">
                  Deadline: {new Date(goal.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/60">
                <button
                  onClick={() => handleDeposit(goal)}
                  className="px-3 py-1.5 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-500/20 text-xs font-semibold flex items-center space-x-1 transition"
                >
                  <IndianRupee className="w-3.5 h-3.5" />
                  <span>Add Funds</span>
                </button>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleEdit(goal)}
                    className="p-1.5 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                    title="Edit Goal"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(goal._id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                    title="Delete Goal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white dark:bg-[#111c3a] border border-slate-200 dark:border-slate-800 rounded-3xl">
            <Target className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-semibold text-slate-600 dark:text-slate-300">No savings goals created yet.</p>
            <p className="text-xs mt-1">Set a milestone goal to track disciplined savings progress.</p>
          </div>
        )}
      </div>

      <GoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        goal={selectedGoal}
        mode={modalMode}
        onSaved={fetchGoals}
      />
    </div>
  );
};

export default GoalsPage;
