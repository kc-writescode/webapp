/**
 * Tax Calculator Component
 * Calculate Indian Income Tax (FY 2024-25)
 */

import { useState } from 'react';
import { Receipt, ExternalLink } from 'lucide-react';
import { calculateIncomeTax } from '@utils/calculations';
import { formatCurrency } from '@utils/formatters';
import Card from '@components/common/Card';
import Input from '@components/common/Input';
import Button from '@components/common/Button';

const TaxCalculator = () => {
  const [income, setIncome] = useState(1000000);
  const [regime, setRegime] = useState('new');
  const [deductions, setDeductions] = useState(150000);
  const [results, setResults] = useState(null);

  const handleCalculate = () => {
    const result = calculateIncomeTax(income, regime, regime === 'old' ? deductions : 0);
    setResults(result);
  };

  return (
    <div className="space-y-6">
      {/* Official Tax Calculator Reference */}
      <Card>
        <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg">
          <div className="p-3 bg-orange-500/20 rounded-lg flex-shrink-0">
            <Receipt className="w-6 h-6 text-orange-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">
              Official Income Tax Calculator
            </h3>
            <p className="text-sm text-slate-300 mb-3">
              For the most accurate and detailed tax calculations, use the official Income Tax Department calculator.
              It includes all deductions, rebates, and special provisions as per the latest tax laws.
            </p>
            <a
              href="https://incometaxindia.gov.in/pages/tools/tax-calculator.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500 text-orange-400 rounded-lg transition-all duration-200 text-sm font-medium"
            >
              Visit Official Calculator
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </Card>

      {/* Input Card */}
      <Card title="Income Details (FY 2024-25)" icon={Receipt}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Annual Gross Income
            </label>
            <Input
              type="number"
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
              min="0"
              step="10000"
            />
            <div className="mt-2">
              <input
                type="range"
                min="100000"
                max="5000000"
                step="50000"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">{formatCurrency(income)} per annum</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Tax Regime
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={regime === 'new' ? 'primary' : 'outline'}
                onClick={() => setRegime('new')}
                fullWidth
              >
                New Regime
              </Button>
              <Button
                variant={regime === 'old' ? 'primary' : 'outline'}
                onClick={() => setRegime('old')}
                fullWidth
              >
                Old Regime
              </Button>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {regime === 'new'
                ? 'Standard deduction: ₹75,000 (No other deductions allowed)'
                : 'Standard deduction: ₹50,000 + 80C/80D deductions'}
            </p>
          </div>

          {regime === 'old' && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Deductions (80C, 80D, etc.)
              </label>
              <Input
                type="number"
                value={deductions}
                onChange={(e) => setDeductions(Number(e.target.value))}
                min="0"
                step="10000"
              />
              <div className="mt-2">
                <input
                  type="range"
                  min="0"
                  max="250000"
                  step="10000"
                  value={deductions}
                  onChange={(e) => setDeductions(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {formatCurrency(deductions)} (Max ₹2,50,000)
              </p>
            </div>
          )}

          <Button variant="primary" onClick={handleCalculate} fullWidth size="lg">
            Calculate Tax
          </Button>
        </div>
      </Card>

      {/* Results */}
      {results && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card variant="gradient" hover>
              <div className="text-center">
                <p className="text-slate-400 text-sm mb-1">Gross Income</p>
                <h3 className="text-xl font-bold text-white">
                  {formatCurrency(results.grossIncome)}
                </h3>
              </div>
            </Card>

            <Card variant="gradient" hover>
              <div className="text-center">
                <p className="text-slate-400 text-sm mb-1">Deductions</p>
                <h3 className="text-xl font-bold text-blue-400">
                  {formatCurrency(results.deductions)}
                </h3>
              </div>
            </Card>

            <Card variant="gradient" hover>
              <div className="text-center">
                <p className="text-slate-400 text-sm mb-1">Total Tax + Cess</p>
                <h3 className="text-xl font-bold text-red-400">
                  {formatCurrency(results.totalTax)}
                </h3>
              </div>
            </Card>

            <Card variant="gradient" hover>
              <div className="text-center">
                <p className="text-slate-400 text-sm mb-1">Net Income</p>
                <h3 className="text-xl font-bold text-green-400">
                  {formatCurrency(results.netIncome)}
                </h3>
              </div>
            </Card>
          </div>

          {/* Tax Breakdown */}
          <Card title="Tax Calculation Breakdown">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                <span className="text-slate-300">Gross Income</span>
                <span className="font-semibold text-white">
                  {formatCurrency(results.grossIncome)}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                <span className="text-slate-300">
                  Less: Deductions
                  {regime === 'new' && ' (Standard ₹75,000)'}
                  {regime === 'old' && ' (Standard ₹50,000 + 80C/80D)'}
                </span>
                <span className="font-semibold text-blue-400">
                  - {formatCurrency(results.deductions)}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                <span className="text-slate-300 font-semibold">Taxable Income</span>
                <span className="font-bold text-white">
                  {formatCurrency(results.taxableIncome)}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-sm font-semibold text-slate-300 mb-2">Tax Slabs:</p>
                {results.breakdown.map((slab, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 px-3 bg-slate-800/50 rounded-lg"
                  >
                    <div>
                      <span className="text-slate-300 text-sm">{slab.slab}</span>
                      <span className="text-xs text-slate-500 ml-2">@ {slab.rate}</span>
                    </div>
                    <span className="font-semibold text-red-400">
                      {formatCurrency(slab.amount)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                <span className="text-slate-300">Income Tax</span>
                <span className="font-semibold text-red-400">{formatCurrency(results.tax)}</span>
              </div>

              <div className="flex items-center justify-between pb-2">
                <span className="text-slate-300">Health & Education Cess (4%)</span>
                <span className="font-semibold text-red-400">{formatCurrency(results.cess)}</span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t-2 border-slate-600">
                <span className="text-white font-bold text-lg">Total Tax Payable</span>
                <span className="font-bold text-red-400 text-lg">
                  {formatCurrency(results.totalTax)}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-white font-bold text-lg">Net Income (Take Home)</span>
                <span className="font-bold text-green-400 text-lg">
                  {formatCurrency(results.netIncome)}
                </span>
              </div>
            </div>
          </Card>

          {/* Effective Tax Rate */}
          <Card>
            <div className="text-center">
              <p className="text-slate-400 text-sm mb-2">Effective Tax Rate</p>
              <h3 className="text-3xl font-bold text-white">
                {((results.totalTax / results.grossIncome) * 100).toFixed(2)}%
              </h3>
              <p className="text-slate-500 text-xs mt-1">
                (Tax as % of Gross Income)
              </p>
            </div>
          </Card>

          {/* Info */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-slate-300">
              <strong>Note:</strong> This calculation is for FY 2024-25 (AY 2025-26). {regime === 'new' ? 'New regime provides rebate under Section 87A for income up to ₹7 lakh.' : 'Old regime provides rebate under Section 87A for income up to ₹5 lakh.'}
              {' '}For personalized tax planning, consult a tax advisor.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default TaxCalculator;
