import React, { useState, useRef, useEffect } from 'react';
import { Menu, Sun, Moon, Plus, User, LogOut, ChevronDown, Calendar, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import NotificationsDropdown from './NotificationsDropdown';

const Navbar = ({ setMobileOpen, budgetAlerts = [] }) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#0b132b]/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 lg:px-8 py-3.5 transition-colors duration-200">
      <div className="flex items-center justify-between">
        {/* Left: Mobile hamburger & Greeting */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-2xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Menu className="w-5 h-5" />
          </motion.button>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                Welcome back, {user?.name ? user.name.split(' ')[0] : 'Member'} 👋
              </h1>
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/10 text-brand-500 border border-brand-500/20">
                PRO
              </span>
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-brand-500" />
              <span>{todayFormatted}</span>
            </div>
          </div>
        </div>

        {/* Right: Quick Action, Theme toggle, Notifications, Profile */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Quick Add Button with Dribbble-style gradient glow */}
          <Link to="/transactions/add">
            <motion.div
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-brand-600 via-blue-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 hover:shadow-brand-500/35 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Transaction</span>
            </motion.div>
          </Link>

          {/* Theme Toggle with Spring Rotate */}
          <motion.button
            whileTap={{ scale: 0.85, rotate: 180 }}
            onClick={toggleTheme}
            className="p-2 rounded-2xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </motion.button>

          {/* Notifications Dropdown */}
          <NotificationsDropdown budgetAlerts={budgetAlerts} />

          {/* Profile Dropdown with Spring AnimatePresence */}
          <div className="relative" ref={profileRef}>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center space-x-2 p-1 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-500 to-accent-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-brand-500/30 shadow-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 hidden sm:block transition-transform duration-200 ${
                  profileOpen ? 'rotate-180' : ''
                }`}
              />
            </motion.button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#111c3a] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl z-50 overflow-hidden py-1.5"
                >
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                      {user?.name}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{user?.email}</p>
                  </div>

                  <div className="p-1.5 space-y-0.5 text-xs font-semibold">
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition"
                    >
                      <User className="w-4 h-4 text-brand-500" />
                      <span>Account Profile</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
