/**
 * UI event handlers and DOM manipulation
 */

/**
 * Initialize all event listeners
 */
function setupEventListeners() {
    debug('Setting up event listeners');
    
    // Setup position dropdown
    setupPositionDropdown();
    
    // Setup qualification allowance listeners
    setupQualificationListeners();
    
    // Calculate button
    const calculateBtn = document.getElementById('calculate-btn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            debug('Calculate button clicked');
            calculateSalary();
            
            // Show the salary increase section after calculation
            showSalaryIncreaseSection();
        });
    }
    
    // Calculate with increase button
    const calculateIncreaseBtn = document.getElementById('calculate-increase-btn');
    if (calculateIncreaseBtn) {
        calculateIncreaseBtn.addEventListener('click', function() {
            debug('Calculate with increase button clicked');
            calculateWithIncrease();
        });
    }
    
    // Toggle taxable allowances
    const toggleTaxableAllowances = document.getElementById('toggle-taxable-allowances');
    if (toggleTaxableAllowances) {
        toggleTaxableAllowances.addEventListener('click', function(e) {
            e.preventDefault();
            const singleSection = document.getElementById('single-taxable-allowance');
            const multipleSection = document.getElementById('multiple-taxable-allowances');

            singleSection.classList.toggle('d-none');
            multipleSection.classList.toggle('d-none');

            const icon = this.querySelector('i');
            const text = this.querySelector('span');

            if (multipleSection.classList.contains('d-none')) {
                icon.classList.remove('fa-minus-circle');
                icon.classList.add('fa-plus-circle');
                text.textContent = 'Enter Detailed Taxable Allowances'; // Changed text
            } else {
                icon.classList.remove('fa-plus-circle');
                icon.classList.add('fa-minus-circle');
                text.textContent = 'Enter Total Taxable Allowances'; // Changed text
                
                // Calculate total when switching to multiple
                calculateTaxableAllowancesTotal();
            }
        });
    }

    // Toggle non-taxable allowances
    const toggleNonTaxableAllowances = document.getElementById('toggle-non-taxable-allowances');
    if (toggleNonTaxableAllowances) {
        toggleNonTaxableAllowances.addEventListener('click', function(e) {
            e.preventDefault();
            const singleSection = document.getElementById('single-non-taxable-allowance');
            const multipleSection = document.getElementById('multiple-non-taxable-allowances');

            singleSection.classList.toggle('d-none');
            multipleSection.classList.toggle('d-none');

            const icon = this.querySelector('i');
            const text = this.querySelector('span');

            if (multipleSection.classList.contains('d-none')) {
                icon.classList.remove('fa-minus-circle');
                icon.classList.add('fa-plus-circle');
                text.textContent = 'Enter Detailed Non-Taxable Allowances'; // Changed text
            } else {
                icon.classList.remove('fa-plus-circle');
                icon.classList.add('fa-minus-circle');
                text.textContent = 'Enter Total Non-Taxable Allowances'; // Changed text
                
                // Calculate total when switching to multiple
                calculateNonTaxableAllowancesTotal();
            }
        });
    }

    // Toggle second job
    const toggleSecondJob = document.getElementById('toggle-second-job');
    if (toggleSecondJob) {
        toggleSecondJob.addEventListener('click', function(e) {
            e.preventDefault();
            const secondJobSection = document.getElementById('second-job-section');
            secondJobSection.classList.toggle('d-none');

            const icon = this.querySelector('i');
            const text = this.querySelector('span');

            if (secondJobSection.classList.contains('d-none')) {
                icon.classList.remove('fa-minus-circle');
                icon.classList.add('fa-plus-circle');
                text.textContent = 'Add Second Job Income';
                document.getElementById('second-job').value = '';
            } else {
                icon.classList.remove('fa-plus-circle');
                icon.classList.add('fa-minus-circle');
                text.textContent = 'Remove Second Job Income';
            }
        });
    }
    
    // Toggle retroactive section - moved from salary-increase.js to here for general event listeners setup
    const toggleRetroactive = document.getElementById('toggle-retroactive');
    if (toggleRetroactive) {
        toggleRetroactive.addEventListener('change', function() {
            const retroactiveSection = document.getElementById('retroactive-section');
            const retroactiveResultsDisplay = document.getElementById('retroactive-results-display');
            if (this.checked) {
                retroactiveSection.classList.remove('d-none');
                // Ensure retroactive results display if there's a calculation to show
                // This might be initially hidden by updateIncreaseResultsDisplay if not applicable
            } else {
                retroactiveSection.classList.add('d-none');
                retroactiveResultsDisplay.classList.add('d-none'); // Hide results if toggle off
            }
        });
    }


    // Insurance dropdown
    const insuranceDropdown = document.getElementById('insurance');
    if (insuranceDropdown) {
        insuranceDropdown.addEventListener('change', function() {
            const customPremiumSection = document.getElementById('custom-premium-section');

            if (this.value === 'custom') {
                customPremiumSection.classList.remove('d-none');
            } else {
                customPremiumSection.classList.add('d-none');
                document.getElementById('custom-premium').value = '';
            }
        });
    }

    // Taxable allowances calculation
    const taxableAllowances = document.querySelectorAll('.taxable-allowance');
    taxableAllowances.forEach(function(input) {
        input.addEventListener('input', calculateTaxableAllowancesTotal);
    });

    // Non-taxable allowances calculation
    const nonTaxableAllowances = document.querySelectorAll('.non-taxable-allowance');
    nonTaxableAllowances.forEach(function(input) {
        input.addEventListener('input', calculateNonTaxableAllowancesTotal);
    });
    
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('change', function() {
            toggleDarkMode(this.checked);
        });
    }
    
    // Initialize tooltips
    initializeTooltips();
}

