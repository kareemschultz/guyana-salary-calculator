/**
 * ENHANCED Salary Increase Calculator - COMPLETE PAYSLIP ACCURACY
 * Now includes: Retroactive Gratuity Differential + Retroactive Vacation Allowance
 */

/**
 * Show the salary increase section after initial calculation
 */
function showSalaryIncreaseSection() {
    const salaryIncreaseSection = document.getElementById('salary-increase-section');
    if (salaryIncreaseSection) {
        salaryIncreaseSection.style.display = 'block';
    }

    // Setup listener for retroactive toggle if not already set up
    const toggleRetroactive = document.getElementById('toggle-retroactive');
    if (toggleRetroactive && !toggleRetroactive.hasAttribute('data-listener-added')) {
        toggleRetroactive.addEventListener('change', function() {
            const retroactiveSection = document.getElementById('retroactive-section');
            const retroactiveResultsDisplay = document.getElementById('retroactive-results-display');
            if (this.checked) {
                if (retroactiveSection) retroactiveSection.classList.remove('d-none');
            } else {
                if (retroactiveSection) retroactiveSection.classList.add('d-none');
                if (retroactiveResultsDisplay) retroactiveResultsDisplay.classList.add('d-none');
            }
        });
        toggleRetroactive.setAttribute('data-listener-added', 'true');
    }

    // Setup listener for gratuity month toggle if not already set up
    const toggleGratuityMonth = document.getElementById('toggle-gratuity-month');
    if (toggleGratuityMonth && !toggleGratuityMonth.hasAttribute('data-listener-added')) {
        toggleGratuityMonth.addEventListener('change', function() {
            const gratuityMonthSection = document.getElementById('gratuity-month-section');
            const gratuityMonthResultsDisplay = document.getElementById('gratuity-month-results-display');
            if (this.checked) {
                if (gratuityMonthSection) gratuityMonthSection.classList.remove('d-none');
            } else {
                if (gratuityMonthSection) gratuityMonthSection.classList.add('d-none');
                if (gratuityMonthResultsDisplay) gratuityMonthResultsDisplay.classList.add('d-none');
            }
        });
        toggleGratuityMonth.setAttribute('data-listener-added', 'true');
    }

    // Populate quick increase percentage dropdown
    populateQuickIncreaseOptions();
}

/**
 * Populate quick increase percentage options
 */
function populateQuickIncreaseOptions() {
    const quickIncreaseSelect = document.getElementById('quick-increase-select');
    if (quickIncreaseSelect && COMMON_SALARY_INCREASES) {
        // Clear existing options except the first one
        while (quickIncreaseSelect.children.length > 1) {
            quickIncreaseSelect.removeChild(quickIncreaseSelect.lastChild);
        }
        
        // Add common increase options
        COMMON_SALARY_INCREASES.forEach(increase => {
            const option = document.createElement('option');
            option.value = increase.value;
            option.textContent = increase.label;
            quickIncreaseSelect.appendChild(option);
        });
        
        // Add event listener for quick selection
        if (!quickIncreaseSelect.hasAttribute('data-listener-added')) {
            quickIncreaseSelect.addEventListener('change', function() {
                if (this.value !== 'custom') {
                    const increasePercentageInput = document.getElementById('increase-percentage');
                    if (increasePercentageInput) {
                        increasePercentageInput.value = this.value;
                    }
                }
            });
            quickIncreaseSelect.setAttribute('data-listener-added', 'true');
        }
    }
}

/**
 * Calculate results with salary increase
 */
