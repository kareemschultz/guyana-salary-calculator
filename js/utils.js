/**
 * Utility functions for the calculator
 */

/**
 * Format a number as a currency string
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount) {
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