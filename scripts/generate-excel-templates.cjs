/**
 * Advanced Excel Template Generator
 * Creates professional-grade financial spreadsheets with comprehensive formulas
 * Run with: node scripts/generate-excel-templates.cjs
 */

const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.join(__dirname, '../public/files/templates');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Helper to create workbook
function createWorkbook() {
  return XLSX.utils.book_new();
}

// Helper to add sheet
function addSheet(workbook, sheetData, sheetName, options = {}) {
  const sheet = XLSX.utils.aoa_to_sheet(sheetData);
  if (options.colWidths) {
    sheet['!cols'] = options.colWidths.map(w => ({ wch: w }));
  }
  if (options.merges) {
    sheet['!merges'] = options.merges;
  }
  XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
  return sheet;
}

// Helper to save workbook
function saveWorkbook(workbook, filename) {
  const filepath = path.join(OUTPUT_DIR, filename);
  XLSX.writeFile(workbook, filepath);
  console.log(`✓ Created: ${filename}`);
}

// ============================================
// 1. COMPLETE BUDGET PLANNER (Advanced)
// ============================================
function createBudgetPlanner() {
  const wb = createWorkbook();

  // Dashboard Sheet
  const dashboard = [
    ['MONTHLY BUDGET DASHBOARD'],
    ['Month:', 'January', '', 'Year:', 2025],
    [''],
    ['INCOME SUMMARY'],
    ['Total Monthly Income', { f: 'Income!E15' }],
    [''],
    ['EXPENSE SUMMARY'],
    ['Category', 'Budgeted', 'Actual', 'Variance', 'Status'],
    ['Housing & Utilities', { f: 'Expenses!C17' }, { f: 'Expenses!D17' }, { f: 'B9-C9' }, { f: 'IF(D9>=0,"Under","Over")' }],
    ['Transportation', { f: 'Expenses!C24' }, { f: 'Expenses!D24' }, { f: 'B10-C10' }, { f: 'IF(D10>=0,"Under","Over")' }],
    ['Food & Groceries', { f: 'Expenses!C31' }, { f: 'Expenses!D31' }, { f: 'B11-C11' }, { f: 'IF(D11>=0,"Under","Over")' }],
    ['Healthcare', { f: 'Expenses!C38' }, { f: 'Expenses!D38' }, { f: 'B12-C12' }, { f: 'IF(D12>=0,"Under","Over")' }],
    ['Personal & Lifestyle', { f: 'Expenses!C47' }, { f: 'Expenses!D47' }, { f: 'B13-C13' }, { f: 'IF(D13>=0,"Under","Over")' }],
    ['Savings & Investments', { f: 'Expenses!C56' }, { f: 'Expenses!D56' }, { f: 'B14-C14' }, { f: 'IF(D14>=0,"Under","Over")' }],
    ['EMIs & Loans', { f: 'Expenses!C63' }, { f: 'Expenses!D63' }, { f: 'B15-C15' }, { f: 'IF(D15>=0,"Under","Over")' }],
    ['Other', { f: 'Expenses!C70' }, { f: 'Expenses!D70' }, { f: 'B16-C16' }, { f: 'IF(D16>=0,"Under","Over")' }],
    [''],
    ['TOTAL EXPENSES', { f: 'SUM(B9:B16)' }, { f: 'SUM(C9:C16)' }, { f: 'B18-C18' }],
    [''],
    ['KEY METRICS'],
    ['Net Savings (Income - Expenses)', { f: 'B5-C18' }],
    ['Savings Rate (%)', { f: 'IF(B5>0,ROUND(B21/B5*100,1),0)' }],
    ['Budget Utilization (%)', { f: 'IF(B18>0,ROUND(C18/B18*100,1),0)' }],
    [''],
    ['50/30/20 RULE ANALYSIS'],
    ['Category', 'Target %', 'Your %', 'Amount', 'Status'],
    ['Needs (Housing, Food, Transport, Health, EMIs)', 50, { f: 'ROUND((C9+C10+C11+C12+C15)/B5*100,1)' }, { f: 'C9+C10+C11+C12+C15' }, { f: 'IF(C27<=B27,"Good","Review")' }],
    ['Wants (Lifestyle, Personal)', 30, { f: 'ROUND((C13+C16)/B5*100,1)' }, { f: 'C13+C16' }, { f: 'IF(C28<=B28,"Good","Review")' }],
    ['Savings & Investments', 20, { f: 'ROUND(C14/B5*100,1)' }, { f: 'C14' }, { f: 'IF(C29>=B29,"Great!","Increase")' }],
    [''],
    ['FINANCIAL HEALTH SCORE'],
    ['Score (out of 100)', { f: 'MIN(100,ROUND((IF(B22>=20,30,B22*1.5)+IF(C27<=50,25,(100-C27)*0.5)+IF(C28<=30,25,(60-C28)*0.83)+IF(B23<=100,20,0)),0))' }],
    ['Rating', { f: 'IF(B32>=80,"Excellent",IF(B32>=60,"Good",IF(B32>=40,"Fair","Needs Work")))' }],
  ];
  addSheet(wb, dashboard, 'Dashboard', { colWidths: [40, 15, 15, 15, 12] });

  // Income Sheet
  const income = [
    ['INCOME TRACKER'],
    [''],
    ['Track all your income sources below. The dashboard will automatically update.'],
    [''],
    ['REGULAR INCOME'],
    ['Source', 'Gross Amount', 'Deductions', 'Net Amount', 'Frequency'],
    ['Primary Salary', 75000, 15000, { f: 'B7-C7' }, 'Monthly'],
    ['Spouse Salary', 0, 0, { f: 'B8-C8' }, 'Monthly'],
    [''],
    ['ADDITIONAL INCOME'],
    ['Source', 'Amount', '', 'Net Amount', 'Notes'],
    ['Freelance/Consulting', 5000, '', { f: 'B12' }, ''],
    ['Rental Income', 0, '', { f: 'B13' }, ''],
    ['Interest/Dividends', 500, '', { f: 'B14' }, ''],
    ['Other Income', 0, '', { f: 'B15' }, ''],
    [''],
    ['TOTAL MONTHLY INCOME', '', '', { f: 'SUM(D7:D8,D12:D15)' }],
    [''],
    ['ANNUAL PROJECTION'],
    ['Estimated Annual Income', { f: 'E17*12' }],
    [''],
    ['INCOME GROWTH TRACKING'],
    ['Month', 'Income', 'Change', '% Change'],
    ['January', { f: 'E17' }, '-', '-'],
    ['February', '', { f: 'IF(B24>0,B24-B23,"")' }, { f: 'IF(AND(B23>0,B24>0),ROUND(C24/B23*100,1),"")' }],
    ['March', '', { f: 'IF(B25>0,B25-B24,"")' }, { f: 'IF(AND(B24>0,B25>0),ROUND(C25/B24*100,1),"")' }],
    ['April', '', { f: 'IF(B26>0,B26-B25,"")' }, { f: 'IF(AND(B25>0,B26>0),ROUND(C26/B25*100,1),"")' }],
    ['May', '', { f: 'IF(B27>0,B27-B26,"")' }, { f: 'IF(AND(B26>0,B27>0),ROUND(C27/B26*100,1),"")' }],
    ['June', '', { f: 'IF(B28>0,B28-B27,"")' }, { f: 'IF(AND(B27>0,B28>0),ROUND(C28/B27*100,1),"")' }],
  ];
  addSheet(wb, income, 'Income', { colWidths: [25, 15, 15, 15, 15] });

  // Expenses Sheet (Comprehensive)
  const expenses = [
    ['EXPENSE TRACKER'],
    [''],
    ['Instructions: Enter your budgeted amount and actual spending. Status updates automatically.'],
    [''],
    ['TIP: Start with last 3 months bank statements to estimate realistic budgets.'],
    [''],
    ['HOUSING & UTILITIES'],
    ['Item', 'Budgeted', 'Actual', 'Variance', 'Notes'],
    ['Rent / Home Loan EMI', 20000, '', { f: 'B9-C9' }, ''],
    ['Society Maintenance', 3000, '', { f: 'B10-C10' }, ''],
    ['Electricity Bill', 2500, '', { f: 'B11-C11' }, ''],
    ['Water Bill', 500, '', { f: 'B12-C12' }, ''],
    ['Gas (Piped/Cylinder)', 800, '', { f: 'B13-C13' }, ''],
    ['Internet & Cable', 1500, '', { f: 'B14-C14' }, ''],
    ['Mobile Recharge', 500, '', { f: 'B15-C15' }, ''],
    ['Home Insurance', 500, '', { f: 'B16-C16' }, ''],
    ['Subtotal - Housing', { f: 'SUM(B9:B16)' }, { f: 'SUM(C9:C16)' }, { f: 'B17-C17' }],
    [''],
    ['TRANSPORTATION'],
    ['Item', 'Budgeted', 'Actual', 'Variance', 'Notes'],
    ['Fuel/Petrol', 4000, '', { f: 'B21-C21' }, ''],
    ['Public Transport/Metro', 1000, '', { f: 'B22-C22' }, ''],
    ['Cab/Auto (Ola/Uber)', 1500, '', { f: 'B23-C23' }, ''],
    ['Subtotal - Transport', { f: 'SUM(B21:B23)' }, { f: 'SUM(C21:C23)' }, { f: 'B24-C24' }],
    [''],
    ['FOOD & GROCERIES'],
    ['Item', 'Budgeted', 'Actual', 'Variance', 'Notes'],
    ['Groceries (Kirana/BigBasket)', 8000, '', { f: 'B28-C28' }, ''],
    ['Milk & Dairy', 1500, '', { f: 'B29-C29' }, ''],
    ['Dining Out/Restaurants', 3000, '', { f: 'B30-C30' }, ''],
    ['Subtotal - Food', { f: 'SUM(B28:B30)' }, { f: 'SUM(C28:C30)' }, { f: 'B31-C31' }],
    [''],
    ['HEALTHCARE'],
    ['Item', 'Budgeted', 'Actual', 'Variance', 'Notes'],
    ['Health Insurance Premium', 2000, '', { f: 'B35-C35' }, ''],
    ['Medicines/Pharmacy', 1000, '', { f: 'B36-C36' }, ''],
    ['Doctor Visits', 500, '', { f: 'B37-C37' }, ''],
    ['Subtotal - Healthcare', { f: 'SUM(B35:B37)' }, { f: 'SUM(C35:C37)' }, { f: 'B38-C38' }],
    [''],
    ['PERSONAL & LIFESTYLE'],
    ['Item', 'Budgeted', 'Actual', 'Variance', 'Notes'],
    ['Clothing & Accessories', 2000, '', { f: 'B42-C42' }, ''],
    ['Personal Care/Grooming', 1000, '', { f: 'B43-C43' }, ''],
    ['Entertainment (Movies, OTT)', 1000, '', { f: 'B44-C44' }, ''],
    ['Gym/Sports/Fitness', 1500, '', { f: 'B45-C45' }, ''],
    ['Hobbies & Learning', 500, '', { f: 'B46-C46' }, ''],
    ['Subtotal - Lifestyle', { f: 'SUM(B42:B46)' }, { f: 'SUM(C42:C46)' }, { f: 'B47-C47' }],
    [''],
    ['SAVINGS & INVESTMENTS'],
    ['Item', 'Budgeted', 'Actual', 'Variance', 'Notes'],
    ['Emergency Fund', 3000, '', { f: 'B51-C51' }, ''],
    ['SIP - Mutual Funds', 5000, '', { f: 'B52-C52' }, ''],
    ['PPF/NPS', 2000, '', { f: 'B53-C53' }, ''],
    ['Stocks/Direct Equity', 2000, '', { f: 'B54-C54' }, ''],
    ['Other Savings', 1000, '', { f: 'B55-C55' }, ''],
    ['Subtotal - Savings', { f: 'SUM(B51:B55)' }, { f: 'SUM(C51:C55)' }, { f: 'B56-C56' }],
    [''],
    ['EMIs & LOANS'],
    ['Item', 'Budgeted', 'Actual', 'Variance', 'Notes'],
    ['Car Loan EMI', 0, '', { f: 'B60-C60' }, ''],
    ['Personal Loan EMI', 0, '', { f: 'B61-C61' }, ''],
    ['Credit Card Payment', 0, '', { f: 'B62-C62' }, ''],
    ['Subtotal - EMIs', { f: 'SUM(B60:B62)' }, { f: 'SUM(C60:C62)' }, { f: 'B63-C63' }],
    [''],
    ['OTHER EXPENSES'],
    ['Item', 'Budgeted', 'Actual', 'Variance', 'Notes'],
    ['Children Education', 0, '', { f: 'B67-C67' }, ''],
    ['Gifts & Donations', 500, '', { f: 'B68-C68' }, ''],
    ['Miscellaneous', 1000, '', { f: 'B69-C69' }, ''],
    ['Subtotal - Other', { f: 'SUM(B67:B69)' }, { f: 'SUM(C67:C69)' }, { f: 'B70-C70' }],
    [''],
    ['GRAND TOTAL', { f: 'B17+B24+B31+B38+B47+B56+B63+B70' }, { f: 'C17+C24+C31+C38+C47+C56+C63+C70' }, { f: 'B72-C72' }],
  ];
  addSheet(wb, expenses, 'Expenses', { colWidths: [30, 15, 15, 12, 25] });

  // Monthly History Sheet
  const history = [
    ['MONTHLY HISTORY TRACKER'],
    [''],
    ['Track your finances over time to identify trends and patterns.'],
    [''],
    ['Month', 'Total Income', 'Total Expenses', 'Net Savings', 'Savings Rate %', 'Notes'],
    ['January 2025', { f: 'Income!E17' }, { f: 'Expenses!C72' }, { f: 'B6-C6' }, { f: 'IF(B6>0,ROUND(D6/B6*100,1),0)' }, ''],
    ['February 2025', '', '', { f: 'B7-C7' }, { f: 'IF(B7>0,ROUND(D7/B7*100,1),0)' }, ''],
    ['March 2025', '', '', { f: 'B8-C8' }, { f: 'IF(B8>0,ROUND(D8/B8*100,1),0)' }, ''],
    ['April 2025', '', '', { f: 'B9-C9' }, { f: 'IF(B9>0,ROUND(D9/B9*100,1),0)' }, ''],
    ['May 2025', '', '', { f: 'B10-C10' }, { f: 'IF(B10>0,ROUND(D10/B10*100,1),0)' }, ''],
    ['June 2025', '', '', { f: 'B11-C11' }, { f: 'IF(B11>0,ROUND(D11/B11*100,1),0)' }, ''],
    ['July 2025', '', '', { f: 'B12-C12' }, { f: 'IF(B12>0,ROUND(D12/B12*100,1),0)' }, ''],
    ['August 2025', '', '', { f: 'B13-C13' }, { f: 'IF(B13>0,ROUND(D13/B13*100,1),0)' }, ''],
    ['September 2025', '', '', { f: 'B14-C14' }, { f: 'IF(B14>0,ROUND(D14/B14*100,1),0)' }, ''],
    ['October 2025', '', '', { f: 'B15-C15' }, { f: 'IF(B15>0,ROUND(D15/B15*100,1),0)' }, ''],
    ['November 2025', '', '', { f: 'B16-C16' }, { f: 'IF(B16>0,ROUND(D16/B16*100,1),0)' }, ''],
    ['December 2025', '', '', { f: 'B17-C17' }, { f: 'IF(B17>0,ROUND(D17/B17*100,1),0)' }, ''],
    [''],
    ['YEARLY SUMMARY'],
    ['Total Income', { f: 'SUM(B6:B17)' }],
    ['Total Expenses', { f: 'SUM(C6:C17)' }],
    ['Total Savings', { f: 'SUM(D6:D17)' }],
    ['Average Savings Rate', { f: 'IF(B20>0,ROUND(D22/B20*100,1),0)' }],
  ];
  addSheet(wb, history, 'Monthly History', { colWidths: [18, 15, 15, 15, 15, 30] });

  saveWorkbook(wb, 'budget-planner.xlsx');
}

