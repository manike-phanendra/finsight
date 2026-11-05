import React from 'react';
import {
  User,
  Mail,
  Calendar,
  Shield,
  Award,
  Users,
  CheckCircle2,
  HardDrive,
  LogOut,
  Moon,
  Sun,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Account Profile & System Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage your user credentials, security status, and team project specifications
        </p>
      </div>

      {/* User Information Card */}
      <div className="bg-white dark:bg-[#111c3a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-accent-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-xl shadow-brand-500/25">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>

          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name}</h2>
                <p className="text-xs text-slate-400">{user?.email}</p>
              </div>
              <span className="px-3 py-1 text-xs font-semibold bg-brand-500/10 text-brand-500 rounded-full self-center sm:self-auto">
                MERN Authenticated User
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/80 text-xs">
              <div className="flex items-center space-x-2.5 text-slate-600 dark:text-slate-300">
                <Calendar className="w-4 h-4 text-brand-500" />
                <span>
                  Member Since:{' '}
                  <strong className="text-slate-900 dark:text-white">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'November 2026'}
                  </strong>
                </span>
              </div>

              <div className="flex items-center space-x-2.5 text-slate-600 dark:text-slate-300">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>
                  Authentication:{' '}
                  <strong className="text-slate-900 dark:text-white">JWT + bcrypt Encrypted</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Health Score & Theme Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Financial Health Index */}
        <div className="bg-white dark:bg-[#111c3a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Financial Health Score</h3>
          </div>

          <div className="flex items-center space-x-4 my-2">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 font-extrabold text-2xl">
              92
            </div>
            <div>
              <p className="font-bold text-sm text-slate-900 dark:text-white">Excellent Standing</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Low burn rate, active savings targets, and healthy category budget margins.
              </p>
            </div>
          </div>

          <div className="space-y-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Savings Rate Discipline</span>
              <span className="font-semibold text-emerald-500">Top 10%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Budget Adherence</span>
              <span className="font-semibold text-brand-500">88% Target Met</span>
            </div>
          </div>
        </div>

        {/* Display & Interface Preferences */}
        <div className="bg-white dark:bg-[#111c3a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
            System Preferences
          </h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Appearance Theme</p>
                <p className="text-slate-400">Toggle between Dark Navy and Clean Light Mode</p>
              </div>
              <button
                onClick={toggleTheme}
                className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-800 dark:text-white flex items-center space-x-1.5"
              >
                {darkMode ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-slate-600" />
                    <span>Dark Navy</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Active Session</p>
                <p className="text-slate-400">Sign out from this device</p>
              </div>
              <button
                onClick={logout}
                className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-semibold transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Official QUANTORA Team Work Division (Section 9 & 13) */}
      <div className="bg-white dark:bg-[#111c3a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center space-x-2.5 mb-4">
          <Users className="w-5 h-5 text-brand-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            QUANTORA Team Work Division & Submission Info
          </h3>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Project Title: <strong>FinSight – Personal Finance Management & Analytics System</strong> | Team: <strong>QUANTORA</strong>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="font-bold text-brand-600 dark:text-brand-400">Team Member 1</span>
            <p className="font-semibold text-slate-900 dark:text-white mt-1">Frontend & Dashboard Lead</p>
            <p className="text-slate-400 mt-1">
              React frontend, landing page, authentication UI, responsive dashboard design, and Recharts graph integration.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="font-bold text-brand-600 dark:text-brand-400">Team Member 2</span>
            <p className="font-semibold text-slate-900 dark:text-white mt-1">Backend & API Lead</p>
            <p className="text-slate-400 mt-1">
              Node.js, Express.js architecture, JWT authentication middleware, password hashing, and transaction CRUD APIs.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="font-bold text-brand-600 dark:text-brand-400">Team Member 3</span>
            <p className="font-semibold text-slate-900 dark:text-white mt-1">Database & Analytics Lead</p>
            <p className="text-slate-400 mt-1">
              MongoDB schemas, budget calculation pipelines, savings goal management, reports generation, and API test suite.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
