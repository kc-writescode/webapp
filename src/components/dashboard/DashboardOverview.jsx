/**
 * DashboardOverview Component
 * Unified dashboard with integrated expense tracking and insights
 */

import { useState, useMemo } from 'react';
import { useAuth } from '@contexts/AuthContext';
import { useBudget } from '@contexts/BudgetContext';
import { useToast } from '@contexts/ToastContext';
import PageLayout from '@components/layout/PageLayout';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import Modal from '@components/common/Modal';
import Input from '@components/common/Input';
import ExpenseForm from '@components/expenses/ExpenseForm';
import CategoryPieChart from '@components/expenses/CategoryPieChart';
import ExpenseCard from '@components/expenses/ExpenseCard';
import BudgetLimits from '@components/budget/BudgetLimits';
import {
  TrendingUp,
  TrendingDown,
  Receipt,
  Target,
  Plus,
  PieChart,
  Wallet,
  Search,
  Filter,
  SortDesc,
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  BarChart3,
  Download,
  Settings,
} from 'lucide-react';
import { formatCurrency, formatBudgetMonth, getCurrentMonth } from '@utils/formatters';
import { EXPENSE_CATEGORIES } from '@data/categories';
import { exportTransactionsToCSV } from '@utils/exportData';

const DashboardOverview = () => {
  const { user } = useAuth();
  const {
    currentMonthExpenses,
    currentMonthIncome,
    currentMonthTransactions,
    totalExpenses,
    totalIncome,
    currentMonthBudget,
    budgetProgress,
    addExpense,
    addIncome,
    updateExpense,
    updateIncome,
    deleteExpense,
    deleteIncome,
  } = useBudget();
  const toast = useToast();

  // State
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // overview, transactions, insights
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const currentMonth = getCurrentMonth();
  const netBalance = totalIncome - totalExpenses;

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let filtered = [...currentMonthTransactions];

    if (searchTerm) {
      filtered = filtered.filter((t) =>
        t.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter((t) => t.type === typeFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((t) => t.category === categoryFilter);
    }

    // Date range filter
    if (fromDate) {
      const fromTimestamp = new Date(fromDate).getTime();
      filtered = filtered.filter((t) => t.date >= fromTimestamp);
    }

    if (toDate) {
      const toTimestamp = new Date(toDate).setHours(23, 59, 59, 999);
      filtered = filtered.filter((t) => t.date <= toTimestamp);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date) - new Date(a.date);
        case 'amount':
          return b.amount - a.amount;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return filtered;
  }, [currentMonthTransactions, searchTerm, typeFilter, categoryFilter, sortBy, fromDate, toDate]);

  // Calculate insights
  const insights = useMemo(() => {
    // Average expense
    const avgExpense = currentMonthExpenses.length > 0 ? totalExpenses / currentMonthExpenses.length : 0;

    // Daily spending (current month)
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const currentDay = new Date().getDate();
    const dailyAvgSpending = currentDay > 0 ? totalExpenses / currentDay : 0;

    // Projected monthly spending
    const projectedMonthly = dailyAvgSpending * daysInMonth;

    // Savings rate
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    // Top spending categories
    const categorySpending = {};
    currentMonthExpenses.forEach((expense) => {
      categorySpending[expense.category] = (categorySpending[expense.category] || 0) + expense.amount;
    });

    const topCategories = Object.entries(categorySpending)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
      }));

    return {
      avgExpense,
      dailyAvgSpending,
      projectedMonthly,
      savingsRate,
      topCategories,
      totalExpenseAmount: totalExpenses,
      totalIncomeAmount: totalIncome,
      transactionCount: currentMonthTransactions.length,
    };
  }, [currentMonthExpenses, currentMonthTransactions, totalExpenses, totalIncome]);

  const handleAddExpense = (transactionData) => {
    const isIncome = transactionData.type === 'income';
    const result = isIncome
      ? addIncome(transactionData)
      : addExpense(transactionData);
    if (result.success) {
      setShowExpenseModal(false);
      toast.success(`${isIncome ? 'Income' : 'Expense'} added successfully!`);
    } else {
      toast.error(result.error || 'Failed to add transaction');
    }
  };

  const handleEditExpense = (id, updates) => {
    const isIncome = updates.type === 'income';
    const result = isIncome
      ? updateIncome(id, updates)
      : updateExpense(id, updates);
    if (result.success) {
      toast.success('Transaction updated successfully!');
    } else {
      toast.error(result.error || 'Failed to update transaction');
    }
  };

  const handleDeleteExpense = (id, type) => {
    const isIncome = type === 'income';
    const result = isIncome
      ? deleteIncome(id)
      : deleteExpense(id);
    if (result.success) {
      toast.success('Transaction deleted successfully!');
    } else {
      toast.error(result.error || 'Failed to delete transaction');
    }
  };

  // Smart tips based on spending patterns
  const getSmartTips = () => {
    const tips = [];

    if (insights.savingsRate < 20 && insights.totalIncomeAmount > 0) {
      tips.push({
        type: 'warning',
        text: `Your savings rate is ${insights.savingsRate.toFixed(1)}%. Try to save at least 20% of your income.`,
      });
    }

    if (budgetProgress > 80 && currentMonthBudget) {
      tips.push({
        type: 'alert',
        text: `You've used ${budgetProgress.toFixed(1)}% of your monthly budget. Consider reducing discretionary spending.`,
      });
    }

    if (insights.topCategories[0]?.percentage > 40) {
      const topCategory = EXPENSE_CATEGORIES.find((c) => c.id === insights.topCategories[0].category);
      tips.push({
        type: 'info',
        text: `${topCategory?.name || 'Your top category'} accounts for ${insights.topCategories[0].percentage.toFixed(1)}% of spending. Consider diversifying.`,
      });
    }

    if (tips.length === 0) {
      tips.push({
        type: 'success',
        text: 'Great job! Your spending patterns look healthy. Keep it up!',
      });
    }

    return tips;
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: PieChart },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'insights', label: 'Insights', icon: Lightbulb },
  ];

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Welcome, {user?.username}! 👋
          </h1>
          <p className="text-slate-400">
            Your financial overview for {formatBudgetMonth(currentMonth)}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card variant="gradient" hover className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs mb-1">Income</p>
                <h3 className="text-xl md:text-2xl font-bold text-green-400">
                  {formatCurrency(totalIncome)}
                </h3>
              </div>
              <div className="p-2 bg-green-500/20 rounded-lg">
                <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
              </div>
            </div>
          </Card>

          <Card variant="gradient" hover className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs mb-1">Expenses</p>
                <h3 className="text-xl md:text-2xl font-bold text-red-400">
                  {formatCurrency(totalExpenses)}
                </h3>
              </div>
              <div className="p-2 bg-red-500/20 rounded-lg">
                <ArrowDownRight className="w-5 h-5 md:w-6 md:h-6 text-red-400" />
              </div>
            </div>
          </Card>

          <Card variant="gradient" hover className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs mb-1">Balance</p>
                <h3 className={`text-xl md:text-2xl font-bold ${netBalance >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>
                  {formatCurrency(netBalance)}
                </h3>
              </div>
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Wallet className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
              </div>
            </div>
          </Card>

          <Card variant="gradient" hover className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs mb-1">Transactions</p>
                <h3 className="text-xl md:text-2xl font-bold text-purple-400">
                  {currentMonthTransactions.length}
                </h3>
              </div>
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Receipt className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mb-6">
          <Button
            variant="outline"
            icon={Download}
            onClick={() => {
              const result = exportTransactionsToCSV(currentMonthTransactions, formatBudgetMonth(currentMonth));
              if (!result.success) {
                alert(result.error || 'No transactions to export');
              }
            }}
            disabled={currentMonthTransactions.length === 0}
          >
            Export CSV
          </Button>
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setShowExpenseModal(true)}
          >
            Add Transaction
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Budget Progress */}
            {currentMonthBudget && (
              <Card title="Budget Progress" icon={Target}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">
                        {formatCurrency(totalExpenses)} of {formatCurrency(currentMonthBudget.totalBudget)}
                      </p>
                      <p className="text-xl font-bold text-white">
                        {budgetProgress.toFixed(1)}% used
                      </p>
                    </div>
                  </div>

                  <div className="relative w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${
                        budgetProgress > 100
                          ? 'bg-gradient-to-r from-red-500 to-red-600'
                          : budgetProgress > 80
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                          : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                      }`}
                      style={{ width: `${Math.min(budgetProgress, 100)}%` }}
                    />
                  </div>

                  {budgetProgress > 100 && (
                    <p className="text-sm text-red-400">
                      ⚠️ Budget exceeded by {formatCurrency(totalExpenses - currentMonthBudget.totalBudget)}
                    </p>
                  )}
                </div>
              </Card>
            )}

            {/* Expense Breakdown */}
            <Card title="Spending Breakdown" icon={PieChart}>
              {currentMonthExpenses.filter((t) => t.type === 'expense').length > 0 ? (
                <CategoryPieChart expenses={currentMonthExpenses.filter((t) => t.type === 'expense')} />
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📊</div>
                  <p className="text-slate-400">No expenses yet</p>
                </div>
              )}
            </Card>

            {/* Income Breakdown */}
            <Card title="Income Breakdown" icon={TrendingUp}>
              {currentMonthIncome.length > 0 ? (
                <CategoryPieChart expenses={currentMonthIncome} type="income" />
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">💰</div>
                  <p className="text-slate-400">No income yet</p>
                </div>
              )}
            </Card>

            {/* Budget Limits by Category */}
            <BudgetLimits />

            {/* Recent Transactions */}
            <Card title="Recent Transactions" icon={Calendar} className="lg:col-span-2">
              {currentMonthTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">💸</div>
                  <p className="text-slate-400">No transactions yet</p>
                  <p className="text-slate-500 text-sm mt-1">Add your first transaction to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentMonthTransactions.slice(0, 5).map((transaction) => (
                    <ExpenseCard
                      key={transaction.id}
                      expense={transaction}
                      onEdit={handleEditExpense}
                      onDelete={(id) => handleDeleteExpense(id, transaction.type)}
                    />
                  ))}
                  {currentMonthTransactions.length > 5 && (
                    <button
                      onClick={() => setActiveTab('transactions')}
                      className="w-full py-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      View all {currentMonthTransactions.length} transactions →
                    </button>
                  )}
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-4">
            {/* Filters */}
            <Card>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                <Input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={Search}
                />

                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-11 pr-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/50 transition-all"
                  >
                    <option value="all">All Types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expenses</option>
                  </select>
                </div>

                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-11 pr-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/50 transition-all"
                  >
                    <option value="all">All Categories</option>
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <SortDesc className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-11 pr-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/50 transition-all"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="amount">Sort by Amount</option>
                    <option value="category">Sort by Category</option>
                  </select>
                </div>
              </div>

              {/* Date Range Filter */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-slate-700">
                <Input
                  type="date"
                  label="From Date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  icon={Calendar}
                />
                <Input
                  type="date"
                  label="To Date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  icon={Calendar}
                />
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFromDate('');
                      setToDate('');
                    }}
                    disabled={!fromDate && !toDate}
                    className="w-full"
                  >
                    Clear Dates
                  </Button>
                </div>
              </div>
            </Card>

            {/* Results Summary */}
            {(searchTerm || typeFilter !== 'all' || categoryFilter !== 'all' || fromDate || toDate) && (
              <div className="flex items-center justify-between px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-sm text-slate-300">
                  Showing <span className="font-bold text-blue-400">{filteredTransactions.length}</span> of{' '}
                  <span className="font-bold">{currentMonthTransactions.length}</span> transactions
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setTypeFilter('all');
                    setCategoryFilter('all');
                    setFromDate('');
                    setToDate('');
                  }}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Transaction List */}
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">
                  {searchTerm || typeFilter !== 'all' || categoryFilter !== 'all' ? '🔍' : '📊'}
                </div>
                <p className="text-slate-400 text-lg">
                  {searchTerm || typeFilter !== 'all' || categoryFilter !== 'all'
                    ? 'No transactions match your filters'
                    : 'No transactions yet'}
                </p>
                <p className="text-slate-500 text-sm mt-2">
                  {searchTerm || typeFilter !== 'all' || categoryFilter !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Add your first transaction to get started!'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTransactions.map((expense) => (
                  <ExpenseCard
                    key={expense.id}
                    expense={expense}
                    onEdit={handleEditExpense}
                    onDelete={(id) => handleDeleteExpense(id, expense.type)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4">
                <p className="text-slate-400 text-xs mb-1">Avg. Transaction</p>
                <p className="text-xl font-bold text-white">{formatCurrency(insights.avgExpense)}</p>
              </Card>
              <Card className="p-4">
                <p className="text-slate-400 text-xs mb-1">Daily Spending</p>
                <p className="text-xl font-bold text-white">{formatCurrency(insights.dailyAvgSpending)}</p>
              </Card>
              <Card className="p-4">
                <p className="text-slate-400 text-xs mb-1">Projected Monthly</p>
                <p className="text-xl font-bold text-yellow-400">{formatCurrency(insights.projectedMonthly)}</p>
              </Card>
              <Card className="p-4">
                <p className="text-slate-400 text-xs mb-1">Savings Rate</p>
                <p className={`text-xl font-bold ${insights.savingsRate >= 20 ? 'text-green-400' : 'text-orange-400'}`}>
                  {insights.savingsRate.toFixed(1)}%
                </p>
              </Card>
            </div>

            {/* Top Categories */}
            <Card title="Top Spending Categories" icon={BarChart3}>
              {insights.topCategories.length > 0 ? (
                <div className="space-y-4">
                  {insights.topCategories.map((item) => {
                    const category = EXPENSE_CATEGORIES.find((c) => c.id === item.category);
                    return (
                      <div key={item.category} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300 flex items-center gap-2">
                            <span>{category?.icon || '📦'}</span>
                            {category?.name || item.category}
                          </span>
                          <span className="text-white font-medium">{formatCurrency(item.amount)}</span>
                        </div>
                        <div className="relative w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <p className="text-xs text-slate-500">{item.percentage.toFixed(1)}% of total spending</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📊</div>
                  <p className="text-slate-400">No spending data yet</p>
                </div>
              )}
            </Card>

            {/* Smart Tips */}
            <Card title="Smart Tips" icon={Lightbulb}>
              <div className="space-y-3">
                {getSmartTips().map((tip, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      tip.type === 'warning'
                        ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'
                        : tip.type === 'alert'
                        ? 'bg-red-500/10 border-red-500/30 text-red-300'
                        : tip.type === 'success'
                        ? 'bg-green-500/10 border-green-500/30 text-green-300'
                        : 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                    }`}
                  >
                    <p className="text-sm">{tip.text}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Add Transaction Modal */}
      <Modal
        isOpen={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        title="Add Transaction"
        size="lg"
      >
        <ExpenseForm
          onSubmit={handleAddExpense}
          onCancel={() => setShowExpenseModal(false)}
        />
      </Modal>
    </PageLayout>
  );
};

export default DashboardOverview;
