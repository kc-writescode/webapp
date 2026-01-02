/**
 * CategoryPieChart Component
 * Pie chart showing expense/income breakdown by category
 */

import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getCategoryById } from '@data/categories';
import { formatCurrency } from '@utils/formatters';

const EXPENSE_COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f59e0b', // yellow
  '#10b981', // green
  '#06b6d4', // cyan
  '#ef4444', // red
  '#f97316', // orange
  '#a855f7', // violet
  '#14b8a6', // teal
];

const INCOME_COLORS = [
  '#10b981', // green
  '#22c55e', // light green
  '#14b8a6', // teal
  '#06b6d4', // cyan
  '#0ea5e9', // sky blue
  '#3b82f6', // blue
  '#6366f1', // indigo
  '#8b5cf6', // purple
  '#a855f7', // violet
  '#d946ef', // fuchsia
];

const CategoryPieChart = ({ expenses, type = 'expense' }) => {
  const COLORS = type === 'income' ? INCOME_COLORS : EXPENSE_COLORS;

  // Group expenses by category
  const categoryData = useMemo(() => {
    const grouped = expenses.reduce((acc, expense) => {
      const category = expense.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += expense.amount;
      return acc;
    }, {});

    // Convert to array and sort by amount
    return Object.entries(grouped)
      .map(([category, amount]) => {
        const categoryInfo = getCategoryById(category, type);
        return {
          name: categoryInfo?.name || category,
          value: amount,
          category,
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [expenses, type]);

  const totalAmount = useMemo(() => {
    return categoryData.reduce((sum, item) => sum + item.value, 0);
  }, [categoryData]);

  const renderTooltip = useMemo(() => {
    const TooltipContent = ({ active, payload }) => {
      if (active && payload && payload.length) {
        const data = payload[0].payload;
        const percentage = ((data.value / totalAmount) * 100).toFixed(1);
        return (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
            <p className="text-white font-semibold mb-1">{data.name}</p>
            <p className="text-blue-400 font-bold">{formatCurrency(data.value)}</p>
            <p className="text-slate-400 text-sm">{percentage}% of total</p>
          </div>
        );
      }
      return null;
    };
    return TooltipContent;
  }, [totalAmount]);

  if (categoryData.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">{type === 'income' ? '💰' : '📊'}</div>
        <p className="text-slate-400">No {type} data to display</p>
      </div>
    );
  }

  return (
    <div>
      {/* Chart */}
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={renderTooltip} />
        </PieChart>
      </ResponsiveContainer>

      {/* Category Breakdown List */}
      <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
        {categoryData.map((item, index) => {
          const percentage = ((item.value / totalAmount) * 100).toFixed(1);
          return (
            <div
              key={item.category}
              className="flex items-center justify-between p-2 sm:p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div
                  className="w-3 h-3 sm:w-4 sm:h-4 rounded flex-shrink-0"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-slate-300 font-medium text-sm sm:text-base truncate">{item.name}</span>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <p className="text-white font-bold text-sm sm:text-base">{formatCurrency(item.value)}</p>
                <p className="text-slate-400 text-xs sm:text-sm">{percentage}%</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryPieChart;
