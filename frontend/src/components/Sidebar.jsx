import React from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  ReceiptText,
  PlusCircle,
  PieChart,
  BarChart3,
  Target,
  FileSpreadsheet,
  User,
  LogOut,
  TrendingUp,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Transactions', href: '/transactions', icon: ReceiptText },
  { name: 'Add Transaction', href: '/transactions/add', icon: PlusCircle },
  { name: 'Budgets', href: '/budgets', icon: PieChart },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Savings Goals', href: '/goals', icon: Target },
  { name: 'Reports', href: '/reports', icon: FileSpreadsheet },
  { name: 'Profile', href: '/profile', icon: User },
];

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navContent = (
    <div className="flex flex-col h-full bg-white dark:bg-[#0b132b] border-r border-slate-200 dark:border-slate-800/80">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center space-x-3 group">
          <motion.div
            whileHover={{ scale: 1.08, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-accent-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/25"
          >
            <TrendingUp className="w-5 h-5" />
          </motion.div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-brand-600 via-blue-500 to-accent-500">
                FinSight
              </span>
            </div>
            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 tracking-wider uppercase">
              By QUANTORA
            </span>
          </div>
        </Link>
        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links with Floating Gliding Pill */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="text-[11px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase px-3 mb-2 flex items-center justify-between">
          <span>Main Menu</span>
          <Sparkles className="w-3 h-3 text-brand-400 opacity-60" />
        </div>
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => setMobileOpen(false)}
              className="relative flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 group"
            >
              {isActive && (
                <motion.div
                  layoutId="sidebarActivePill"
                  className="absolute inset-0 bg-brand-600 rounded-2xl shadow-md shadow-brand-600/30"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <Icon
                className={`w-4 h-4 flex-shrink-0 relative z-10 transition-colors duration-200 ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-500 dark:text-slate-400 group-hover:text-brand-600 dark:group-hover:text-white'
                }`}
              />
              <span
                className={`relative z-10 transition-colors duration-200 ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'
                }`}
              >
                {item.name}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Info & Logout Card */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800/60">
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-[#111c3a] border border-slate-200/60 dark:border-slate-800">
          <Link to="/profile" className="flex items-center space-x-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm shadow-brand-500/30">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {user?.name || 'Alex Morgan'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {user?.email || 'demo@finsight.quantora.com'}
              </p>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 fixed inset-y-0 left-0 z-40">
        {navContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-[#0b132b] shadow-2xl"
          >
            {navContent}
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
