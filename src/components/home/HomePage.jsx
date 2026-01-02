/**
 * HomePage Component
 * Redesigned home page showcasing all features
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import {
  LayoutDashboard,
  Receipt,
  TrendingUp,
  Calculator,
  MessageSquare,
  Target,
  ArrowRight,
  CheckCircle,
  Sparkles,
  BookOpen,
  Download,
  FileText,
  FileSpreadsheet,
  CreditCard,
  PiggyBank,
  Shield,
  Lock,
} from 'lucide-react';
import TopHeader from '@components/layout/TopHeader';
import Button from '@components/common/Button';
import AuthModal from '@components/auth/AuthModal';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for header background
  useState(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: Target,
      title: 'Free Goal Tracker',
      description: 'Track all your finances in one place with real-time insights',
      color: 'from-blue-500 to-cyan-500',
      path: '/savings',
      auth: true,
    },
    {
      icon: Receipt,
      title: 'Expense Tracking',
      description: 'Monitor spending with 18 Indian categories and UPI integration',
      color: 'from-orange-500 to-red-500',
      path: '/expenses',
      auth: true,
    },
    {
      icon: TrendingUp,
      title: 'Financial News',
      description: 'Stay updated with the latest market news and insights',
      color: 'from-green-500 to-emerald-500',
      path: '/news',
      auth: false,
    },
    {
      icon: Calculator,
      title: 'Free Tools',
      description: 'SIP, EMI, Tax, PPF, NPS calculators with FY 2025-26 rates',
      color: 'from-purple-500 to-pink-500',
      path: '/calculators',
      auth: false,
    },
    {
      icon: MessageSquare,
      title: 'Community Forum',
      description: 'Share insights, ask questions, and connect with finance enthusiasts',
      color: 'from-pink-500 to-rose-500',
      path: '/community',
      auth: false,
    },
  ];

  const freeEbooks = [
    {
      title: 'Understanding Credit Score',
      subtitle: 'Why It Matters and How to Improve',
      description: 'Learn how credit scores work in India and actionable tips to build a strong credit profile.',
      color: 'from-blue-500 to-cyan-500',
      file: '/files/Understanding-Credit-Score-Why-It-Matters-and-How-to-Improve.pdf',
    },
    {
      title: 'Understanding EMI in India',
      subtitle: 'Benefits and the Hidden Trap',
      description: 'Discover how EMIs work, their advantages, and the common pitfalls to avoid.',
      color: 'from-orange-500 to-red-500',
      file: '/files/Understanding-EMI-in-India-Benefits-and-the-Hidden-Trap.pdf',
    },
    {
      title: 'Understanding Health Insurance',
      subtitle: 'Why It Matters for Every Indian',
      description: 'A comprehensive guide to health insurance coverage and choosing the right plan.',
      color: 'from-green-500 to-emerald-500',
      file: '/files/Understanding-Health-Insurance-Why-It-Matters-for-Every-Indian.pdf',
    },
    {
      title: 'Benefits of Filing Income Tax Returns',
      subtitle: 'A Simple Guide for Everyone',
      description: 'Understand why filing ITR is important and the benefits it brings beyond compliance.',
      color: 'from-purple-500 to-pink-500',
      file: '/files/The-Benefits-of-Filing-Income-Tax-Returns-in-India-A-Simple-Guide-for-Everyone.pdf',
    },
  ];

  const excelTemplates = [
    {
      title: 'Complete Budget Planner',
      description: 'Monthly budget with 50/30/20 rule analysis and expense categorization.',
      color: 'from-indigo-500 to-blue-500',
      icon: FileSpreadsheet,
      file: '/files/Free Resources/Complete Budget Planner.xlsx',
    },
    {
      title: 'Salary & Tax Calculator',
      description: 'CTC to in-hand calculator with FY 2025-26 tax slabs.',
      color: 'from-green-500 to-teal-500',
      icon: Receipt,
      file: '/files/Free Resources/Salary Tax Calculator.xlsx',
    },
    {
      title: 'Debt Freedom Tracker',
      description: 'Master debt with snowball & avalanche strategies.',
      color: 'from-orange-500 to-red-500',
      icon: CreditCard,
      file: '/files/Free Resources/Debt Freedom Tracker.xlsx',
    },
    {
      title: 'Investment Portfolio Manager',
      description: 'Track mutual funds, stocks, FDs with CAGR calculations.',
      color: 'from-purple-500 to-indigo-500',
      icon: TrendingUp,
      file: '/files/Free Resources/Investment Portfolio Manager.xlsx',
    },
    {
      title: 'Emergency Fund Planner',
      description: 'Calculate your ideal emergency fund with savings timeline.',
      color: 'from-yellow-500 to-orange-500',
      icon: PiggyBank,
      file: '/files/Free Resources/Emergency Fund Planner.xlsx',
    },
    {
      title: 'Insurance Needs Analyzer',
      description: 'Comprehensive insurance audit with coverage calculators.',
      color: 'from-teal-500 to-cyan-500',
      icon: Shield,
      file: '/files/Free Resources/Insurance Needs Analyzer.xlsx',
    },
  ];

  const benefits = [
    { text: '100% Free to use', icon: CheckCircle },
    { text: 'Indian market focused', icon: CheckCircle },
    { text: 'Latest FY 2025-26 tax slabs', icon: CheckCircle },
    { text: 'Real-time market data', icon: CheckCircle },
    { text: 'Secure local storage', icon: CheckCircle },
  ];

  const handleFeatureClick = (feature) => {
    if (feature.auth && !user) {
      setShowAuthModal(true);
    } else {
      navigate(feature.path);
    }
  };

  // Handle download - requires login
  const handleDownload = (e) => {
    if (!user) {
      e.preventDefault();
      setShowAuthModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <TopHeader isScrolled={isScrolled} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-400 font-medium">Built for India 🇮🇳</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            Master Your Money,
            <br />
            Secure Your Future
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Complete personal finance platform with expense tracking, market data,
            and Indian tax calculators (FY 2025-26)
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {user ? (
              <Button
                variant="primary"
                size="lg"
                icon={LayoutDashboard}
                onClick={() => navigate('/dashboard')}
                className="text-lg px-8 py-6"
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setShowAuthModal(true)}
                  className="text-lg px-8 py-6"
                >
                  Get Started Free
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/calculators')}
                  className="text-lg px-8 py-6"
                >
                  Try Calculators
                </Button>
              </>
            )}
          </div>

          {/* Benefits */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm text-slate-300 justify-center"
                >
                  <Icon className="w-4 h-4 text-green-400" />
                  <span>{benefit.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Everything You Need
            </h2>
            <p className="text-xl text-slate-400">
              Comprehensive financial tools in one platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  onClick={() => handleFeatureClick(feature)}
                  className="group cursor-pointer bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:bg-slate-800/70 hover:border-slate-600 transition-all duration-300 hover:scale-105"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm mb-4">{feature.description}</p>
                  <div className={`flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                    Explore <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Free Resources Section */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-400 font-medium">Free Downloads</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Free Resources
            </h2>
            <p className="text-xl text-slate-400">
              Download free eBooks and Excel spreadsheets to boost your financial literacy
            </p>
          </div>

          {/* Free eBooks */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Free eBooks</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {freeEbooks.map((ebook, index) => (
                <a
                  key={index}
                  href={user ? ebook.file : '#'}
                  target={user ? '_blank' : undefined}
                  rel={user ? 'noopener noreferrer' : undefined}
                  onClick={handleDownload}
                  className="group cursor-pointer bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:bg-slate-800/70 hover:border-slate-500 transition-all duration-300 hover:scale-[1.02] block"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-4 bg-gradient-to-br ${ebook.color} rounded-xl flex-shrink-0`}>
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                        {ebook.title}
                      </h3>
                      <p className="text-sm text-slate-300 mb-2">{ebook.subtitle}</p>
                      <p className="text-sm text-slate-400 mb-4">{ebook.description}</p>
                      <div className={`flex items-center gap-2 text-sm font-semibold ${user ? 'text-emerald-400 group-hover:text-emerald-300' : 'text-blue-400 group-hover:text-blue-300'}`}>
                        {user ? <Download className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        <span>{user ? 'Download Free PDF' : 'Login to Download'}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Excel Spreadsheets */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <FileSpreadsheet className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Excel Spreadsheets</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {excelTemplates.map((template, index) => {
                const Icon = template.icon;
                return (
                  <a
                    key={index}
                    href={user ? template.file : '#'}
                    download={user ? true : undefined}
                    onClick={handleDownload}
                    className="group cursor-pointer bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-5 hover:bg-slate-800/70 hover:border-slate-500 transition-all duration-300 hover:scale-[1.02] block"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 bg-gradient-to-br ${template.color} rounded-xl flex-shrink-0`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                          {template.title}
                        </h4>
                        <p className="text-sm text-slate-400 mb-3">{template.description}</p>
                        <div className={`flex items-center gap-2 text-sm font-semibold ${user ? 'text-emerald-400 group-hover:text-emerald-300' : 'text-blue-400 group-hover:text-blue-300'}`}>
                          {user ? <Download className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                          <span>{user ? 'Download Excel' : 'Login to Download'}</span>
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => navigate('/resources')}
            >
              View All Resources
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-3xl p-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                Start Managing Your Finances Today
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Join thousands of Indians taking control of their financial future
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={() => setShowAuthModal(true)}
                className="text-lg px-12 py-6"
              >
                Get Started Free
              </Button>
              <p className="text-sm text-slate-400 mt-4">
                No credit card required • 100% Free • Made in India
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto text-center text-slate-400 text-sm">
          <p>© 2026 FinKnight India. Built for the Indian market with ❤️</p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default HomePage;
