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
  Shield,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Home as HomeIcon,
  Landmark,
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
      description: 'SIP, EMI, Tax, PPF, NPS calculators with FY 2024-25 rates',
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

  const calculators = [
    { name: 'SIP Calculator', desc: 'Calculate mutual fund returns', icon: TrendingUp },
    { name: 'EMI Calculator', desc: 'Loan repayment planning', icon: HomeIcon },
    { name: 'Income Tax', desc: 'FY 2024-25 tax calculator', icon: Receipt },
    { name: 'PPF Calculator', desc: 'Public Provident Fund', icon: Shield },
    { name: 'NPS Calculator', desc: 'National Pension System', icon: Landmark },
    { name: 'Retirement', desc: 'Retirement corpus planning', icon: Target },
  ];

  const benefits = [
    { text: '100% Free to use', icon: CheckCircle },
    { text: 'Indian market focused', icon: CheckCircle },
    { text: 'Latest FY 2024-25 tax slabs', icon: CheckCircle },
    { text: 'UPI & digital payments', icon: CheckCircle },
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
            and Indian tax calculators (FY 2024-25)
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
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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

      {/* Calculators Section */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Free Tools
            </h2>
            <p className="text-xl text-slate-400">
              Updated with FY 2024-25 tax slabs and current interest rates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {calculators.map((calc, index) => {
              const Icon = calc.icon;
              return (
                <div
                  key={index}
                  onClick={() => navigate('/calculators')}
                  className="group cursor-pointer bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:bg-slate-800/70 hover:border-blue-500/50 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                      <Icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1">{calc.name}</h3>
                      <p className="text-sm text-slate-400">{calc.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Button
              variant="primary"
              size="lg"
              icon={Calculator}
              onClick={() => navigate('/calculators')}
            >
              View All Calculators
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
          <p>© 2024 FinLit Hub India. Built for the Indian market with ❤️</p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default HomePage;
