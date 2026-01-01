/**
 * Financial Calculations
 * Formulas for EMI, SIP, compound interest, retirement planning, etc.
 */

/**
 * Calculate EMI (Equated Monthly Installment) for a loan
 * @param {number} principal - Loan amount
 * @param {number} annualRate - Annual interest rate (percentage)
 * @param {number} tenureMonths - Loan tenure in months
 * @returns {Object} { emi, totalInterest, totalPayment, breakdown }
 */
export const calculateEMI = (principal, annualRate, tenureMonths) => {
  if (principal <= 0 || tenureMonths <= 0) {
    return { emi: 0, totalInterest: 0, totalPayment: 0, breakdown: [] };
  }

  const monthlyRate = annualRate / 12 / 100;

  let emi;
  if (annualRate === 0) {
    emi = principal / tenureMonths;
  } else {
    emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
          (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  }

  const totalPayment = emi * tenureMonths;
  const totalInterest = totalPayment - principal;

  // Generate amortization schedule
  const breakdown = [];
  let balance = principal;

  for (let month = 1; month <= tenureMonths; month++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = emi - interestPayment;
    balance -= principalPayment;

    breakdown.push({
      month,
      emi: emi,
      principal: principalPayment,
      interest: interestPayment,
      balance: Math.max(0, balance),
    });
  }

  return {
    emi: Math.round(emi),
    totalInterest: Math.round(totalInterest),
    totalPayment: Math.round(totalPayment),
    breakdown,
  };
};

/**
 * Calculate SIP (Systematic Investment Plan) returns
 * @param {number} monthlyInvestment - Monthly investment amount
 * @param {number} annualReturn - Expected annual return (percentage)
 * @param {number} years - Investment duration in years
 * @returns {Object} { totalInvested, futureValue, returns, yearlyBreakdown }
 */
export const calculateSIP = (monthlyInvestment, annualReturn, years) => {
  if (monthlyInvestment <= 0 || years <= 0) {
    return { totalInvested: 0, futureValue: 0, returns: 0, yearlyBreakdown: [] };
  }

  const months = years * 12;
  const monthlyRate = annualReturn / 12 / 100;

  let futureValue;
  if (annualReturn === 0) {
    futureValue = monthlyInvestment * months;
  } else {
    futureValue = monthlyInvestment *
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
      (1 + monthlyRate);
  }

  const totalInvested = monthlyInvestment * months;
  const returns = futureValue - totalInvested;

  // Yearly breakdown
  const yearlyBreakdown = [];
  for (let year = 1; year <= years; year++) {
    const monthsInvested = year * 12;
    const yearlyFutureValue = annualReturn === 0
      ? monthlyInvestment * monthsInvested
      : monthlyInvestment *
        ((Math.pow(1 + monthlyRate, monthsInvested) - 1) / monthlyRate) *
        (1 + monthlyRate);
    const yearlyInvested = monthlyInvestment * monthsInvested;

    yearlyBreakdown.push({
      year,
      invested: Math.round(yearlyInvested),
      value: Math.round(yearlyFutureValue),
      returns: Math.round(yearlyFutureValue - yearlyInvested),
    });
  }

  return {
    totalInvested: Math.round(totalInvested),
    futureValue: Math.round(futureValue),
    returns: Math.round(returns),
    yearlyBreakdown,
  };
};

/**
 * Calculate lumpsum investment returns
 * @param {number} principal - Initial investment amount
 * @param {number} annualReturn - Expected annual return (percentage)
 * @param {number} years - Investment duration in years
 * @returns {Object} { invested, futureValue, returns, yearlyBreakdown }
 */
export const calculateLumpsum = (principal, annualReturn, years) => {
  if (principal <= 0 || years <= 0) {
    return { invested: 0, futureValue: 0, returns: 0, yearlyBreakdown: [] };
  }

  const rate = annualReturn / 100;
  const futureValue = principal * Math.pow(1 + rate, years);
  const returns = futureValue - principal;

  // Yearly breakdown
  const yearlyBreakdown = [];
  for (let year = 1; year <= years; year++) {
    const yearValue = principal * Math.pow(1 + rate, year);
    yearlyBreakdown.push({
      year,
      invested: Math.round(principal),
      value: Math.round(yearValue),
      returns: Math.round(yearValue - principal),
    });
  }

  return {
    invested: Math.round(principal),
    futureValue: Math.round(futureValue),
    returns: Math.round(returns),
    yearlyBreakdown,
  };
};

/**
 * Calculate compound interest
 * @param {number} principal - Initial amount
 * @param {number} rate - Interest rate (percentage)
 * @param {number} time - Time period in years
 * @param {number} frequency - Compounding frequency per year (1=yearly, 12=monthly, 365=daily)
 * @returns {Object} { principal, interest, totalAmount }
 */
export const calculateCompoundInterest = (principal, rate, time, frequency = 1) => {
  if (principal <= 0 || time <= 0) {
    return { principal: 0, interest: 0, totalAmount: 0 };
  }

  const totalAmount = principal * Math.pow(1 + (rate / 100) / frequency, frequency * time);
  const interest = totalAmount - principal;

  return {
    principal: Math.round(principal),
    interest: Math.round(interest),
    totalAmount: Math.round(totalAmount),
  };
};

/**
 * Calculate retirement corpus needed
 * @param {number} currentAge - Current age
 * @param {number} retirementAge - Planned retirement age
 * @param {number} monthlyExpenses - Current monthly expenses
 * @param {number} inflationRate - Expected inflation rate (percentage)
 * @param {number} lifeExpectancy - Expected life expectancy
 * @returns {Object} { corpusNeeded, monthlyExpensesAtRetirement, yearsInRetirement }
 */
export const calculateRetirementCorpus = (
  currentAge,
  retirementAge,
  monthlyExpenses,
  inflationRate,
  lifeExpectancy
) => {
  const yearsToRetirement = retirementAge - currentAge;
  const yearsInRetirement = lifeExpectancy - retirementAge;

  if (yearsToRetirement <= 0 || yearsInRetirement <= 0) {
    return { corpusNeeded: 0, monthlyExpensesAtRetirement: 0, yearsInRetirement: 0 };
  }

  // Monthly expenses at retirement (adjusted for inflation)
  const monthlyExpensesAtRetirement = monthlyExpenses * Math.pow(1 + inflationRate / 100, yearsToRetirement);

  // Corpus needed (assuming 4% safe withdrawal rate)
  const annualExpensesAtRetirement = monthlyExpensesAtRetirement * 12;
  const corpusNeeded = annualExpensesAtRetirement * yearsInRetirement;

  return {
    corpusNeeded: Math.round(corpusNeeded),
    monthlyExpensesAtRetirement: Math.round(monthlyExpensesAtRetirement),
    yearsInRetirement,
  };
};

/**
 * Calculate income tax (India - FY 2025-26)
 * @param {number} income - Annual gross income
 * @param {string} regime - 'old' or 'new'
 * @param {number} deductions - Section 80C, 80D deductions (only for old regime)
 * @returns {Object} { taxableIncome, tax, netIncome, breakdown }
 */
export const calculateIncomeTax = (income, regime = 'new', deductions = 0) => {
  let tax = 0;
  let taxableIncome = income;
  const breakdown = [];

  if (regime === 'new') {
    // New tax regime (FY 2025-26) - Standard deduction of ₹75,000
    const standardDeduction = 75000;
    taxableIncome = Math.max(0, income - standardDeduction);

    // New regime slabs (FY 2025-26)
    if (taxableIncome <= 300000) {
      tax = 0;
      breakdown.push({ slab: 'Up to ₹3,00,000', rate: '0%', amount: 0 });
    } else if (taxableIncome <= 700000) {
      tax = (taxableIncome - 300000) * 0.05;
      breakdown.push({ slab: '₹3,00,001 to ₹7,00,000', rate: '5%', amount: tax });
    } else if (taxableIncome <= 1000000) {
      tax = 20000 + (taxableIncome - 700000) * 0.10;
      breakdown.push({ slab: '₹3,00,001 to ₹7,00,000', rate: '5%', amount: 20000 });
      breakdown.push({ slab: '₹7,00,001 to ₹10,00,000', rate: '10%', amount: (taxableIncome - 700000) * 0.10 });
    } else if (taxableIncome <= 1200000) {
      tax = 50000 + (taxableIncome - 1000000) * 0.15;
      breakdown.push({ slab: 'Up to ₹10,00,000', rate: 'Various', amount: 50000 });
      breakdown.push({ slab: '₹10,00,001 to ₹12,00,000', rate: '15%', amount: (taxableIncome - 1000000) * 0.15 });
    } else if (taxableIncome <= 1500000) {
      tax = 80000 + (taxableIncome - 1200000) * 0.20;
      breakdown.push({ slab: 'Up to ₹12,00,000', rate: 'Various', amount: 80000 });
      breakdown.push({ slab: '₹12,00,001 to ₹15,00,000', rate: '20%', amount: (taxableIncome - 1200000) * 0.20 });
    } else {
      tax = 140000 + (taxableIncome - 1500000) * 0.30;
      breakdown.push({ slab: 'Up to ₹15,00,000', rate: 'Various', amount: 140000 });
      breakdown.push({ slab: 'Above ₹15,00,000', rate: '30%', amount: (taxableIncome - 1500000) * 0.30 });
    }

    // Rebate under Section 87A (if income up to ₹7 lakh)
    if (taxableIncome <= 700000) {
      tax = 0;
    }
  } else {
    // Old tax regime (with deductions)
    const standardDeduction = 50000;
    taxableIncome = Math.max(0, income - standardDeduction - deductions);

    if (taxableIncome <= 250000) {
      tax = 0;
      breakdown.push({ slab: 'Up to ₹2,50,000', rate: '0%', amount: 0 });
    } else if (taxableIncome <= 500000) {
      tax = (taxableIncome - 250000) * 0.05;
      breakdown.push({ slab: '₹2,50,001 to ₹5,00,000', rate: '5%', amount: tax });
    } else if (taxableIncome <= 1000000) {
      tax = 12500 + (taxableIncome - 500000) * 0.20;
      breakdown.push({ slab: '₹2,50,001 to ₹5,00,000', rate: '5%', amount: 12500 });
      breakdown.push({ slab: '₹5,00,001 to ₹10,00,000', rate: '20%', amount: (taxableIncome - 500000) * 0.20 });
    } else {
      tax = 112500 + (taxableIncome - 1000000) * 0.30;
      breakdown.push({ slab: 'Up to ₹10,00,000', rate: 'Various', amount: 112500 });
      breakdown.push({ slab: 'Above ₹10,00,000', rate: '30%', amount: (taxableIncome - 1000000) * 0.30 });
    }

    // Rebate under Section 87A (if income up to ₹5 lakh)
    if (taxableIncome <= 500000) {
      tax = Math.max(0, tax - 12500);
    }
  }

  // Add Health and Education Cess (4%)
  const cess = tax * 0.04;
  const totalTax = tax + cess;

  return {
    grossIncome: Math.round(income),
    deductions: regime === 'old' ? Math.round(deductions + 50000) : 75000,
    taxableIncome: Math.round(taxableIncome),
    tax: Math.round(tax),
    cess: Math.round(cess),
    totalTax: Math.round(totalTax),
    netIncome: Math.round(income - totalTax),
    breakdown,
  };
};

/**
 * Calculate CAGR (Compound Annual Growth Rate)
 * @param {number} initialValue - Starting value
 * @param {number} finalValue - Ending value
 * @param {number} years - Number of years
 * @returns {number} CAGR percentage
 */
export const calculateCAGR = (initialValue, finalValue, years) => {
  if (initialValue <= 0 || years <= 0) return 0;
  return ((Math.pow(finalValue / initialValue, 1 / years) - 1) * 100).toFixed(2);
};

/**
 * Calculate budget variance
 * @param {number} budgeted - Budgeted amount
 * @param {number} actual - Actual amount spent
 * @returns {Object} { variance, percentage, isOverBudget }
 */
export const calculateBudgetVariance = (budgeted, actual) => {
  const variance = actual - budgeted;
  const percentage = budgeted > 0 ? (variance / budgeted) * 100 : 0;

  return {
    variance: Math.round(variance),
    percentage: percentage.toFixed(2),
    isOverBudget: variance > 0,
  };
};

/**
 * Calculate PPF (Public Provident Fund) maturity - India
 * @param {number} annualInvestment - Annual investment (max ₹1.5 lakh)
 * @param {number} years - Investment period (15 years minimum)
 * @param {number} interestRate - PPF interest rate (default 7.1% for FY 2025-26)
 * @returns {Object} { totalInvested, maturityAmount, interest, yearlyBreakdown }
 */
export const calculatePPF = (annualInvestment, years = 15, interestRate = 7.1) => {
  // PPF limit: Max ₹1.5 lakh per year
  const investment = Math.min(annualInvestment, 150000);
  const rate = interestRate / 100;

  let balance = 0;
  const yearlyBreakdown = [];

  for (let year = 1; year <= years; year++) {
    balance = (balance + investment) * (1 + rate);
    yearlyBreakdown.push({
      year,
      invested: investment * year,
      balance: Math.round(balance),
      interest: Math.round(balance - (investment * year)),
    });
  }

  const totalInvested = investment * years;
  const maturityAmount = balance;
  const interest = maturityAmount - totalInvested;

  return {
    totalInvested: Math.round(totalInvested),
    maturityAmount: Math.round(maturityAmount),
    interest: Math.round(interest),
    yearlyBreakdown,
  };
};

/**
 * Calculate NPS (National Pension System) returns - India
 * @param {number} monthlyContribution - Monthly contribution
 * @param {number} currentAge - Current age
 * @param {number} retirementAge - Retirement age (default 60)
 * @param {number} expectedReturn - Expected annual return (default 10%)
 * @returns {Object} { totalInvested, maturityCorpus, annuityAmount, lumpsum }
 */
export const calculateNPS = (monthlyContribution, currentAge, retirementAge = 60, expectedReturn = 10) => {
  const years = retirementAge - currentAge;
  const sipResult = calculateSIP(monthlyContribution, expectedReturn, years);

  // At maturity, 40% must be used to purchase annuity
  const annuityPortion = sipResult.futureValue * 0.4;
  const lumpsum = sipResult.futureValue * 0.6;

  // Assume annuity rate of 6% per annum
  const monthlyAnnuity = (annuityPortion * 0.06) / 12;

  return {
    totalInvested: sipResult.totalInvested,
    maturityCorpus: sipResult.futureValue,
    annuityAmount: Math.round(annuityPortion),
    lumpsum: Math.round(lumpsum),
    monthlyPension: Math.round(monthlyAnnuity),
  };
};

/**
 * Calculate Sukanya Samriddhi Yojana (SSY) maturity - India
 * @param {number} annualInvestment - Annual deposit (max ₹1.5 lakh)
 * @param {number} years - Years of deposit (max 15 years)
 * @param {number} interestRate - SSY interest rate (default 8.2% for FY 2025-26)
 * @returns {Object} { totalInvested, maturityAmount, interest }
 */
export const calculateSSY = (annualInvestment, years = 15, interestRate = 8.2) => {
  // SSY limit: Max ₹1.5 lakh per year
  const investment = Math.min(annualInvestment, 150000);

  // Investment for 15 years, matures at 21 years
  const maturityYears = 21;
  const rate = interestRate / 100;

  let balance = 0;

  // Deposits for first 15 years
  for (let year = 1; year <= Math.min(years, 15); year++) {
    balance = (balance + investment) * (1 + rate);
  }

  // Interest continues till 21 years
  for (let year = years + 1; year <= maturityYears; year++) {
    balance = balance * (1 + rate);
  }

  const totalInvested = investment * Math.min(years, 15);
  const interest = balance - totalInvested;

  return {
    totalInvested: Math.round(totalInvested),
    maturityAmount: Math.round(balance),
    interest: Math.round(interest),
  };
};

export default {
  calculateEMI,
  calculateSIP,
  calculateLumpsum,
  calculateCompoundInterest,
  calculateRetirementCorpus,
  calculateIncomeTax,
  calculateCAGR,
  calculateBudgetVariance,
  calculatePPF,
  calculateNPS,
  calculateSSY,
};
