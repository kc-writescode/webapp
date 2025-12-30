/**
 * MarketDashboard Component
 * Main market data page with watchlist and top cryptos
 */

import { useState, useEffect } from 'react';
import { TrendingUp, Search, RefreshCw, Star, Plus } from 'lucide-react';
import { useMarket } from '@contexts/MarketContext';
import PageLayout from '@components/layout/PageLayout';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import Modal from '@components/common/Modal';
import AssetCard from './AssetCard';
import { searchSymbols } from '@services/alphaVantageService';
import { searchCryptos } from '@services/coingeckoService';

const MarketDashboard = () => {
  const {
    watchlistWithPrices,
    loading,
    error,
    refreshWatchlist,
    fetchTopCryptos,
    addToWatchlist,
  } = useMarket();

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchType, setSearchType] = useState('stock'); // 'stock' or 'crypto'
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [topCryptos, setTopCryptos] = useState([]);
  const [loadingTop, setLoadingTop] = useState(false);

  // Popular Indian stocks
  const popularIndianStocks = [
    { symbol: 'RELIANCE.NS', name: 'Reliance Industries', type: 'stock' },
    { symbol: 'TCS.NS', name: 'Tata Consultancy Services', type: 'stock' },
    { symbol: 'INFY.NS', name: 'Infosys', type: 'stock' },
    { symbol: 'HDFCBANK.NS', name: 'HDFC Bank', type: 'stock' },
    { symbol: 'ICICIBANK.NS', name: 'ICICI Bank', type: 'stock' },
    { symbol: 'HINDUNILVR.NS', name: 'Hindustan Unilever', type: 'stock' },
    { symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel', type: 'stock' },
    { symbol: 'ITC.NS', name: 'ITC Limited', type: 'stock' },
    { symbol: 'SBIN.NS', name: 'State Bank of India', type: 'stock' },
    { symbol: 'BAJFINANCE.NS', name: 'Bajaj Finance', type: 'stock' },
    { symbol: 'KOTAKBANK.NS', name: 'Kotak Mahindra Bank', type: 'stock' },
    { symbol: 'LT.NS', name: 'Larsen & Toubro', type: 'stock' },
  ];

  // Load top cryptos on mount
  useEffect(() => {
    loadTopCryptos();
  }, []);

  const loadTopCryptos = async () => {
    setLoadingTop(true);
    const result = await fetchTopCryptos(10);
    if (result.success) {
      setTopCryptos(result.data);
    }
    setLoadingTop(false);
  };

  const handleRefresh = async () => {
    await refreshWatchlist();
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearching(true);
    setSearchResults([]);

    try {
      if (searchType === 'stock') {
        const result = await searchSymbols(searchQuery);
        setSearchResults(
          result.results.map((r) => ({
            symbol: r.symbol,
            name: r.name,
            type: 'stock',
            region: r.region,
            currency: r.currency,
          }))
        );
      } else {
        const result = await searchCryptos(searchQuery);
        setSearchResults(
          result.results.map((r) => ({
            symbol: r.symbol,
            name: r.name,
            type: 'crypto',
            id: r.id,
            image: r.thumb,
          }))
        );
      }
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleAddToWatchlist = (asset) => {
    const result = addToWatchlist({
      symbol: asset.symbol,
      name: asset.name,
      type: asset.type,
      coinId: asset.id,
    });

    if (result.success) {
      setShowAddModal(false);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Markets Dashboard
          </h1>
          <p className="text-slate-400 text-lg">
            Track stocks and cryptocurrencies in real-time
          </p>
        </div>

        {/* My Watchlist */}
        <Card
          title="My Watchlist"
          subtitle={`${watchlistWithPrices.length} / 10 assets`}
          icon={Star}
          className="mb-8"
          action={
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                icon={RefreshCw}
                onClick={handleRefresh}
                disabled={loading || watchlistWithPrices.length === 0}
              >
                Refresh
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={() => setShowAddModal(true)}
                disabled={watchlistWithPrices.length >= 10}
              >
                Add Asset
              </Button>
            </div>
          }
        >
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {loading && watchlistWithPrices.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-48 bg-slate-800/50 rounded-xl border border-slate-700 animate-pulse"
                />
              ))}
            </div>
          ) : watchlistWithPrices.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-slate-400 text-lg mb-2">Your watchlist is empty</p>
              <p className="text-slate-500 text-sm mb-4">
                Add stocks or cryptocurrencies to track their prices
              </p>
              <Button
                variant="primary"
                icon={Plus}
                onClick={() => setShowAddModal(true)}
              >
                Add Your First Asset
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {watchlistWithPrices.map((asset) => (
                <AssetCard
                  key={`${asset.type}-${asset.symbol}`}
                  asset={asset}
                  type={asset.type}
                />
              ))}
            </div>
          )}
        </Card>

        {/* Top Cryptocurrencies */}
        <Card title="Top Cryptocurrencies" subtitle="By market cap" icon={TrendingUp}>
          {loadingTop ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-48 bg-slate-800/50 rounded-xl border border-slate-700 animate-pulse"
                />
              ))}
            </div>
          ) : topCryptos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🪙</div>
              <p className="text-slate-400 text-lg">No crypto data available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topCryptos.map((crypto) => (
                <AssetCard
                  key={crypto.id}
                  asset={{
                    symbol: crypto.symbol,
                    name: crypto.name,
                    id: crypto.id,
                    coinId: crypto.id,
                    image: crypto.image,
                    price: crypto.currentPrice,
                    currentPrice: crypto.currentPrice,
                    change24h: crypto.priceChangePercentage24h,
                    marketCap: crypto.marketCap,
                    volume24h: crypto.volume24h,
                  }}
                  type="crypto"
                  showChart={false}
                />
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Add Asset Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSearchQuery('');
          setSearchResults([]);
        }}
        title="Add Asset to Watchlist"
        size="lg"
      >
        <div className="space-y-4">
          {/* Type Selector */}
          <div className="flex gap-2">
            <Button
              variant={searchType === 'crypto' ? 'primary' : 'outline'}
              onClick={() => {
                setSearchType('crypto');
                setSearchResults([]);
              }}
              fullWidth
            >
              Cryptocurrency
            </Button>
            <Button
              variant={searchType === 'stock' ? 'primary' : 'outline'}
              onClick={() => {
                setSearchType('stock');
                setSearchResults([]);
              }}
              fullWidth
            >
              Stock
            </Button>
          </div>

          {/* Popular Indian Stocks - Show when stock tab is selected and no search */}
          {searchType === 'stock' && !searchQuery && searchResults.length === 0 && (
            <div className="space-y-3">
              <p className="text-sm text-slate-400 font-medium">Popular Indian Stocks (NSE)</p>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {popularIndianStocks.map((stock, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-white">{stock.symbol}</p>
                      <p className="text-sm text-slate-400">{stock.name}</p>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={Plus}
                      onClick={() => handleAddToWatchlist(stock)}
                    >
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search */}
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder={
                searchType === 'stock'
                  ? 'Search stocks (e.g., RELIANCE.NS, TCS.NS)'
                  : 'Search cryptos (e.g., Bitcoin, Ethereum)'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              icon={Search}
            />
            <Button
              variant="primary"
              onClick={handleSearch}
              disabled={!searchQuery.trim() || searching}
            >
              {searching ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {result.image && (
                      <img
                        src={result.image}
                        alt={result.name}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-white">{result.symbol}</p>
                      <p className="text-sm text-slate-400">{result.name}</p>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Plus}
                    onClick={() => handleAddToWatchlist(result)}
                  >
                    Add
                  </Button>
                </div>
              ))}
            </div>
          )}

          {searching && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-slate-400 mt-2">Searching...</p>
            </div>
          )}
        </div>
      </Modal>
    </PageLayout>
  );
};

export default MarketDashboard;
