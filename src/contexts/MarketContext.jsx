/**
 * MarketContext
 * Manages market data state (stocks, crypto, watchlist)
 */

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { getItem, setItem, STORAGE_KEYS } from '@utils/localStorage';
import { getStockQuote, getBatchQuotes } from '@services/alphaVantageService';
import { getCryptoPrice, getBatchCryptoPrices, getTopCryptos } from '@services/coingeckoService';

const MarketContext = createContext();

export const useMarket = () => {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
};

export const MarketProvider = ({ children }) => {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [marketData, setMarketData] = useState({
    stocks: {},
    cryptos: {},
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load watchlist from localStorage
  useEffect(() => {
    if (user) {
      const savedWatchlist = getItem(STORAGE_KEYS.WATCHLIST) || [];
      setWatchlist(savedWatchlist);
    }
  }, [user]);

  // Save watchlist to localStorage
  const saveWatchlist = useCallback((newWatchlist) => {
    setWatchlist(newWatchlist);
    setItem(STORAGE_KEYS.WATCHLIST, newWatchlist);
  }, []);

  /**
   * Add asset to watchlist
   */
  const addToWatchlist = useCallback(
    (asset) => {
      // Check if already in watchlist
      const exists = watchlist.some(
        (item) => item.symbol === asset.symbol && item.type === asset.type
      );

      if (exists) {
        return { success: false, error: 'Asset already in watchlist' };
      }

      // Limit watchlist to 10 items
      if (watchlist.length >= 10) {
        return { success: false, error: 'Watchlist is full (max 10 items)' };
      }

      const newWatchlist = [
        ...watchlist,
        {
          ...asset,
          addedAt: Date.now(),
        },
      ];

      saveWatchlist(newWatchlist);
      return { success: true };
    },
    [watchlist, saveWatchlist]
  );

  /**
   * Remove asset from watchlist
   */
  const removeFromWatchlist = useCallback(
    (symbol, type) => {
      const newWatchlist = watchlist.filter(
        (item) => !(item.symbol === symbol && item.type === type)
      );
      saveWatchlist(newWatchlist);
      return { success: true };
    },
    [watchlist, saveWatchlist]
  );

  /**
   * Clear entire watchlist
   */
  const clearWatchlist = useCallback(() => {
    saveWatchlist([]);
    return { success: true };
  }, [saveWatchlist]);

  /**
   * Fetch stock data
   */
  const fetchStock = useCallback(async (symbol) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getStockQuote(symbol);
      setMarketData((prev) => ({
        ...prev,
        stocks: {
          ...prev.stocks,
          [symbol]: data,
        },
      }));
      return { success: true, data };
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch stock data';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch crypto data
   */
  const fetchCrypto = useCallback(async (coinId) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getCryptoPrice(coinId);
      setMarketData((prev) => ({
        ...prev,
        cryptos: {
          ...prev.cryptos,
          [coinId]: data,
        },
      }));
      return { success: true, data };
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch crypto data';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refresh watchlist data
   */
  const refreshWatchlist = useCallback(async () => {
    if (watchlist.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      // Separate stocks and cryptos
      const stocks = watchlist.filter((item) => item.type === 'stock');
      const cryptos = watchlist.filter((item) => item.type === 'crypto');

      // Fetch stock data
      if (stocks.length > 0) {
        const stockSymbols = stocks.map((s) => s.symbol);
        const stockData = await getBatchQuotes(stockSymbols);

        setMarketData((prev) => ({
          ...prev,
          stocks: stockData.reduce(
            (acc, stock) => ({
              ...acc,
              [stock.symbol]: stock,
            }),
            prev.stocks
          ),
        }));
      }

      // Fetch crypto data
      if (cryptos.length > 0) {
        const coinIds = cryptos.map((c) => c.coinId || c.symbol.toLowerCase());
        const cryptoData = await getBatchCryptoPrices(coinIds);

        setMarketData((prev) => ({
          ...prev,
          cryptos: cryptoData.prices.reduce(
            (acc, crypto) => ({
              ...acc,
              [crypto.coinId]: crypto,
            }),
            prev.cryptos
          ),
        }));
      }

      return { success: true };
    } catch (err) {
      const errorMsg = err.message || 'Failed to refresh watchlist';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [watchlist]);

  /**
   * Get top cryptocurrencies
   */
  const fetchTopCryptos = useCallback(async (limit = 10) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getTopCryptos(limit, 1);
      return { success: true, data: result.coins };
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch top cryptos';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Check if asset is in watchlist
   */
  const isInWatchlist = useCallback(
    (symbol, type) => {
      return watchlist.some((item) => item.symbol === symbol && item.type === type);
    },
    [watchlist]
  );

  /**
   * Get watchlist data with current prices
   */
  const watchlistWithPrices = useMemo(() => {
    return watchlist.map((item) => {
      if (item.type === 'stock') {
        const stockData = marketData.stocks[item.symbol];
        return {
          ...item,
          ...stockData,
        };
      } else {
        const cryptoData = marketData.cryptos[item.coinId || item.symbol.toLowerCase()];
        return {
          ...item,
          ...cryptoData,
        };
      }
    });
  }, [watchlist, marketData]);

  const value = {
    watchlist,
    watchlistWithPrices,
    marketData,
    loading,
    error,
    addToWatchlist,
    removeFromWatchlist,
    clearWatchlist,
    fetchStock,
    fetchCrypto,
    refreshWatchlist,
    fetchTopCryptos,
    isInWatchlist,
  };

  return <MarketContext.Provider value={value}>{children}</MarketContext.Provider>;
};

export default MarketContext;
