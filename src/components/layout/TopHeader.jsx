/**
 * TopHeader Component
 * Fixed top header showing logo and user information
 */

import { useState } from 'react';
import { useAuth } from '@contexts/AuthContext';
import { LogOut, LogIn, Menu, X, WifiOff, Wifi } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthModal from '@components/auth/AuthModal';
import Button from '@components/common/Button';
import useOnlineStatus from '@hooks/useOnlineStatus';

const TopHeader = ({ onLogoClick, isScrolled }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { isOnline, wasOffline } = useOnlineStatus();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', auth: true },
    { name: 'Goals', path: '/savings', auth: true },
    { name: 'News', path: '/news', auth: false },
    { name: 'Tools', path: '/calculators', auth: false },
    { name: 'Community', path: '/community', auth: false },
  ];

  return (
    <>
      {/* Offline Banner */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-red-500 text-white px-4 py-2 text-center text-sm font-medium flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4" />
          You're offline. Some features may not work.
        </div>
      )}

      {/* Back Online Banner */}
      {wasOffline && isOnline && (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-green-500 text-white px-4 py-2 text-center text-sm font-medium flex items-center justify-center gap-2 animate-slide-up">
          <Wifi className="w-4 h-4" />
          You're back online!
        </div>
      )}

      <header
        className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
          !isOnline || wasOffline ? 'top-10' : 'top-0'
        } ${
          isScrolled
            ? 'bg-slate-900/95 backdrop-blur-xl border-b border-slate-700 shadow-xl'
            : 'bg-slate-900/50 backdrop-blur-md'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <button
                onClick={() => navigate('/')}
                className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent hover:scale-105 transition-transform"
              >
                FinLit Hub India
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => {
                if (link.auth && !user) return null;
                return (
                  <button
                    key={link.path}
                    onClick={() => navigate(link.path)}
                    className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
                  >
                    {link.name}
                  </button>
                );
              })}
            </div>

            {/* User Section */}
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <button
                    onClick={() => navigate('/profile')}
                    className="hidden sm:flex items-center gap-2 bg-slate-800/50 px-3 py-2 rounded-full border border-slate-700 hover:border-blue-500/50 hover:bg-slate-700/50 transition-all"
                    title="View Profile"
                  >
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm font-medium text-white">
                      {user.username}
                    </span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5 text-gray-400 hover:text-red-400 transition-colors" />
                  </button>
                </>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  icon={LogIn}
                  onClick={() => setShowAuthModal(true)}
                  className="hidden md:flex"
                >
                  Login
                </Button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                {showMobileMenu ? (
                  <X className="w-6 h-6 text-white" />
                ) : (
                  <Menu className="w-6 h-6 text-white" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden py-4 border-t border-slate-700">
              <div className="flex flex-col gap-3">
                {navLinks.map((link) => {
                  if (link.auth && !user) return null;
                  return (
                    <button
                      key={link.path}
                      onClick={() => {
                        navigate(link.path);
                        setShowMobileMenu(false);
                      }}
                      className="text-slate-300 hover:text-white transition-colors text-sm font-medium text-left py-2"
                    >
                      {link.name}
                    </button>
                  );
                })}
                {!user && (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={LogIn}
                    onClick={() => {
                      setShowAuthModal(true);
                      setShowMobileMenu(false);
                    }}
                    fullWidth
                  >
                    Login / Sign Up
                  </Button>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};

export default TopHeader;
