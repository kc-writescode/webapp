/**
 * FloatingNavBar Component
 * Mobile-first floating bottom navigation bar
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Newspaper,
  Calculator,
  Target,
  Users,
} from 'lucide-react';

const FloatingNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation items - updated for fintech platform
  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'savings', label: 'Goals', icon: Target, path: '/savings' },
    { id: 'news', label: 'News', icon: Newspaper, path: '/news' },
    { id: 'calculators', label: 'Tools', icon: Calculator, path: '/calculators' },
    { id: 'community', label: 'Community', icon: Users, path: '/community' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Determine active section based on current path
  const getActiveSection = () => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return 'dashboard';
    if (path.startsWith('/expenses')) return 'expenses';
    if (path.startsWith('/savings')) return 'savings';
    if (path.startsWith('/news')) return 'news';
    if (path.startsWith('/calculators')) return 'calculators';
    if (path.startsWith('/community')) return 'community';
    return 'dashboard';
  };

  const activeSection = getActiveSection();

  return (
    <nav className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 px-2 sm:px-4 w-full max-w-[95%] sm:max-w-md">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl shadow-blue-500/10 p-1.5 sm:p-2">
        <div className="flex items-center justify-around gap-0.5 sm:gap-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`relative flex flex-col items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-2 sm:py-3 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50 z-10'
                    : 'text-gray-400 hover:text-white hover:bg-slate-800/50 hover:scale-105'
                }`}
              >
                <Icon
                  className={`transition-all duration-300 ${
                    isActive ? 'w-5 h-5 sm:w-6 sm:h-6' : 'w-4 h-4 sm:w-5 sm:h-5'
                  }`}
                />
                <span className="text-[10px] sm:text-xs font-medium transition-all duration-300 whitespace-nowrap">
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-400 rounded-full animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default FloatingNavBar;