// ============================================
// 2. SALARY & TAX CALCULATOR (Advanced)
// ============================================
function createSalaryCalculator() {
  const wb = createWorkbook();

  // Main Calculator
  const calculator = [
    ['SALARY & TAX CALCULATOR FY 2025-26'],
    [''],
    ['SECTION A: YOUR CTC DETAILS'],
    [''],
    ['Annual CTC', 1500000],
    ['Basic Salary (% of CTC)', 40],
    ['HRA (% of Basic)', 50],
    [''],
    ['SECTION B: PERSONAL DETAILS'],
    [''],
    ['Age (Years)', 30],
    ['City Type (1=Metro, 0=Non-Metro)', 1],
    ['Monthly Rent Paid', 25000],
    [''],
    ['SECTION C: SALARY BREAKDOWN'],
    [''],
    ['Component', 'Annual', 'Monthly'],
    ['Basic Salary', { f: 'B5*B6/100' }, { f: 'B18/12' }],
    ['HRA', { f: 'B18*B7/100' }, { f: 'B19/12' }],
    ['Special Allowance', { f: 'B5-B18-B19-B18*0.12-B18*0.0481' }, { f: 'B20/12' }],
    [''],
    ['Gross Salary', { f: 'SUM(B18:B20)' }, { f: 'B22/12' }],
    [''],
    ['EMPLOYER CONTRIBUTIONS (Part of CTC)'],
    ['EPF (Employer 12%)', { f: 'MIN(B18*0.12,21600)' }, { f: 'B25/12' }],
    ['Gratuity (4.81%)', { f: 'B18*0.0481' }, { f: 'B26/12' }],
    [''],
    ['EMPLOYEE DEDUCTIONS'],
    ['EPF (Employee 12%)', { f: 'MIN(B18*0.12,21600)' }, { f: 'B29/12' }],
    ['Professional Tax', 2500, { f: 'B30/12' }],
    [''],
    ['Total Deductions (Before Tax)', { f: 'SUM(B29:B30)' }, { f: 'B32/12' }],
    [''],
    ['TAX CALCULATION - NEW REGIME FY 2025-26'],
    [''],
    ['Gross Taxable Income', { f: 'B22' }],
    ['Less: Standard Deduction', 75000],
    ['Taxable Income', { f: 'MAX(B36-B37,0)' }],
    [''],
    ['Tax Slabs:'],
    ['0-4L @ 0%', 0],
    ['4-8L @ 5%', { f: 'IF(B38>400000,MIN(B38-400000,400000)*0.05,0)' }],
    ['8-12L @ 10%', { f: 'IF(B38>800000,MIN(B38-800000,400000)*0.1,0)' }],
    ['12-16L @ 15%', { f: 'IF(B38>1200000,MIN(B38-1200000,400000)*0.15,0)' }],
    ['16-20L @ 20%', { f: 'IF(B38>1600000,MIN(B38-1600000,400000)*0.2,0)' }],
    ['20-24L @ 25%', { f: 'IF(B38>2000000,MIN(B38-2000000,400000)*0.25,0)' }],
    ['Above 24L @ 30%', { f: 'IF(B38>2400000,(B38-2400000)*0.3,0)' }],
    ['Total Tax', { f: 'SUM(B41:B47)' }],
    ['Less: Rebate u/s 87A', { f: 'IF(B38<=1200000,B48,0)' }],
    ['Tax after Rebate', { f: 'MAX(B48-B49,0)' }],
    ['Add: Cess @ 4%', { f: 'B50*0.04' }],
    ['Total Tax Payable (New)', { f: 'B50+B51' }],
    [''],
    ['FINAL IN-HAND CALCULATION'],
    [''],
    ['Annual Gross Salary', { f: 'B22' }],
    ['Less: EPF Deduction', { f: 'B29' }],
    ['Less: Professional Tax', { f: 'B30' }],
    ['Less: Income Tax', { f: 'B52' }],
    ['Annual In-Hand', { f: 'B55-B56-B57-B58' }],
    ['Monthly In-Hand', { f: 'ROUND(B59/12,0)' }],
  ];
  addSheet(wb, calculator, 'Calculator', { colWidths: [35, 18, 15] });

  // Tax Slabs Reference
  const taxSlabs = [
    ['INCOME TAX SLABS - QUICK REFERENCE'],
    [''],
    ['NEW TAX REGIME FY 2025-26 (Default)'],
    [''],
    ['Income Slab', 'Tax Rate'],
    ['Up to 4,00,000', '0%'],
    ['4,00,001 - 8,00,000', '5%'],
    ['8,00,001 - 12,00,000', '10%'],
    ['12,00,001 - 16,00,000', '15%'],
    ['16,00,001 - 20,00,000', '20%'],
    ['20,00,001 - 24,00,000', '25%'],
    ['Above 24,00,000', '30%'],
    [''],
    ['Key Points:'],
    ['Standard Deduction: 75,000'],
    ['Full tax rebate if income up to 12 Lakhs'],
    [''],
    ['OLD TAX REGIME'],
    [''],
    ['Income Slab', 'Tax Rate'],
    ['Up to 2,50,000', '0%'],
    ['2,50,001 - 5,00,000', '5%'],
    ['5,00,001 - 10,00,000', '20%'],
    ['Above 10,00,000', '30%'],
    [''],
    ['Available Deductions in Old Regime:'],
    ['Section 80C: Up to 1,50,000'],
    ['Section 80D: 25,000 (50,000 for seniors)'],
    ['HRA Exemption: As per rules'],
    ['NPS 80CCD(1B): Additional 50,000'],
    ['Home Loan Interest: Up to 2,00,000'],
  ];
  addSheet(wb, taxSlabs, 'Tax Slabs', { colWidths: [30, 15] });

  saveWorkbook(wb, 'salary-calculator.xlsx');
}

