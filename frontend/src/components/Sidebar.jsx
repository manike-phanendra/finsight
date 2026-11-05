import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navContent = (
    <div className="flex flex-col h-full bg-white dark:bg-[#0b132b] border-r border-slate-200 dark:border-slate-800/80">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-accent-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform">
            <TrendingUp className="w-5 h-5" />
          </div>
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
            className="lg:hidden text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="text-[11px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase px-3 mb-2">
          Menu
        </div>
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800/60">
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#111c3a] border border-slate-200/60 dark:border-slate-800">
          <Link to="/profile" className="flex items-center space-x-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email || 'user@finsight.com'}</p>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            title="Logout"
            className="p-1.5 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 z-40">
        {navContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-full shadow-2xl">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
