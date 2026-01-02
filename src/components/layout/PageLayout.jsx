/**
 * PageLayout Component
 * Main layout wrapper with header and navigation
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopHeader from './TopHeader';
import FloatingNavBar from './FloatingNavBar';

const PageLayout = ({ children, showNav = true }) => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll handler for header background
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          setIsScrolled(scrolled > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = () => {
    navigate('/dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-x-hidden">
      <TopHeader onLogoClick={handleLogoClick} isScrolled={isScrolled} />
      {showNav && <FloatingNavBar />}

      <main className="pt-16 overflow-x-hidden">
        {children}
      </main>

      {/* Bottom spacing for floating nav */}
      {showNav && <div className="h-24 sm:h-32" />}
    </div>
  );
};

export default PageLayout;