/**
 * Update the qualification allowance based on selection
 */
function updateQualificationAllowance() {
    const selectedQualification = document.querySelector('input[name="qualification-type"]:checked').value;
    const allowanceAmount = QUALIFICATION_ALLOWANCES[selectedQualification];
    
    const qualificationAlert = document.querySelector('.qualification-alert');
    const allowanceAmountElement = document.getElementById('qualification-allowance-amount');
    
    if (selectedQualification === 'none') {
        qualificationAlert.classList.add('d-none');
    } else {
        qualificationAlert.classList.remove('d-none');
        allowanceAmountElement.textContent = formatCurrency(allowanceAmount);
    }
}

/**
 * Set up event listeners for qualification checkboxes
 */
function setupQualificationListeners() {
    const qualificationChecks = document.querySelectorAll('.qualification-check');
    qualificationChecks.forEach(check => {
        check.addEventListener('change', updateQualificationAllowance);
    });
}

/**
 * Initialize Bootstrap tooltips
 */
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl, {
            html: true
        });
    });
}

/**
 * Calculate and display the total of taxable allowances
 */
function calculateTaxableAllowancesTotal() {
    let total = 0;
    document.querySelectorAll('.taxable-allowance').forEach(function(input) {
        total += parseFloat(input.value) || 0;
    });

    const totalElement = document.getElementById('taxable-allowances-total');
    if (totalElement) {
        totalElement.textContent = 'GYD $' + total.toFixed(2);
    }

    // Update the single input field too
    if (document.getElementById('single-taxable-allowance') && 
        !document.getElementById('single-taxable-allowance').classList.contains('d-none')) {
        document.getElementById('taxable-allowances').value = total;
    }
}

/**
 * Calculate and display the total of non-taxable allowances
 */
function calculateNonTaxableAllowancesTotal() {
    let total = 0;
    // Exclude vacation-allowance from this sum because it's handled as an annual lump sum separately.
    document.querySelectorAll('.non-taxable-allowance').forEach(function(input) {
        if (input.id !== 'vacation-allowance') { // Explicitly exclude vacation-allowance
            total += parseFloat(input.value) || 0;
        }
    });

    const totalElement = document.getElementById('non-taxable-allowances-total');
    if (totalElement) {
        totalElement.textContent = 'GYD $' + total.toFixed(2);
    }

    // Update the single input field too
    if (document.getElementById('single-non-taxable-allowance') && 
        !document.getElementById('single-non-taxable-allowance').classList.contains('d-none')) {
        document.getElementById('non-taxable-allowances').value = total;
    }
}

/**
 * Update all result fields with calculation values
 * @param {Object} results - The calculation results
 */
