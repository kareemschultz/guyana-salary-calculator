/**
 * Main calculation functions - Updated with Payment Frequency Support
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
        alert("There was an error in the calculation. Please check your inputs and try again.\n\nDetails: " + error.message);
    } finally {
        // Hide loading overlay
        hideLoadingOverlay();
    }
}

/**
 * Get all input values from the form with payment frequency support
 * @returns {Object} All input values
 */
function getInputValues() {
    // Get position from dropdown or custom input
    const position = getSelectedPosition();
    
    // Get current payment frequency
    const paymentFrequency = getCurrentFrequency();
    const frequencyConfig = getFrequencyConfig();

    // Basic salary
    const basicSalaryElement = document.getElementById('basic-salary');
    if (!basicSalaryElement) {
        debug("Error: 'basic-salary' element not found in the DOM.");
        throw new Error("Missing 'Basic Salary' input element. Ensure index.html is fully updated and loaded.");
    }
    const basicSalary = parseFloat(basicSalaryElement.value) || 0;

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
        document.querySelectorAll('.non-taxable-allowance').forEach(function(input) {
            nonTaxableAllowances += parseFloat(input.value) || 0;
        });
    } else {
        // Single input is showing
        nonTaxableAllowances = parseFloat(document.getElementById('non-taxable-allowances').value) || 0;
    }

    // Get vacation allowance (annual payment)
    const vacationAllowance = parseFloat(document.getElementById('vacation-allowance')?.value) || 0;

    // Get qualification allowance for current frequency
    const qualificationType = document.querySelector('input[name="qualification-type"]:checked')?.value || 'none';
    const qualificationAllowance = getQualificationAllowanceForFrequency(qualificationType);

    // Add qualification allowance to non-taxable allowances as it's a non-taxable payment
    nonTaxableAllowances += qualificationAllowance;

    // Get other income and deductions
    const overtimeIncome = parseFloat(document.getElementById('overtime')?.value) || 0;
    const secondJobIncome = parseFloat(document.getElementById('second-job')?.value) || 0;
    const childCount = parseInt(document.getElementById('children')?.value) || 0;
    const loanPayment = parseFloat(document.getElementById('loan-payment')?.value) || 0;
    const creditUnionDeduction = parseFloat(document.getElementById('credit-union-deduction')?.value) || 0;

    // Insurance premium - convert to current frequency if needed
    let insurancePremium = 0;
    const insuranceType = document.getElementById('insurance')?.value || 'none';

    if (insuranceType === 'custom') {
        insurancePremium = parseFloat(document.getElementById('custom-premium')?.value) || 0;
    } else {
        // Convert monthly insurance premiums to current frequency
        const monthlyPremium = INSURANCE_PREMIUMS[insuranceType] || 0;
        insurancePremium = convertFromMonthly(monthlyPremium, paymentFrequency);
    }

    // Gratuity options
    const gratuityRate = parseFloat(document.getElementById('gratuity-rate')?.value) || 22.5;
    const gratuityPeriod = parseInt(document.getElementById('gratuity-period')?.value) || 6;

    return {
        position,
        paymentFrequency,
        frequencyConfig,
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
        creditUnionDeduction,
        insurancePremium,
        insuranceType,
        gratuityRate,
        gratuityPeriod
    };
}

/**
 * Perform all calculations based on input values with frequency support
 * @param {Object} inputs - Input values from the form
 * @returns {Object} Calculation results
 */
