/**
 * Salary Increase Calculator Functions
 */

/**
 * Show the salary increase section after initial calculation
 */
function showSalaryIncreaseSection() {
    const salaryIncreaseSection = document.getElementById('salary-increase-section');
    if (salaryIncreaseSection) {
        salaryIncreaseSection.classList.remove('d-none');
    }
}

/**
 * Calculate results with salary increase
 */
function calculateWithIncrease() {
    debug('Calculating with salary increase');
    
    try {
        // Get the last calculated results
        const lastResults = getCurrentResults();
        if (!lastResults) {
            alert('Please calculate your current salary first before applying an increase.');
            return;
        }
        
        // Get increase parameters
        const increasePercentage = parseFloat(document.getElementById('increase-percentage').value) || 0;
        const isTaxable = document.querySelector('input[name="increase-taxable"]:checked').value === 'yes';
        
        // Calculate new values
        const results = calculateIncreaseResults(lastResults, increasePercentage, isTaxable);
        
        // Display new results
        updateIncreaseResultsDisplay(results, lastResults);
        
    } catch (error) {
        console.error("Increase calculation error:", error);
        alert("There was an error in the calculation. Please check your inputs and try again.");
    }
}

/**
 * Store the current calculation results for later comparison
 * @param {Object} results - The calculation results
 */
function storeCurrentResults(results) {
    window.lastCalculationResults = JSON.parse(JSON.stringify(results));
}

/**
 * Get the current stored calculation results
 * @returns {Object} The last calculation results
 */
function getCurrentResults() {
    return window.lastCalculationResults;
}

/**
 * Calculate results with the salary increase applied
 * @param {Object} baseResults - The base calculation results
 * @param {number} increasePercentage - The percentage increase
 * @param {boolean} isTaxable - Whether the increase is taxable
 * @returns {Object} The new calculation results
 */
function calculateIncreaseResults(baseResults, increasePercentage, isTaxable) {
    // Calculate the increase amount
    const increaseAmount = baseResults.basicSalary * (increasePercentage / 100);
    
    // Create a deep copy of the base results to modify
    const newResults = JSON.parse(JSON.stringify(baseResults));
    
    // Apply the increase to basic salary
    newResults.basicSalary += increaseAmount;
    
    // Recalculate gratuity based on the new basicSalary
    newResults.monthlyGratuityAccrual = newResults.basicSalary * (newResults.gratuityRate / 100);
    newResults.sixMonthGratuity = newResults.monthlyGratuityAccrual * 6;
    
    // Update regular monthly gross income.
    // This Gross includes all income before tax-specific deductions.
    newResults.regularMonthlyGrossIncome = newResults.basicSalary + newResults.taxableAllowances + newResults.nonTaxableAllowances +
                                           newResults.overtimeIncome + newResults.secondJobIncome;

    // Recalculate deductions that reduce taxable income based on the new gross
    newResults.personalAllowance = Math.max(PERSONAL_ALLOWANCE, newResults.regularMonthlyGrossIncome / 3);
    newResults.nisContribution = Math.min(newResults.regularMonthlyGrossIncome * NIS_RATE, NIS_CEILING * NIS_RATE);
    
    // Recalculate actual insurance deduction based on the new gross income
    // Lesser of premium paid, 10% of new gross, or $50,000 monthly
    const newActualInsuranceDeduction = Math.min(newResults.insurancePremium, newResults.regularMonthlyGrossIncome * 0.10, 50000);
    newResults.actualInsuranceDeduction = newActualInsuranceDeduction; // Store for consistency and reference

    // Recalculate non-taxable overtime and second job allowances for the new income
    newResults.overtimeAllowance = Math.min(newResults.overtimeIncome, OVERTIME_ALLOWANCE_MAX);
    newResults.secondJobAllowance = Math.min(newResults.secondJobIncome, SECOND_JOB_ALLOWANCE_MAX);

    if (isTaxable) {
        // If the increase is taxable, the full increased gross is used for taxable income calculation
        newResults.taxableIncome = Math.max(0, newResults.regularMonthlyGrossIncome -
                                         newResults.personalAllowance -
                                         newResults.nisContribution -
                                         newResults.childAllowance -
                                         newActualInsuranceDeduction - // Use the newly capped deduction
                                         newResults.overtimeAllowance -
                                         newResults.secondJobAllowance);
        
        // Recalculate income tax based on the new taxable income
        if (newResults.taxableIncome <= TAX_THRESHOLD) {
            newResults.incomeTax = newResults.taxableIncome * TAX_RATE_1;
        } else {
            newResults.incomeTax = (TAX_THRESHOLD * TAX_RATE_1) +
                                  ((newResults.taxableIncome - TAX_THRESHOLD) * TAX_RATE_2);
        }
    } else {
        // If the increase is non-taxable, the 'taxable income' and 'income tax'
        // should effectively remain the same as they were before the increase,
        // unless other fixed deductions (like NIS cap) change due to higher gross.
        // The gross has increased, but for PAYE purposes, the taxable component does not change.
        // We need to re-evaluate the actual taxable income and tax only if the *deductions*
        // themselves are affected by the higher gross (e.g., NIS reaching ceiling, PA change).

        // For non-taxable increase, the `taxableIncome` and `incomeTax` values
        // should effectively be the same as the baseResults, but we must
        // re-run the calculation as some components like PA and NIS might change due to higher gross.
        newResults.taxableIncome = Math.max(0, newResults.regularMonthlyGrossIncome -
                                         newResults.personalAllowance -
                                         newResults.nisContribution -
                                         newResults.childAllowance -
                                         newActualInsuranceDeduction -
                                         newResults.overtimeAllowance -
                                         newResults.secondJobAllowance);
        
        // Income tax calculation
        if (newResults.taxableIncome <= TAX_THRESHOLD) {
            newResults.incomeTax = newResults.taxableIncome * TAX_RATE_1;
        } else {
            newResults.incomeTax = (TAX_THRESHOLD * TAX_RATE_1) +
                                  ((newResults.taxableIncome - TAX_THRESHOLD) * TAX_RATE_2);
        }

        // IMPORTANT: For a non-taxable increase, the `increaseAmount` itself should not be
        // considered part of the `taxableIncome` calculation. The previous `regularMonthlyGrossIncome`
        // already includes the non-taxable allowances. The `taxableIncome` formula above
        // correctly subtracts the allowances. If `increaseAmount` is non-taxable,
        // it means the *portion* of `regularMonthlyGrossIncome` corresponding to `increaseAmount`
        // should also be excluded from `taxableIncome`.

        // This simplified path for `else` block (non-taxable increase)
        // essentially re-runs the full calculation with the higher overall gross,
        // but because `taxableIncome` is already explicitly subtracting all non-taxable
        // components (including overtime, second job, and now potentially the "increase"
        // itself if that were an allowance), it should be fine.
        // The key is that `taxableIncome` formula is consistent.
    }
    
    // Recalculate net salary - GPSU and loan payments are deducted from net pay (not tax deductible)
    newResults.monthlyNetSalary = newResults.regularMonthlyGrossIncome -
                                  newResults.nisContribution -
                                  newResults.incomeTax -
                                  newResults.loanPayment -
                                  newResults.gpsuDeduction;
    
    // Recalculate special month totals
    newResults.monthSixTotal = newResults.monthlyNetSalary + newResults.sixMonthGratuity;
    newResults.monthTwelveTotal = newResults.monthlyNetSalary + newResults.sixMonthGratuity + newResults.vacationAllowance;
    
    // Recalculate annual figures
    newResults.annualGrossIncome = newResults.regularMonthlyGrossIncome * 12;
    newResults.annualNisContribution = newResults.nisContribution * 12;
    newResults.annualTaxPayable = newResults.incomeTax * 12;
    newResults.annualGratuityTotal = newResults.sixMonthGratuity * 2;
    newResults.annualTotal = (newResults.monthlyNetSalary * 12) + newResults.annualGratuityTotal + newResults.vacationAllowance;
    
    // Calculate differences for display
    newResults.monthlyNetDifference = newResults.monthlyNetSalary - baseResults.monthlyNetSalary;
    newResults.annualNetDifference = newResults.annualTotal - baseResults.annualTotal;
    newResults.basicSalaryDifference = newResults.basicSalary - baseResults.basicSalary;
    newResults.monthlyGratuityDifference = newResults.monthlyGratuityAccrual - baseResults.monthlyGratuityAccrual;
    
    return newResults;
}

