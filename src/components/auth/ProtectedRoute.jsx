/**
 * ProtectedRoute Component
 * Route guard for authenticated pages
 */

import { useState } from 'react';
import { useAuth } from '@contexts/AuthContext';
import AuthModal from './AuthModal';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show auth modal
  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="mb-6 text-6xl">🔒</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Authentication Required
            </h2>
            <p className="text-slate-400 mb-8">
              Please login or create an account to access this page.
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
            >
              Login / Sign Up
            </button>
          </div>
        </div>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode="login"
        />
      </>
    );
  }

  // User is authenticated, render the protected content
  return children;
};

export default ProtectedRoute;
