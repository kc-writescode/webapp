import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@contexts/AuthContext';
import { BudgetProvider } from '@contexts/BudgetContext';
import { MarketProvider } from '@contexts/MarketContext';
import { CommunityProvider } from '@contexts/CommunityContext';
import HomePage from '@components/home/HomePage';
import DashboardOverview from '@components/dashboard/DashboardOverview';
import MarketDashboard from '@components/market/MarketDashboard';
import CalculatorHub from '@components/calculators/CalculatorHub';
import CommunityPage from '@components/community/CommunityPage';
import SavingsGoals from '@components/savings/SavingsGoals';
import NewsPage from '@components/news/NewsPage';

// Production pages
const DashboardPage = () => <DashboardOverview />;
const MarketsPage = () => <MarketDashboard />;
const CalculatorsPage = () => <CalculatorHub />;
const CommunityHub = () => <CommunityPage />;
const SavingsPage = () => <SavingsGoals />;
const NewsHub = () => <NewsPage />;

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