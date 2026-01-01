import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@contexts/AuthContext';
import { BudgetProvider } from '@contexts/BudgetContext';
import { MarketProvider } from '@contexts/MarketContext';
import { CommunityProvider } from '@contexts/CommunityContext';

// Eager load home page for fast initial load
import HomePage from '@components/home/HomePage';

// Lazy load feature pages for code splitting
const DashboardOverview = lazy(() => import('@components/dashboard/DashboardOverview'));
const MarketDashboard = lazy(() => import('@components/market/MarketDashboard'));
const CalculatorHub = lazy(() => import('@components/calculators/CalculatorHub'));
const CommunityPage = lazy(() => import('@components/community/CommunityPage'));
const SavingsGoals = lazy(() => import('@components/savings/SavingsGoals'));
const NewsPage = lazy(() => import('@components/news/NewsPage'));
const ProfilePage = lazy(() => import('@components/profile/ProfilePage'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-slate-400">Loading...</p>
    </div>
  </div>
);

// Production pages with Suspense wrappers
const DashboardPage = () => (
  <Suspense fallback={<PageLoader />}>
    <DashboardOverview />
  </Suspense>
);
const MarketsPage = () => (
  <Suspense fallback={<PageLoader />}>
    <MarketDashboard />
  </Suspense>
);
const CalculatorsPage = () => (
  <Suspense fallback={<PageLoader />}>
    <CalculatorHub />
  </Suspense>
);
const CommunityHub = () => (
  <Suspense fallback={<PageLoader />}>
    <CommunityPage />
  </Suspense>
);
const SavingsPage = () => (
  <Suspense fallback={<PageLoader />}>
    <SavingsGoals />
  </Suspense>
);
const NewsHub = () => (
  <Suspense fallback={<PageLoader />}>
    <NewsPage />
  </Suspense>
);
const ProfileHub = () => (
  <Suspense fallback={<PageLoader />}>
    <ProfilePage />
  </Suspense>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <BudgetProvider>
          <MarketProvider>
            <CommunityProvider>
              <Routes>
                {/* Home page - new design */}
                <Route path="/" element={<HomePage />} />

                {/* Feature routes */}
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/markets" element={<MarketsPage />} />
                <Route path="/calculators" element={<CalculatorsPage />} />
                <Route path="/community" element={<CommunityHub />} />
                <Route path="/savings" element={<SavingsPage />} />
                <Route path="/news" element={<NewsHub />} />
                <Route path="/profile" element={<ProfileHub />} />
                {/* Redirect old expenses route to dashboard */}
                <Route path="/expenses" element={<Navigate to="/dashboard" replace />} />

                {/* Fallback - redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </CommunityProvider>
          </MarketProvider>
        </BudgetProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;