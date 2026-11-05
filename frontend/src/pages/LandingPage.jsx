import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  ShieldCheck,
  PieChart,
  BarChart3,
  Target,
  ArrowRight,
  CheckCircle2,
  Lock,
  Zap,
  Users,
  FileSpreadsheet,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated, loginDemo } = useAuth();
  const navigate = useNavigate();

  const handleDemoAccess = async () => {
    await loginDemo();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b132b] text-slate-900 dark:text-slate-100 selection:bg-brand-500 selection:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-[#0b132b]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-accent-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-brand-600 via-blue-500 to-accent-500">
                FinSight
              </span>
              <span className="block text-[10px] font-semibold text-slate-400 dark:text-slate-500 tracking-wider uppercase">
                QUANTORA
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition flex items-center space-x-1.5"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <button
                  onClick={handleDemoAccess}
                  className="hidden sm:inline-flex px-3.5 py-2 rounded-xl border border-brand-500/30 text-brand-600 dark:text-brand-400 hover:bg-brand-500/10 text-xs font-semibold transition"
                >
                  ⚡ Instant Demo
                </button>
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-white transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-500/15 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-brand-500/10 dark:bg-brand-500/15 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
              <span>QUANTORA presents: FinSight MERN FinTech System</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Track Smart.{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-600 via-blue-500 to-accent-500">
                Spend Wisely.
              </span>{' '}
              Save Better.
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              A comprehensive Personal Finance Management & Analytics application designed to give you total control over cash flow, smart monthly budget limits, interactive analytics, and milestone-driven savings goals.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/register"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white font-semibold text-sm shadow-xl shadow-brand-500/25 transition-all flex items-center justify-center space-x-2 hover:scale-[1.02]"
              >
                <span>Launch Your Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={handleDemoAccess}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-sm text-slate-800 dark:text-white transition-all flex items-center justify-center space-x-2"
              >
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Explore Live Demo Data</span>
              </button>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Complete 7 Modules</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>JWT Secure Auth & bcrypt</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Recharts Visual Analytics</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>MongoDB Full CRUD</span>
              </div>
            </div>
          </div>

          {/* Interactive Mock Dashboard Preview */}
          <div className="mt-14 max-w-5xl mx-auto rounded-3xl p-2 sm:p-3 bg-gradient-to-b from-brand-500/20 via-slate-200/50 to-transparent dark:from-brand-500/20 dark:via-slate-800/50 border border-slate-200/80 dark:border-slate-700/50 shadow-2xl">
            <div className="bg-white dark:bg-[#111c3a] rounded-2xl p-6 sm:p-8 overflow-hidden">
              <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-mono text-slate-400 ml-2">finsight.quantora.com/dashboard</span>
                </div>
                <span className="text-xs font-bold text-brand-600 dark:text-brand-400">MERN Stack Certified</span>
              </div>

              {/* Grid Preview Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-400">Total Balance</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">$23,925.00</p>
                  <span className="text-[10px] font-semibold text-emerald-500">+12.4% vs last mo</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-400">Monthly Income</p>
                  <p className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">$6,470.00</p>
                  <span className="text-[10px] font-semibold text-emerald-500">Tech & Freelance</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-400">Monthly Expenses</p>
                  <p className="text-xl sm:text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">$2,455.00</p>
                  <span className="text-[10px] font-semibold text-rose-500">Within Budget</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-400">Savings Target</p>
                  <p className="text-xl sm:text-2xl font-bold text-violet-600 dark:text-violet-400 mt-1">72%</p>
                  <span className="text-[10px] font-semibold text-violet-500">$7,200 / $10,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7 Modules Feature Grid */}
      <section className="py-20 bg-white/50 dark:bg-[#080f24] border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
              Engineered by QUANTORA
            </h2>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              Seven Integrated Financial Modules
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Every feature requested in the official FinSight blueprint, fully implemented with zero compromise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Lock,
                title: 'Module 1: User Authentication',
                desc: 'Secure registration, login, logout, password hashing via bcryptjs, JWT token authorization, and protected dashboard routes.',
              },
              {
                icon: TrendingUp,
                title: 'Module 2: Real-time Dashboard',
                desc: 'Live financial KPI cards (Balance, Income, Expenses, Savings), recent transactions feed, monthly summary, and budget alerts.',
              },
              {
                icon: BarChart3,
                title: 'Module 3: Transaction CRUD',
                desc: 'Comprehensive income and expense logging, real-time editing, deletion, keyword search, category filters, and date range filters.',
              },
              {
                icon: PieChart,
                title: 'Module 4: Budget Management',
                desc: 'Monthly category budget limits, percentage usage tracking, dynamic progress bars, and proactive overspending alert warnings.',
              },
              {
                icon: BarChart3,
                title: 'Module 5: Financial Analytics',
                desc: 'Interactive Recharts graphs: Income vs Expense bar charts, category breakdown pie charts, and 6-12 month spending trends.',
              },
              {
                icon: Target,
                title: 'Module 6: Savings Goals',
                desc: 'Create savings targets, set deadlines, track completion percentages, quick deposit funds, and delete completed goals.',
              },
              {
                icon: FileSpreadsheet,
                title: 'Module 7: Reports & Export',
                desc: 'Comprehensive monthly financial statements, income vs expense breakdowns, and instant CSV transaction data export.',
              },
            ].map((m, idx) => {
              const Icon = m.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white dark:bg-[#111c3a] border border-slate-200/80 dark:border-slate-800 hover:border-brand-500/50 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{m.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{m.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-brand-500" />
            <span className="font-bold text-slate-800 dark:text-slate-200">FinSight</span>
            <span>&copy; 2026 QUANTORA. All rights reserved.</span>
          </div>
          <p className="text-[11px]">
            Final Project Submission | MERN Stack Full-Stack FinTech Architecture
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