function performCalculations(inputs) {
    const {
        paymentFrequency,
        frequencyConfig,
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
        creditUnionDeduction,
        insurancePremium,
        gratuityRate,
        gratuityPeriod
    } = inputs;

    // Convert basic salary to monthly for gratuity calculation (gratuity is always monthly-based)
    const monthlyBasicSalary = convertToMonthly(basicSalary, paymentFrequency);
    
    // Calculate monthly gratuity accrual (not paid monthly, but accrued)
    const monthlyGratuityAccrual = monthlyBasicSalary * (gratuityRate / 100);
    
    // Six month accumulated gratuity (paid at the 6-month mark)
    const sixMonthGratuity = monthlyGratuityAccrual * 6;
    
    // Calculate gross income for the selected frequency
    const regularMonthlyGrossIncome = basicSalary + taxableAllowances + nonTaxableAllowances +
                                     overtimeIncome + secondJobIncome;

    // Calculate deductions that reduce taxable income using frequency-specific values
    const personalAllowance = Math.max(frequencyConfig.personalAllowance, regularMonthlyGrossIncome / 3);
    const nisContribution = Math.min(regularMonthlyGrossIncome * frequencyConfig.nisRate, 
                                    frequencyConfig.nisCeiling * frequencyConfig.nisRate);
    const childAllowance = childCount * frequencyConfig.childAllowance;
    
    // Overtime and Second Job allowances (non-taxable portions)
    const overtimeAllowance = Math.min(overtimeIncome, frequencyConfig.overtimeMax);
    const secondJobAllowance = Math.min(secondJobIncome, frequencyConfig.secondJobMax);

    // Apply the cap for insurance premium deduction
    const actualInsuranceDeduction = Math.min(insurancePremium, 
                                             regularMonthlyGrossIncome * 0.10, 
                                             frequencyConfig.insuranceMaxMonthly);

    // Calculate the 'gross income for taxable calculation'
    const grossIncomeForTaxableCalculation = regularMonthlyGrossIncome - nonTaxableAllowances - 
                                           overtimeAllowance - secondJobAllowance;

    // Calculate actual taxable income (Chargeable Income)
    const taxableIncome = Math.max(0, grossIncomeForTaxableCalculation - personalAllowance -
                            nisContribution - childAllowance - actualInsuranceDeduction);

    // Calculate income tax using frequency-specific thresholds
    let incomeTax = 0;
    if (taxableIncome <= frequencyConfig.taxThreshold) {
        incomeTax = taxableIncome * TAX_RATE_1;
    } else {
        incomeTax = (frequencyConfig.taxThreshold * TAX_RATE_1) +
                   ((taxableIncome - frequencyConfig.taxThreshold) * TAX_RATE_2);
    }

    // Calculate net salary for the selected frequency
    const netSalaryForFrequency = regularMonthlyGrossIncome - nisContribution - incomeTax - 
                                 loanPayment - creditUnionDeduction;

    // Convert to monthly equivalents for compatibility with existing logic
    const monthlyGrossIncome = convertToMonthly(regularMonthlyGrossIncome, paymentFrequency);
    const monthlyNetSalary = convertToMonthly(netSalaryForFrequency, paymentFrequency);
    
    // PACKAGE CALCULATIONS
    
    // For month 6 - net salary + gratuity
    const monthSixTotal = monthlyNetSalary + sixMonthGratuity;
    
    // For month 12 - net salary + gratuity + vacation allowance
    const monthTwelveTotal = monthlyNetSalary + sixMonthGratuity + vacationAllowance;
    
    // Annual calculations
    const annualGrossIncome = regularMonthlyGrossIncome * frequencyConfig.periodsPerYear;
    const annualNisContribution = nisContribution * frequencyConfig.periodsPerYear;
    const annualTaxPayable = incomeTax * frequencyConfig.periodsPerYear;
    const annualNetSalary = netSalaryForFrequency * frequencyConfig.periodsPerYear;
    const annualGratuityTotal = sixMonthGratuity * 2; // Two gratuity payments per year
    
    // Total annual figure (including two gratuity payments and one annual vacation allowance)
    const annualTotal = annualNetSalary + annualGratuityTotal + vacationAllowance;

    return {
        // Input values (for reference)
        paymentFrequency,
        frequencyConfig,
        basicSalary,
        monthlyBasicSalary,
        taxableAllowances,
        nonTaxableAllowances,
        vacationAllowance,
        qualificationType,
        qualificationAllowance,
        overtimeIncome,
        secondJobIncome,
        childCount,
        loanPayment,
        creditUnionDeduction,
        insurancePremium,
        actualInsuranceDeduction,
        gratuityRate,
        
        // Frequency-specific calculations
        regularMonthlyGrossIncome,
        grossIncomeForTaxableCalculation,
        personalAllowance,
        nisContribution,
        childAllowance,
        overtimeAllowance,
        secondJobAllowance,
        taxableIncome,
        incomeTax,
        netSalaryForFrequency,
        
        // Monthly equivalents (for compatibility)
        monthlyGrossIncome,
        monthlyNetSalary,
        monthlyGratuityAccrual,
        
        // Special month calculations (always monthly)
        sixMonthGratuity,
        monthSixTotal,
        monthTwelveTotal,
        
        // Annual calculations
        annualGrossIncome,
        annualNisContribution,
        annualTaxPayable,
        annualNetSalary,
        annualGratuityTotal,
        annualTotal
    };
}
