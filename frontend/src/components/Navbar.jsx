import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bot, LogOut, User, ShieldCheck, ChevronDown, Bell } from 'lucide-react';

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Side: Brand Logo & Sidebar Toggle */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg lg:hidden"
            aria-label="Toggle Navigation"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-900 to-brand-700 flex items-center justify-center text-white shadow-md shadow-brand-900/20 group-hover:scale-105 transition-transform duration-200">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-lg tracking-tight block leading-none">
                AI Career <span className="text-brand-700">Mentor</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-brand-600 block mt-0.5">
                {role === 'admin' ? 'Admin Portal' : 'Career Intelligence SaaS'}
              </span>
            </div>
          </Link>
        </div>

        {/* Right Side: Quick Info, Notifications & Profile Menu */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Notification bell mock */}
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-700 rounded-full"></span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-3 p-1.5 rounded-xl hover:bg-slate-100/80 transition-colors focus:outline-none"
            >
              <div className="w-9 h-9 rounded-full bg-brand-800 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                {user?.Full_Name ? user.Full_Name.charAt(0).toUpperCase() : user?.Username ? user.Username.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-slate-800 leading-tight">
                  {user?.Full_Name || user?.Username || 'User'}
                </p>
                <p className="text-xs text-slate-500 capitalize">{role}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-xs text-slate-400 uppercase font-semibold">Signed in as</p>
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {user?.Email || user?.Username || 'Account'}
                  </p>
                </div>

                {role === 'user' ? (
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-800"
                  >
                    <User className="w-4 h-4 mr-2.5 text-slate-400" />
                    Profile Settings
                  </Link>
                ) : (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-800"
                  >
                    <ShieldCheck className="w-4 h-4 mr-2.5 text-slate-400" />
                    Admin Overview
                  </Link>
                )}

                <div className="border-t border-slate-100 my-1"></div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left font-medium"
                >
                  <LogOut className="w-4 h-4 mr-2.5 text-red-500" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
