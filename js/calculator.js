/**
 * Main calculation functions
 */

/**
 * Main function to calculate salary and update the UI
 */
function calculateSalary() {
    debug("Calculate function called");
    
    try {
        // Show loading overlay
        showLoadingOverlay();
        
        // Gather input values
        const inputValues = getInputValues();
        
        // Perform calculations
        const results = performCalculations(inputValues);
        
        // Store results for comparison with salary increase
        storeCurrentResults(results);
        
        // Update the UI with results
        updateResultsDisplay(results);
        
    } catch (error) {
        console.error("Calculation error:", error);
        alert("There was an error in the calculation. Please check your inputs and try again.");
    } finally {
        // Hide loading overlay
        hideLoadingOverlay();
    }
}

/**
 * Get all input values from the form
 * @returns {Object} All input values
 */
function getInputValues() {
    // Get position from dropdown or custom input
    const position = getSelectedPosition();
    
    // Basic salary
    const basicSalary = parseFloat(document.getElementById('basic-salary').value) || 0;
    
    // Get taxable allowances
    let taxableAllowances = 0;
    if (document.getElementById('single-taxable-allowance') && 
        document.getElementById('single-taxable-allowance').classList.contains('d-none')) {
        // Multiple allowances are showing
        document.querySelectorAll('.taxable-allowance').forEach(function(input) {
            taxableAllowances += parseFloat(input.value) || 0;
        });
    } else {
        // Single input is showing
        taxableAllowances = parseFloat(document.getElementById('taxable-allowances').value) || 0;
    }
    
    // Get non-taxable allowances
    let nonTaxableAllowances = 0;
    if (document.getElementById('single-non-taxable-allowance') && 
        document.getElementById('single-non-taxable-allowance').classList.contains('d-none')) {
        // Multiple allowances are showing
        document.querySelectorAll('.non-taxable-allowance:not(#vacation-allowance)').forEach(function(input) {
            nonTaxableAllowances += parseFloat(input.value) || 0;
        });
    } else {
        // Single input is showing - assume this already accounts for vacation allowance
        nonTaxableAllowances = parseFloat(document.getElementById('non-taxable-allowances').value) || 0;
    }

    // Get vacation allowance (annual payment)
    const vacationAllowance = parseFloat(document.getElementById('vacation-allowance')?.value) || 0;
    
    // Get qualification allowance
    const qualificationType = document.querySelector('input[name="qualification-type"]:checked').value;
    const qualificationAllowance = QUALIFICATION_ALLOWANCES[qualificationType];
    
    // Add qualification allowance to non-taxable allowances
    nonTaxableAllowances += qualificationAllowance;
    
    // Get other income and deductions
    const overtimeIncome = parseFloat(document.getElementById('overtime').value) || 0;
    const secondJobIncome = parseFloat(document.getElementById('second-job').value) || 0;
    const childCount = parseInt(document.getElementById('children').value) || 0;
    const loanPayment = parseFloat(document.getElementById('loan-payment').value) || 0;
    const gpsuDeduction = parseFloat(document.getElementById('gpsu-deduction').value) || 0;

    // Insurance premium
    let insurancePremium = 0;
    const insuranceType = document.getElementById('insurance').value;
    
    if (insuranceType === 'custom') {
        insurancePremium = parseFloat(document.getElementById('custom-premium').value) || 0;
    } else {
        insurancePremium = INSURANCE_PREMIUMS[insuranceType];
    }

    // Gratuity options
    const gratuityRate = parseFloat(document.getElementById('gratuity-rate').value) || 22.5;
    const gratuityPeriod = parseInt(document.getElementById('gratuity-period').value) || 6;

    return {
        position,
        basicSalary,
        taxableAllowances,
        nonTaxableAllowances,
        vacationAllowance,
        qualificationType,
        qualificationAllowance,
        overtimeIncome,
        secondJobIncome,
        childCount,
        loanPayment,
        gpsuDeduction,
        insurancePremium,
        insuranceType,
        gratuityRate,
        gratuityPeriod
    };
}

/**
 * Perform all calculations based on input values
 * @param {Object} inputs - Input values from the form
 * @returns {Object} Calculation results
 */
