import React, { useState, useRef, useEffect } from 'react';
import { Bell, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotificationsDropdown = ({ budgetAlerts = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalAlerts = budgetAlerts.length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {totalAlerts > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-[#0b132b] animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#111c3a] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-sm text-slate-900 dark:text-white">Financial Notifications</span>
              {totalAlerts > 0 && (
                <span className="px-2 py-0.5 text-xs font-semibold bg-rose-500/10 text-rose-500 rounded-full">
                  {totalAlerts} Alert{totalAlerts > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {budgetAlerts.length > 0 ? (
              budgetAlerts.map((alert, idx) => (
                <div key={idx} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${alert.isOver ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'}`}>
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div className="flex-1 text-xs">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {alert.isOver ? `Over Budget: ${alert.category}` : `Budget Warning: ${alert.category}`}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                        {alert.isOver
                          ? `You exceeded your budget by ₹${Number(alert.exceeded).toLocaleString('en-IN', { minimumFractionDigits: 2 })} (${alert.percentage}% used).`
                          : `You've used ${alert.percentage}% of your monthly ${alert.category} budget.`}
                      </p>
                      <Link
                        to="/budgets"
                        onClick={() => setIsOpen(false)}
                        className="text-brand-600 dark:text-brand-400 font-medium hover:underline inline-block mt-1"
                      >
                        Adjust Budget &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-slate-400 dark:text-slate-500 text-xs">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                <p className="font-medium text-slate-700 dark:text-slate-300">All Budgets are on Track</p>
                <p className="mt-1">No overspending alerts for the current billing cycle.</p>
              </div>
            )}

            <div className="p-3 bg-slate-50/50 dark:bg-slate-800/20 text-center">
              <Link
                to="/reports"
                onClick={() => setIsOpen(false)}
                className="text-xs text-brand-600 dark:text-brand-400 font-medium hover:underline"
              >
                View Complete Monthly Report &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
