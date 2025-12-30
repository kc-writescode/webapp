/**
 * NPS Calculator Component
 * Calculate National Pension System returns (India)
 */

import { useState } from 'react';
import { Landmark } from 'lucide-react';
import { calculateNPS } from '@utils/calculations';
import { formatCurrency } from '@utils/formatters';
import Card from '@components/common/Card';
import Input from '@components/common/Input';
import Button from '@components/common/Button';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const NPSCalculator = () => {
  const [monthlyContribution, setMonthlyContribution] = useState(5000);
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [expectedReturn, setExpectedReturn] = useState(10);
  const [results, setResults] = useState(null);

  const handleCalculate = () => {
    const result = calculateNPS(monthlyContribution, currentAge, retirementAge, expectedReturn);
    setResults(result);
  };

  const pieData = results ? [
    { name: 'Lumpsum (60%)', value: results.lumpsum, color: '#10b981' },
    { name: 'Annuity (40%)', value: results.annuityAmount, color: '#3b82f6' },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Input Card */}
      <Card title="NPS Contribution Details" icon={Landmark}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Monthly Contribution
            </label>
            <Input
              type="number"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Number(e.target.value))}
              min="500"
              step="500"
            />
            <div className="mt-2">
              <input
                type="range"
                min="500"
                max="50000"
                step="500"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">{formatCurrency(monthlyContribution)} per month</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Current Age
              </label>
              <Input
                type="number"
                value={currentAge}
                onChange={(e) => setCurrentAge(Number(e.target.value))}
                min="18"
                max="65"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Retirement Age
              </label>
              <Input
                type="number"
                value={retirementAge}
                onChange={(e) => setRetirementAge(Number(e.target.value))}
                min="60"
                max="75"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Expected Annual Return (%)
            </label>
            <Input
              type="number"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(Number(e.target.value))}
              min="1"
              max="15"
              step="0.5"
            />
            <div className="mt-2">
              <input
                type="range"
                min="1"
                max="15"
                step="0.5"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {expectedReturn}% per annum (Historical NPS returns: 9-12%)
            </p>
          </div>

          <Button variant="primary" onClick={handleCalculate} fullWidth size="lg">
            Calculate NPS Returns
          </Button>
        </div>
      </Card>

      {/* Results */}
      {results && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card variant="gradient" hover>
              <div className="text-center">
                <p className="text-slate-400 text-sm mb-1">Total Invested</p>
                <h3 className="text-2xl font-bold text-white">
                  {formatCurrency(results.totalInvested)}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Over {retirementAge - currentAge} years
                </p>
              </div>
            </Card>

            <Card variant="gradient" hover>
              <div className="text-center">
                <p className="text-slate-400 text-sm mb-1">Maturity Corpus</p>
                <h3 className="text-2xl font-bold text-emerald-400">
                  {formatCurrency(results.maturityCorpus)}
                </h3>
                <p className="text-xs text-slate-400 mt-1">At age {retirementAge}</p>
              </div>
            </Card>
          </div>

          {/* Corpus Distribution */}
          <Card title="Corpus Distribution at Maturity">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>

              {/* Breakdown */}
              <div className="space-y-4">
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <p className="text-green-400 font-semibold mb-1">Lumpsum Withdrawal (60%)</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(results.lumpsum)}</p>
                  <p className="text-xs text-slate-400 mt-1">Tax-free withdrawal</p>
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-blue-400 font-semibold mb-1">Annuity Purchase (40%)</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(results.annuityAmount)}</p>
                  <p className="text-xs text-slate-400 mt-1">Mandatory annuity investment</p>
                </div>

                <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <p className="text-purple-400 font-semibold mb-1">Estimated Monthly Pension</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(results.monthlyPension)}</p>
                  <p className="text-xs text-slate-400 mt-1">@ 6% annuity rate</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <h4 className="font-semibold text-white mb-3">NPS Key Features</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• Regulated by PFRDA</li>
                <li>• Choice of pension fund managers</li>
                <li>• Two account types: Tier I & Tier II</li>
                <li>• Partial withdrawal allowed after 3 years</li>
                <li>• 60% lumpsum + 40% annuity at maturity</li>
                <li>• Tax benefits under Section 80C & 80CCD(1B)</li>
                <li>• Low cost compared to other pension plans</li>
              </ul>
            </Card>

            <Card>
              <h4 className="font-semibold text-white mb-3">Tax Benefits</h4>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-blue-400 font-semibold mb-1">Section 80CCD(1)</p>
                  <p className="text-slate-300">
                    Deduction under 80C limit (₹1.5 lakh)
                  </p>
                </div>
                <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <p className="text-purple-400 font-semibold mb-1">Section 80CCD(1B)</p>
                  <p className="text-slate-300">
                    Additional deduction of ₹50,000
                  </p>
                </div>
                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <p className="text-green-400 font-semibold mb-1">Tax on Maturity</p>
                  <p className="text-slate-300">
                    60% lumpsum is tax-free, annuity is taxable
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default NPSCalculator;
