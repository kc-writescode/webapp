/**
 * EMI Calculator Component
 * Calculate Loan EMI and amortization schedule
 */

import { useState } from 'react';
import { Home } from 'lucide-react';
import { calculateEMI } from '@utils/calculations';
import { formatCurrency } from '@utils/formatters';
import Card from '@components/common/Card';
import Input from '@components/common/Input';
import Button from '@components/common/Button';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
        <p className="text-white font-semibold">{payload[0].name}</p>
        <p className="text-lg font-bold" style={{ color: payload[0].payload.color }}>
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const EMICalculator = () => {
  const [principal, setPrincipal] = useState('1000000');
  const [annualRate, setAnnualRate] = useState('8.5');
  const [tenureYears, setTenureYears] = useState('20');
  const [results, setResults] = useState(null);

  const handleCalculate = () => {
    const tenureMonths = (Number(tenureYears) || 0) * 12;
    const result = calculateEMI(Number(principal) || 0, Number(annualRate) || 0, tenureMonths);
    setResults(result);
  };

  const pieData = results ? [
    { name: 'Principal', value: Number(principal) || 0, color: '#3b82f6' },
    { name: 'Interest', value: results.totalInterest, color: '#ef4444' },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Input Card */}
      <Card title="Loan Details" icon={Home}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Loan Amount (Principal)
            </label>
            <Input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              min="10000"
            />
            <div className="mt-2">
              <input
                type="range"
                min="100000"
                max="10000000"
                step="100000"
                value={Number(principal) || 100000}
                onChange={(e) => setPrincipal(e.target.value)}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">{formatCurrency(Number(principal) || 0)}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Interest Rate (% per annum)
            </label>
            <Input
              type="number"
              value={annualRate}
              onChange={(e) => setAnnualRate(e.target.value)}
              min="1"
              max="20"
            />
            <div className="mt-2">
              <input
                type="range"
                min="1"
                max="20"
                step="0.1"
                value={Number(annualRate) || 1}
                onChange={(e) => setAnnualRate(e.target.value)}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">{annualRate || 0}% per annum</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Loan Tenure (Years)
            </label>
            <Input
              type="number"
              value={tenureYears}
              onChange={(e) => setTenureYears(e.target.value)}
              min="1"
              max="30"
            />
            <div className="mt-2">
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={Number(tenureYears) || 1}
                onChange={(e) => setTenureYears(e.target.value)}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {tenureYears || 0} years ({(Number(tenureYears) || 0) * 12} months)
            </p>
          </div>

          <Button variant="primary" onClick={handleCalculate} fullWidth size="lg">
            Calculate EMI
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
                <p className="text-slate-400 text-sm mb-1">Monthly EMI</p>
                <h3 className="text-2xl md:text-3xl font-bold text-white">
                  {formatCurrency(results.emi)}
                </h3>
              </div>
            </Card>

            <Card variant="gradient" hover>
              <div className="text-center">
                <p className="text-slate-400 text-sm mb-1">Total Interest</p>
                <h3 className="text-2xl md:text-3xl font-bold text-red-400">
                  {formatCurrency(results.totalInterest)}
                </h3>
              </div>
            </Card>

            <Card variant="gradient" hover>
              <div className="text-center">
                <p className="text-slate-400 text-sm mb-1">Total Payment</p>
                <h3 className="text-2xl md:text-3xl font-bold text-orange-400">
                  {formatCurrency(results.totalPayment)}
                </h3>
              </div>
            </Card>
          </div>

          {/* Pie Chart */}
          <Card title="Payment Breakdown">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${formatCurrency(entry.value)}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Amortization Schedule (First 12 months) */}
          <Card title="Amortization Schedule (First Year)">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-2 text-slate-400">Month</th>
                    <th className="text-right py-2 text-slate-400">EMI</th>
                    <th className="text-right py-2 text-slate-400">Principal</th>
                    <th className="text-right py-2 text-slate-400">Interest</th>
                    <th className="text-right py-2 text-slate-400">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {results.breakdown.slice(0, 12).map((row) => (
                    <tr key={row.month} className="border-b border-slate-800 hover:bg-slate-800/50">
                      <td className="py-2 text-white">{row.month}</td>
                      <td className="text-right text-orange-400">{formatCurrency(row.emi)}</td>
                      <td className="text-right text-blue-400">{formatCurrency(row.principal)}</td>
                      <td className="text-right text-red-400">{formatCurrency(row.interest)}</td>
                      <td className="text-right text-slate-300">{formatCurrency(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Showing first 12 months of {tenureYears * 12} months tenure
            </p>
          </Card>
        </>
      )}
    </div>
  );
};

export default EMICalculator;