// ============================================
// 3. DEBT FREEDOM TRACKER (Advanced)
// ============================================
function createDebtTracker() {
  const wb = createWorkbook();

  // Dashboard
  const dashboard = [
    ['DEBT FREEDOM DASHBOARD'],
    [''],
    ['DEBT OVERVIEW'],
    [''],
    ['Total Original Debt', { f: "'Debt List'!C15" }],
    ['Total Current Balance', { f: "'Debt List'!D15" }],
    ['Total Paid Off', { f: 'B5-B6' }],
    ['Progress', { f: 'IF(B5>0,ROUND(B7/B5*100,1),0)' }, '%'],
    [''],
    ['Monthly Minimum Payment', { f: "'Debt List'!E15" }],
    ['Your Monthly Budget', { f: "'Debt List'!B18" }],
    ['Extra Payment Available', { f: 'B11-B10' }],
    [''],
    ['PAYOFF PROJECTIONS'],
    [''],
    ['Strategy', 'Months to Freedom', 'Total Interest'],
    ['Minimum Payments Only', { f: 'ROUND(B6/B10,0)' }, { f: 'B17*B10-B6' }],
    ['With Extra Payments', { f: 'ROUND(B6/B11,0)' }, { f: 'B18*B11-B6' }],
    ['Months Saved', { f: 'B17-B18' }, ''],
    [''],
    ['MOTIVATION TRACKER'],
    [''],
    ['Milestone', 'Target', 'Status'],
    ['25% Debt Free', { f: 'B5*0.25' }, { f: 'IF(B7>=B24,"ACHIEVED!","In Progress")' }],
    ['50% Debt Free', { f: 'B5*0.5' }, { f: 'IF(B7>=B25,"ACHIEVED!","In Progress")' }],
    ['75% Debt Free', { f: 'B5*0.75' }, { f: 'IF(B7>=B26,"ACHIEVED!","In Progress")' }],
    ['100% DEBT FREE!', { f: 'B5' }, { f: 'IF(B7>=B27,"CONGRATULATIONS!","Keep Going!")' }],
  ];
  addSheet(wb, dashboard, 'Dashboard', { colWidths: [30, 18, 15] });

  // Debt List
  const debtList = [
    ['DEBT LIST'],
    [''],
    ['Enter all your debts below:'],
    [''],
    ['Debt Name', 'Lender', 'Original Amount', 'Current Balance', 'Min Payment', 'Interest Rate %', 'Due Date'],
    ['Credit Card 1', 'HDFC', 80000, 65000, 3250, 42, 5],
    ['Credit Card 2', 'ICICI', 45000, 38000, 1900, 39, 10],
    ['Personal Loan', 'Bajaj', 300000, 220000, 12000, 16, 5],
    ['Car Loan', 'HDFC', 600000, 480000, 15000, 9.5, 1],
    ['Gold Loan', 'Muthoot', 100000, 75000, 4000, 12, 15],
    ['Education Loan', 'SBI', 500000, 420000, 8500, 8.5, 10],
    ['Consumer Durable', 'Bajaj', 50000, 30000, 3500, 14, 20],
    ['Add more...', '', '', '', '', '', ''],
    [''],
    ['TOTALS', '', { f: 'SUM(C6:C13)' }, { f: 'SUM(D6:D13)' }, { f: 'SUM(E6:E13)' }],
    [''],
    ['YOUR MONTHLY BUDGET FOR DEBT'],
    ['Amount you can pay monthly:', 55000],
    ['Extra beyond minimum:', { f: 'B18-E15' }],
    [''],
    ['PAYOFF ORDER - AVALANCHE (Highest Interest First):'],
    ['1. Credit Card 1 (42%)'],
    ['2. Credit Card 2 (39%)'],
    ['3. Personal Loan (16%)'],
    ['4. Consumer Durable (14%)'],
    ['5. Gold Loan (12%)'],
    [''],
    ['PAYOFF ORDER - SNOWBALL (Smallest Balance First):'],
    ['1. Consumer Durable (30,000)'],
    ['2. Credit Card 2 (38,000)'],
    ['3. Credit Card 1 (65,000)'],
    ['4. Gold Loan (75,000)'],
  ];
  addSheet(wb, debtList, 'Debt List', { colWidths: [20, 12, 18, 18, 15, 15, 10] });

  // Payment Tracker
  const payments = [
    ['PAYMENT TRACKER'],
    [''],
    ['Record each payment to track progress.'],
    [''],
    ['Date', 'Debt Name', 'Payment Amount', 'Interest', 'Principal', 'New Balance', 'Notes'],
    ['01-Jan-2025', 'Credit Card 1', 10000, 2275, 7725, 57275, 'Extra payment'],
    ['01-Jan-2025', 'Credit Card 2', 1900, 1235, 665, 37335, 'Minimum'],
    ['01-Jan-2025', 'Personal Loan', 12000, 2933, 9067, 210933, 'Minimum'],
    ['01-Jan-2025', 'Car Loan', 15000, 3800, 11200, 468800, 'Minimum'],
    ['01-Jan-2025', 'Gold Loan', 4000, 750, 3250, 71750, 'Minimum'],
    ['01-Jan-2025', 'Education Loan', 8500, 2975, 5525, 414475, 'Minimum'],
    ['01-Jan-2025', 'Consumer Durable', 3500, 350, 3150, 26850, 'Minimum'],
    ['', '', '', '', '', '', ''],
    ['Continue adding...', '', '', '', '', '', ''],
    [''],
    ['MONTHLY SUMMARY'],
    ['Total Paid This Month', { f: 'SUM(C6:C12)' }],
    ['Total to Interest', { f: 'SUM(D6:D12)' }],
    ['Total to Principal', { f: 'SUM(E6:E12)' }],
  ];
  addSheet(wb, payments, 'Payment Tracker', { colWidths: [15, 18, 15, 12, 12, 15, 20] });

  saveWorkbook(wb, 'debt-tracker.xlsx');
}

