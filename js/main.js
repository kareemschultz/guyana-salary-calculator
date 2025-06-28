/**
 * Main initialization script - Updated with Payment Frequency Support
 */

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    debug('DOM fully loaded - initializing calculator with frequency support');
    
    // Initialize theme
    initializeTheme();
    
    // Set default dates
    setDefaultDates();
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup payment frequency listeners
    setupPaymentFrequencyListeners();
    
    // Initialize frequency-dependent labels and previews
    updateFrequencyLabels();
    
    // Initialize tooltips
    initializeTooltips();
    
    debug('Calculator initialization complete with frequency support');
});
