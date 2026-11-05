import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const DashboardLayout = () => {
  const { isAuthenticated, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [budgetAlerts, setBudgetAlerts] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchBudgetAlerts = async () => {
      try {
        const res = await api.get('/budgets');
        if (res.data.success && res.data.budgets) {
          const alerts = [];
          res.data.budgets.forEach((b) => {
            if (b.isOverBudget) {
              alerts.push({
                category: b.category,
                isOver: true,
                exceeded: b.spentAmount - b.amount,
                percentage: b.percentage,
              });
            } else if (b.isWarning) {
              alerts.push({
                category: b.category,
                isOver: false,
                percentage: b.percentage,
              });
            }
          });
          setBudgetAlerts(alerts);
        }
      } catch (err) {
        console.error('Failed to load budget alerts:', err);
      }
    };

    fetchBudgetAlerts();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0b132b]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading FinSight...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b132b] text-slate-900 dark:text-slate-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Navbar */}
        <Navbar setMobileOpen={setMobileOpen} budgetAlerts={budgetAlerts} />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
