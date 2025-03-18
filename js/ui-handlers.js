/**
 * UI event handlers and DOM manipulation
 */

/**
 * Initialize all event listeners
 */
function setupEventListeners() {
    debug('Setting up event listeners');
    
    // Calculate button
    const calculateBtn = document.getElementById('calculate-btn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            debug('Calculate button clicked');
            calculateSalary();
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
                text.textContent = 'Add Multiple';
            } else {
                icon.classList.remove('fa-plus-circle');
                icon.classList.add('fa-minus-circle');
                text.textContent = 'Show Single';
                
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
                text.textContent = 'Add Multiple';
            } else {
                icon.classList.remove('fa-plus-circle');
                icon.classList.add('fa-minus-circle');
                text.textContent = 'Show Single';
                
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
    
    // Position preset buttons
    const positionPresets = document.querySelectorAll('.position-preset');
    positionPresets.forEach(function(button) {
        button.addEventListener('click', function() {
            const presetId = this.getAttribute('data-position');
            applyPositionPreset(presetId);
            
            // Highlight the selected button
            positionPresets.forEach(btn => btn.classList.remove('btn-primary'));
            positionPresets.forEach(btn => btn.classList.add('btn-outline-primary'));
            this.classList.remove('btn-outline-primary');
            this.classList.add('btn-primary');
        });
    });

    // Initialize tooltips
    initializeTooltips();
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
    document.querySelectorAll('.non-taxable-allowance').forEach(function(input) {
        total += parseFloat(input.value) || 0;
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
    document.getElementById('result-insurance').textContent = formatCurrency(results.insurancePremium);
    document.getElementById('result-loan-deductions').textContent = formatCurrency(results.loanPayment);
    document.getElementById('result-gpsu-deduction').textContent = formatCurrency(results.gpsuDeduction);
    document.getElementById('result-taxable-income').textContent = formatCurrency(results.taxableIncome);
    document.getElementById('result-tax').textContent = formatCurrency(results.incomeTax);
    document.getElementById('result-monthly-gratuity').textContent = formatCurrency(results.monthlyGratuityAccrual);
    document.getElementById('result-net').textContent = formatCurrency(results.monthlyNetSalary);

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