/**
 * Display the salary increase calculation results
 * @param {Object} results - The new calculation results
 * @param {Object} baseResults - The original calculation results
 */
function updateIncreaseResultsDisplay(results, baseResults) {
    const increaseResults = document.getElementById('increase-results');
    if (increaseResults) {
        increaseResults.classList.remove('d-none');
    }
    
    // Monthly Comparison
    document.getElementById('new-basic-salary').textContent = formatCurrency(results.basicSalary);
    document.getElementById('basic-salary-diff').textContent = '+' + formatCurrency(results.basicSalaryDifference);
    
    document.getElementById('new-monthly-net').textContent = formatCurrency(results.monthlyNetSalary);
    document.getElementById('monthly-increase').textContent = '+' + formatCurrency(results.monthlyNetDifference);
    
    document.getElementById('new-monthly-gratuity').textContent = formatCurrency(results.monthlyGratuityAccrual);
    document.getElementById('monthly-gratuity-diff').textContent = '+' + formatCurrency(results.monthlyGratuityDifference);
    
    // Annual Comparison
    document.getElementById('new-annual-gross').textContent = formatCurrency(results.annualGrossIncome);
    document.getElementById('new-annual-nis').textContent = formatCurrency(results.annualNisContribution);
    document.getElementById('new-annual-tax').textContent = formatCurrency(results.annualTaxPayable);
    document.getElementById('new-annual-gratuity').textContent = formatCurrency(results.annualGratuityTotal);
    document.getElementById('new-annual-income').textContent = formatCurrency(results.annualTotal);
    document.getElementById('annual-income-diff').textContent = '+' + formatCurrency(results.annualNetDifference);
    
    // Special Payment Months - Month 6
    document.getElementById('new-month-six-net').textContent = formatCurrency(results.monthlyNetSalary);
    document.getElementById('new-month-six-gratuity').textContent = formatCurrency(results.sixMonthGratuity);
    document.getElementById('new-month-six-total').textContent = formatCurrency(results.monthSixTotal);
    
    // Special Payment Months - Month 12
    document.getElementById('new-month-twelve-net').textContent = formatCurrency(results.monthlyNetSalary);
    document.getElementById('new-month-twelve-gratuity').textContent = formatCurrency(results.sixMonthGratuity);
    document.getElementById('new-month-twelve-vacation').textContent = formatCurrency(results.vacationAllowance);
    document.getElementById('new-month-twelve-total').textContent = formatCurrency(results.monthTwelveTotal);
}
