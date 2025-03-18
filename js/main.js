/**
 * Main initialization script
 */

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    debug('DOM fully loaded - initializing calculator');
    
    // Initialize theme
    initializeTheme();
    
    // Set default dates
    setDefaultDates();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize tooltips
    initializeTooltips();
    
    debug('Calculator initialization complete');
});