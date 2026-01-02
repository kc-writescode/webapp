import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@contexts/AuthContext';
import { BudgetProvider } from '@contexts/BudgetContext';
import { MarketProvider } from '@contexts/MarketContext';
import { CommunityProvider } from '@contexts/CommunityContext';
import { ToastProvider } from '@contexts/ToastContext';
import { AchievementProvider } from '@contexts/AchievementContext';
import ErrorBoundary from '@components/common/ErrorBoundary';
import ToastContainer from '@components/common/Toast';
import BadgeUnlockNotification from '@components/common/BadgeUnlockNotification';

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
const FreeResources = lazy(() => import('@components/resources/FreeResources'));

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
const ResourcesPage = () => (
  <Suspense fallback={<PageLoader />}>
    <FreeResources />
  </Suspense>
);

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <BudgetProvider>
            <MarketProvider>
              <CommunityProvider>
                <ToastProvider>
                  <AchievementProvider>
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
                      <Route path="/resources" element={<ResourcesPage />} />
                      {/* Redirect old expenses route to dashboard */}
                      <Route path="/expenses" element={<Navigate to="/dashboard" replace />} />

                      {/* Fallback - redirect to home */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                    <ToastContainer />
                    <BadgeUnlockNotification />
                  </AchievementProvider>
                </ToastProvider>
              </CommunityProvider>
            </MarketProvider>
          </BudgetProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;