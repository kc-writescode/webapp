/**
 * SpendingTrends Component
 * Shows spending comparisons and trends over time
 */

import { useMemo } from 'react';
import { useBudget } from '@contexts/BudgetContext';
import Card from '@components/common/Card';
import { TrendingUp, TrendingDown, Minus, Calendar, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@utils/formatters';
import { EXPENSE_CATEGORIES } from '@data/categories';

const SpendingTrends = () => {
  const { expenses, income } = useBudget();

  // Calculate trends
  const trends = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Get dates for comparisons
    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(now.getDate() - now.getDay());
    thisWeekStart.setHours(0, 0, 0, 0);

    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);

    const lastWeekEnd = new Date(thisWeekStart);
    lastWeekEnd.setMilliseconds(-1);

    const thisMonthStart = new Date(currentYear, currentMonth, 1);
    const lastMonthStart = new Date(currentYear, currentMonth - 1, 1);
    const lastMonthEnd = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);

    // Filter expenses
    const thisWeekExpenses = expenses.filter((e) => new Date(e.date) >= thisWeekStart);
    const lastWeekExpenses = expenses.filter(
      (e) => new Date(e.date) >= lastWeekStart && new Date(e.date) <= lastWeekEnd
    );
    const thisMonthExpenses = expenses.filter((e) => new Date(e.date) >= thisMonthStart);
    const lastMonthExpenses = expenses.filter(
      (e) => new Date(e.date) >= lastMonthStart && new Date(e.date) <= lastMonthEnd
    );

    // Calculate totals
    const thisWeekTotal = thisWeekExpenses.reduce((sum, e) => sum + e.amount, 0);
    const lastWeekTotal = lastWeekExpenses.reduce((sum, e) => sum + e.amount, 0);
    const thisMonthTotal = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const lastMonthTotal = lastMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

    // Calculate percentage changes
    const weekChange = lastWeekTotal > 0
      ? ((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100
      : thisWeekTotal > 0 ? 100 : 0;

    const monthChange = lastMonthTotal > 0
      ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
      : thisMonthTotal > 0 ? 100 : 0;

    // Daily average for current month
    const daysElapsed = now.getDate();
    const dailyAverage = thisMonthTotal / daysElapsed;

    // Projected monthly spend
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const projectedMonthly = dailyAverage * daysInMonth;

    // Category trends (compare this month vs last month)
    const categoryTrends = {};
    EXPENSE_CATEGORIES.forEach((cat) => {
      const thisMonthCat = thisMonthExpenses
        .filter((e) => e.category === cat.id)
        .reduce((sum, e) => sum + e.amount, 0);
      const lastMonthCat = lastMonthExpenses
        .filter((e) => e.category === cat.id)
        .reduce((sum, e) => sum + e.amount, 0);

      if (thisMonthCat > 0 || lastMonthCat > 0) {
        const change = lastMonthCat > 0
          ? ((thisMonthCat - lastMonthCat) / lastMonthCat) * 100
          : thisMonthCat > 0 ? 100 : 0;

        categoryTrends[cat.id] = {
          category: cat,
          thisMonth: thisMonthCat,
          lastMonth: lastMonthCat,
          change,
        };
      }
    });

    // Sort categories by absolute change
    const sortedCategoryTrends = Object.values(categoryTrends)
      .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
      .slice(0, 5);

    return {
      thisWeekTotal,
      lastWeekTotal,
      weekChange,
      thisMonthTotal,
      lastMonthTotal,
      monthChange,
      dailyAverage,
      projectedMonthly,
      categoryTrends: sortedCategoryTrends,
      transactionCount: thisMonthExpenses.length,
    };
  }, [expenses]);

  const getTrendIcon = (change) => {
    if (change > 5) return <TrendingUp className="w-4 h-4 text-red-400" />;
    if (change < -5) return <TrendingDown className="w-4 h-4 text-green-400" />;
    return <Minus className="w-4 h-4 text-slate-400" />;
  };

  const getTrendColor = (change, inverse = false) => {
    // For expenses, down is good (green), up is bad (red)
    if (inverse) {
      if (change > 5) return 'text-green-400';
      if (change < -5) return 'text-red-400';
    } else {
      if (change > 5) return 'text-red-400';
      if (change < -5) return 'text-green-400';
    }
    return 'text-slate-400';
  };

  return (
    <div className="space-y-6">
      {/* Period Comparisons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Week over Week */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-slate-400">Week over Week</h4>
            <Calendar className="w-4 h-4 text-slate-500" />
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-slate-500 mb-1">This Week</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(trends.thisWeekTotal)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 mb-1">Last Week</p>
              <p className="text-lg text-slate-400">
                {formatCurrency(trends.lastWeekTotal)}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getTrendIcon(trends.weekChange)}
              <span className={`text-sm font-medium ${getTrendColor(trends.weekChange)}`}>
                {trends.weekChange > 0 ? '+' : ''}{trends.weekChange.toFixed(1)}%
              </span>
            </div>
            <span className="text-xs text-slate-500">
              {trends.weekChange > 0 ? 'Spending more' : trends.weekChange < 0 ? 'Spending less' : 'No change'}
            </span>
          </div>
        </Card>

        {/* Month over Month */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-slate-400">Month over Month</h4>
            <Calendar className="w-4 h-4 text-slate-500" />
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-slate-500 mb-1">This Month</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(trends.thisMonthTotal)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 mb-1">Last Month</p>
              <p className="text-lg text-slate-400">
                {formatCurrency(trends.lastMonthTotal)}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getTrendIcon(trends.monthChange)}
              <span className={`text-sm font-medium ${getTrendColor(trends.monthChange)}`}>
                {trends.monthChange > 0 ? '+' : ''}{trends.monthChange.toFixed(1)}%
              </span>
            </div>
            <span className="text-xs text-slate-500">
              {trends.monthChange > 0 ? 'Spending more' : trends.monthChange < 0 ? 'Spending less' : 'No change'}
            </span>
          </div>
        </Card>
      </div>

      {/* Velocity & Projections */}
      <Card className="p-5">
        <h4 className="text-sm font-medium text-slate-400 mb-4">Spending Velocity</h4>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-slate-500 mb-1">Daily Average</p>
            <p className="text-xl font-bold text-white">
              {formatCurrency(trends.dailyAverage)}
            </p>
            <p className="text-xs text-slate-500 mt-1">per day this month</p>
          </div>

          <div>
            <p className="text-xs text-slate-500 mb-1">Projected Monthly</p>
            <p className="text-xl font-bold text-orange-400">
              {formatCurrency(trends.projectedMonthly)}
            </p>
            <p className="text-xs text-slate-500 mt-1">at current pace</p>
          </div>

          <div>
            <p className="text-xs text-slate-500 mb-1">Transactions</p>
            <p className="text-xl font-bold text-blue-400">
              {trends.transactionCount}
            </p>
            <p className="text-xs text-slate-500 mt-1">this month</p>
          </div>
        </div>
      </Card>

      {/* Category Trends */}
      {trends.categoryTrends.length > 0 && (
        <Card className="p-5">
          <h4 className="text-sm font-medium text-slate-400 mb-4">Category Changes</h4>
          <p className="text-xs text-slate-500 mb-4">Compared to last month</p>

          <div className="space-y-3">
            {trends.categoryTrends.map((trend) => (
              <div
                key={trend.category.id}
                className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{trend.category.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-white">{trend.category.name}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>{formatCurrency(trend.lastMonth)}</span>
                      <ArrowRight className="w-3 h-3" />
                      <span className="text-white">{formatCurrency(trend.thisMonth)}</span>
                    </div>
                  </div>
                </div>

                <div className={`flex items-center gap-1 ${getTrendColor(trend.change)}`}>
                  {getTrendIcon(trend.change)}
                  <span className="text-sm font-medium">
                    {trend.change > 0 ? '+' : ''}{trend.change.toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default SpendingTrends;