function performCalculations(inputs) {
    const {
        basicSalary,
        taxableAllowances,
        nonTaxableAllowances,
        vacationAllowance,
        qualificationAllowance,
        overtimeIncome,
        secondJobIncome,
        childCount,
        loanPayment,
        gpsuDeduction,
        insurancePremium,
        gratuityRate,
        gratuityPeriod
    } = inputs;

    // Calculate monthly gratuity accrual (not paid monthly, but accrued)
    const monthlyGratuityAccrual = basicSalary * (gratuityRate / 100);
    
    // Six month accumulated gratuity (paid at the 6-month mark)
    const sixMonthGratuity = monthlyGratuityAccrual * 6;
    
    // Calculate regular monthly gross income (excluding gratuity and vacation)
    const regularMonthlyGrossIncome = basicSalary + taxableAllowances + nonTaxableAllowances + 
                                    overtimeIncome + secondJobIncome;

    // Calculate deductions
    const personalAllowance = Math.max(PERSONAL_ALLOWANCE, regularMonthlyGrossIncome / 3);
    const nisContribution = Math.min(regularMonthlyGrossIncome * NIS_RATE, NIS_CEILING * NIS_RATE);
    const childAllowance = childCount * CHILD_ALLOWANCE;
    const overtimeAllowance = Math.min(overtimeIncome, OVERTIME_ALLOWANCE_MAX);
    const secondJobAllowance = Math.min(secondJobIncome, SECOND_JOB_ALLOWANCE_MAX);

    // CORRECTED: Calculate taxable income - GPSU is NOT tax deductible (credit union payment)
    // Per GRA 2025 rules: Only Personal Allowance, NIS, Child Allowance, and Insurance are tax deductible
    const taxableIncome = Math.max(0, basicSalary + taxableAllowances - personalAllowance - 
                            nisContribution - childAllowance - insurancePremium);

    // Calculate income tax
    let incomeTax = 0;
    if (taxableIncome <= TAX_THRESHOLD) {
        incomeTax = taxableIncome * TAX_RATE_1;
    } else {
        incomeTax = (TAX_THRESHOLD * TAX_RATE_1) + 
                ((taxableIncome - TAX_THRESHOLD) * TAX_RATE_2);
    }

    // CORRECTED: Calculate regular monthly net salary
    // Insurance premium is already deducted as tax deduction, not as separate payment
    // GPSU and loan payments are deducted from net pay
    const monthlyNetSalary = regularMonthlyGrossIncome - nisContribution - incomeTax - loanPayment - gpsuDeduction;

    // PACKAGE CALCULATIONS
    
    // For month 6 - net salary + gratuity
    const monthSixTotal = monthlyNetSalary + sixMonthGratuity;
    
    // For month 12 - net salary + gratuity + vacation allowance
    const monthTwelveTotal = monthlyNetSalary + sixMonthGratuity + vacationAllowance;
    
    // Annual calculations
    const annualGrossIncome = regularMonthlyGrossIncome * 12;
    const annualNisContribution = nisContribution * 12;
    const annualTaxPayable = incomeTax * 12;
    const annualGratuityTotal = sixMonthGratuity * 2; // Two gratuity payments per year
    
    // Total annual figure
    const annualTotal = monthlyNetSalary * 12 + annualGratuityTotal + vacationAllowance;

    return {
        // Input values (for reference)
        basicSalary,
        taxableAllowances,
        nonTaxableAllowances,
        vacationAllowance,
        qualificationAllowance,
        overtimeIncome,
        secondJobIncome,
        childCount,
        loanPayment,
        gpsuDeduction,
        insurancePremium,
        gratuityRate,
        
        // Monthly calculations
        regularMonthlyGrossIncome,
        personalAllowance,
        nisContribution,
        childAllowance,
        overtimeAllowance,
        secondJobAllowance,
        taxableIncome,
        incomeTax,
        monthlyNetSalary,
        monthlyGratuityAccrual,
        
        // Special month calculations
        sixMonthGratuity,
        monthSixTotal,
        monthTwelveTotal,
        
        // Annual calculations
        annualGrossIncome,
        annualNisContribution,
        annualTaxPayable,
        annualGratuityTotal,
        annualTotal
    };
}
