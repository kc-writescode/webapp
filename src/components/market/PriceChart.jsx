/**
 * PriceChart Component
 * Interactive price chart for stocks and cryptos using Recharts
 * Performance optimized with lazy loading
 */

import { useState, useEffect, lazy, Suspense, useMemo } from 'react';
import { getIntradayData, getDailyData } from '@services/alphaVantageService';

// Lazy load Recharts components for better initial page load
const LazyLineChart = lazy(() =>
  import('recharts').then((module) => ({ default: module.LineChart }))
);
const LazyLine = lazy(() =>
  import('recharts').then((module) => ({ default: module.Line }))
);
const LazyAreaChart = lazy(() =>
  import('recharts').then((module) => ({ default: module.AreaChart }))
);
const LazyArea = lazy(() =>
  import('recharts').then((module) => ({ default: module.Area }))
);
const LazyXAxis = lazy(() =>
  import('recharts').then((module) => ({ default: module.XAxis }))
);
const LazyYAxis = lazy(() =>
  import('recharts').then((module) => ({ default: module.YAxis }))
);
const LazyCartesianGrid = lazy(() =>
  import('recharts').then((module) => ({ default: module.CartesianGrid }))
);
const LazyTooltip = lazy(() =>
  import('recharts').then((module) => ({ default: module.Tooltip }))
);
const LazyResponsiveContainer = lazy(() =>
  import('recharts').then((module) => ({ default: module.ResponsiveContainer }))
);
import { getCryptoChart } from '@services/coingeckoService';
import { formatCurrency, formatDate } from '@utils/formatters';
import Button from '@components/common/Button';

// Chart loading skeleton
const ChartSkeleton = () => (
  <div className="chart-skeleton h-[400px] w-full flex items-center justify-center">
    <div className="text-center">
      <div className="w-full h-64 skeleton mx-auto mb-3 rounded-lg" />
      <p className="text-slate-500 text-sm">Loading chart...</p>
    </div>
  </div>
);

const TIME_RANGES = {
  stock: [
    { label: '1D', value: '1D', interval: '5min' },
    { label: '5D', value: '5D', interval: '15min' },
    { label: '1M', value: '1M', days: 30 },
    { label: '3M', value: '3M', days: 90 },
    { label: '1Y', value: '1Y', days: 365 },
  ],
  crypto: [
    { label: '1D', value: '1', days: '1' },
    { label: '7D', value: '7', days: '7' },
    { label: '1M', value: '30', days: '30' },
    { label: '3M', value: '90', days: '90' },
    { label: '1Y', value: '365', days: '365' },
  ],
};

const PriceChart = ({ symbol, name, type, coinId }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState(type === 'stock' ? '1D' : '7');
  const [chartType, setChartType] = useState('area'); // 'area' or 'line'

  const ranges = type === 'stock' ? TIME_RANGES.stock : TIME_RANGES.crypto;

  useEffect(() => {
    fetchChartData();
  }, [timeRange, symbol, type, coinId]);

  const fetchChartData = async () => {
    setLoading(true);
    setError(null);

    try {
      if (type === 'stock') {
        const selectedRange = ranges.find((r) => r.value === timeRange);

        if (selectedRange.interval) {
          // Intraday data
          const result = await getIntradayData(symbol, selectedRange.interval);
          setChartData(
            result.data.map((d) => ({
              time: formatDate(d.date, 'HH:mm'),
              price: d.close,
              fullDate: d.date,
            }))
          );
        } else {
          // Daily data
          const result = await getDailyData(symbol, true);
          const limitedData = result.data.slice(-selectedRange.days);
          setChartData(
            limitedData.map((d) => ({
              time: formatDate(d.timestamp, 'MMM dd'),
              price: d.close,
              fullDate: d.timestamp,
            }))
          );
        }
      } else {
        // Crypto data
        const result = await getCryptoChart(coinId || symbol.toLowerCase(), timeRange);
        setChartData(
          result.data.map((d) => ({
            time:
              timeRange === '1'
                ? formatDate(d.date, 'HH:mm')
                : formatDate(d.date, 'MMM dd'),
            price: d.price,
            fullDate: d.date,
          }))
        );
      }
    } catch (err) {
      console.error('Error fetching chart data:', err);
      setError(err.message || 'Failed to load chart data');
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="text-slate-400 text-sm mb-1">
            {formatDate(data.fullDate, 'MMM dd, yyyy HH:mm')}
          </p>
          <p className="text-white font-bold text-lg">
            {formatCurrency(data.price, 'USD', data.price < 1)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate if price is up or down
  const priceUp =
    chartData.length >= 2 && chartData[chartData.length - 1].price >= chartData[0].price;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📉</div>
        <p className="text-red-400 text-lg">{error}</p>
        <Button variant="primary" onClick={fetchChartData} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📊</div>
        <p className="text-slate-400 text-lg">No chart data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Time Range Selector */}
        <div className="flex gap-2">
          {ranges.map((range) => (
            <Button
              key={range.value}
              variant={timeRange === range.value ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range.value)}
            >
              {range.label}
            </Button>
          ))}
        </div>

        {/* Chart Type Toggle */}
        <div className="flex gap-2">
          <Button
            variant={chartType === 'area' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setChartType('area')}
          >
            Area
          </Button>
          <Button
            variant={chartType === 'line' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setChartType('line')}
          >
            Line
          </Button>
        </div>
      </div>

      {/* Chart - Lazy loaded */}
      <Suspense fallback={<ChartSkeleton />}>
        <LazyResponsiveContainer width="100%" height={400}>
          {chartType === 'area' ? (
            <LazyAreaChart data={chartData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={priceUp ? '#10b981' : '#ef4444'}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={priceUp ? '#10b981' : '#ef4444'}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <LazyCartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <LazyXAxis
                dataKey="time"
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
              <LazyYAxis
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                domain={['auto', 'auto']}
                tickFormatter={(value) => formatCurrency(value, 'USD', false)}
              />
              <LazyTooltip content={<CustomTooltip />} />
              <LazyArea
                type="monotone"
                dataKey="price"
                stroke={priceUp ? '#10b981' : '#ef4444'}
                strokeWidth={2}
                fill="url(#colorPrice)"
              />
            </LazyAreaChart>
          ) : (
            <LazyLineChart data={chartData}>
              <LazyCartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <LazyXAxis
                dataKey="time"
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
              <LazyYAxis
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                domain={['auto', 'auto']}
                tickFormatter={(value) => formatCurrency(value, 'USD', false)}
              />
              <LazyTooltip content={<CustomTooltip />} />
              <LazyLine
                type="monotone"
                dataKey="price"
                stroke={priceUp ? '#10b981' : '#ef4444'}
                strokeWidth={2}
                dot={false}
              />
            </LazyLineChart>
          )}
        </LazyResponsiveContainer>
      </Suspense>

      {/* Chart Info */}
      <div className="text-center text-sm text-slate-400">
        {name && <span className="font-semibold text-white">{name}</span>}
        {' • '}
        <span>{chartData.length} data points</span>
      </div>
    </div>
  );
};

export default PriceChart;
