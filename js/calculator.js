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
    // NOTE: #vacation-allowance no longer has 'non-taxable-allowance' class in index.html
    // so it will not be summed here if multiple inputs are used.
    let nonTaxableAllowances = 0;
    if (document.getElementById('single-non-taxable-allowance') &&
        document.getElementById('single-non-taxable-allowance').classList.contains('d-none')) {
        // Multiple allowances are showing
        document.querySelectorAll('.non-taxable-allowance').forEach(function(input) {
            nonTaxableAllowances += parseFloat(input.value) || 0;
        });
    } else {
        // Single input is showing - assume this already accounts for other non-taxable allowances
        nonTaxableAllowances = parseFloat(document.getElementById('non-taxable-allowances').value) || 0;
    }

    // Get vacation allowance (annual payment) - collected separately as it's an annual lump sum
    const vacationAllowance = parseFloat(document.getElementById('vacation-allowance')?.value) || 0;

    // Get qualification allowance
    const qualificationType = document.querySelector('input[name="qualification-type"]:checked').value;
    const qualificationAllowance = QUALIFICATION_ALLOWANCES[qualificationType];

    // Add qualification allowance to non-taxable allowances as it's a non-taxable monthly payment
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
        nonTaxableAllowances, // This now correctly excludes the annual vacationAllowance lump sum
        vacationAllowance, // This is the annual lump sum for Month 12 payment
        qualificationType,
        qualificationAllowance,
        overtimeIncome,
        secondJobIncome,
        childCount,
        loanPayment,
        gpsuDeduction,
        insurancePremium, // This is the premium amount paid/selected, not yet capped for deduction
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
        nonTaxableAllowances, // Correctly calculated from getInputValues
        vacationAllowance, // Annual lump sum
        qualificationAllowance,
        overtimeIncome,
        secondJobIncome,
        childCount,
        loanPayment,
        gpsuDeduction,
        insurancePremium, // Premium amount paid/selected
        gratuityRate,
        gratuityPeriod
    } = inputs;

    // Calculate monthly gratuity accrual (not paid monthly, but accrued)
    const monthlyGratuityAccrual = basicSalary * (gratuityRate / 100);
    
    // Six month accumulated gratuity (paid at the 6-month mark)
    const sixMonthGratuity = monthlyGratuityAccrual * 6;
    
    // Calculate regular monthly gross income for personal allowance and NIS calculation
    // This gross includes all income before tax-specific deductions
    const regularMonthlyGrossIncome = basicSalary + taxableAllowances + nonTaxableAllowances +
                                    overtimeIncome + secondJobIncome;

    // Apply the cap for insurance premium deduction
    // Deduction is lesser of premiums paid, 10% of gross income, or $50,000 monthly
    const actualInsuranceDeduction = Math.min(insurancePremium, regularMonthlyGrossIncome * 0.10, 50000);

    // Calculate deductions that reduce taxable income
    // Personal Allowance: Greater of $130,000 or 1/3 of gross income
    const personalAllowance = Math.max(PERSONAL_ALLOWANCE, regularMonthlyGrossIncome / 3);
    // NIS Contribution: 5.6% of gross income up to $280,000 monthly ceiling
    const nisContribution = Math.min(regularMonthlyGrossIncome * NIS_RATE, NIS_CEILING * NIS_RATE);
    // Child Allowance: $10,000 per child per month
    const childAllowance = childCount * CHILD_ALLOWANCE;
    // Overtime Allowance (non-taxable portion): Lesser of actual overtime or $50,000 monthly
    const overtimeAllowance = Math.min(overtimeIncome, OVERTIME_ALLOWANCE_MAX);
    // Second Job Allowance (non-taxable portion): Lesser of actual second job income or $50,000 monthly
    const secondJobAllowance = Math.min(secondJobIncome, SECOND_JOB_ALLOWANCE_MAX);


    // Calculate taxable income (Chargeable Income)
    // Deduct all statutory allowances/deductions from the regular gross income
    const taxableIncome = Math.max(0, regularMonthlyGrossIncome - personalAllowance -
                            nisContribution - childAllowance - actualInsuranceDeduction -
                            overtimeAllowance - secondJobAllowance); // Subtracted non-taxable portions

    // Calculate income tax (PAYE)
    let incomeTax = 0;
    if (taxableIncome <= TAX_THRESHOLD) { // First $260,000 monthly ($3,120,000 annually) at 25%
        incomeTax = taxableIncome * TAX_RATE_1;
    } else { // Income above threshold at 35%
        incomeTax = (TAX_THRESHOLD * TAX_RATE_1) +
                ((taxableIncome - TAX_THRESHOLD) * TAX_RATE_2);
    }

    // Calculate regular monthly net salary
    // Loan payments and GPSU are deducted from net pay, as they are not tax-deductible
    const monthlyNetSalary = regularMonthlyGrossIncome - nisContribution - incomeTax - loanPayment - gpsuDeduction;

    // PACKAGE CALCULATIONS
    
    // For month 6 - net salary + gratuity
    const monthSixTotal = monthlyNetSalary + sixMonthGratuity;
    
    // For month 12 - net salary + gratuity + vacation allowance (annual lump sum)
    const monthTwelveTotal = monthlyNetSalary + sixMonthGratuity + vacationAllowance;
    
    // Annual calculations
    const annualGrossIncome = regularMonthlyGrossIncome * 12;
    const annualNisContribution = nisContribution * 12;
    const annualTaxPayable = incomeTax * 12;
    const annualGratuityTotal = sixMonthGratuity * 2; // Two gratuity payments per year
    
    // Total annual figure (including two gratuity payments and one annual vacation allowance)
    const annualTotal = (monthlyNetSalary * 12) + annualGratuityTotal + vacationAllowance;

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
        insurancePremium, // Original premium input
        actualInsuranceDeduction, // The amount actually deducted for tax purposes
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
