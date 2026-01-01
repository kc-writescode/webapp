/**
 * Tax Calculator Component
 * Redirect to official Income Tax Department calculator (FY 2025-26)
 */

import { Receipt, ExternalLink } from 'lucide-react';
import Card from '@components/common/Card';

const TaxCalculator = () => {
  return (
    <div className="space-y-6">
      {/* Official Tax Calculator Reference */}
      <Card>
        <div className="flex flex-col items-center text-center p-8 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg">
          <div className="p-4 bg-orange-500/20 rounded-xl mb-6">
            <Receipt className="w-12 h-12 text-orange-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">
            Official Income Tax Calculator
          </h3>
          <p className="text-slate-300 mb-6 max-w-lg">
            For the most accurate and detailed tax calculations, use the official Income Tax Department calculator.
            It includes all deductions, rebates, and special provisions as per the latest FY 2025-26 tax laws.
          </p>
          <a
            href="https://incometaxindia.gov.in/pages/tools/tax-calculator.aspx"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all duration-200 text-lg font-semibold shadow-lg hover:shadow-xl"
          >
            Visit Official Calculator
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </Card>
    </div>
  );
};

export default TaxCalculator;