function calculateWithIncrease() {
    debug('Calculating with enhanced salary increase (including retro gratuity & vacation)');
    
    try {
        // Get the last calculated results
        const lastResults = getCurrentResults();
        if (!lastResults) {
            alert('Please calculate your current salary first before applying an increase.');
            return;
        }
        
        // Get increase parameters
        const increasePercentageElement = document.getElementById('increase-percentage');
        const increasePercentage = increasePercentageElement ? (parseFloat(increasePercentageElement.value) || 0) : 0;
        
        const increaseTaxableElement = document.querySelector('input[name="increase-taxable"]:checked');
        const isTaxable = increaseTaxableElement ? increaseTaxableElement.value === 'yes' : true;
        
        // Get retroactive parameters
        const toggleRetroactiveElement = document.getElementById('toggle-retroactive');
        const isRetroactive = toggleRetroactiveElement ? toggleRetroactiveElement.checked : false;
        
        const retroactiveMonthsElement = document.getElementById('retroactive-months');
        const retroactiveMonths = isRetroactive && retroactiveMonthsElement ? (parseInt(retroactiveMonthsElement.value) || 0) : 0;

        // Get gratuity month parameters
        const toggleGratuityMonthElement = document.getElementById('toggle-gratuity-month');
        const isGratuityMonth = toggleGratuityMonthElement ? toggleGratuityMonthElement.checked : false;

        // Calculate new values with ENHANCED retroactive components
        const results = calculateEnhancedIncreaseResults(lastResults, increasePercentage, isTaxable, retroactiveMonths, isGratuityMonth);
        
        // Display new results with enhanced breakdown
        updateEnhancedIncreaseResultsDisplay(results, lastResults, isRetroactive, isGratuityMonth);
        
    } catch (error) {
        console.error("Enhanced increase calculation error:", error);
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
 * ENHANCED: Calculate results with complete retroactive components
 * @param {Object} baseResults - The base calculation results
 * @param {number} increasePercentage - The percentage increase
 * @param {boolean} isTaxable - Whether the increase is taxable
 * @param {number} retroactiveMonths - Number of months for retroactive pay
 * @param {boolean} isGratuityMonth - Whether this is a gratuity payment month
 * @returns {Object} The new calculation results with enhanced retroactive components
 */
function calculateEnhancedIncreaseResults(baseResults, increasePercentage, isTaxable, retroactiveMonths, isGratuityMonth) {
    // Calculate the increase amount based on baseResults.basicSalary
    const monthlyBasicIncreaseAmount = baseResults.basicSalary * (increasePercentage / 100);
    
    // Create a deep copy of the base results to modify
    const newResults = JSON.parse(JSON.stringify(baseResults));
    
    // Apply the increase to basic salary for the new monthly salary
    newResults.basicSalary += monthlyBasicIncreaseAmount;
    
    // Recalculate gratuity based on the new basicSalary
    const originalMonthlyGratuity = baseResults.basicSalary * (newResults.gratuityRate / 100);
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
                                  newResults.creditUnionDeduction;

    // === ENHANCED RETROACTIVE CALCULATIONS ===
    newResults.retroactiveMonthlyIncrease = 0;
    newResults.totalRetroactiveLumpSum = 0;
    newResults.retroactiveGratuityDifferential = 0;
    newResults.retroactiveVacationAllowance = 0;
    newResults.totalRetroactiveGross = 0;
    newResults.netPayWithRetroactiveLumpSum = 0;

    if (retroactiveMonths > 0) {
        // 1. Basic Salary Retroactive (Backpay)
        newResults.retroactiveMonthlyIncrease = monthlyBasicIncreaseAmount;
        newResults.totalRetroactiveLumpSum = monthlyBasicIncreaseAmount * retroactiveMonths;
        
        // 2. NEW: Retroactive Gratuity Differential
        const monthlyGratuityIncrease = newResults.monthlyGratuityAccrual - originalMonthlyGratuity;
        newResults.retroactiveGratuityDifferential = monthlyGratuityIncrease * retroactiveMonths;
        
        // 3. NEW: Retroactive Vacation Allowance (typically equals monthly salary increase)
        newResults.retroactiveVacationAllowance = monthlyBasicIncreaseAmount; // Usually for 1 month (annual adjustment)
        
        // 4. Total Retroactive Components
        newResults.totalRetroactiveGross = newResults.totalRetroactiveLumpSum + 
                                          newResults.retroactiveGratuityDifferential + 
                                          newResults.retroactiveVacationAllowance;

        // Calculate net pay for the month that includes ALL retroactive components
        const grossForRetroMonth = newResults.regularMonthlyGrossIncome + newResults.totalRetroactiveGross;

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

        // Calculate Net Pay for the retroactive payment month (including ALL retro components)
        newResults.netPayWithRetroactiveLumpSum = grossForRetroMonth - retroNisContribution - retroIncomeTax - newResults.loanPayment - newResults.creditUnionDeduction;
    }

    // === GRATUITY MONTH CALCULATION ===
    newResults.gratuityMonthNetPay = 0;
    newResults.gratuityMonthTotalPay = 0;
    newResults.isGratuityMonth = isGratuityMonth;

    if (isGratuityMonth) {
        // Calculate total payment for gratuity month (regular net + gratuity payment)
        newResults.gratuityMonthNetPay = newResults.monthlyNetSalary;
        newResults.gratuityMonthTotalPay = newResults.monthlyNetSalary + newResults.sixMonthGratuity;
        
        // If also retroactive, add ALL retroactive components to gratuity month
        if (retroactiveMonths > 0) {
            newResults.gratuityMonthTotalPay = newResults.netPayWithRetroactiveLumpSum + newResults.sixMonthGratuity;
        }
    }

    // Recalculate annual figures based on new monthly net salary
    newResults.annualGrossIncome = newResults.regularMonthlyGrossIncome * 12;
    newResults.annualNisContribution = newResults.nisContribution * 12;
    newResults.annualTaxPayable = newResults.incomeTax * 12;
    newResults.annualGratuityTotal = newResults.sixMonthGratuity * 2;
    
    // Recalculate annual total (including all retroactive components)
    newResults.annualTotal = (newResults.monthlyNetSalary * 12) + newResults.annualGratuityTotal + (newResults.vacationAllowance || 0);
    
    // Add ALL retroactive components to annual total if applicable
    if (retroactiveMonths > 0) {
        newResults.annualTotal += newResults.totalRetroactiveGross;
    }
    
    // Recalculate special month totals
    newResults.monthSixTotal = newResults.monthlyNetSalary + newResults.sixMonthGratuity;
    newResults.monthTwelveTotal = newResults.monthlyNetSalary + newResults.sixMonthGratuity + (newResults.vacationAllowance || 0);

    // Calculate difference values for display
    newResults.basicSalaryDifference = newResults.basicSalary - baseResults.basicSalary;
    newResults.monthlyNetDifference = newResults.monthlyNetSalary - baseResults.monthlyNetSalary;
    newResults.monthlyGratuityDifference = newResults.monthlyGratuityAccrual - baseResults.monthlyGratuityAccrual;
    newResults.annualNetDifference = newResults.annualTotal - baseResults.annualTotal;

    return newResults;
}

/**
 * CRITICAL: Safe helper function to update salary increase elements
 * This prevents "Cannot set properties of null" errors
 * @param {string} elementId - The ID of the element to update
 * @param {string} value - The value to set
 */
function safeUpdateIncreaseElement(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
        return true;
    } else {
        // Only warn for critical elements, silently skip optional ones
        const criticalElements = [
            'new-basic-salary', 'new-monthly-net', 'new-monthly-gratuity',
            'new-annual-gross', 'new-annual-income'
        ];
        if (criticalElements.includes(elementId)) {
            console.warn(`Critical salary increase element '${elementId}' not found in DOM`);
        }
        return false;
    }
}

/**
 * ENHANCED: Display the salary increase calculation results with complete breakdown
 * @param {Object} results - The new calculation results
 * @param {Object} baseResults - The original calculation results
 * @param {boolean} isRetroactive - Whether retroactive pay was calculated
 * @param {boolean} isGratuityMonth - Whether this is a gratuity payment month
 */
function updateEnhancedIncreaseResultsDisplay(results, baseResults, isRetroactive, isGratuityMonth) {
    try {
        const increaseResults = document.getElementById('increase-results');
        if (increaseResults) {
            increaseResults.classList.remove('d-none');
        }
        
        // Helper function to safely format currency
        const safeCurrency = (amount) => {
            if (amount === undefined || amount === null || isNaN(amount)) {
                return '$0.00';
            }
            return '$' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        };
        
        // Monthly Comparison - SAFE UPDATES
        safeUpdateIncreaseElement('new-basic-salary', safeCurrency(results.basicSalary));
        safeUpdateIncreaseElement('basic-salary-diff', '+' + safeCurrency(results.basicSalaryDifference || 0));
        
        safeUpdateIncreaseElement('new-monthly-net', safeCurrency(results.monthlyNetSalary));
        safeUpdateIncreaseElement('monthly-increase', '+' + safeCurrency(results.monthlyNetDifference || 0));
        
        safeUpdateIncreaseElement('new-monthly-gratuity', safeCurrency(results.monthlyGratuityAccrual));
        safeUpdateIncreaseElement('monthly-gratuity-diff', '+' + safeCurrency(results.monthlyGratuityDifference || 0));
        
        // Annual Comparison - SAFE UPDATES
        safeUpdateIncreaseElement('new-annual-gross', safeCurrency(results.annualGrossIncome));
        safeUpdateIncreaseElement('new-annual-tax', safeCurrency(results.annualTaxPayable));
        safeUpdateIncreaseElement('new-annual-gratuity', safeCurrency(results.annualGratuityTotal));
        safeUpdateIncreaseElement('new-annual-income', safeCurrency(results.annualTotal));
        safeUpdateIncreaseElement('annual-income-diff', '+' + safeCurrency(results.annualNetDifference || 0));
        
        // Special Payment Months - Month 6 - SAFE UPDATES
        safeUpdateIncreaseElement('new-month-six-net', safeCurrency(results.monthlyNetSalary));
        safeUpdateIncreaseElement('new-month-six-gratuity', safeCurrency(results.sixMonthGratuity));
        safeUpdateIncreaseElement('new-month-six-total', safeCurrency(results.monthSixTotal));
        
        // Special Payment Months - Month 12 - SAFE UPDATES
        safeUpdateIncreaseElement('new-month-twelve-net', safeCurrency(results.monthlyNetSalary));
        safeUpdateIncreaseElement('new-month-twelve-gratuity', safeCurrency(results.sixMonthGratuity));
        safeUpdateIncreaseElement('new-month-twelve-vacation', safeCurrency(results.vacationAllowance || 0));
        safeUpdateIncreaseElement('new-month-twelve-total', safeCurrency(results.monthTwelveTotal));

        // ENHANCED: Retroactive Results Display with ALL components
        const retroactiveResultsDisplay = document.getElementById('retroactive-results-display');
        if (isRetroactive && results.totalRetroactiveLumpSum > 0) {
            if (retroactiveResultsDisplay) {
                retroactiveResultsDisplay.classList.remove('d-none');
            }
            
            // Basic retroactive
            safeUpdateIncreaseElement('retro-monthly-increase', safeCurrency(results.retroactiveMonthlyIncrease || 0));
            safeUpdateIncreaseElement('total-retro-lump-sum', safeCurrency(results.totalRetroactiveLumpSum || 0));
            
            // NEW: Enhanced retroactive components
            safeUpdateIncreaseElement('retro-gratuity-differential', safeCurrency(results.retroactiveGratuityDifferential || 0));
            safeUpdateIncreaseElement('retro-vacation-allowance', safeCurrency(results.retroactiveVacationAllowance || 0));
            safeUpdateIncreaseElement('total-retro-gross', safeCurrency(results.totalRetroactiveGross || 0));
            
            safeUpdateIncreaseElement('net-pay-with-retro', safeCurrency(results.netPayWithRetroactiveLumpSum || 0));
        } else {
            if (retroactiveResultsDisplay) {
                retroactiveResultsDisplay.classList.add('d-none');
            }
        }

        // Gratuity Month Results Display
        const gratuityMonthResultsDisplay = document.getElementById('gratuity-month-results-display');
        if (isGratuityMonth) {
            if (gratuityMonthResultsDisplay) {
                gratuityMonthResultsDisplay.classList.remove('d-none');
            }
            safeUpdateIncreaseElement('gratuity-month-net-pay', safeCurrency(results.gratuityMonthNetPay || 0));
            safeUpdateIncreaseElement('gratuity-month-gratuity-payment', safeCurrency(results.sixMonthGratuity || 0));
            safeUpdateIncreaseElement('gratuity-month-total-pay', safeCurrency(results.gratuityMonthTotalPay || 0));
            
            // Update summary message with enhanced details
            const gratuityMonthMessage = document.getElementById('gratuity-month-message');
            if (gratuityMonthMessage) {
                let message = `This month you receive both your salary increase and gratuity payment totaling ${safeCurrency(results.gratuityMonthTotalPay)}.`;
                if (isRetroactive && results.totalRetroactiveGross > 0) {
                    message = `This month you receive your salary increase, ALL retroactive payments (Basic: ${safeCurrency(results.totalRetroactiveLumpSum)}, Gratuity: ${safeCurrency(results.retroactiveGratuityDifferential)}, Vacation: ${safeCurrency(results.retroactiveVacationAllowance)}), and gratuity payment - an exceptional total of ${safeCurrency(results.gratuityMonthTotalPay)}!`;
                }
                gratuityMonthMessage.textContent = message;
            }
        } else {
            if (gratuityMonthResultsDisplay) {
                gratuityMonthResultsDisplay.classList.add('d-none');
            }
        }
        
        console.log('Enhanced salary increase display updated successfully with complete retroactive breakdown');
        
    } catch (error) {
        console.error('Error in enhanced salary increase display:', error);
        console.log('Enhanced salary increase calculation completed despite display errors');
        
        const increaseResults = document.getElementById('increase-results');
        if (increaseResults) {
            increaseResults.classList.remove('d-none');
        }
    }
}

/**
 * Show the gratuity month section
 */
function showGratuityMonthSection() {
    const gratuityMonthSection = document.getElementById('gratuity-month-section');
    if (gratuityMonthSection) {
        gratuityMonthSection.classList.remove('d-none');
    }
}

/**
 * Hide the gratuity month section
 */
function hideGratuityMonthSection() {
    const gratuityMonthSection = document.getElementById('gratuity-month-section');
    if (gratuityMonthSection) {
        gratuityMonthSection.classList.add('d-none');
    }
}
