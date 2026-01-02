/**
 * BudgetLimits Component
 * Set and track budget limits per expense category
 */

import { useState, useMemo, useCallback } from 'react';
import { Target, Edit2, Save, X, AlertTriangle, CheckCircle } from 'lucide-react';
import { useBudget } from '@contexts/BudgetContext';
import Card from '@components/common/Card';
import Input from '@components/common/Input';
import { formatCurrency } from '@utils/formatters';
import { EXPENSE_CATEGORIES } from '@data/categories';
import { getItem, setItem, STORAGE_KEYS } from '@utils/localStorage';

const BudgetLimits = () => {
  const { currentMonthExpenses } = useBudget();
  const [categoryBudgets, setCategoryBudgets] = useState(() => {
    return getItem(STORAGE_KEYS.CATEGORY_BUDGETS, {});
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [editValue, setEditValue] = useState('');

  // Calculate spending by category
  const categorySpending = useMemo(() => {
    const spending = {};
    currentMonthExpenses
      .filter((t) => t.type === 'expense')
      .forEach((expense) => {
        spending[expense.category] = (spending[expense.category] || 0) + expense.amount;
      });
    return spending;
  }, [currentMonthExpenses]);

  // Get budget status for a category
  const getBudgetStatus = useCallback((categoryId) => {
    const budget = categoryBudgets[categoryId];
    const spent = categorySpending[categoryId] || 0;

    if (!budget || budget === 0) {
      return { status: 'none', percentage: 0, spent, budget: 0 };
    }

    const percentage = (spent / budget) * 100;

    if (percentage >= 100) {
      return { status: 'exceeded', percentage, spent, budget };
    } else if (percentage >= 80) {
      return { status: 'warning', percentage, spent, budget };
    }
    return { status: 'good', percentage, spent, budget };
  }, [categoryBudgets, categorySpending]);

  const handleStartEdit = (categoryId) => {
    setEditingCategory(categoryId);
    setEditValue(categoryBudgets[categoryId]?.toString() || '');
  };

  const handleSaveBudget = (categoryId) => {
    const newBudgets = {
      ...categoryBudgets,
      [categoryId]: parseFloat(editValue) || 0,
    };
    setCategoryBudgets(newBudgets);
    setItem(STORAGE_KEYS.CATEGORY_BUDGETS, newBudgets);
    setEditingCategory(null);
    setEditValue('');
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditValue('');
  };

  // Calculate total budget and spending
  const totals = useMemo(() => {
    const totalBudget = Object.values(categoryBudgets).reduce((sum, val) => sum + (val || 0), 0);
    const totalSpent = Object.values(categorySpending).reduce((sum, val) => sum + val, 0);
    return { totalBudget, totalSpent };
  }, [categoryBudgets, categorySpending]);

  // Get categories with alerts
  const alertCategories = useMemo(() => {
    return EXPENSE_CATEGORIES.filter((cat) => {
      const status = getBudgetStatus(cat.id);
      return status.status === 'exceeded' || status.status === 'warning';
    });
  }, [getBudgetStatus]);

  return (
    <Card title="Budget Limits by Category" icon={Target}>
      {/* Alerts Section */}
      {alertCategories.length > 0 && (
        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-400">Budget Alerts</span>
          </div>
          <div className="space-y-1">
            {alertCategories.map((cat) => {
              const status = getBudgetStatus(cat.id);
              return (
                <p key={cat.id} className="text-xs text-yellow-300">
                  {cat.name}: {status.percentage.toFixed(0)}% used ({formatCurrency(status.spent)} / {formatCurrency(status.budget)})
                </p>
              );
            })}
          </div>
        </div>
      )}

      {/* Total Summary */}
      {totals.totalBudget > 0 && (
        <div className="mb-4 p-3 bg-slate-800/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Total Budget Progress</span>
            <span className="text-sm font-medium text-white">
              {formatCurrency(totals.totalSpent)} / {formatCurrency(totals.totalBudget)}
            </span>
          </div>
          <div className="relative w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`absolute top-0 left-0 h-full rounded-full transition-all ${
                totals.totalSpent / totals.totalBudget > 1
                  ? 'bg-red-500'
                  : totals.totalSpent / totals.totalBudget > 0.8
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${Math.min((totals.totalSpent / totals.totalBudget) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Category List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {EXPENSE_CATEGORIES.map((category) => {
          const status = getBudgetStatus(category.id);
          const isEditing = editingCategory === category.id;

          return (
            <div
              key={category.id}
              className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${category.color}`} />
                  <span className="text-sm font-medium text-white">{category.name}</span>
                </div>

                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      placeholder="Budget"
                      className="w-28 text-sm py-1"
                    />
                    <button
                      onClick={() => handleSaveBudget(category.id)}
                      className="p-1 text-green-400 hover:bg-green-500/20 rounded"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-1 text-slate-400 hover:bg-slate-700 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {status.budget > 0 ? (
                      <span className="text-xs text-slate-400">
                        {formatCurrency(status.spent)} / {formatCurrency(status.budget)}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500">No limit set</span>
                    )}
                    <button
                      onClick={() => handleStartEdit(category.id)}
                      className="p-1 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              {status.budget > 0 && (
                <div className="relative w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 h-full rounded-full transition-all ${
                      status.status === 'exceeded'
                        ? 'bg-red-500'
                        : status.status === 'warning'
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(status.percentage, 100)}%` }}
                  />
                </div>
              )}

              {/* Status Badge */}
              {status.budget > 0 && (
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-slate-500">
                    {status.percentage.toFixed(0)}% used
                  </span>
                  {status.status === 'exceeded' && (
                    <span className="flex items-center gap-1 text-xs text-red-400">
                      <AlertTriangle className="w-3 h-3" />
                      Over budget
                    </span>
                  )}
                  {status.status === 'warning' && (
                    <span className="flex items-center gap-1 text-xs text-yellow-400">
                      <AlertTriangle className="w-3 h-3" />
                      Near limit
                    </span>
                  )}
                  {status.status === 'good' && status.percentage > 0 && (
                    <span className="flex items-center gap-1 text-xs text-green-400">
                      <CheckCircle className="w-3 h-3" />
                      On track
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Help Text */}
      <p className="mt-4 text-xs text-slate-500 text-center">
        Click the edit icon to set a monthly budget limit for each category
      </p>
    </Card>
  );
};

export default BudgetLimits;
