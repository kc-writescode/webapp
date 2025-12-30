/**
 * AssetCard Component
 * Displays stock or crypto asset with price and change
 */

import { useState } from 'react';
import { TrendingUp, TrendingDown, Star, StarOff, Activity } from 'lucide-react';
import { useMarket } from '@contexts/MarketContext';
import { formatCurrency, formatCompactNumber, formatPercentageChange } from '@utils/formatters';
import Button from '@components/common/Button';
import Modal from '@components/common/Modal';
import PriceChart from './PriceChart';

const AssetCard = ({ asset, type, showChart = true }) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useMarket();
  const [showChartModal, setShowChartModal] = useState(false);

  const inWatchlist = isInWatchlist(asset.symbol, type);

  const handleToggleWatchlist = () => {
    if (inWatchlist) {
      removeFromWatchlist(asset.symbol, type);
    } else {
      addToWatchlist({
        symbol: asset.symbol,
        name: asset.name || asset.symbol,
        type,
        coinId: type === 'crypto' ? asset.id || asset.coinId : undefined,
      });
    }
  };

  // Determine price change
  const priceChange = type === 'stock' ? asset.changePercent : asset.change24h;
  const changeInfo = formatPercentageChange(priceChange);

  return (
    <>
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 hover:bg-slate-800/70 transition-all duration-200 hover:border-slate-600">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {asset.image && (
              <img src={asset.image} alt={asset.name} className="w-10 h-10 rounded-full" />
            )}
            <div>
              <h3 className="text-lg font-bold text-white">{asset.symbol}</h3>
              {asset.name && (
                <p className="text-sm text-slate-400 line-clamp-1">{asset.name}</p>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleWatchlist}
            icon={inWatchlist ? Star : StarOff}
            className={inWatchlist ? 'text-yellow-400' : 'text-slate-400'}
            aria-label={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
          />
        </div>

        {/* Price Info */}
        <div className="space-y-2 mb-3">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white">
              {formatCurrency(asset.price || asset.currentPrice, 'USD', asset.price < 1)}
            </span>
            <div className={`flex items-center gap-1 text-sm font-semibold ${changeInfo.color}`}>
              {changeInfo.isPositive ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )}
              <span>{changeInfo.text}</span>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
            {type === 'stock' && asset.volume && (
              <div>
                <span className="block">Volume</span>
                <span className="text-white font-medium">
                  {formatCompactNumber(asset.volume)}
                </span>
              </div>
            )}
            {type === 'stock' && asset.high && asset.low && (
              <div>
                <span className="block">24h Range</span>
                <span className="text-white font-medium">
                  {formatCurrency(asset.low, 'USD', false)} -{' '}
                  {formatCurrency(asset.high, 'USD', false)}
                </span>
              </div>
            )}
            {type === 'crypto' && asset.marketCap && (
              <div>
                <span className="block">Market Cap</span>
                <span className="text-white font-medium">
                  {formatCompactNumber(asset.marketCap)}
                </span>
              </div>
            )}
            {type === 'crypto' && asset.volume24h && (
              <div>
                <span className="block">24h Volume</span>
                <span className="text-white font-medium">
                  {formatCompactNumber(asset.volume24h)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Chart Button */}
        {showChart && (
          <Button
            variant="outline"
            size="sm"
            fullWidth
            icon={Activity}
            onClick={() => setShowChartModal(true)}
          >
            View Chart
          </Button>
        )}

        {/* Cache indicator */}
        {asset.fromCache && (
          <div className="mt-2 text-xs text-slate-500 italic">Cached data</div>
        )}
      </div>

      {/* Chart Modal */}
      {showChart && (
        <Modal
          isOpen={showChartModal}
          onClose={() => setShowChartModal(false)}
          title={`${asset.symbol} Price Chart`}
          size="xl"
        >
          <PriceChart
            symbol={asset.symbol}
            name={asset.name}
            type={type}
            coinId={type === 'crypto' ? asset.id || asset.coinId : undefined}
          />
        </Modal>
      )}
    </>
  );
};

export default AssetCard;
