/**
 * UI event handlers and DOM manipulation
 */

/**
 * Helper function to safely update element text content
 * @param {string} elementId - The ID of the element to update
 * @param {string} value - The value to set
 */
function safeUpdateElement(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
        return true;
    } else {
        // Only log warnings for critical elements, not optional ones
        const optionalElements = [
            'result-qualification-allowance', 
            'result-annual-nis',
            'result-month-six-net',
            'result-month-six-gratuity', 
            'result-month-twelve-net',
            'result-month-twelve-gratuity',
            'result-month-twelve-vacation'
        ];
        
        if (!optionalElements.includes(elementId)) {
            console.warn(`Element with ID '${elementId}' not found in DOM`);
        }
        return false;
    }
}

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
                text.textContent = 'Enter Detailed Taxable Allowances';
            } else {
                icon.classList.remove('fa-plus-circle');
                icon.classList.add('fa-minus-circle');
                text.textContent = 'Enter Total Taxable Allowances';
                
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
                text.textContent = 'Enter Detailed Non-Taxable Allowances';
            } else {
                icon.classList.remove('fa-plus-circle');
                icon.classList.add('fa-minus-circle');
                text.textContent = 'Enter Total Non-Taxable Allowances';
                
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
    
    // Toggle retroactive section
    const toggleRetroactive = document.getElementById('toggle-retroactive');
    if (toggleRetroactive) {
        toggleRetroactive.addEventListener('change', function() {
            const retroactiveSection = document.getElementById('retroactive-section');
            const retroactiveResultsDisplay = document.getElementById('retroactive-results-display');
            if (this.checked) {
                retroactiveSection.classList.remove('d-none');
            } else {
                retroactiveSection.classList.add('d-none');
                if (retroactiveResultsDisplay) {
                    retroactiveResultsDisplay.classList.add('d-none');
                }
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
 * Show results sections safely
 */
function showResultsSections() {
    const sections = [
        'results-summary',
        'quick-stats', 
        'detailed-results',
        'simulator-divider',
        'salary-increase-section',
        'charts-divider',
        'charts-section'
    ];
    
    sections.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.style.display = 'block';
        }
    });
}

/**
 * Update summary display with proper error handling
 */
function updateSummaryDisplay(results) {
    if (!results) {
        console.error('No results provided to updateSummaryDisplay');
        return;
    }

    try {
        // Update summary cards safely
        safeUpdateElement('summary-net-monthly', formatCurrency(results.monthlyNetSalary));
        safeUpdateElement('summary-annual-net', formatCurrency(results.annualTotal));
        safeUpdateElement('summary-month-six', formatCurrency(results.monthSixTotal));
        safeUpdateElement('summary-month-twelve', formatCurrency(results.monthTwelveTotal));

        // Update quick stats safely
        const effectiveTaxRate = ((results.incomeTax / results.regularMonthlyGrossIncome) * 100) || 0;
        const retentionRate = ((results.monthlyNetSalary / results.regularMonthlyGrossIncome) * 100) || 0;
        
        safeUpdateElement('stat-tax-rate', effectiveTaxRate.toFixed(1) + '%');
        safeUpdateElement('stat-retention', retentionRate.toFixed(1) + '%');
        safeUpdateElement('stat-gratuity', formatCurrency(results.monthlyGratuityAccrual));
        safeUpdateElement('stat-nis', formatCurrency(results.nisContribution));

        // Show all results sections
        showResultsSections();
    } catch (error) {
        console.error('Error in updateSummaryDisplay:', error);
    }
}

/**
 * Update all result fields with calculation values
 * @param {Object} results - The calculation results
 */
function updateResultsDisplay(results) {
    try {
        // Regular monthly values - use safe update for all elements
        safeUpdateElement('result-basic', formatCurrency(results.basicSalary));
        safeUpdateElement('result-taxable-allowances', formatCurrency(results.taxableAllowances));
        safeUpdateElement('result-non-taxable-allowances', formatCurrency(results.nonTaxableAllowances));
        safeUpdateElement('result-qualification-allowance', formatCurrency(results.qualificationAllowance || 0));
        safeUpdateElement('result-gross', formatCurrency(results.regularMonthlyGrossIncome));
        safeUpdateElement('result-personal-allowance', formatCurrency(results.personalAllowance));
        safeUpdateElement('result-nis', formatCurrency(results.nisContribution));
        safeUpdateElement('result-child', formatCurrency(results.childAllowance));
        safeUpdateElement('result-overtime', formatCurrency(results.overtimeAllowance));
        safeUpdateElement('result-second-job', formatCurrency(results.secondJobAllowance));
        safeUpdateElement('result-insurance', formatCurrency(results.actualInsuranceDeduction));
        safeUpdateElement('result-loan-deductions', formatCurrency(results.loanPayment));
        safeUpdateElement('result-credit-union-deduction', formatCurrency(results.creditUnionDeduction));
        safeUpdateElement('result-taxable-income', formatCurrency(results.taxableIncome));
        safeUpdateElement('result-tax', formatCurrency(results.incomeTax));
        safeUpdateElement('result-monthly-gratuity', formatCurrency(results.monthlyGratuityAccrual));
        safeUpdateElement('result-net', formatCurrency(results.monthlyNetSalary));

        // Annual projections
        safeUpdateElement('result-annual-gross', formatCurrency(results.annualGrossIncome));
        safeUpdateElement('result-annual-nis', formatCurrency(results.annualNisContribution || results.nisContribution * 12));
        safeUpdateElement('result-annual-tax', formatCurrency(results.annualTaxPayable));
        safeUpdateElement('result-annual-gratuity', formatCurrency(results.annualGratuityTotal));
        safeUpdateElement('result-annual-net', formatCurrency(results.annualTotal));

        // Special month totals
        safeUpdateElement('result-month-six-net', formatCurrency(results.monthlyNetSalary));
        safeUpdateElement('result-month-six-gratuity', formatCurrency(results.sixMonthGratuity));
        safeUpdateElement('result-month-six-total', formatCurrency(results.monthSixTotal));
        
        safeUpdateElement('result-month-twelve-net', formatCurrency(results.monthlyNetSalary));
        safeUpdateElement('result-month-twelve-gratuity', formatCurrency(results.sixMonthGratuity));
        safeUpdateElement('result-month-twelve-vacation', formatCurrency(results.vacationAllowance || 0));
        safeUpdateElement('result-month-twelve-total', formatCurrency(results.monthTwelveTotal));

        // Show/hide second job row
        const secondJobResultRow = document.getElementById('second-job-result-row');
        if (secondJobResultRow) {
            if (results.secondJobIncome > 0 || 
                (document.getElementById('second-job-section') && 
                 !document.getElementById('second-job-section').classList.contains('d-none'))) {
                secondJobResultRow.classList.remove('d-none');
            } else {
                secondJobResultRow.classList.add('d-none');
            }
        }

        // Update summary display
        updateSummaryDisplay(results);

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
    } catch (error) {
        console.error('Error in updateResultsDisplay:', error);
        // Still try to show basic summary even if detailed update fails
        try {
            updateSummaryDisplay(results);
        } catch (summaryError) {
            console.error('Error in updateSummaryDisplay fallback:', summaryError);
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
