/**
 * Utility functions for the calculator - Updated with Payment Frequency Support and Dark Mode Default
 */

/**
 * Format a number as a currency string
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount) {
    if (amount === undefined || amount === null || isNaN(amount)) {
        return '$0.00';
    }
    return '$' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

/**
 * Set default dates in the form
 */
function setDefaultDates() {
    // Set default dates
    const today = new Date();
    document.getElementById('calculation-date').valueAsDate = today;
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 6);
    document.getElementById('start-date').valueAsDate = sixMonthsAgo;
}

/**
 * Show the loading overlay
 */
function showLoadingOverlay() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
    }
}

/**
 * Hide the loading overlay
 */
function hideLoadingOverlay() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

/**
 * Log a debugging message
 * @param {string} message - The message to log
 * @param {any} data - Optional data to log
 */
function debug(message, data = null) {
    console.log(`[Calculator] ${message}`, data || '');
}

/**
 * Check if dark mode is enabled
 * @returns {boolean} True if dark mode is enabled
 */
function isDarkMode() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
}

/**
 * Toggle between light and dark themes
 * @param {boolean} darkMode - Whether to enable dark mode
 */
function toggleDarkMode(darkMode) {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    
    // Update chart themes if they exist
    updateChartsTheme();
}

/**
 * Initialize theme based on stored preference - DEFAULTS TO DARK MODE
 */
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    
    // Default to dark mode if no preference is saved
    const isDark = savedTheme === null ? true : savedTheme === 'dark';
    
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.checked = isDark;
    }
    
    debug('Theme initialized', { savedTheme, isDark });
}

/**
 * Update chart colors based on current theme
 */
function updateChartsTheme() {
    const isDark = isDarkMode();
    
    // Chart color themes
    const chartColors = {
        light: {
            backgroundColor: '#ffffff',
            textColor: '#1f2937',
            gridColor: '#e5e7eb',
            colors: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']
        },
        dark: {
            backgroundColor: '#1f2937',
            textColor: '#f9fafb',
            gridColor: '#374151',
            colors: ['#60a5fa', '#f87171', '#34d399', '#fbbf24', '#a78bfa', '#f472b6']
        }
    };
    
    const theme = isDark ? chartColors.dark : chartColors.light;
    
    // Update Chart.js defaults
    if (typeof Chart !== 'undefined') {
        Chart.defaults.color = theme.textColor;
        Chart.defaults.scale.grid.color = theme.gridColor;
    }
    
    // Redraw existing charts with new theme if they exist
    if (typeof incomeChart !== 'undefined' && incomeChart) {
        incomeChart.data.datasets[0].backgroundColor = theme.colors;
        incomeChart.update();
    }
    
    if (typeof taxChart !== 'undefined' && taxChart) {
        taxChart.data.datasets[0].backgroundColor = theme.colors[0];
        taxChart.data.datasets[0].borderColor = theme.colors[0];
        taxChart.data.datasets[1].backgroundColor = theme.colors[1];
        taxChart.data.datasets[1].borderColor = theme.colors[1];
        taxChart.update();
    }
    
    if (typeof cashFlowChart !== 'undefined' && cashFlowChart) {
        cashFlowChart.data.datasets[0].borderColor = theme.colors[0];
        cashFlowChart.update();
    }
    
    if (typeof taxSavingsChart !== 'undefined' && taxSavingsChart) {
        taxSavingsChart.data.datasets[0].backgroundColor = [
            theme.colors[0],
            theme.colors[1],
            theme.colors[2],
            theme.colors[3]
        ];
        taxSavingsChart.update();
    }
    
    if (typeof netVsGrossChart !== 'undefined' && netVsGrossChart) {
        netVsGrossChart.data.datasets[0].backgroundColor = theme.colors[0];
        netVsGrossChart.data.datasets[1].backgroundColor = theme.colors[1];
        netVsGrossChart.update();
    }
}

/**
 * Apply a position preset to the form with frequency conversion support
 * @param {string} presetId - The ID of the preset to apply
 */
