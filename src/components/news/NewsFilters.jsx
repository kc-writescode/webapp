/**
 * NewsFilters Component
 * Category tabs and search filter for news
 */

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { NEWS_CATEGORIES } from '@utils/constants';
import Input from '@components/common/Input';

const NewsFilters = ({
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  loading = false,
}) => {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearch);
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange]);

  const handleClearSearch = () => {
    setLocalSearch('');
    onSearchChange('');
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Input
          type="text"
          placeholder="Search financial news..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          icon={Search}
          disabled={loading}
        />
        {localSearch && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-700 rounded-full transition-colors"
            disabled={loading}
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        )}
      </div>

      {/* Category Tabs - Desktop */}
      <div className="hidden md:flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {NEWS_CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === category.id
                ? 'bg-blue-500 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Category Dropdown - Mobile */}
      <div className="md:hidden">
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          disabled={loading}
          className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/50 transition-all duration-200"
        >
          {NEWS_CATEGORIES.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Active Filters Indicator */}
      {(selectedCategory !== 'all' || searchQuery) && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-400">Active filters:</span>
          {selectedCategory !== 'all' && (
            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
              {NEWS_CATEGORIES.find((c) => c.id === selectedCategory)?.name}
            </span>
          )}
          {searchQuery && (
            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
              Search: "{searchQuery}"
            </span>
          )}
          <button
            onClick={() => {
              onCategoryChange('all');
              handleClearSearch();
            }}
            className="ml-auto text-xs text-slate-400 hover:text-white transition-colors"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default NewsFilters;
