/**
 * ExpenseForm Component
 * Form for adding and editing expenses
 */

import { useState, useEffect } from 'react';
import Input from '@components/common/Input';
import Button from '@components/common/Button';
import { Banknote, Calendar, Tag, CreditCard, Save, X } from 'lucide-react';
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from '@data/categories';
import { validateAmount, validateRequired } from '@utils/validators';

const ExpenseForm = ({ onSubmit, onCancel, initialData = null, loading = false }) => {
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: 'food',
    description: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'card',
    tags: [],
  });

  const [errors, setErrors] = useState({});

  // Populate form with initial data for editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        amount: initialData.amount.toString(),
        type: initialData.type || 'expense',
        category: initialData.category || 'food',
        description: initialData.description || '',
        date: initialData.date
          ? new Date(initialData.date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        paymentMethod: initialData.paymentMethod || 'card',
        tags: initialData.tags || [],
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

    const amountValidation = validateAmount(formData.amount);
    if (!amountValidation.isValid) {
      newErrors.amount = amountValidation.error;
    }

    const descriptionValidation = validateRequired(formData.description, 'Description');
    if (!descriptionValidation.isValid) {
      newErrors.description = descriptionValidation.error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const transactionData = {
      amount: parseFloat(formData.amount),
      type: formData.type,
      category: formData.category,
      description: formData.description.trim(),
      date: new Date(formData.date).getTime(),
      paymentMethod: formData.paymentMethod,
      tags: formData.tags,
    };

    onSubmit(transactionData);
  };

  const handleReset = () => {
    setFormData({
      amount: '',
      type: 'expense',
      category: 'food',
      description: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'card',
      tags: [],
    });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Type Selector */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Transaction Type <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
              className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all ${
                formData.type === 'expense'
                  ? 'bg-red-500/20 border-2 border-red-500 text-red-400'
                  : 'bg-slate-800/50 border border-slate-700 text-slate-400 hover:border-slate-600'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
              className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all ${
                formData.type === 'income'
                  ? 'bg-green-500/20 border-2 border-green-500 text-green-400'
                  : 'bg-slate-800/50 border border-slate-700 text-slate-400 hover:border-slate-600'
              }`}
            >
              Income
            </button>
          </div>
        </div>

        {/* Amount */}
        <Input
          label="Amount"
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="0.00"
          icon={Banknote}
          error={errors.amount}
          required
          step="0.01"
          min="0"
        />

        {/* Date */}
        <Input
          label="Date"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          icon={Calendar}
          required
        />

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-11 pr-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/50 transition-all duration-200"
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Payment Method <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-11 pr-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/50 transition-all duration-200"
            >
              {PAYMENT_METHODS.map((method) => (
                <option key={method.id} value={method.id}>
                  {method.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <Input
            label="Description"
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="What did you spend on?"
            error={errors.description}
            required
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          icon={Save}
          loading={loading}
        >
          {initialData ? `Update ${formData.type === 'income' ? 'Income' : 'Expense'}` : `Add ${formData.type === 'income' ? 'Income' : 'Expense'}`}
        </Button>

        {!initialData && (
          <Button
            type="button"
            variant="ghost"
            onClick={handleReset}
          >
            Reset
          </Button>
        )}

        {onCancel && (
          <Button
            type="button"
            variant="outline"
            icon={X}
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default ExpenseForm;
