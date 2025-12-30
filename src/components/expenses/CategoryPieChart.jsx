/**
 * CategoryPieChart Component
 * Pie chart showing expense breakdown by category
 */

import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getCategoryById } from '@data/categories';
import { formatCurrency } from '@utils/formatters';

const COLORS = [
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

const CategoryPieChart = ({ expenses }) => {
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
        const categoryInfo = getCategoryById(category, 'expense');
        return {
          name: categoryInfo?.name || category,
          value: amount,
          category,
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  const totalAmount = useMemo(() => {
    return categoryData.reduce((sum, item) => sum + item.value, 0);
  }, [categoryData]);

  if (categoryData.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📊</div>
        <p className="text-slate-400">No expense data to display</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
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

  return (
    <div>
      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry) => (
              <span className="text-slate-300 text-sm">
                {value}: {formatCurrency(entry.payload.value)}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Category Breakdown List */}
      <div className="mt-6 space-y-2">
        {categoryData.map((item, index) => {
          const percentage = ((item.value / totalAmount) * 100).toFixed(1);
          return (
            <div
              key={item.category}
              className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-slate-300 font-medium">{item.name}</span>
              </div>
              <div className="text-right">
                <p className="text-white font-bold">{formatCurrency(item.value)}</p>
                <p className="text-slate-400 text-sm">{percentage}%</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryPieChart;
