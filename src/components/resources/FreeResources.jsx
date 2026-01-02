/**
 * FreeResources Component
 * Dedicated page for free resources, eBooks, and Excel spreadsheets
 */

import { useState, useMemo } from 'react';
import {
  BookOpen,
  Download,
  FileText,
  FileSpreadsheet,
  CreditCard,
  TrendingUp,
  Search,
  ExternalLink,
  PiggyBank,
  Shield,
  Receipt,
  Star,
  Lock,
} from 'lucide-react';
import PageLayout from '@components/layout/PageLayout';
import Card from '@components/common/Card';
import Input from '@components/common/Input';
import { useAuth } from '@contexts/AuthContext';
import AuthModal from '@components/auth/AuthModal';

const FreeResources = () => {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Resources', icon: BookOpen },
    { id: 'credit', name: 'Credit & Loans', icon: CreditCard },
    { id: 'tax', name: 'Tax & Salary', icon: Receipt },
    { id: 'insurance', name: 'Insurance', icon: Shield },
    { id: 'investing', name: 'Investing', icon: TrendingUp },
    { id: 'budgeting', name: 'Budgeting', icon: PiggyBank },
  ];

  const freeEbooks = [
    {
      id: 1,
      title: 'Understanding Credit Score',
      subtitle: 'Why It Matters and How to Improve',
      description: 'Learn how credit scores work in India and actionable tips to build a strong credit profile. Covers CIBIL, Experian, and more.',
      category: 'credit',
      pages: '24 pages',
      color: 'from-blue-500 to-cyan-500',
      file: '/files/Understanding-Credit-Score-Why-It-Matters-and-How-to-Improve.pdf',
      featured: true,
    },
    {
      id: 2,
      title: 'Understanding EMI in India',
      subtitle: 'Benefits and the Hidden Trap',
      description: 'Discover how EMIs work, their advantages, and the common pitfalls to avoid. Essential reading before taking any loan.',
      category: 'credit',
      pages: '18 pages',
      color: 'from-orange-500 to-red-500',
      file: '/files/Understanding-EMI-in-India-Benefits-and-the-Hidden-Trap.pdf',
      featured: true,
    },
    {
      id: 3,
      title: 'Understanding Health Insurance',
      subtitle: 'Why It Matters for Every Indian',
      description: 'A comprehensive guide to health insurance coverage and choosing the right plan for you and your family.',
      category: 'insurance',
      pages: '32 pages',
      color: 'from-green-500 to-emerald-500',
      file: '/files/Understanding-Health-Insurance-Why-It-Matters-for-Every-Indian.pdf',
      featured: true,
    },
    {
      id: 4,
      title: 'Benefits of Filing Income Tax Returns',
      subtitle: 'A Simple Guide for Everyone',
      description: 'Understand why filing ITR is important and the benefits it brings beyond compliance. Updated for FY 2025-26.',
      category: 'tax',
      pages: '20 pages',
      color: 'from-purple-500 to-pink-500',
      file: '/files/The-Benefits-of-Filing-Income-Tax-Returns-in-India-A-Simple-Guide-for-Everyone.pdf',
      featured: true,
    },
  ];

  const templates = [
    {
      id: 1,
      title: 'Complete Budget Planner',
      description: 'Comprehensive monthly budget with 50/30/20 rule analysis, expense categorization across 25+ Indian categories, automatic savings rate calculation, and visual dashboard.',
      category: 'budgeting',
      type: 'Excel Spreadsheet',
      icon: FileSpreadsheet,
      color: 'from-indigo-500 to-blue-500',
      file: '/files/Free Resources/Complete Budget Planner.xlsx',
      features: ['Auto-calculations', '50/30/20 Analysis', 'Visual Dashboard'],
      featured: true,
    },
    {
      id: 2,
      title: 'Salary & Tax Calculator',
      description: 'Complete CTC to in-hand calculator with FY 2025-26 tax slabs. Includes HRA exemption calculation, Old vs New regime comparison, and monthly take-home projections.',
      category: 'tax',
      type: 'Excel Spreadsheet',
      icon: Receipt,
      color: 'from-green-500 to-teal-500',
      file: '/files/Free Resources/Salary Tax Calculator.xlsx',
      features: ['FY 2025-26 Slabs', 'Old vs New Regime', 'HRA Exemption'],
      featured: true,
    },
    {
      id: 3,
      title: 'Debt Freedom Tracker',
      description: 'Master your debt with snowball & avalanche strategies. Includes amortization schedules, interest savings calculator, payment tracker, and debt-free date projection.',
      category: 'credit',
      type: 'Excel Spreadsheet',
      icon: CreditCard,
      color: 'from-orange-500 to-red-500',
      file: '/files/Free Resources/Debt Freedom Tracker.xlsx',
      features: ['2 Payoff Strategies', 'Progress Milestones', 'Interest Tracker'],
    },
    {
      id: 4,
      title: 'Investment Portfolio Manager',
      description: 'Track mutual funds, stocks, FDs, PPF, and NPS in one place. Calculates absolute & CAGR returns, asset allocation analysis, and rebalancing recommendations.',
      category: 'investing',
      type: 'Excel Spreadsheet',
      icon: TrendingUp,
      color: 'from-purple-500 to-indigo-500',
      file: '/files/Free Resources/Investment Portfolio Manager.xlsx',
      features: ['Multi-Asset Tracking', 'Return Calculator', 'Asset Allocation'],
      featured: true,
    },
    {
      id: 5,
      title: 'Emergency Fund Planner',
      description: 'Calculate your ideal emergency fund based on your lifestyle. Includes expense analysis, savings timeline, and recommended fund allocation across liquid assets.',
      category: 'budgeting',
      type: 'Excel Spreadsheet',
      icon: PiggyBank,
      color: 'from-yellow-500 to-orange-500',
      file: '/files/Free Resources/Emergency Fund Planner.xlsx',
      features: ['Personalized Target', 'Savings Timeline', 'Progress Tracker'],
    },
    {
      id: 6,
      title: 'Insurance Needs Analyzer',
      description: 'Comprehensive insurance audit covering Health, Term Life, Motor, Home & PA. Includes coverage calculators, premium trackers, and renewal reminders.',
      category: 'insurance',
      type: 'Excel Spreadsheet',
      icon: Shield,
      color: 'from-teal-500 to-cyan-500',
      file: '/files/Free Resources/Insurance Needs Analyzer.xlsx',
      features: ['Coverage Calculator', 'Policy Tracker', 'Renewal Alerts'],
    },
  ];

  // Filter resources based on search and category
  const filteredEbooks = useMemo(() => {
    return freeEbooks.filter((ebook) => {
      const matchesSearch =
        ebook.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ebook.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'all' || ebook.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesSearch =
        template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'all' || template.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  const stats = [
    { label: 'Free eBooks', value: freeEbooks.length, icon: BookOpen },
    { label: 'Excel Spreadsheets', value: templates.length, icon: FileSpreadsheet },
    { label: 'Downloads', value: '10K+', icon: Download },
    { label: 'User Rating', value: '4.8★', icon: Star },
  ];

  // Handle download - requires login
  const handleDownload = (e, file, isNewTab = false) => {
    if (!user) {
      e.preventDefault();
      setShowAuthModal(true);
      return;
    }
    // If user is logged in, allow default behavior
  };

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400 font-medium">100% Free Downloads</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Free Resources
          </h1>
          <p className="text-slate-400 text-lg">
            Download free eBooks and Excel spreadsheets to master your personal finances
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="text-center">
                <Icon className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </Card>
            );
          })}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                    activeCategory === category.id
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Free eBooks Section */}
        {filteredEbooks.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Free eBooks</h2>
                <p className="text-sm text-slate-400">Comprehensive guides on financial topics</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEbooks.map((ebook) => (
                <a
                  key={ebook.id}
                  href={user ? ebook.file : '#'}
                  target={user ? '_blank' : undefined}
                  rel={user ? 'noopener noreferrer' : undefined}
                  onClick={(e) => handleDownload(e, ebook.file, true)}
                  className="group cursor-pointer bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:bg-slate-800/70 hover:border-slate-500 transition-all duration-300 hover:scale-[1.02] block"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-4 bg-gradient-to-br ${ebook.color} rounded-xl flex-shrink-0`}>
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                          {ebook.title}
                        </h3>
                        {ebook.featured && (
                          <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs font-semibold rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-300 mb-2">{ebook.subtitle}</p>
                      <p className="text-sm text-slate-400 mb-3">{ebook.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">{ebook.pages}</span>
                        <div className={`flex items-center gap-2 text-sm font-semibold ${user ? 'text-emerald-400 group-hover:text-emerald-300' : 'text-blue-400 group-hover:text-blue-300'}`}>
                          {user ? <Download className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                          <span>{user ? 'Download Free PDF' : 'Login to Download'}</span>
                          {user && <ExternalLink className="w-3 h-3" />}
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Templates Section */}
        {filteredTemplates.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <FileSpreadsheet className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Excel Spreadsheets</h2>
                <p className="text-sm text-slate-400">Ready-to-use spreadsheets with built-in formulas and calculations</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => {
                const Icon = template.icon;
                return (
                  <a
                    key={template.id}
                    href={user ? template.file : '#'}
                    download={user ? true : undefined}
                    onClick={(e) => handleDownload(e, template.file)}
                    className="group cursor-pointer bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:bg-slate-800/70 hover:border-slate-500 transition-all duration-300 hover:scale-[1.02] block"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r ${template.color} rounded-xl group-hover:scale-110 transition-transform`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      {template.featured && (
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-semibold rounded-full flex items-center gap-1">
                          <Star className="w-3 h-3" /> Popular
                        </span>
                      )}
                    </div>
                    <h4 className="text-lg font-bold mb-2 text-white group-hover:text-cyan-400 transition-colors">
                      {template.title}
                    </h4>
                    <p className="text-slate-400 text-sm mb-4 line-clamp-3">
                      {template.description}
                    </p>
                    {template.features && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {template.features.map((feature, idx) => (
                          <span key={idx} className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                      <span className="text-xs text-slate-500">{template.type}</span>
                      <div className={`flex items-center gap-2 text-sm font-semibold ${user ? 'text-emerald-400 group-hover:text-emerald-300' : 'text-blue-400 group-hover:text-blue-300'}`}>
                        {user ? <Download className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        <span>{user ? 'Download' : 'Login to Download'}</span>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        )}

        {/* No Results */}
        {filteredEbooks.length === 0 && filteredTemplates.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-slate-400 text-lg mb-2">No resources found</p>
            <p className="text-slate-500 text-sm">
              Try adjusting your search or filter to find what you're looking for
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveCategory('all');
              }}
              className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Info Banner */}
        {!user && (
          <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/30">
            <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
              <div className="p-3 bg-blue-500/20 rounded-full">
                <Lock className="w-8 h-8 text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">Login to Download Resources</h3>
                <p className="text-slate-300 text-sm">
                  Create a free account to access all eBooks and Excel spreadsheets.
                  Our mission is to make financial literacy accessible to everyone in India.
                </p>
              </div>
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
              >
                Login / Sign Up
              </button>
            </div>
          </Card>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </PageLayout>
  );
};

export default FreeResources;
