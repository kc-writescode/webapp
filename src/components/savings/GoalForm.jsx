/**
 * GoalForm Component
 * Form for creating and editing savings goals
 */

import { useState, useEffect } from 'react';
import Input from '@components/common/Input';
import Button from '@components/common/Button';
import { Target, Calendar, Tag, Save, X, DollarSign } from 'lucide-react';
import { GOAL_CATEGORIES } from '@utils/constants';
import { validateAmount, validateRequired } from '@utils/validators';
import { formatCurrency } from '@utils/formatters';

const GoalForm = ({ onSubmit, onCancel, initialData = null, loading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '0',
    deadline: '',
    category: 'emergency',
    description: '',
  });

  const [errors, setErrors] = useState({});

  // Populate form with initial data for editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        targetAmount: initialData.targetAmount?.toString() || '',
        currentAmount: initialData.currentAmount?.toString() || '0',
        deadline: initialData.deadline
          ? new Date(initialData.deadline).toISOString().split('T')[0]
          : '',
        category: initialData.category || 'emergency',
        description: initialData.description || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const nameValidation = validateRequired(formData.name, 'Goal name');
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.error;
    } else if (formData.name.length > 50) {
      newErrors.name = 'Goal name must be 50 characters or less';
    }

    const targetValidation = validateAmount(formData.targetAmount, 1);
    if (!targetValidation.isValid) {
      newErrors.targetAmount = targetValidation.error;
    }

    const currentValidation = validateAmount(formData.currentAmount, 0);
    if (!currentValidation.isValid) {
      newErrors.currentAmount = currentValidation.error;
    } else if (parseFloat(formData.currentAmount) > parseFloat(formData.targetAmount)) {
      newErrors.currentAmount = 'Current amount cannot exceed target amount';
    }

    if (formData.deadline) {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (deadlineDate < today && !initialData) {
        newErrors.deadline = 'Deadline must be in the future';
      }
    }

    if (formData.description && formData.description.length > 200) {
      newErrors.description = 'Description must be 200 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const goalData = {
      name: formData.name.trim(),
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount),
      deadline: formData.deadline ? new Date(formData.deadline).getTime() : null,
      category: formData.category,
      description: formData.description.trim(),
    };

    onSubmit(goalData);
  };

  // Calculate preview values
  const targetAmount = parseFloat(formData.targetAmount) || 0;
  const currentAmount = parseFloat(formData.currentAmount) || 0;
  const remaining = Math.max(targetAmount - currentAmount, 0);
  const progress = targetAmount > 0 ? (currentAmount / targetAmount) * 100 : 0;

  const calculateMonthlyTarget = () => {
    if (!formData.deadline || remaining <= 0) return null;
    const deadlineDate = new Date(formData.deadline);
    const today = new Date();
    const monthsLeft = Math.max(
      Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24 * 30)),
      1
    );
    return remaining / monthsLeft;
  };

  const monthlyTarget = calculateMonthlyTarget();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Goal Name */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Goal Name <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Emergency Fund, Vacation, New Car"
          maxLength={50}
          error={errors.name}
          disabled={loading}
        />
        <p className="text-xs text-slate-500 mt-1">
          {formData.name.length}/50 characters
        </p>
      </div>

      {/* Target Amount */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Target Amount <span className="text-red-500">*</span>
        </label>
        <Input
          type="number"
          name="targetAmount"
          value={formData.targetAmount}
          onChange={handleChange}
          placeholder="100000"
          min="1"
          step="100"
          icon={DollarSign}
          error={errors.targetAmount}
          disabled={loading}
        />
      </div>

      {/* Current Amount (only for create) */}
      {!initialData && (
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Current Amount (Optional)
          </label>
          <Input
            type="number"
            name="currentAmount"
            value={formData.currentAmount}
            onChange={handleChange}
            placeholder="0"
            min="0"
            step="100"
            icon={DollarSign}
            error={errors.currentAmount}
            disabled={loading}
          />
          <p className="text-xs text-slate-500 mt-1">
            Start with an initial contribution (default: ₹0)
          </p>
        </div>
      )}

      {/* Deadline */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Deadline (Optional)
        </label>
        <Input
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          icon={Calendar}
          error={errors.deadline}
          disabled={loading}
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Category
        </label>
        <div className="relative">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-11 pr-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/50 transition-all duration-200"
            disabled={loading}
          >
            {GOAL_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Description (Optional)
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Add details about your savings goal..."
          rows={3}
          maxLength={200}
          className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/50 transition-all duration-200 resize-none"
          disabled={loading}
        />
        <p className="text-xs text-slate-500 mt-1">
          {formData.description.length}/200 characters
        </p>
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      {/* Preview */}
      {targetAmount > 0 && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 space-y-2">
          <h4 className="text-sm font-semibold text-blue-400 mb-2">Preview</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-slate-400">Target</p>
              <p className="font-bold text-white">{formatCurrency(targetAmount)}</p>
            </div>
            <div>
              <p className="text-slate-400">Current</p>
              <p className="font-bold text-green-400">{formatCurrency(currentAmount)}</p>
            </div>
            <div>
              <p className="text-slate-400">Remaining</p>
              <p className="font-bold text-orange-400">{formatCurrency(remaining)}</p>
            </div>
            <div>
              <p className="text-slate-400">Progress</p>
              <p className="font-bold text-blue-400">{progress.toFixed(1)}%</p>
            </div>
          </div>
          {monthlyTarget && (
            <div className="pt-2 border-t border-blue-500/30">
              <p className="text-xs text-slate-400">Recommended monthly savings</p>
              <p className="font-bold text-white">{formatCurrency(monthlyTarget)}/month</p>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          icon={Save}
          disabled={loading}
          fullWidth
        >
          {loading ? 'Saving...' : initialData ? 'Update Goal' : 'Create Goal'}
        </Button>
        <Button
          type="button"
          variant="outline"
          icon={X}
          onClick={onCancel}
          disabled={loading}
          fullWidth
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default GoalForm;
