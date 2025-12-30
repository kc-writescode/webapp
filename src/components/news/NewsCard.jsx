/**
 * NewsCard Component
 * Individual news article card
 */

import { ExternalLink, Clock } from 'lucide-react';
import { formatRelativeTime } from '@utils/formatters';

const NewsCard = ({ article }) => {
  const handleClick = () => {
    window.open(article.url, '_blank', 'noopener,noreferrer');
  };

  // Truncate text helper
  const truncate = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  // Fallback gradient for missing images
  const gradients = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-orange-500 to-red-500',
    'from-green-500 to-teal-500',
  ];
  const gradientIndex = article.id.length % gradients.length;
  const fallbackGradient = gradients[gradientIndex];

  return (
    <div
      onClick={handleClick}
      className="group bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 hover:border-blue-500/50 transition-all duration-300 overflow-hidden cursor-pointer hover:transform hover:scale-[1.02]"
    >
      {/* Image */}
      <div className="relative aspect-video w-full overflow-hidden">
        {article.imageUrl ? (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.classList.add('bg-gradient-to-br', fallbackGradient);
            }}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${fallbackGradient} flex items-center justify-center`}>
            <span className="text-4xl">📰</span>
          </div>
        )}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />

        {/* Source Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-blue-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
            {article.source}
          </span>
        </div>

        {/* External Link Icon */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="p-2 bg-white/90 rounded-full">
            <ExternalLink className="w-4 h-4 text-slate-900" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-bold text-white text-lg leading-tight line-clamp-2 group-hover:text-blue-400 transition-colors">
          {article.title}
        </h3>

        {/* Description */}
        {article.description && (
          <p className="text-sm text-slate-400 line-clamp-3">
            {truncate(article.description, 150)}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-700">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock size={14} />
            <span>{formatRelativeTime(article.publishedDate)}</span>
          </div>
          {article.author && (
            <span className="text-xs text-slate-500 truncate max-w-[150px]">
              {article.author}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
