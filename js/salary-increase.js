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
    
    // Create a copy of the base results to modify
    const newResults = JSON.parse(JSON.stringify(baseResults));
    
    // Apply the increase to basic salary
    newResults.basicSalary += increaseAmount;
    
    // Calculate new gratuity
    const monthlyGratuityAccrual = newResults.basicSalary * (newResults.gratuityRate / 100);
    newResults.monthlyGratuityAccrual = monthlyGratuityAccrual;
    newResults.sixMonthGratuity = monthlyGratuityAccrual * 6;
    
    // If increase is not taxable, leave taxable income unchanged
    // If increase is taxable, recalculate taxable income and tax
    if (isTaxable) {
        // Update gross income
        newResults.regularMonthlyGrossIncome += increaseAmount;
        
        // Recalculate deductions
        newResults.personalAllowance = Math.max(PERSONAL_ALLOWANCE, newResults.regularMonthlyGrossIncome / 3);
        newResults.nisContribution = Math.min(newResults.regularMonthlyGrossIncome * NIS_RATE, NIS_CEILING * NIS_RATE);
        
        // Recalculate taxable income
        newResults.taxableIncome = Math.max(0, newResults.basicSalary + newResults.taxableAllowances - 
                                     newResults.personalAllowance - newResults.nisContribution - 
                                     newResults.childAllowance - newResults.insurancePremium);
        
        // Recalculate income tax
        if (newResults.taxableIncome <= TAX_THRESHOLD) {
            newResults.incomeTax = newResults.taxableIncome * TAX_RATE_1;
        } else {
            newResults.incomeTax = (TAX_THRESHOLD * TAX_RATE_1) + 
                                  ((newResults.taxableIncome - TAX_THRESHOLD) * TAX_RATE_2);
        }
    } else {
        // Update gross income but mark increase as non-taxable
        newResults.regularMonthlyGrossIncome += increaseAmount;
        // The taxable income and tax calculations stay the same
    }
    
    // Recalculate net salary
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
    newResults.annualTotal = newResults.monthlyNetSalary * 12 + newResults.annualGratuityTotal + newResults.vacationAllowance;
    
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