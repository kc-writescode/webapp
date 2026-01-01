/**
 * Retirement Calculator Component
 * Calculate retirement corpus needed
 */

import { useState } from 'react';
import { Landmark } from 'lucide-react';
import { calculateRetirementCorpus } from '@utils/calculations';
import { formatCurrency } from '@utils/formatters';
import Card from '@components/common/Card';
import Input from '@components/common/Input';
import Button from '@components/common/Button';

const RetirementCalculator = () => {
  const [currentAge, setCurrentAge] = useState('30');
  const [retirementAge, setRetirementAge] = useState('60');
  const [monthlyExpenses, setMonthlyExpenses] = useState('50000');
  const [inflationRate, setInflationRate] = useState('6');
  const [lifeExpectancy, setLifeExpectancy] = useState('80');
  const [results, setResults] = useState(null);

  const handleCalculate = () => {
    const result = calculateRetirementCorpus(
      Number(currentAge) || 30,
      Number(retirementAge) || 60,
      Number(monthlyExpenses) || 0,
      Number(inflationRate) || 6,
      Number(lifeExpectancy) || 80
    );
    setResults(result);
  };

  return (
    <div className="space-y-6">
      {/* Input Card */}
      <Card title="Retirement Planning Details" icon={Landmark}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Current Age
              </label>
              <Input
                type="number"
                value={currentAge}
                onChange={(e) => setCurrentAge(e.target.value)}
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
                onChange={(e) => setRetirementAge(e.target.value)}
                min="40"
                max="75"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Current Monthly Expenses
            </label>
            <Input
              type="number"
              value={monthlyExpenses}
              onChange={(e) => setMonthlyExpenses(e.target.value)}
              min="10000"
            />
            <div className="mt-2">
              <input
                type="range"
                min="10000"
                max="200000"
                step="5000"
                value={Number(monthlyExpenses) || 10000}
                onChange={(e) => setMonthlyExpenses(e.target.value)}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">{formatCurrency(Number(monthlyExpenses) || 0)} per month</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Expected Inflation Rate (%)
            </label>
            <Input
              type="number"
              value={inflationRate}
              onChange={(e) => setInflationRate(e.target.value)}
              min="1"
              max="15"
            />
            <div className="mt-2">
              <input
                type="range"
                min="1"
                max="15"
                step="0.5"
                value={Number(inflationRate) || 1}
                onChange={(e) => setInflationRate(e.target.value)}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {inflationRate || 0}% per annum (India average: 5-7%)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Life Expectancy
            </label>
            <Input
              type="number"
              value={lifeExpectancy}
              onChange={(e) => setLifeExpectancy(e.target.value)}
              min="60"
              max="100"
            />
            <p className="text-xs text-slate-400 mt-1">{lifeExpectancy || 0} years</p>
          </div>

          <Button variant="primary" onClick={handleCalculate} fullWidth size="lg">
            Calculate Retirement Corpus
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
                <p className="text-slate-400 text-sm mb-1">Current Monthly Expenses</p>
                <h3 className="text-2xl font-bold text-white">
                  {formatCurrency(Number(monthlyExpenses) || 0)}
                </h3>
              </div>
            </Card>

            <Card variant="gradient" hover>
              <div className="text-center">
                <p className="text-slate-400 text-sm mb-1">Expenses at Retirement</p>
                <h3 className="text-2xl font-bold text-orange-400">
                  {formatCurrency(results.monthlyExpensesAtRetirement)}
                </h3>
                <p className="text-xs text-slate-400 mt-1">@ {inflationRate || 0}% inflation</p>
              </div>
            </Card>

            <Card variant="gradient" hover>
              <div className="text-center">
                <p className="text-slate-400 text-sm mb-1">Corpus Needed</p>
                <h3 className="text-2xl font-bold text-emerald-400">
                  {formatCurrency(results.corpusNeeded)}
                </h3>
              </div>
            </Card>
          </div>

          {/* Detailed Breakdown */}
          <Card title="Retirement Plan Breakdown">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-blue-400 text-sm mb-1">Years to Retirement</p>
                  <p className="text-3xl font-bold text-white">{(Number(retirementAge) || 60) - (Number(currentAge) || 30)}</p>
                  <p className="text-xs text-slate-400 mt-1">Time to build your corpus</p>
                </div>

                <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <p className="text-purple-400 text-sm mb-1">Retirement Duration</p>
                  <p className="text-3xl font-bold text-white">{results.yearsInRetirement}</p>
                  <p className="text-xs text-slate-400 mt-1">Years in retirement</p>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/30 rounded-lg">
                <h4 className="text-lg font-semibold text-white mb-4">To Build This Corpus:</h4>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-slate-300">Monthly SIP Required</span>
                    <span className="text-xl font-bold text-emerald-400">
                      {formatCurrency(Math.round(results.corpusNeeded / ((Math.pow(1.12, (Number(retirementAge) || 60) - (Number(currentAge) || 30)) - 1) / 0.12 * 12)))}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 text-center">
                    Assuming 12% annual returns from equity investments
                  </p>
                </div>
              </div>

              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-sm text-slate-300">
                  <strong>Note:</strong> This is a simplified calculation. Consider other factors like:
                </p>
                <ul className="mt-2 space-y-1 text-xs text-slate-400 list-disc list-inside">
                  <li>EPF/PPF/NPS contributions</li>
                  <li>Real estate investments</li>
                  <li>Healthcare costs in retirement</li>
                  <li>Social Security benefits</li>
                  <li>Part-time income during retirement</li>
                </ul>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default RetirementCalculator;
