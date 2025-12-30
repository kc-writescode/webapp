/**
 * NewsPage Component
 * Main financial news feed page
 */

import { useState, useEffect, useCallback } from 'react';
import { Newspaper, RefreshCw, AlertCircle } from 'lucide-react';
import PageLayout from '@components/layout/PageLayout';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import NewsCard from './NewsCard';
import NewsFilters from './NewsFilters';
import NewsSkeleton from './NewsSkeleton';
import { getTopHeadlines, getFinancialNews } from '@services/newsService';

const NewsPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [fromCache, setFromCache] = useState(false);

  // Load news based on category
  const loadNews = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let result;
      if (category === 'all') {
        result = await getFinancialNews();
      } else {
        result = await getTopHeadlines(category, 30);
      }

      setArticles(result.articles);
      setFromCache(result.fromCache);
    } catch (err) {
      console.error('Error loading news:', err);
      setError(err.message || 'Failed to load news. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [category]);

  // Load news on mount and category change
  useEffect(() => {
    loadNews();
  }, [loadNews]);

  // Filter articles by search query
  const filteredArticles = searchQuery
    ? articles.filter(
        (article) =>
          article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : articles;

  const handleRefresh = () => {
    loadNews();
  };

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
            Financial News
          </h1>
          <p className="text-slate-400 text-lg">
            Stay updated with the latest market news and insights
          </p>
        </div>

        {/* Cache Indicator & Refresh */}
        <div className="flex items-center justify-between mb-6">
          {fromCache && (
            <div className="flex items-center gap-2 px-3 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <span className="text-xs text-yellow-400">📦 Showing cached news</span>
            </div>
          )}
          <div className={!fromCache ? 'w-full flex justify-end' : ''}>
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={handleRefresh}
              disabled={loading}
              className={loading ? 'animate-spin' : ''}
            >
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <NewsFilters
            selectedCategory={category}
            onCategoryChange={setCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            loading={loading}
          />
        </Card>

        {/* Results Count */}
        {!loading && filteredArticles.length > 0 && (searchQuery || category !== 'all') && (
          <div className="mb-4 text-sm text-slate-400">
            Showing <span className="font-bold text-blue-400">{filteredArticles.length}</span> of{' '}
            <span className="font-bold">{articles.length}</span> articles
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="mb-8">
            <div className="flex items-start gap-4 p-4">
              <div className="p-3 bg-red-500/20 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-400 mb-1">
                  Error Loading News
                </h3>
                <p className="text-slate-400 mb-4">{error}</p>
                <Button variant="primary" size="sm" onClick={handleRefresh}>
                  Try Again
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <NewsSkeleton count={6} />
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredArticles.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📰</div>
            <p className="text-slate-400 text-lg mb-2">
              {searchQuery ? 'No articles match your search' : 'No news articles found'}
            </p>
            <p className="text-slate-500 text-sm mb-6">
              {searchQuery
                ? 'Try adjusting your search or filters'
                : 'Check back later for the latest financial news'}
            </p>
            {searchQuery && (
              <Button
                variant="outline"
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </Button>
            )}
          </div>
        )}

        {/* Articles Grid */}
        {!loading && !error && filteredArticles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}

        {/* Info Banner */}
        {!loading && !error && articles.length > 0 && (
          <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-slate-300 text-center">
              <strong>Note:</strong> News is cached for 30 minutes to optimize API usage.
              Click refresh to check for new articles.
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default NewsPage;