// ============================================
// 4. INVESTMENT PORTFOLIO MANAGER (Advanced)
// ============================================
function createInvestmentTracker() {
  const wb = createWorkbook();

  // Portfolio Dashboard
  const dashboard = [
    ['INVESTMENT PORTFOLIO DASHBOARD'],
    [''],
    ['Last Updated:', '', 'Portfolio Age (Years):', 1],
    [''],
    ['PORTFOLIO SUMMARY'],
    [''],
    ['Asset Class', 'Invested', 'Current Value', 'Gain/Loss', 'Return %', 'Allocation %'],
    ['Mutual Funds', { f: "'Mutual Funds'!D25" }, { f: "'Mutual Funds'!E25" }, { f: 'C8-B8' }, { f: 'IF(B8>0,ROUND((C8-B8)/B8*100,2),0)' }, { f: 'IF($C$13>0,ROUND(C8/$C$13*100,1),0)' }],
    ['Stocks', { f: 'Stocks!F20' }, { f: 'Stocks!G20' }, { f: 'C9-B9' }, { f: 'IF(B9>0,ROUND((C9-B9)/B9*100,2),0)' }, { f: 'IF($C$13>0,ROUND(C9/$C$13*100,1),0)' }],
    ['Fixed Deposits', { f: "'Fixed Income'!B18" }, { f: "'Fixed Income'!C18" }, { f: 'C10-B10' }, { f: 'IF(B10>0,ROUND((C10-B10)/B10*100,2),0)' }, { f: 'IF($C$13>0,ROUND(C10/$C$13*100,1),0)' }],
    ['PPF/EPF', { f: "'Fixed Income'!B19" }, { f: "'Fixed Income'!C19" }, { f: 'C11-B11' }, { f: 'IF(B11>0,ROUND((C11-B11)/B11*100,2),0)' }, { f: 'IF($C$13>0,ROUND(C11/$C$13*100,1),0)' }],
    ['NPS', { f: "'Fixed Income'!B20" }, { f: "'Fixed Income'!C20" }, { f: 'C12-B12' }, { f: 'IF(B12>0,ROUND((C12-B12)/B12*100,2),0)' }, { f: 'IF($C$13>0,ROUND(C12/$C$13*100,1),0)' }],
    [''],
    ['TOTAL PORTFOLIO', { f: 'SUM(B8:B12)' }, { f: 'SUM(C8:C12)' }, { f: 'SUM(D8:D12)' }, { f: 'IF(B14>0,ROUND((C14-B14)/B14*100,2),0)' }, 100],
    [''],
    ['PERFORMANCE METRICS'],
    [''],
    ['Absolute Return', { f: 'D14' }],
    ['Absolute Return %', { f: 'E14' }],
    ['CAGR', { f: 'IF(D3>=1,ROUND((POWER(C14/B14,1/D3)-1)*100,2),"Need 1+ year")' }],
    [''],
    ['ASSET ALLOCATION ANALYSIS'],
    [''],
    ['Your Age:', 30],
    ['Recommended Equity %:', { f: '100-B24' }],
    ['Your Equity %:', { f: 'F8+F9' }],
    ['Status:', { f: 'IF(ABS(B25-B26)<=15,"Balanced","Rebalance needed")' }],
  ];
  addSheet(wb, dashboard, 'Dashboard', { colWidths: [20, 15, 15, 12, 12, 12] });

  // Mutual Funds
  const mutualFunds = [
    ['MUTUAL FUNDS TRACKER'],
    [''],
    ['Track your mutual fund investments with returns calculation.'],
    [''],
    ['Fund Name', 'AMC', 'Category', 'Invested', 'Current Value', 'Units', 'Avg NAV', 'Current NAV', 'Return %', 'Type'],
    ['Axis Bluechip Fund', 'Axis', 'Large Cap', 150000, 172500, 1875, 80.00, 92.00, { f: 'ROUND((E6-D6)/D6*100,2)' }, 'SIP'],
    ['Parag Parikh Flexi Cap', 'PPFAS', 'Flexi Cap', 120000, 144000, 1600, 75.00, 90.00, { f: 'ROUND((E7-D7)/D7*100,2)' }, 'SIP'],
    ['Mirae Asset Large Cap', 'Mirae', 'Large Cap', 80000, 88000, 800, 100.00, 110.00, { f: 'ROUND((E8-D8)/D8*100,2)' }, 'Lump'],
    ['Kotak Small Cap', 'Kotak', 'Small Cap', 60000, 78000, 400, 150.00, 195.00, { f: 'ROUND((E9-D9)/D9*100,2)' }, 'SIP'],
    ['SBI Equity Hybrid', 'SBI', 'Hybrid', 50000, 54000, 250, 200.00, 216.00, { f: 'ROUND((E10-D10)/D10*100,2)' }, 'Lump'],
    ['HDFC Index Nifty 50', 'HDFC', 'Index', 40000, 44000, 200, 200.00, 220.00, { f: 'ROUND((E11-D11)/D11*100,2)' }, 'SIP'],
    ['UTI Nifty Next 50', 'UTI', 'Index', 30000, 33000, 600, 50.00, 55.00, { f: 'ROUND((E12-D12)/D12*100,2)' }, 'SIP'],
    ['Add more funds...', '', '', '', '', '', '', '', '', ''],
    [''],
    ['CATEGORY SUMMARY'],
    ['Category', 'Invested', 'Value', 'Return %'],
    ['Large Cap', { f: 'D6+D8' }, { f: 'E6+E8' }, { f: 'IF(B17>0,ROUND((C17-B17)/B17*100,2),0)' }],
    ['Flexi/Multi Cap', { f: 'D7' }, { f: 'E7' }, { f: 'IF(B18>0,ROUND((C18-B18)/B18*100,2),0)' }],
    ['Small Cap', { f: 'D9' }, { f: 'E9' }, { f: 'IF(B19>0,ROUND((C19-B19)/B19*100,2),0)' }],
    ['Index Funds', { f: 'D11+D12' }, { f: 'E11+E12' }, { f: 'IF(B20>0,ROUND((C20-B20)/B20*100,2),0)' }],
    ['Hybrid', { f: 'D10' }, { f: 'E10' }, { f: 'IF(B21>0,ROUND((C21-B21)/B21*100,2),0)' }],
    [''],
    ['TOTAL MF PORTFOLIO', { f: 'SUM(D6:D13)' }, { f: 'SUM(E6:E13)' }, { f: 'IF(B25>0,ROUND((C25-B25)/B25*100,2),0)' }],
  ];
  addSheet(wb, mutualFunds, 'Mutual Funds', { colWidths: [25, 10, 12, 12, 12, 8, 10, 12, 10, 8] });

  // Stocks
  const stocks = [
    ['STOCK PORTFOLIO TRACKER'],
    [''],
    ['Track your direct equity investments.'],
    [''],
    ['Stock Name', 'Symbol', 'Sector', 'Qty', 'Avg Price', 'CMP', 'Invested', 'Value', 'Gain/Loss', 'Return %'],
    ['Reliance Industries', 'RELIANCE', 'Energy', 20, 2400, 2850, { f: 'D6*E6' }, { f: 'D6*F6' }, { f: 'H6-G6' }, { f: 'ROUND(I6/G6*100,2)' }],
    ['HDFC Bank', 'HDFCBANK', 'Banking', 30, 1550, 1720, { f: 'D7*E7' }, { f: 'D7*F7' }, { f: 'H7-G7' }, { f: 'ROUND(I7/G7*100,2)' }],
    ['Infosys', 'INFY', 'IT', 40, 1380, 1520, { f: 'D8*E8' }, { f: 'D8*F8' }, { f: 'H8-G8' }, { f: 'ROUND(I8/G8*100,2)' }],
    ['TCS', 'TCS', 'IT', 15, 3400, 3850, { f: 'D9*E9' }, { f: 'D9*F9' }, { f: 'H9-G9' }, { f: 'ROUND(I9/G9*100,2)' }],
    ['ITC', 'ITC', 'FMCG', 100, 420, 465, { f: 'D10*E10' }, { f: 'D10*F10' }, { f: 'H10-G10' }, { f: 'ROUND(I10/G10*100,2)' }],
    ['Asian Paints', 'ASIANPAINT', 'Consumer', 10, 2800, 2650, { f: 'D11*E11' }, { f: 'D11*F11' }, { f: 'H11-G11' }, { f: 'ROUND(I11/G11*100,2)' }],
    ['Bajaj Finance', 'BAJFINANCE', 'NBFC', 8, 7200, 7800, { f: 'D12*E12' }, { f: 'D12*F12' }, { f: 'H12-G12' }, { f: 'ROUND(I12/G12*100,2)' }],
    ['Titan Company', 'TITAN', 'Consumer', 12, 3100, 3450, { f: 'D13*E13' }, { f: 'D13*F13' }, { f: 'H13-G13' }, { f: 'ROUND(I13/G13*100,2)' }],
    ['Add more stocks...', '', '', '', '', '', '', '', '', ''],
    [''],
    ['SECTOR SUMMARY'],
    ['Sector', 'Invested', 'Value', 'Return %'],
    ['IT', { f: 'G8+G9' }, { f: 'H8+H9' }, { f: 'IF(B18>0,ROUND((C18-B18)/B18*100,2),0)' }],
    ['Banking/NBFC', { f: 'G7+G12' }, { f: 'H7+H12' }, { f: 'IF(B19>0,ROUND((C19-B19)/B19*100,2),0)' }],
    [''],
    ['TOTAL STOCKS', { f: 'SUM(G6:G14)' }, { f: 'SUM(H6:H14)' }, { f: 'IF(B21>0,ROUND((C21-B21)/B21*100,2),0)' }],
  ];
  addSheet(wb, stocks, 'Stocks', { colWidths: [22, 15, 12, 6, 10, 10, 12, 12, 10, 10] });

  // Fixed Income
  const fixedIncome = [
    ['FIXED INCOME INVESTMENTS'],
    [''],
    ['Track FDs, PPF, NPS, and other safe investments.'],
    [''],
    ['FIXED DEPOSITS'],
    ['Bank/NBFC', 'Principal', 'Current Value', 'Interest Rate %', 'Tenure', 'Maturity Date'],
    ['SBI FD', 300000, { f: 'B7*(1+D7/100)^0.5' }, 7.1, '1 Year', '31-Dec-2025'],
    ['HDFC FD', 200000, { f: 'B8*(1+D8/100)^0.5' }, 7.25, '2 Years', '31-Dec-2026'],
    ['Bajaj Finance FD', 100000, { f: 'B9*(1+D9/100)^0.25' }, 8.1, '1 Year', '31-Mar-2025'],
    ['Add more FDs...', '', '', '', '', ''],
    [''],
    ['FD Total', { f: 'SUM(B7:B10)' }, { f: 'SUM(C7:C10)' }],
    [''],
    ['PPF / EPF'],
    ['Account', 'Contribution', 'Current Value', 'Interest Rate'],
    ['PPF Account', 500000, { f: 'B16*1.15' }, '7.1%'],
    ['EPF Balance', 800000, { f: 'B17*1.1' }, '8.25%'],
    [''],
    ['PPF/EPF Total', { f: 'SUM(B16:B17)' }, { f: 'SUM(C16:C17)' }],
    [''],
    ['NPS'],
    ['Account', 'Contribution', 'Current Value', 'Allocation'],
    ['Tier 1', 200000, 240000, 'Equity: 75%'],
    ['Tier 2', 50000, 55000, 'Equity: 50%'],
    [''],
    ['NPS Total', { f: 'SUM(B23:B24)' }, { f: 'SUM(C23:C24)' }],
  ];
  addSheet(wb, fixedIncome, 'Fixed Income', { colWidths: [18, 15, 15, 15, 12, 15] });

  saveWorkbook(wb, 'investment-tracker.xlsx');
}

