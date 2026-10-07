import React from 'react';
import { Menu, LogOut, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC<{ onToggleSidebar: () => void }> = ({ onToggleSidebar }) => {
  const { user, role, logout } = useAuth();
  const isOfficer = role === 'ROLE_OFFICER';

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 lg:hidden">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="font-bold text-slate-800 text-sm">PlacementPortal</span>
        </div>
        <div className="hidden lg:block">
          <h1 className="text-sm font-semibold text-slate-800">
            Campus Recruitment & Placement System
          </h1>
          <p className="text-xs text-slate-400">Department of Training & Placements</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Role badge */}
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
            isOfficer
              ? 'bg-purple-50 text-purple-700 border-purple-200'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}
        >
          {isOfficer ? 'Placement Officer' : `Student (${user?.studentId || 'Profile'})`}
        </span>

        {/* Profile info */}
        <div className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="text-right">
            <p className="text-xs font-bold text-slate-800">{user?.fullName || 'User'}</p>
            <p className="text-[11px] text-slate-500">{user?.email}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-brand-600 text-white font-semibold text-xs flex items-center justify-center shadow-sm">
            {user?.fullName?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>

        {/* Quick logout */}
        <button
          onClick={logout}
          title="Sign Out"
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
