/**
 * ExpenseList Component
 * List of expenses with filtering and sorting
 */

import { useState, useMemo } from 'react';
import { Search, Filter, SortDesc } from 'lucide-react';
import ExpenseCard from './ExpenseCard';
import Input from '@components/common/Input';
import { EXPENSE_CATEGORIES } from '@data/categories';

const ExpenseList = ({ expenses, onEdit, onDelete, loading = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all'); // all, income, expense
  const [sortBy, setSortBy] = useState('date'); // date, amount, category

  // Filter and sort expenses
  const filteredExpenses = useMemo(() => {
    let filtered = [...expenses];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((expense) =>
        expense.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter((expense) => expense.type === typeFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((expense) => expense.category === categoryFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date) - new Date(a.date); // Newest first
        case 'amount':
          return b.amount - a.amount; // Highest first
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return filtered;
  }, [expenses, searchTerm, categoryFilter, typeFilter, sortBy]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 bg-slate-800/50 rounded-xl border border-slate-700 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Search */}
        <Input
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={Search}
        />

        {/* Type Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-11 pr-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/50 transition-all duration-200"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expenses</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-11 pr-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/50 transition-all duration-200"
          >
            <option value="all">All Categories</option>
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div className="relative">
          <SortDesc className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-11 pr-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/50 transition-all duration-200"
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
            <option value="category">Sort by Category</option>
          </select>
        </div>
      </div>

      {/* Results Summary */}
      {(searchTerm || categoryFilter !== 'all' || typeFilter !== 'all') && (
        <div className="flex items-center justify-between px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-sm text-slate-300">
            Showing <span className="font-bold text-blue-400">{filteredExpenses.length}</span> of{' '}
            <span className="font-bold">{expenses.length}</span> transactions
          </p>
        </div>
      )}

      {/* Transaction List */}
      {filteredExpenses.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">
            {searchTerm || categoryFilter !== 'all' || typeFilter !== 'all' ? '🔍' : '📊'}
          </div>
          <p className="text-slate-400 text-lg">
            {searchTerm || categoryFilter !== 'all' || typeFilter !== 'all'
              ? 'No transactions match your filters'
              : 'No transactions yet'}
          </p>
          <p className="text-slate-500 text-sm mt-2">
            {searchTerm || categoryFilter !== 'all' || typeFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Add your first transaction to get started!'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredExpenses.map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              onEdit={onEdit}
              onDelete={(id) => onDelete(id, expense.type)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
