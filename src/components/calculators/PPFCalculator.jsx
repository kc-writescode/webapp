/**
 * PPF Calculator Component
 * Calculate Public Provident Fund maturity (India)
 */

import { useState } from 'react';
import { Shield } from 'lucide-react';
import { calculatePPF } from '@utils/calculations';
import { formatCurrency } from '@utils/formatters';
import Card from '@components/common/Card';
import Input from '@components/common/Input';
import Button from '@components/common/Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PPFCalculator = () => {
  const [annualInvestment, setAnnualInvestment] = useState(150000);
  const [years, setYears] = useState(15);
  const [interestRate, setInterestRate] = useState(7.1);
  const [results, setResults] = useState(null);

  const handleCalculate = () => {
    const result = calculatePPF(annualInvestment, years, interestRate);
    setResults(result);
  };

  return (
    <div className="space-y-6">
      {/* Input Card */}
      <Card title="PPF Investment Details" icon={Shield}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Annual Investment (Max ₹1.5 Lakh)
            </label>
            <Input
              type="number"
              value={annualInvestment}
              onChange={(e) => setAnnualInvestment(Math.min(150000, Number(e.target.value)))}
              min="500"
              max="150000"
              step="1000"
            />
            <div className="mt-2">
              <input
                type="range"
                min="500"
                max="150000"
                step="1000"
                value={annualInvestment}
                onChange={(e) => setAnnualInvestment(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {formatCurrency(annualInvestment)} per year
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Investment Period (Min 15 years)
            </label>
            <Input
              type="number"
              value={years}
              onChange={(e) => setYears(Math.max(15, Number(e.target.value)))}
              min="15"
              max="30"
              step="1"
            />
            <div className="mt-2">
              <input
                type="range"
                min="15"
                max="30"
                step="1"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">{years} years</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Interest Rate (Current: 7.1% for FY 2024-25)
            </label>
            <Input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              min="1"
              max="12"
              step="0.1"
            />
            <p className="text-xs text-slate-400 mt-1">{interestRate}% per annum (compounded annually)</p>
          </div>

          <Button variant="primary" onClick={handleCalculate} fullWidth size="lg">
            Calculate PPF Maturity
          </Button>
        </div>
      </Card>

      {/* Results */}
      {results && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card variant="gradient" hover>
              <div className="text-center">
                <p className="text-slate-400 text-sm mb-1">Total Invested</p>
                <h3 className="text-2xl font-bold text-white">
                  {formatCurrency(results.totalInvested)}
                </h3>
              </div>
            </Card>

            <Card variant="gradient" hover>
              <div className="text-center">
                <p className="text-slate-400 text-sm mb-1">Interest Earned</p>
                <h3 className="text-2xl font-bold text-green-400">
                  {formatCurrency(results.interest)}
                </h3>
              </div>
            </Card>

            <Card variant="gradient" hover>
              <div className="text-center">
                <p className="text-slate-400 text-sm mb-1">Maturity Amount</p>
                <h3 className="text-2xl font-bold text-emerald-400">
                  {formatCurrency(results.maturityAmount)}
                </h3>
              </div>
            </Card>
          </div>

          {/* Chart */}
          <Card title="Year-wise Growth">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={results.yearlyBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="year" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`} />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                />
                <Legend />
                <Bar dataKey="invested" fill="#3b82f6" name="Total Invested" />
                <Bar dataKey="balance" fill="#10b981" name="Account Balance" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <h4 className="font-semibold text-white mb-3">PPF Key Features</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• 15-year lock-in period (extendable in 5-year blocks)</li>
                <li>• Minimum deposit: ₹500 per year</li>
                <li>• Maximum deposit: ₹1,50,000 per year</li>
                <li>• Tax-free returns under Section 80C</li>
                <li>• Compounded annually</li>
                <li>• Partial withdrawal after 7 years</li>
                <li>• Loan facility available from 3rd to 6th year</li>
              </ul>
            </Card>

            <Card>
              <h4 className="font-semibold text-white mb-3">Tax Benefits</h4>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <p className="text-green-400 font-semibold mb-1">EEE Status</p>
                  <p className="text-slate-300">
                    Exempt-Exempt-Exempt: Investment, interest, and maturity all tax-free
                  </p>
                </div>
                <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-blue-400 font-semibold mb-1">Section 80C Deduction</p>
                  <p className="text-slate-300">
                    Up to ₹1.5 lakh deduction per year
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

export default PPFCalculator;