function applyPositionPreset(presetId) {
    if (!POSITION_PRESETS[presetId]) {
        debug('Invalid position preset ID: ' + presetId);
        return;
    }
    
    const preset = POSITION_PRESETS[presetId];
    const frequencyConfig = getFrequencyConfig();
    debug('Applying position preset with frequency conversion', { preset, frequencyConfig });
    
    // Convert monthly preset values to current frequency
    const basicSalaryForFrequency = convertFromMonthly(preset.baseSalary);
    const totalTaxableForFrequency = convertFromMonthly(preset.totalTaxableAllowances);
    const totalNonTaxableForFrequency = convertFromMonthly(preset.totalNonTaxableAllowances);
    
    // Set the converted basic salary
    document.getElementById('basic-salary').value = Math.round(basicSalaryForFrequency);
    
    // Calculate gross salary for vacation allowance
    const grossSalary = preset.baseSalary + preset.totalTaxableAllowances + preset.totalNonTaxableAllowances;
    
    // First, handle the toggles if needed before populating fields
    // Check if we need to show multiple taxable allowances
    const taxableMultipleSection = document.getElementById('multiple-taxable-allowances');
    const taxableSingleSection = document.getElementById('single-taxable-allowance');
    const needToToggleTaxable = (taxableMultipleSection.classList.contains('d-none') && 
                             Object.values(preset.taxableAllowances).some(val => val > 0));
    
    if (needToToggleTaxable) {
        // Toggle to show multiple taxable allowances
        taxableSingleSection.classList.add('d-none');
        taxableMultipleSection.classList.remove('d-none');
        
        // Update the toggle button appearance
        const toggleTaxableBtn = document.getElementById('toggle-taxable-allowances');
        if (toggleTaxableBtn) {
            const icon = toggleTaxableBtn.querySelector('i');
            const text = toggleTaxableBtn.querySelector('span');
            
            if (icon) {
                icon.classList.remove('fa-plus-circle');
                icon.classList.add('fa-minus-circle');
            }
            
            if (text) {
                text.textContent = 'Enter Total Taxable Allowances';
            }
        }
    }
    
    // Check if we need to show multiple non-taxable allowances
    const nonTaxableMultipleSection = document.getElementById('multiple-non-taxable-allowances');
    const nonTaxableSingleSection = document.getElementById('single-non-taxable-allowance');
    const needToToggleNonTaxable = (nonTaxableMultipleSection.classList.contains('d-none') && 
                                (Object.values(preset.nonTaxableAllowances).some(val => val > 0) || grossSalary > 0));
    
    if (needToToggleNonTaxable) {
        // Toggle to show multiple non-taxable allowances
        nonTaxableSingleSection.classList.add('d-none');
        nonTaxableMultipleSection.classList.remove('d-none');
        
        // Update the toggle button appearance
        const toggleNonTaxableBtn = document.getElementById('toggle-non-taxable-allowances');
        if (toggleNonTaxableBtn) {
            const icon = toggleNonTaxableBtn.querySelector('i');
            const text = toggleNonTaxableBtn.querySelector('span');
            
            if (icon) {
                icon.classList.remove('fa-plus-circle');
                icon.classList.add('fa-minus-circle');
            }
            
            if (text) {
                text.textContent = 'Enter Total Non-Taxable Allowances';
            }
        }
    }
    
    // Now populate the fields based on the current visibility state
    
    // Set taxable allowances with frequency conversion
    if (!taxableMultipleSection.classList.contains('d-none')) {
        // Multiple section is now visible, populate individual fields with converted values
        document.getElementById('duty-allowance').value = Math.round(convertFromMonthly(preset.taxableAllowances.duty || 0));
        document.getElementById('uniform-allowance').value = Math.round(convertFromMonthly(preset.taxableAllowances.uniform || 0));
        document.getElementById('housing-allowance').value = Math.round(convertFromMonthly(preset.taxableAllowances.housing || 0));
        document.getElementById('acting-allowance').value = Math.round(convertFromMonthly(preset.taxableAllowances.acting || 0));
        document.getElementById('meal-allowance').value = Math.round(convertFromMonthly(preset.taxableAllowances.meal || 0));
        document.getElementById('saving-scheme').value = Math.round(convertFromMonthly(preset.taxableAllowances.saving || 0));
        document.getElementById('other-taxable').value = '';
        
        // Calculate totals
        calculateTaxableAllowancesTotal();
    } else {
        // Single section is visible
        document.getElementById('taxable-allowances').value = Math.round(totalTaxableForFrequency);
    }
    
    // Set non-taxable allowances with frequency conversion
    if (!nonTaxableMultipleSection.classList.contains('d-none')) {
        // Multiple section is now visible, populate individual fields with converted values
        document.getElementById('travel-allowance').value = Math.round(convertFromMonthly(preset.nonTaxableAllowances.travel || 0));
        document.getElementById('telecom-allowance').value = Math.round(convertFromMonthly(preset.nonTaxableAllowances.telecom || 0));
        document.getElementById('entertainment-allowance').value = Math.round(convertFromMonthly(preset.nonTaxableAllowances.entertainment || 0));
        document.getElementById('station-allowance').value = '';
        document.getElementById('subsistence-allowance').value = '';
        document.getElementById('laundry-allowance').value = '';
        document.getElementById('other-non-taxable').value = '';
        
        // Set vacation allowance (keep as annual lump sum)
        document.getElementById('vacation-allowance').value = grossSalary;
        
        // Calculate totals
        calculateNonTaxableAllowancesTotal();
    } else {
        // Single section is visible
        document.getElementById('non-taxable-allowances').value = Math.round(totalNonTaxableForFrequency);
    }
}