// ============================================
// 5. EMERGENCY FUND PLANNER (Advanced)
// ============================================
function createEmergencyFundCalc() {
  const wb = createWorkbook();

  const calculator = [
    ['EMERGENCY FUND PLANNER'],
    [''],
    ['WHY EMERGENCY FUND MATTERS'],
    [''],
    ['Protects you from: Job loss, Medical emergencies, Car/Home repairs'],
    [''],
    ['STEP 1: CALCULATE MONTHLY ESSENTIAL EXPENSES'],
    [''],
    ['Expense Category', 'Monthly Amount'],
    ['Rent / Home Loan EMI', 25000],
    ['Utilities (Electricity, Water, Gas)', 3500],
    ['Groceries & Essential Food', 10000],
    ['Insurance Premiums', 3000],
    ['Children Education', 5000],
    ['Loan EMIs (Car, Personal)', 8000],
    ['Phone & Internet', 1000],
    ['Essential Transport', 3000],
    ['Medicines & Healthcare', 1500],
    ['Domestic Help', 2000],
    ['Other Essential Expenses', 2000],
    [''],
    ['TOTAL MONTHLY ESSENTIALS', { f: 'SUM(B10:B20)' }],
    [''],
    ['STEP 2: DETERMINE FUND SIZE'],
    [''],
    ['Your Situation', 'Months Needed', 'Fund Target'],
    ['Stable Salaried Job', 6, { f: 'B22*B27' }],
    ['Government/PSU Job', 3, { f: 'B22*B28' }],
    ['Freelancer/Consultant', 9, { f: 'B22*B29' }],
    ['Business Owner', 12, { f: 'B22*B30' }],
    ['Single Income Household', 9, { f: 'B22*B31' }],
    ['Dual Income (Both Private)', 4, { f: 'B22*B32' }],
    [''],
    ['SELECT YOUR SITUATION (Enter months):', 6],
    ['YOUR EMERGENCY FUND TARGET', { f: 'B22*B34' }],
    [''],
    ['STEP 3: GAP ANALYSIS'],
    [''],
    ['Your Current Emergency Fund', 100000],
    ['Amount Still Needed', { f: 'MAX(B35-B39,0)' }],
    ['Completion Percentage', { f: 'IF(B35>0,MIN(ROUND(B39/B35*100,1),100),0)' }],
    [''],
    ['STEP 4: SAVINGS PLAN'],
    [''],
    ['Monthly Amount You Can Save', 10000],
    ['Months to Reach Goal', { f: 'IF(B45>0,CEILING(B40/B45,1),"Enter amount")' }],
    [''],
    ['WHERE TO PARK YOUR FUND:'],
    ['Immediate (1 month) - Savings Account', { f: 'B22' }],
    ['Short-term (2-3 months) - Liquid Fund', { f: 'B22*2' }],
    ['Medium-term (3-6 months) - Bank FD', { f: 'MAX(B35-B49-B50,0)' }],
  ];
  addSheet(wb, calculator, 'Calculator', { colWidths: [40, 20, 18] });

  // Progress Tracker
  const tracker = [
    ['EMERGENCY FUND PROGRESS TRACKER'],
    [''],
    ['Goal Amount:', { f: 'Calculator!B35' }],
    [''],
    ['Month', 'Starting Balance', 'Added', 'Used', 'Ending Balance', 'Progress %'],
    ['January 2025', 100000, 10000, 0, { f: 'B6+C6-D6' }, { f: 'IF($B$3>0,ROUND(E6/$B$3*100,1),0)' }],
    ['February 2025', { f: 'E6' }, 10000, 0, { f: 'B7+C7-D7' }, { f: 'IF($B$3>0,ROUND(E7/$B$3*100,1),0)' }],
    ['March 2025', { f: 'E7' }, 10000, 0, { f: 'B8+C8-D8' }, { f: 'IF($B$3>0,ROUND(E8/$B$3*100,1),0)' }],
    ['April 2025', { f: 'E8' }, 10000, 0, { f: 'B9+C9-D9' }, { f: 'IF($B$3>0,ROUND(E9/$B$3*100,1),0)' }],
    ['May 2025', { f: 'E9' }, 10000, 0, { f: 'B10+C10-D10' }, { f: 'IF($B$3>0,ROUND(E10/$B$3*100,1),0)' }],
    ['June 2025', { f: 'E10' }, 10000, 0, { f: 'B11+C11-D11' }, { f: 'IF($B$3>0,ROUND(E11/$B$3*100,1),0)' }],
    ['Continue...', '', '', '', '', ''],
    [''],
    ['MILESTONES'],
    ['25% of Goal', { f: 'B3*0.25' }, { f: 'IF(E6>=B15,"Achieved","In Progress")' }],
    ['50% of Goal', { f: 'B3*0.5' }, { f: 'IF(E9>=B16,"Achieved","In Progress")' }],
    ['100% GOAL!', { f: 'B3' }, { f: 'IF(E11>=B17,"COMPLETED!","Keep Saving!")' }],
  ];
  addSheet(wb, tracker, 'Progress Tracker', { colWidths: [18, 18, 12, 12, 18, 12] });

  saveWorkbook(wb, 'emergency-fund.xlsx');
}

