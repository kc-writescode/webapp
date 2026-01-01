/**
 * CalculatorHub Component
 * Main page for financial calculators
 */

import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { Calculator, TrendingUp, Home, Receipt, Landmark, Shield } from 'lucide-react';
import { useAuth } from '@contexts/AuthContext';
import PageLayout from '@components/layout/PageLayout';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import AuthModal from '@components/auth/AuthModal';

// Lazy load calculator components for better performance
const SIPCalculator = lazy(() => import('./SIPCalculator'));
const EMICalculator = lazy(() => import('./EMICalculator'));
const TaxCalculator = lazy(() => import('./TaxCalculator'));
const PPFCalculator = lazy(() => import('./PPFCalculator'));
const NPSCalculator = lazy(() => import('./NPSCalculator'));
const RetirementCalculator = lazy(() => import('./RetirementCalculator'));

// Calculator loading skeleton
const CalculatorLoader = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-8 bg-slate-700 rounded w-1/3"></div>
    <div className="h-64 bg-slate-700 rounded"></div>
    <div className="h-32 bg-slate-700 rounded"></div>
  </div>
);

const CALCULATORS = [
  {
    id: 'sip',
    name: 'SIP Calculator',
    description: 'Calculate Systematic Investment Plan returns',
    icon: TrendingUp,
    color: 'from-blue-500 to-cyan-500',
    component: SIPCalculator,
  },
  {
    id: 'emi',
    name: 'EMI Calculator',
    description: 'Calculate loan EMI and total interest',
    icon: Home,
    color: 'from-orange-500 to-red-500',
    component: EMICalculator,
  },
  {
    id: 'tax',
    name: 'Income Tax Calculator',
    description: 'Calculate income tax liability (FY 2025-26)',
    icon: Receipt,
    color: 'from-red-500 to-pink-500',
    component: TaxCalculator,
  },
  {
    id: 'ppf',
    name: 'PPF Calculator',
    description: 'Calculate Public Provident Fund maturity',
    icon: Shield,
    color: 'from-green-500 to-emerald-500',
    component: PPFCalculator,
  },
  {
    id: 'nps',
    name: 'NPS Calculator',
    description: 'Calculate National Pension System returns',
    icon: Landmark,
    color: 'from-purple-500 to-indigo-500',
    component: NPSCalculator,
  },
  {
    id: 'retirement',
    name: 'Retirement Calculator',
    description: 'Plan your retirement corpus',
    icon: Landmark,
    color: 'from-teal-500 to-cyan-500',
    component: RetirementCalculator,
  },
];

const CalculatorHub = () => {
  const { user } = useAuth();
  const [selectedCalculator, setSelectedCalculator] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      setSelectedCalculator(null);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Show auth modal if user is not logged in
  if (!user) {
    return (
      <PageLayout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔐</div>
            <h2 className="text-2xl font-bold text-white mb-2">Login Required</h2>
            <p className="text-slate-400 mb-6">Please login to access the financial calculators</p>
            <Button variant="primary" onClick={() => setShowAuthModal(true)}>
              Login / Sign Up
            </Button>
          </div>
        </div>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </PageLayout>
    );
  }

  // Handle selecting a calculator - push state for browser history
  const handleSelectCalculator = useCallback((calc) => {
    setSelectedCalculator(calc);
    window.history.pushState({ calculator: calc.id }, '', `/calculators/${calc.id}`);
  }, []);

  // Handle back button click
  const handleBack = useCallback(() => {
    setSelectedCalculator(null);
    window.history.pushState(null, '', '/calculators');
  }, []);

  const SelectedComponent = selectedCalculator?.component;

  if (selectedCalculator) {
    return (
      <PageLayout>
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-6"
          >
            ← Back to Calculators
          </Button>

          {/* Selected Calculator */}
          <div className="mb-6">
            <h1 className={`text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r ${selectedCalculator.color} bg-clip-text text-transparent`}>
              {selectedCalculator.name}
            </h1>
            <p className="text-slate-400 text-lg">
              {selectedCalculator.description}
            </p>
          </div>

          <Suspense fallback={<CalculatorLoader />}>
            <SelectedComponent />
          </Suspense>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Financial Calculators
          </h1>
          <p className="text-slate-400 text-lg">
            Plan your investments, loans, and taxes with our comprehensive calculators
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CALCULATORS.map((calc) => {
            const Icon = calc.icon;
            return (
              <div
                key={calc.id}
                onClick={() => handleSelectCalculator(calc)}
                className="group cursor-pointer"
              >
                <Card
                  variant="gradient"
                  hover
                  className="h-full transition-all duration-300 group-hover:scale-105"
                >
                  <div className="flex flex-col items-center text-center p-6">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${calc.color} flex items-center justify-center mb-4 shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-2">
                      {calc.name}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-400 text-sm mb-4">
                      {calc.description}
                    </p>

                    {/* CTA */}
                    <div className={`text-sm font-semibold bg-gradient-to-r ${calc.color} bg-clip-text text-transparent`}>
                      Calculate Now →
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Info Section */}
        <Card className="mt-8" variant="glass">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Calculator className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">
                All calculators are tailored for the Indian market
              </h3>
              <p className="text-slate-400 text-sm">
                Our calculators use current Indian tax slabs (FY 2025-26), interest rates, and
                regulations. Results are indicative and for educational purposes only. Please
                consult a financial advisor for personalized advice.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
};

export default CalculatorHub;
