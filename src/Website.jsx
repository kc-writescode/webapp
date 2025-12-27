import React, { useState, useEffect } from 'react';
import { BookOpen, TrendingUp, Users, MessageCircle, Briefcase, Download, FileText, Calculator, CreditCard, TrendingDown, ArrowRight, ExternalLink, ChevronRight, ThumbsUp, ThumbsDown, Send, User, LogOut, Plus, MessageSquare, Award } from 'lucide-react';

const FinancialWebsite = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [currentPage, setCurrentPage] = useState('main');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'FinanceGuru',
      avatar: '👨‍💼',
      title: 'Should I invest in SIP or Lump Sum for mutual funds?',
      content: 'I have ₹5 lakhs to invest. Market is at all-time high. Should I do SIP or invest everything at once?',
      category: 'Investing',
      upvotes: 45,
      downvotes: 3,
      comments: 12,
      time: '2 hours ago',
      voted: null
    },
    {
      id: 2,
      author: 'TaxSaver2024',
      avatar: '💰',
      title: 'Best tax-saving options under 80C for FY 2024-25?',
      content: 'Looking for recommendations beyond PPF and ELSS. What are you all investing in this year?',
      category: 'Taxation',
      upvotes: 67,
      downvotes: 5,
      comments: 23,
      time: '5 hours ago',
      voted: null
    },
    {
      id: 3,
      author: 'CreditScoreHero',
      avatar: '🎯',
      title: 'Improved my credit score from 650 to 780 in 6 months!',
      content: 'Here\'s what I did: Paid all EMIs on time, kept credit utilization below 30%, and disputed incorrect entries. Happy to answer questions!',
      category: 'Credit',
      upvotes: 123,
      downvotes: 2,
      comments: 34,
      time: '1 day ago',
      voted: null
    }
  ]);
  const [showComments, setShowComments] = useState(null);

  const navigation = [
    { id: 'home', label: 'Home', icon: BookOpen },
    { id: 'resources', label: 'Resources', icon: FileText },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'about', label: 'About', icon: Users },
    { id: 'community', label: 'Community', icon: MessageCircle }
  ];

  const ebooks = [
    {
      title: 'The EMI Trap',
      description: 'Understanding hidden costs and avoiding debt cycles',
      pages: '45 pages',
      category: 'Debt Management',
      color: 'from-red-500 to-orange-500'
    },
    {
      title: 'Credit Score Mastery',
      description: 'Why your credit score matters and how to improve it',
      pages: '38 pages',
      category: 'Credit',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'ITR Filing Advantages',
      description: 'Complete guide to Income Tax Returns and benefits',
      pages: '52 pages',
      category: 'Tax Planning',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Investment Basics',
      description: 'Start your investment journey with confidence',
      pages: '60 pages',
      category: 'Investing',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const templates = [
    {
      title: 'Budget Planner',
      description: 'Track expenses and manage your monthly budget',
      type: 'Excel Template',
      icon: Calculator,
      color: 'from-indigo-500 to-blue-500'
    },
    {
      title: 'Salary Planner',
      description: 'Optimize your salary breakdown and tax planning',
      type: 'Excel Template',
      icon: FileText,
      color: 'from-green-500 to-teal-500'
    },
    {
      title: 'Debt Payoff Calculator',
      description: 'Plan your debt repayment strategy effectively',
      type: 'Excel Template',
      icon: CreditCard,
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'Investment Tracker',
      description: 'Monitor all your investments in one place',
      type: 'Excel Template',
      icon: TrendingUp,
      color: 'from-purple-500 to-indigo-500'
    }
  ];

  const newsArticles = [
    {
      title: 'RBI Announces New Interest Rate Policy',
      excerpt: 'Reserve Bank of India maintains repo rate at 6.5%, impacting home loans and fixed deposits...',
      date: 'Dec 27, 2025',
      category: 'Policy',
      readTime: '5 min read',
      source: 'Economic Times'
    },
    {
      title: 'New Tax Regime vs Old: What Changed in 2025',
      excerpt: 'Finance Ministry releases detailed comparison showing benefits for different income brackets...',
      date: 'Dec 26, 2025',
      category: 'Taxation',
      readTime: '7 min read',
      source: 'Mint'
    },
    {
      title: 'Gold Prices Hit All-Time High',
      excerpt: 'Gold crosses ₹72,000 per 10 grams as global uncertainty drives safe-haven demand...',
      date: 'Dec 25, 2025',
      category: 'Markets',
      readTime: '4 min read',
      source: 'MoneyControl'
    },
    {
      title: 'Digital Rupee Pilot Expands to 12 Cities',
      excerpt: 'CBDC adoption grows as more banks join the digital currency initiative...',
      date: 'Dec 24, 2025',
      category: 'FinTech',
      readTime: '6 min read',
      source: 'Business Standard'
    },
    {
      title: 'Stock Market Reaches New Peak',
      excerpt: 'Sensex crosses 85,000 mark driven by strong FII inflows and positive GDP data...',
      date: 'Dec 23, 2025',
      category: 'Markets',
      readTime: '5 min read',
      source: 'NDTV Profit'
    },
    {
      title: 'NPS Contribution Limit Increased',
      excerpt: 'Government raises NPS contribution ceiling to ₹3 lakhs for additional tax benefits...',
      date: 'Dec 22, 2025',
      category: 'Retirement',
      readTime: '4 min read',
      source: 'Financial Express'
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrolled / maxScroll) * 100;
      setScrollProgress(progress);

      if (currentPage === 'main') {
        const sections = ['home', 'resources', 'about'];
        const sectionElements = sections.map(s => document.getElementById(s));
        const currentSection = sectionElements.find(el => {
          if (!el) return false;
          const rect = el.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        });

        if (currentSection) {
          setActiveSection(currentSection.id);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  const scrollToSection = (sectionId) => {
    if (sectionId === 'trends') {
      setCurrentPage('trends');
      setActiveSection('trends');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (sectionId === 'community') {
      setCurrentPage('community');
      setActiveSection('community');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentPage('main');
      setActiveSection(sectionId);
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const handleAuth = () => {
    if (authUsername.trim()) {
      setUser({ username: authUsername, avatar: '👤', karma: authMode === 'login' ? 127 : 0 });
      setShowAuthModal(false);
      setAuthUsername('');
      setAuthPassword('');
    }
  };

  const handleVote = (postId, voteType) => {
    if (!user) {
      setShowAuthModal(true);
      setAuthMode('login');
      return;
    }
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const currentVote = post.voted;
        let upvotes = post.upvotes;
        let downvotes = post.downvotes;
        let newVote = null;

        if (voteType === 'up') {
          if (currentVote === 'up') {
            upvotes--;
          } else {
            upvotes++;
            newVote = 'up';
            if (currentVote === 'down') downvotes--;
          }
        } else {
          if (currentVote === 'down') {
            downvotes--;
          } else {
            downvotes++;
            newVote = 'down';
            if (currentVote === 'up') upvotes--;
          }
        }

        return { ...post, upvotes, downvotes, voted: newVote };
      }
      return post;
    }));
  };

  const AuthModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 max-w-md w-full p-8 animate-slideUp">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {authMode === 'login' ? 'Welcome Back' : 'Join Our Community'}
          </h2>
          <button onClick={() => setShowAuthModal(false)} className="text-gray-400 hover:text-white transition-colors">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Username</label>
            <input
              type="text"
              value={authUsername}
              onChange={(e) => setAuthUsername(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
            <input
              type="password"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="Enter your password"
            />
          </div>
        </div>

        <button
          onClick={handleAuth}
          className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-[1.02]"
        >
          {authMode === 'login' ? 'Login' : 'Sign Up'}
        </button>

        <div className="mt-4 text-center">
          <button
            onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            {authMode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );

  const CommunityPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white pt-20 pb-32 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => scrollToSection('home')}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-all duration-300 hover:gap-3"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
            Back to Home
          </button>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700 transition-all duration-300 hover:border-blue-500">
                <span className="text-2xl">{user.avatar}</span>
                <div>
                  <div className="font-semibold text-white">{user.username}</div>
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    {user.karma} karma
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setUser(null)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-all duration-300"
                title="Logout"
              >
                <LogOut className="w-5 h-5 text-gray-400 hover:text-red-400 transition-colors" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setShowAuthModal(true); setAuthMode('login'); }}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105"
            >
              Login / Sign Up
            </button>
          )}
        </div>

        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Community Forum
          </h1>
          <p className="text-xl text-gray-300">
            Discuss financial topics, share experiences, and learn from others
          </p>
        </div>

        {user && (
          <div className="mb-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-6 animate-slideDown">
            <div className="flex items-start gap-4">
              <span className="text-3xl">{user.avatar}</span>
              <div className="flex-1">
                <textarea
                  placeholder="Share your financial question or insight..."
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-all duration-300 resize-none"
                  rows="3"
                />
                <div className="flex items-center justify-between mt-3">
                  <div className="flex gap-2">
                    {['Investing', 'Taxation', 'Credit', 'Savings'].map(cat => (
                      <button key={cat} className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-full text-sm transition-all duration-300 hover:scale-105">
                        {cat}
                      </button>
                    ))}
                  </div>
                  <button className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {posts.map((post, idx) => (
            <div key={post.id} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-all duration-500 ease-out animate-fadeIn" style={{animationDelay: `${idx * 100}ms`}}>
              <div className="p-6">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => handleVote(post.id, 'up')}
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        post.voted === 'up' 
                          ? 'bg-green-500/20 text-green-400 scale-110' 
                          : 'hover:bg-slate-700 text-gray-400 hover:text-green-400 hover:scale-110'
                      }`}
                    >
                      <ThumbsUp className="w-5 h-5" />
                    </button>
                    <span className={`font-bold text-lg transition-colors duration-300 ${
                      post.voted === 'up' ? 'text-green-400' : post.voted === 'down' ? 'text-red-400' : 'text-gray-300'
                    }`}>
                      {post.upvotes - post.downvotes}
                    </span>
                    <button
                      onClick={() => handleVote(post.id, 'down')}
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        post.voted === 'down' 
                          ? 'bg-red-500/20 text-red-400 scale-110' 
                          : 'hover:bg-slate-700 text-gray-400 hover:text-red-400 hover:scale-110'
                      }`}
                    >
                      <ThumbsDown className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xl">{post.avatar}</span>
                      <span className="font-semibold text-white">{post.author}</span>
                      <span className="text-gray-500 text-sm">•</span>
                      <span className="text-gray-500 text-sm">{post.time}</span>
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold">
                        {post.category}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold mb-2 text-white hover:text-blue-400 transition-colors duration-300 cursor-pointer">
                      {post.title}
                    </h3>
                    <p className="text-gray-400 mb-4 leading-relaxed">
                      {post.content}
                    </p>

                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setShowComments(showComments === post.id ? null : post.id)}
                        className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-all duration-300 hover:gap-3"
                      >
                        <MessageSquare className="w-5 h-5" />
                        <span className="font-semibold">{post.comments} comments</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-all duration-300 hover:gap-3">
                        <ExternalLink className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>

                {showComments === post.id && (
                  <div className="mt-6 pt-6 border-t border-slate-700 animate-slideDown">
                    {user && (
                      <div className="flex gap-3 mb-6">
                        <span className="text-xl">{user.avatar}</span>
                        <div className="flex-1">
                          <textarea
                            placeholder="Write a comment..."
                            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-all duration-300 resize-none"
                            rows="2"
                          />
                          <button className="mt-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                            <Send className="w-4 h-4" />
                            Comment
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="space-y-4">
                      {[1, 2].map(i => (
                        <div key={i} className="flex gap-3 pl-6 border-l-2 border-slate-700">
                          <span className="text-lg">👤</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-white">User{i}</span>
                              <span className="text-gray-500 text-sm">• 1 hour ago</span>
                            </div>
                            <p className="text-gray-400">
                              {i === 1 ? 'SIP is generally safer during volatile markets. Dollar cost averaging helps!' : 'I would suggest starting with 50% lump sum and rest in SIP over 6 months.'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const TrendsPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white pt-20 pb-32 px-4">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => scrollToSection('home')}
          className="mb-8 flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-all duration-300 hover:gap-3"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
          Back to Home
        </button>

        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
            Financial Trends & News
          </h1>
          <p className="text-xl text-gray-300">
            Stay updated with the latest developments in Indian finance and markets
          </p>
        </div>

        <div className="grid gap-6">
          {newsArticles.map((article, i) => (
            <div key={i} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 hover:border-blue-500 transition-all duration-500 ease-out p-6 hover:transform hover:scale-[1.01] animate-fadeIn" style={{animationDelay: `${i * 100}ms`}}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold">
                      {article.category}
                    </span>
                    <span className="text-gray-500 text-sm">{article.readTime}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-white hover:text-blue-400 transition-colors duration-300">
                    {article.title}
                  </h3>
                  <p className="text-gray-400 mb-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{article.date}</span>
                      <span>•</span>
                      <span>{article.source}</span>
                    </div>
                    <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold transition-all duration-300 hover:gap-3">
                      Read More <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105">
            Load More Articles
          </button>
        </div>
      </div>
    </div>
  );

  if (currentPage === 'trends') {
    return (
      <>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.6s ease-out forwards;
            opacity: 0;
          }
          .animate-slideUp {
            animation: slideUp 0.4s ease-out forwards;
          }
          .animate-slideDown {
            animation: slideDown 0.4s ease-out forwards;
          }
        `}</style>
        <div className="fixed top-0 left-0 w-full h-1 bg-slate-800 z-50">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 transition-all duration-300 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
        <TrendsPage />
        <nav className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-full px-6 py-4 shadow-2xl shadow-blue-500/20">
            <div className="flex gap-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`relative group px-4 py-3 rounded-full transition-all duration-500 ease-out ${
                      isActive 
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-110' 
                        : 'text-gray-400 hover:text-white hover:bg-slate-800 hover:scale-105'
                    }`}
                    title={item.label}
                  >
                    <Icon className="w-6 h-6" />
                    {isActive && (
                      <span className="ml-2 font-semibold hidden md:inline-block">
                        {item.label}
                      </span>
                    )}
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-slate-900 px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none md:hidden">
                      {item.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      </>
    );
  }

  if (currentPage === 'community') {
    return (
      <>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.6s ease-out forwards;
            opacity: 0;
          }
          .animate-slideUp {
            animation: slideUp 0.4s ease-out forwards;
          }
          .animate-slideDown {
            animation: slideDown 0.4s ease-out forwards;
          }
        `}</style>
        <div className="fixed top-0 left-0 w-full h-1 bg-slate-800 z-50">
          <div 
            className="h-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 transition-all duration-300 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
        {showAuthModal && <AuthModal />}
        <CommunityPage />
        <nav className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-full px-6 py-4 shadow-2xl shadow-green-500/20">
            <div className="flex gap-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`relative group px-4 py-3 rounded-full transition-all duration-500 ease-out ${
                      isActive 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg scale-110' 
                        : 'text-gray-400 hover:text-white hover:bg-slate-800 hover:scale-105'
                    }`}
                    title={item.label}
                  >
                    <Icon className="w-6 h-6" />
                    {isActive && (
                      <span className="ml-2 font-semibold hidden md:inline-block">
                        {item.label}
                      </span>
                    )}
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-slate-900 px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none md:hidden">
                      {item.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      </>
    );
  }

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="fixed top-0 left-0 w-full h-1 bg-slate-800 z-50">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 transition-all duration-300 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        <section id="home" className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-5xl mx-auto">
            <div className="mb-6 inline-block animate-fadeIn">
              <div className="px-6 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-full text-blue-400 font-semibold">
                Financial Literacy Hub
              </div>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent leading-tight animate-fadeIn" style={{animationDelay: '100ms'}}>
              Master Your Money
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto animate-fadeIn" style={{animationDelay: '200ms'}}>
              Free resources, expert insights, and practical tools to help you make informed financial decisions
            </p>
            <div className="flex flex-wrap gap-4 justify-center animate-fadeIn" style={{animationDelay: '300ms'}}>
              <button 
                onClick={() => scrollToSection('resources')}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-500 ease-out transform hover:scale-110 flex items-center gap-2"
              >
                Explore Resources <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => scrollToSection('trends')}
                className="px-8 py-4 bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-full font-semibold hover:border-blue-500 transition-all duration-500 ease-out transform hover:scale-110"
              >
                Latest Trends
              </button>
            </div>
          </div>
        </section>

        <section id="resources" className="min-h-screen py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Free Resources
              </h2>
              <p className="text-xl text-gray-400">
                Download comprehensive guides and practical templates
              </p>
            </div>

            <div className="mb-20">
              <div className="flex items-center gap-3 mb-8">
                <BookOpen className="w-8 h-8 text-blue-400" />
                <h3 className="text-3xl font-bold text-white">E-Books</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {ebooks.map((ebook, i) => (
                  <div key={i} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 hover:border-blue-500 transition-all duration-500 ease-out p-8 hover:transform hover:scale-[1.03] group">
                    <div className={`inline-block px-3 py-1 bg-gradient-to-r ${ebook.color} bg-opacity-20 rounded-full text-sm font-semibold mb-4 transition-all duration-500 group-hover:scale-110`}>
                      {ebook.category}
                    </div>
                    <h4 className="text-2xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors duration-300">
                      {ebook.title}
                    </h4>
                    <p className="text-gray-400 mb-4 leading-relaxed">
                      {ebook.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{ebook.pages}</span>
                      <button className={`flex items-center gap-2 px-6 py-2 bg-gradient-to-r ${ebook.color} rounded-full font-semibold hover:shadow-lg transition-all duration-500 ease-out transform hover:scale-110`}>
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-8">
                <Calculator className="w-8 h-8 text-cyan-400" />
                <h3 className="text-3xl font-bold text-white">Templates & Tools</h3>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {templates.map((template, i) => {
                  const Icon = template.icon;
                  return (
                    <div key={i} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 hover:border-cyan-500 transition-all duration-500 ease-out p-6 hover:transform hover:scale-110 group text-center">
                      <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${template.color} rounded-2xl mb-4 group-hover:scale-125 transition-transform duration-500 ease-out`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-xl font-bold mb-2 text-white group-hover:text-cyan-400 transition-colors duration-300">
                        {template.title}
                      </h4>
                      <p className="text-gray-400 text-sm mb-4">
                        {template.description}
                      </p>
                      <span className="text-xs text-gray-500">{template.type}</span>
                      <button className="mt-4 w-full py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105">
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="min-h-screen flex items-center px-4 py-20 bg-slate-800/30">
          <div className="max-w-6xl mx-auto w-full">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                About Us
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                  We're on a mission to democratize financial education in India. Our platform provides free, accessible resources to help you understand credit, investments, taxes, and personal finance.
                </p>
                <p className="text-lg text-gray-400 leading-relaxed">
                  Founded by financial experts and educators, we've helped over 500,000 Indians make smarter financial decisions through our comprehensive guides and tools.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Downloads', value: '1M+' },
                  { label: 'Users', value: '500K+' },
                  { label: 'Resources', value: '150+' },
                  { label: 'Rating', value: '4.8★' }
                ].map((stat, i) => (
                  <div key={i} className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-6 rounded-2xl border border-blue-500/30 text-center backdrop-blur-sm hover:scale-110 transition-all duration-500 ease-out">
                    <div className="text-4xl font-bold text-blue-400 mb-2">{stat.value}</div>
                    <div className="text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <nav className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-full px-6 py-4 shadow-2xl shadow-blue-500/20">
            <div className="flex gap-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`relative group px-4 py-3 rounded-full transition-all duration-500 ease-out ${
                      isActive 
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-110' 
                        : 'text-gray-400 hover:text-white hover:bg-slate-800 hover:scale-105'
                    }`}
                    title={item.label}
                  >
                    <Icon className="w-6 h-6" />
                    {isActive && (
                      <span className="ml-2 font-semibold hidden md:inline-block">
                        {item.label}
                      </span>
                    )}
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-slate-900 px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none md:hidden">
                      {item.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        <div className="h-32" />
      </div>
    </>
  );
};

export default FinancialWebsite;