// ============================================
// 6. INSURANCE NEEDS ANALYZER (Advanced)
// ============================================
function createInsuranceChecklist() {
  const wb = createWorkbook();

  // Coverage Dashboard
  const dashboard = [
    ['INSURANCE COVERAGE DASHBOARD'],
    [''],
    ['COVERAGE SUMMARY'],
    [''],
    ['Insurance Type', 'Recommended', 'Your Coverage', 'Gap', 'Status', 'Priority'],
    ['Health Insurance', { f: "'Health'!C12" }, { f: "'Health'!C13" }, { f: 'B6-C6' }, { f: 'IF(D6<=0,"Adequate","Under-insured")' }, 'Critical'],
    ['Term Life Insurance', { f: "'Life'!C16" }, { f: "'Life'!C17" }, { f: 'B7-C7' }, { f: 'IF(D7<=0,"Adequate","Under-insured")' }, 'Critical'],
    ['Motor Insurance', 'Full Cover', { f: "'Other'!C8" }, '-', { f: 'IF(C8="Comprehensive","OK","Review")' }, 'Mandatory'],
    ['Personal Accident', { f: "'Other'!C13" }, { f: "'Other'!C14" }, { f: 'B9-C9' }, { f: 'IF(D9<=0,"Adequate","Review")' }, 'High'],
    ['Home Insurance', 'As per value', { f: "'Other'!C19" }, '-', { f: 'IF(C10="Yes","Have","Missing")' }, 'Medium'],
    [''],
    ['ANNUAL PREMIUM SUMMARY'],
    [''],
    ['Type', 'Annual Premium', 'Monthly Cost'],
    ['Health Insurance', { f: "'Health'!C14" }, { f: 'B15/12' }],
    ['Term Life Insurance', { f: "'Life'!C18" }, { f: 'B16/12' }],
    ['Motor Insurance', { f: "'Other'!C9" }, { f: 'B17/12' }],
    ['Personal Accident', { f: "'Other'!C15" }, { f: 'B18/12' }],
    ['Home Insurance', { f: "'Other'!C20" }, { f: 'B19/12' }],
    ['TOTAL', { f: 'SUM(B15:B19)' }, { f: 'B20/12' }],
    [''],
    ['ACTION ITEMS'],
    ['1. Review coverage gaps highlighted above'],
    ['2. Get quotes from 3+ insurers before buying'],
    ['3. Compare claim settlement ratios'],
    ['4. Read policy documents carefully'],
    ['5. Update nominee details annually'],
  ];
  addSheet(wb, dashboard, 'Dashboard', { colWidths: [22, 15, 15, 10, 15, 10] });

  // Health Insurance
  const healthInsurance = [
    ['HEALTH INSURANCE ANALYZER'],
    [''],
    ['FAMILY DETAILS'],
    [''],
    ['Member', 'Age', 'Pre-existing Conditions'],
    ['Self', 35, 'None'],
    ['Spouse', 32, 'None'],
    ['Child 1', 8, 'None'],
    ['Parent 1', 62, 'Diabetes'],
    ['Parent 2', 58, 'None'],
    [''],
    ['COVERAGE RECOMMENDATION'],
    ['Self + Spouse + Children', 1500000],
    ['Your Current Coverage', ''],
    ['Your Current Premium', ''],
    [''],
    ['Parents (Separate Policy)', 1000000],
    ['Super Top-Up', 5000000],
    [''],
    ['WHAT TO LOOK FOR'],
    ['Feature', 'Recommended'],
    ['Room Rent Limit', 'No sub-limits'],
    ['Co-payment', '0% (no co-pay)'],
    ['Waiting Period', '2-3 years'],
    ['Network Hospitals', '5000+ in your city'],
    ['Claim Settlement Ratio', '95%+'],
    [''],
    ['TOP INSURERS:'],
    ['Star Health, HDFC Ergo, Care Health, Niva Bupa, ICICI Lombard'],
  ];
  addSheet(wb, healthInsurance, 'Health', { colWidths: [25, 20, 20] });

  // Life Insurance
  const lifeInsurance = [
    ['LIFE INSURANCE ANALYZER'],
    [''],
    ['YOUR DETAILS'],
    [''],
    ['Your Age', 35],
    ['Annual Income', 1500000],
    ['Years to Retirement', 25],
    ['Number of Dependents', 3],
    [''],
    ['COVERAGE CALCULATION'],
    [''],
    ['METHOD 1: Income Replacement (10x)', { f: 'B6*10' }],
    ['METHOD 2: Human Life Value', { f: 'B6*B7*0.5' }],
    [''],
    ['RECOMMENDED COVERAGE', { f: 'MAX(B12,B13)' }],
    [''],
    ['Your Current Term Cover', 5000000],
    ['Your Current Premium', 8000],
    [''],
    ['Coverage Gap', { f: 'MAX(B16-B17,0)' }],
    [''],
    ['RECOMMENDED FEATURES'],
    ['Policy Type: Pure Term (NOT ULIP/Endowment)'],
    ['Policy Term: Till age 60-65'],
    ['Riders: Critical Illness, Accidental Death'],
    ['Claim Settlement Ratio: 98%+'],
    [''],
    ['TOP TERM PLANS:'],
    ['HDFC Life Click 2 Protect, ICICI Pru iProtect, Max Life Smart Term'],
  ];
  addSheet(wb, lifeInsurance, 'Life', { colWidths: [35, 20] });

  // Other Insurance
  const otherInsurance = [
    ['OTHER ESSENTIAL INSURANCE'],
    [''],
    ['MOTOR INSURANCE'],
    [''],
    ['Vehicle Details', 'Your Information'],
    ['Vehicle Type', 'Car'],
    ['Coverage Type', 'Comprehensive'],
    ['Annual Premium', ''],
    ['IDV (Insured Declared Value)', ''],
    ['NCB (No Claim Bonus) %', ''],
    [''],
    ['PERSONAL ACCIDENT INSURANCE'],
    ['Recommended Coverage (20x monthly)', { f: '50000*20' }],
    ['Your Current Coverage', ''],
    ['Annual Premium', ''],
    [''],
    ['HOME INSURANCE'],
    ['Do you have home insurance?', 'No'],
    ['Your Property Value', ''],
    ['Coverage Amount', ''],
    ['Annual Premium', ''],
    [''],
    ['HOME INSURANCE CHECKLIST:'],
    ['Structure (Building)', 'Covered?'],
    ['Contents', ''],
    ['Fire Damage', ''],
    ['Natural Disasters', ''],
    ['Theft/Burglary', ''],
    ['Third Party Liability', ''],
  ];
  addSheet(wb, otherInsurance, 'Other', { colWidths: [35, 20] });

  // Policy Tracker
  const policyTracker = [
    ['POLICY TRACKER'],
    [''],
    ['Keep all your insurance policies organized.'],
    [''],
    ['Policy Type', 'Company', 'Policy Number', 'Sum Assured', 'Premium', 'Start Date', 'End Date', 'Nominee'],
    ['Health', '', '', '', '', '', '', ''],
    ['Term Life', '', '', '', '', '', '', ''],
    ['Car', '', '', '', '', '', '', ''],
    ['Two-Wheeler', '', '', '', '', '', '', ''],
    ['Personal Accident', '', '', '', '', '', '', ''],
    ['Home', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    [''],
    ['TOTAL ANNUAL PREMIUM', { f: 'SUM(E6:E12)' }],
    [''],
    ['RENEWAL CALENDAR'],
    ['Month', 'Policies Due', 'Premium'],
    ['January', '', ''],
    ['February', '', ''],
    ['March', '', ''],
    ['April', '', ''],
    ['May', '', ''],
    ['June', '', ''],
  ];
  addSheet(wb, policyTracker, 'Policy Tracker', { colWidths: [15, 15, 18, 15, 12, 12, 12, 15] });

  saveWorkbook(wb, 'insurance-checklist.xlsx');
}

// ============================================
// RUN ALL GENERATORS
// ============================================
console.log('\n📊 Generating Advanced Excel Templates...\n');
console.log('═══════════════════════════════════════════════════════════\n');

createBudgetPlanner();
createSalaryCalculator();
createDebtTracker();
createInvestmentTracker();
createEmergencyFundCalc();
createInsuranceChecklist();

console.log('\n═══════════════════════════════════════════════════════════');
console.log('✅ All templates generated successfully!');
console.log(`📁 Location: ${OUTPUT_DIR}`);
console.log('═══════════════════════════════════════════════════════════\n');
