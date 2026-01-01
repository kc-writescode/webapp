/**
 * ContributionModal Component
 * Modal for adding contributions to a savings goal
 */

import { useState } from 'react';
import Input from '@components/common/Input';
import Button from '@components/common/Button';
import { IndianRupee, Plus, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@utils/formatters';
import GoalProgress from './GoalProgress';

const ContributionModal = ({ goal, onSubmit, onClose, loading = false }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const quickAmounts = [500, 1000, 5000, 10000];

  const handleQuickAmount = (value) => {
    setAmount(value.toString());
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const contributionAmount = parseFloat(amount);

    if (!amount || isNaN(contributionAmount) || contributionAmount <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    onSubmit(contributionAmount);
  };

  const contributionAmount = parseFloat(amount) || 0;
  const newTotal = goal.currentAmount + contributionAmount;
  const newProgress = Math.min((newTotal / goal.targetAmount) * 100, 100);
  const willComplete = newTotal >= goal.targetAmount;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Current Progress */}
      <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-white">{goal.name}</h4>
          <span className="text-sm text-slate-400">
            {((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)}%
          </span>
        </div>
        <GoalProgress
          currentAmount={goal.currentAmount}
          targetAmount={goal.targetAmount}
          size="md"
          showLabels={false}
        />
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Current</span>
          <span className="font-semibold text-white">
            {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
          </span>
        </div>
      </div>

      {/* Contribution Amount */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Contribution Amount <span className="text-red-500">*</span>
        </label>
        <Input
          type="number"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setError('');
          }}
          placeholder="Enter amount"
          min="1"
          step="1"
          icon={IndianRupee}
          error={error}
          disabled={loading}
          autoFocus
        />
      </div>

      {/* Quick Amount Buttons */}
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">
          Quick Add
        </label>
        <div className="grid grid-cols-4 gap-2">
          {quickAmounts.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => handleQuickAmount(value)}
              className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                amount === value.toString()
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              disabled={loading}
            >
              ₹{value >= 1000 ? `${value / 1000}k` : value}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      {contributionAmount > 0 && (
        <div
          className={`rounded-lg p-4 border-2 ${
            willComplete
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-blue-500/10 border-blue-500/30'
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp
              className={willComplete ? 'text-green-400' : 'text-blue-400'}
              size={20}
            />
            <h4
              className={`text-sm font-semibold ${
                willComplete ? 'text-green-400' : 'text-blue-400'
              }`}
            >
              {willComplete ? '🎉 Goal will be achieved!' : 'New Total Preview'}
            </h4>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">New Total</span>
              <span className="font-bold text-white text-lg">
                {formatCurrency(newTotal)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">New Progress</span>
              <span
                className={`font-bold ${
                  willComplete ? 'text-green-400' : 'text-blue-400'
                }`}
              >
                {newProgress.toFixed(1)}%
              </span>
            </div>
            {!willComplete && (
              <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-700">
                <span className="text-slate-400">Remaining</span>
                <span className="font-semibold text-orange-400">
                  {formatCurrency(goal.targetAmount - newTotal)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <Button
          type="submit"
          variant="primary"
          icon={Plus}
          disabled={loading || !amount || parseFloat(amount) <= 0}
          fullWidth
        >
          {loading ? 'Adding...' : 'Add Contribution'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={loading}
          fullWidth
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ContributionModal;
