import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Compass,
  HelpCircle,
  MessageSquareCode,
  User,
  ShieldCheck,
  Sparkles,
  LogOut,
} from 'lucide-react';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const { role, logout } = useAuth();

  const userNavItems = [
    { name: 'Dashboard Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Resume Analysis', path: '/resume-analysis', icon: FileText },
    { name: 'Career Roadmap', path: '/roadmap', icon: Compass },
    { name: 'Interview Preparation', path: '/interview-prep', icon: HelpCircle },
    { name: 'AI Mock Interview', path: '/mock-interview', icon: MessageSquareCode },
    { name: 'Profile & Resume', path: '/profile', icon: User },
  ];

  const adminNavItems = [
    { name: 'Admin Dashboard', path: '/admin/dashboard', icon: ShieldCheck },
  ];

  const navItems = role === 'admin' ? adminNavItems : userNavItems;

  return (
    <>
      {/* Backdrop overlay for mobile */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 bg-brand-900 text-slate-300 z-40 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 transform lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Navigation links */}
        <div className="p-4 space-y-6 overflow-y-auto">
          {/* Section Banner */}
          <div className="bg-brand-800/60 border border-brand-700/50 rounded-xl p-3 flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-brand-700/80 text-brand-200">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">AI Career Engine</p>
              <p className="text-[11px] text-slate-300">FastAPI Powered</p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="px-3 text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-2">
              Main Menu
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                      isActive
                        ? 'bg-brand-700 text-white shadow-sm font-semibold'
                        : 'text-slate-300 hover:bg-brand-800/80 hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-slate-800 bg-brand-950/40">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg bg-brand-800/40 hover:bg-red-900/40 text-slate-300 hover:text-red-300 border border-slate-700/50 hover:border-red-800/50 text-xs font-medium transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
