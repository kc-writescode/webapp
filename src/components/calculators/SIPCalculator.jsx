/**
 * SIP Calculator Component
 * Calculate Systematic Investment Plan returns
 */

import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { calculateSIP } from '@utils/calculations';
import { formatCurrency } from '@utils/formatters';
import Card from '@components/common/Card';
import Input from '@components/common/Input';
import Button from '@components/common/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SIPCalculator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState('5000');
  const [annualReturn, setAnnualReturn] = useState('12');
  const [years, setYears] = useState('10');
  const [results, setResults] = useState(null);

  const handleCalculate = () => {
    const result = calculateSIP(
      Number(monthlyInvestment) || 0,
      Number(annualReturn) || 0,
      Number(years) || 0
    );
    setResults(result);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="text-white font-semibold mb-1">Year {data.year}</p>
          <p className="text-blue-400 text-sm">Invested: {formatCurrency(data.invested)}</p>
          <p className="text-green-400 text-sm">Value: {formatCurrency(data.value)}</p>
          <p className="text-emerald-400 text-sm">Returns: {formatCurrency(data.returns)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Input Card */}
      <Card title="Investment Details" icon={TrendingUp}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Monthly Investment Amount
            </label>
            <Input
              type="number"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(e.target.value)}
              min="100"
            />
            <div className="mt-2 flex items-center justify-between">
              <input
                type="range"
                min="500"
                max="100000"
                step="500"
                value={Number(monthlyInvestment) || 500}
                onChange={(e) => setMonthlyInvestment(e.target.value)}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {formatCurrency(Number(monthlyInvestment) || 0)} per month
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Expected Annual Return (%)
            </label>
            <Input
              type="number"
              value={annualReturn}
              onChange={(e) => setAnnualReturn(e.target.value)}
              min="1"
              max="30"
            />
            <div className="mt-2">
              <input
                type="range"
                min="1"
                max="30"
                step="0.5"
                value={Number(annualReturn) || 1}
                onChange={(e) => setAnnualReturn(e.target.value)}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">{annualReturn || 0}% per annum</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Investment Period (Years)
            </label>
            <Input
              type="number"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              min="1"
              max="40"
            />
            <div className="mt-2">
              <input
                type="range"
                min="1"
                max="40"
                step="1"
                value={Number(years) || 1}
                onChange={(e) => setYears(e.target.value)}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">{years || 0} years</p>
          </div>

          <Button variant="primary" onClick={handleCalculate} fullWidth size="lg">
            Calculate SIP Returns
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
                <p className="text-slate-400 text-sm mb-1">Future Value</p>
                <h3 className="text-2xl font-bold text-green-400">
                  {formatCurrency(results.futureValue)}
                </h3>
              </div>
            </Card>

            <Card variant="gradient" hover>
              <div className="text-center">
                <p className="text-slate-400 text-sm mb-1">Total Returns</p>
                <h3 className="text-2xl font-bold text-emerald-400">
                  {formatCurrency(results.returns)}
                </h3>
              </div>
            </Card>
          </div>

          {/* Chart */}
          <Card title="Growth Over Time">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={results.yearlyBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  dataKey="year"
                  stroke="#94a3b8"
                  label={{ value: 'Years', position: 'insideBottom', offset: -5 }}
                />
                <YAxis
                  stroke="#94a3b8"
                  tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="invested"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Invested"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Value"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Breakdown */}
          <Card title="Year-wise Breakdown">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-2 text-slate-400">Year</th>
                    <th className="text-right py-2 text-slate-400">Invested</th>
                    <th className="text-right py-2 text-slate-400">Value</th>
                    <th className="text-right py-2 text-slate-400">Returns</th>
                  </tr>
                </thead>
                <tbody>
                  {results.yearlyBreakdown.map((row) => (
                    <tr key={row.year} className="border-b border-slate-800 hover:bg-slate-800/50">
                      <td className="py-2 text-white">{row.year}</td>
                      <td className="text-right text-blue-400">{formatCurrency(row.invested)}</td>
                      <td className="text-right text-green-400">{formatCurrency(row.value)}</td>
                      <td className="text-right text-emerald-400">{formatCurrency(row.returns)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default SIPCalculator;
