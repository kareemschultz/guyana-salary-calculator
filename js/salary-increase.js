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

    // Setup listener for retroactive toggle
    const toggleRetroactive = document.getElementById('toggle-retroactive');
    if (toggleRetroactive) {
        toggleRetroactive.addEventListener('change', function() {
            const retroactiveSection = document.getElementById('retroactive-section');
            const retroactiveResultsDisplay = document.getElementById('retroactive-results-display');
            if (this.checked) {
                retroactiveSection.classList.remove('d-none');
                retroactiveResultsDisplay.classList.remove('d-none');
            } else {
                retroactiveSection.classList.add('d-none');
                retroactiveResultsDisplay.classList.add('d-none');
            }
        });
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
        
        // Get retroactive parameters
        const isRetroactive = document.getElementById('toggle-retroactive').checked;
        const retroactiveMonths = isRetroactive ? (parseInt(document.getElementById('retroactive-months').value) || 0) : 0;

        // Calculate new values
        const results = calculateIncreaseResults(lastResults, increasePercentage, isTaxable, retroactiveMonths);
        
        // Display new results
        updateIncreaseResultsDisplay(results, lastResults, isRetroactive);
        
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
 * @param {number} retroactiveMonths - Number of months for retroactive pay
 * @returns {Object} The new calculation results
 */
function calculateIncreaseResults(baseResults, increasePercentage, isTaxable, retroactiveMonths) {
    // Calculate the increase amount based on baseResults.basicSalary
    const monthlyBasicIncreaseAmount = baseResults.basicSalary * (increasePercentage / 100);
    
    // Create a deep copy of the base results to modify
    const newResults = JSON.parse(JSON.stringify(baseResults));
    
    // Apply the increase to basic salary for the new monthly salary
    newResults.basicSalary += monthlyBasicIncreaseAmount;
    
    // Recalculate gratuity based on the new basicSalary
    newResults.monthlyGratuityAccrual = newResults.basicSalary * (newResults.gratuityRate / 100);
    newResults.sixMonthGratuity = newResults.monthlyGratuityAccrual * 6;
    
    // Update regular monthly gross income for the new monthly salary
    newResults.regularMonthlyGrossIncome = newResults.basicSalary + newResults.taxableAllowances + newResults.nonTaxableAllowances +
                                           newResults.overtimeIncome + newResults.secondJobIncome;

    // Recalculate deductions that reduce taxable income based on the new gross
    newResults.personalAllowance = Math.max(PERSONAL_ALLOWANCE, newResults.regularMonthlyGrossIncome / 3);
    newResults.nisContribution = Math.min(newResults.regularMonthlyGrossIncome * NIS_RATE, NIS_CEILING * NIS_RATE);
    
    // Recalculate actual insurance deduction based on the new gross income
    const newActualInsuranceDeduction = Math.min(newResults.insurancePremium, newResults.regularMonthlyGrossIncome * 0.10, 50000);
    newResults.actualInsuranceDeduction = newActualInsuranceDeduction; 

    // Recalculate non-taxable overtime and second job allowances for the new income
    newResults.overtimeAllowance = Math.min(newResults.overtimeIncome, OVERTIME_ALLOWANCE_MAX);
    newResults.secondJobAllowance = Math.min(newResults.secondJobIncome, SECOND_JOB_ALLOWANCE_MAX);

    // Calculate the 'gross income for taxable calculation' for the new monthly salary
    const grossIncomeForTaxableCalculation = newResults.regularMonthlyGrossIncome - newResults.nonTaxableAllowances - newResults.overtimeAllowance - newResults.secondJobAllowance;

    // Calculate actual taxable income for the new monthly salary
    newResults.taxableIncome = Math.max(0, grossIncomeForTaxableCalculation -
                                         newResults.personalAllowance -
                                         newResults.nisContribution -
                                         newResults.childAllowance -
                                         newActualInsuranceDeduction);
    
    // Recalculate income tax for the new monthly salary
    if (newResults.taxableIncome <= TAX_THRESHOLD) {
        newResults.incomeTax = newResults.taxableIncome * TAX_RATE_1;
    } else {
        newResults.incomeTax = (TAX_THRESHOLD * TAX_RATE_1) +
                              ((newResults.taxableIncome - TAX_THRESHOLD) * TAX_RATE_2);
    }
    
    // Recalculate net salary for the new monthly salary
    newResults.monthlyNetSalary = newResults.regularMonthlyGrossIncome -
                                  newResults.nisContribution -
                                  newResults.incomeTax -
                                  newResults.loanPayment -
                                  newResults.creditUnionDeduction; // Renamed for clarity

    // --- Retroactive Calculation ---
    newResults.retroactiveMonthlyIncrease = 0;
    newResults.totalRetroactiveLumpSum = 0;
    newResults.netPayWithRetroactiveLumpSum = 0;

    if (retroactiveMonths > 0) {
        newResults.retroactiveMonthlyIncrease = monthlyBasicIncreaseAmount; // The increase per month
        newResults.totalRetroactiveLumpSum = monthlyBasicIncreaseAmount * retroactiveMonths; // Total lump sum

        // To calculate net pay for the retroactive month, we need to apply tax on the lump sum
        // This means calculating tax for a hypothetical month where this lump sum is added to gross.
        
        // Hypothetical gross for the retroactive payment month (full new monthly gross + lump sum)
        const grossForRetroMonth = newResults.regularMonthlyGrossIncome + newResults.totalRetroactiveLumpSum;

        // Recalculate PA/NIS based on this temporarily inflated gross for retro month
        const retroPersonalAllowance = Math.max(PERSONAL_ALLOWANCE, grossForRetroMonth / 3);
        const retroNisContribution = Math.min(grossForRetroMonth * NIS_RATE, NIS_CEILING * NIS_RATE);
        const retroActualInsuranceDeduction = Math.min(newResults.insurancePremium, grossForRetroMonth * 0.10, 50000);

        // Calculate gross income for taxable calculation for the retroactive month
        const retroGrossIncomeForTaxableCalculation = grossForRetroMonth - newResults.nonTaxableAllowances - newResults.overtimeAllowance - newResults.secondJobAllowance;

        // Calculate taxable income for the retroactive payment month
        const retroTaxableIncome = Math.max(0, retroGrossIncomeForTaxableCalculation - retroPersonalAllowance -
                                       retroNisContribution - newResults.childAllowance - retroActualInsuranceDeduction);

        // Calculate income tax for the retroactive payment month
        let retroIncomeTax = 0;
        if (retroTaxableIncome <= TAX_THRESHOLD) {
            retroIncomeTax = retroTaxableIncome * TAX_RATE_1;
        } else {
            retroIncomeTax = (TAX_THRESHOLD * TAX_RATE_1) +
                            ((retroTaxableIncome - TAX_THRESHOLD) * TAX_RATE_2);
        }

        // Calculate Net Pay for the retroactive payment month
        newResults.netPayWithRetroactiveLumpSum = grossForRetroMonth - retroNisContribution - retroIncomeTax - newResults.loanPayment - newResults.creditUnionDeduction;
        
        // Add the total retroactive lump sum to the annual total, as it's a one-time payment.
        newResults.annualTotal += newResults.totalRetroactiveLumpSum;
    }


    // Recalculate annual figures based on new monthly net salary (already includes deductions)
    newResults.annualGrossIncome = newResults.regularMonthlyGrossIncome * 12;
    newResults.annualNisContribution = newResults.nisContribution * 12;
    newResults.annualTaxPayable = newResults.incomeTax * 12;
    newResults.annualGratuityTotal = newResults.sixMonthGratuity * 2;
    // newResults.annualTotal already updated with retroactive lump sum if applicable


    return newResults;
}

/**
 * Display the salary increase calculation results
 * @param {Object} results - The new calculation results
 * @param {Object} baseResults - The original calculation results
 * @param {boolean} isRetroactive - Whether retroactive pay was calculated
 */
function updateIncreaseResultsDisplay(results, baseResults, isRetroactive) {
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

    // Retroactive Results Display
    const retroactiveResultsDisplay = document.getElementById('retroactive-results-display');
    if (isRetroactive && results.totalRetroactiveLumpSum > 0) {
        retroactiveResultsDisplay.classList.remove('d-none');
        document.getElementById('retro-monthly-increase').textContent = formatCurrency(results.retroactiveMonthlyIncrease);
        document.getElementById('total-retro-lump-sum').textContent = formatCurrency(results.totalRetroactiveLumpSum);
        document.getElementById('net-pay-with-retro').textContent = formatCurrency(results.netPayWithRetroactiveLumpSum);
    } else {
        retroactiveResultsDisplay.classList.add('d-none');
    }
}