function updateResultsDisplay(results) {
    // Regular monthly values
    document.getElementById('result-basic').textContent = formatCurrency(results.basicSalary);
    document.getElementById('result-taxable-allowances').textContent = formatCurrency(results.taxableAllowances);
    document.getElementById('result-non-taxable-allowances').textContent = formatCurrency(results.nonTaxableAllowances);
    document.getElementById('result-gross').textContent = formatCurrency(results.regularMonthlyGrossIncome);
    document.getElementById('result-personal-allowance').textContent = formatCurrency(results.personalAllowance);
    document.getElementById('result-nis').textContent = formatCurrency(results.nisContribution);
    document.getElementById('result-child').textContent = formatCurrency(results.childAllowance);
    document.getElementById('result-overtime').textContent = formatCurrency(results.overtimeAllowance);
    document.getElementById('result-second-job').textContent = formatCurrency(results.secondJobAllowance);
    document.getElementById('result-insurance').textContent = formatCurrency(results.actualInsuranceDeduction); // Use actual deducted amount
    document.getElementById('result-loan-deductions').textContent = formatCurrency(results.loanPayment);
    document.getElementById('result-credit-union-deduction').textContent = formatCurrency(results.creditUnionDeduction); // Updated ID and variable name
    document.getElementById('result-taxable-income').textContent = formatCurrency(results.taxableIncome);
    document.getElementById('result-tax').textContent = formatCurrency(results.incomeTax);
    document.getElementById('result-monthly-gratuity').textContent = formatCurrency(results.monthlyGratuityAccrual);
    document.getElementById('result-net').textContent = formatCurrency(results.monthlyNetSalary);

    // If you added the qualification allowance row to the results display
    if (document.getElementById('result-qualification-allowance')) {
        document.getElementById('result-qualification-allowance').textContent = formatCurrency(results.qualificationAllowance);
    }

    // Annual projections
    document.getElementById('result-annual-gross').textContent = formatCurrency(results.annualGrossIncome);
    document.getElementById('result-annual-nis').textContent = formatCurrency(results.annualNisContribution);
    document.getElementById('result-annual-tax').textContent = formatCurrency(results.annualTaxPayable);
    document.getElementById('result-annual-gratuity').textContent = formatCurrency(results.annualGratuityTotal);
    document.getElementById('result-annual-net').textContent = formatCurrency(results.annualTotal);

    // Package breakdown - Month 6
    document.getElementById('result-month-six-net').textContent = formatCurrency(results.monthlyNetSalary);
    document.getElementById('result-month-six-gratuity').textContent = formatCurrency(results.sixMonthGratuity);
    document.getElementById('result-month-six-total').textContent = formatCurrency(results.monthSixTotal);
    
    // Package breakdown - Month 12
    document.getElementById('result-month-twelve-net').textContent = formatCurrency(results.monthlyNetSalary);
    document.getElementById('result-month-twelve-gratuity').textContent = formatCurrency(results.sixMonthGratuity);
    document.getElementById('result-month-twelve-vacation').textContent = formatCurrency(results.vacationAllowance);
    document.getElementById('result-month-twelve-total').textContent = formatCurrency(results.monthTwelveTotal);

    // Show/hide second job row
    const secondJobResultRow = document.getElementById('second-job-result-row');
    if (results.secondJobIncome > 0 || 
        (document.getElementById('second-job-section') && 
         !document.getElementById('second-job-section').classList.contains('d-none'))) {
        secondJobResultRow.classList.remove('d-none');
    } else {
        secondJobResultRow.classList.add('d-none');
    }

    // Create charts
    createIncomeChart(
        results.basicSalary, 
        results.taxableAllowances, 
        results.nonTaxableAllowances, 
        results.monthlyGratuityAccrual
    );
    
    createTaxChart(results.taxableIncome, results.incomeTax);
    
    // New visualizations
    createCashFlowChart(
        results.monthlyNetSalary,
        results.sixMonthGratuity,
        results.vacationAllowance
    );
    
    createTaxSavingsChart(results);
    
    createNetVsGrossChart(results);
    
    // Scroll to results on mobile
    if (window.innerWidth < 992) {
        const resultsSection = document.querySelector('.results-section');
        if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

/**
 * Handle position dropdown selection
 */
function setupPositionDropdown() {
    const positionSelect = document.getElementById('position-select');
    const positionCustom = document.getElementById('position-custom');
    
    // Initial state - if "Other" is selected, show custom input
    if (positionSelect && positionCustom) {
        if (positionSelect.value === 'other') {
            positionCustom.style.display = 'block';
        } else {
            positionCustom.style.display = 'none';
        }
        
        // Add event listener for dropdown changes
        positionSelect.addEventListener('change', function() {
            if (this.value === 'other') {
                // Show custom input field
                positionCustom.style.display = 'block';
                positionCustom.focus();
            } else {
                // Hide custom input and apply position preset
                positionCustom.style.display = 'none';
                applyPositionPreset(this.value);
            }
        });
    }
}

/**
 * Update the position function to work with the dropdown
 * This function gets the displayed position text (either custom or selected)
 */
function getSelectedPosition() {
    const positionSelect = document.getElementById('position-select');
    const positionCustom = document.getElementById('position-custom');
    
    if (!positionSelect || !positionCustom) {
        // Fallback to old position field if the dropdown isn't found
        const oldPositionField = document.getElementById('position');
        return oldPositionField ? oldPositionField.value : '';
    }
    
    if (positionSelect.value === 'other') {
        return positionCustom.value;
    } else {
        // Get the text of the selected option
        return positionSelect.options[positionSelect.selectedIndex].text;
    }
}
