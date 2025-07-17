/**
 * Tax and benefit constants for Guyana 2025 - PAYSLIP VERIFIED VERSION
 */

// Tax rates
const TAX_RATE_1 = 0.25; // 25% on income up to $260,000 monthly
const TAX_RATE_2 = 0.35; // 35% on income above $260,000 monthly
const TAX_THRESHOLD = 260000; // Monthly threshold

// Allowances and deductions
const PERSONAL_ALLOWANCE = 130000; // Monthly personal allowance
const CHILD_ALLOWANCE = 10000; // Per child
const OVERTIME_ALLOWANCE_MAX = 50000; // Maximum overtime allowance
const SECOND_JOB_ALLOWANCE_MAX = 50000; // Maximum second job allowance

// NIS contributions
const NIS_RATE = 0.056; // 5.6%
const NIS_CEILING = 280000; // Monthly ceiling

// Insurance premiums
const INSURANCE_PREMIUMS = {
    'none': 0,
    'employee': 1469,
    'employee-one': 3182,
    'family': 4970,
    'custom': 'custom'
};

// Position presets for common government positions - ENHANCED WITH PAYSLIP-VERIFIED DATA
const POSITION_PRESETS = {
    'it-officer-2': {
        title: 'IT Officer II (Payslip Verified)',
        baseSalary: 285685, // VERIFIED: Original salary before 8% increase → 308,540
        taxableAllowances: {
            duty: 15000,    // VERIFIED: From payslip
            uniform: 5000   // VERIFIED: From payslip
        },
        nonTaxableAllowances: {
            travel: 5000,      // VERIFIED: From payslip (travelling allowance)
            telecom: 5000      // VERIFIED: From payslip (telephone & internet)
        },
        totalTaxableAllowances: 20000,    // 15000 + 5000
        totalNonTaxableAllowances: 10000, // 5000 + 5000
        // Calculated gross: 285,685 + 20,000 + 10,000 = 315,685
        vacationAllowance: 315685, // Annual vacation = gross monthly salary
        verified: true // Mark as payslip verified
    },
    'ict-tech-1': {
        title: 'ICT Technician I',
        baseSalary: 308540, // From sample payslip data
        taxableAllowances: {
            duty: 0,
            uniform: 5000
        },
        nonTaxableAllowances: {
            travel: 5000,
            telecom: 5000
        },
        totalTaxableAllowances: 5000,
        totalNonTaxableAllowances: 10000
    },
    'ict-tech-2': {
        title: 'ICT Technician II',
        baseSalary: 176564,
        taxableAllowances: {
            duty: 12000,
            uniform: 5000
        },
        nonTaxableAllowances: {
            travel: 0,
            telecom: 0
        },
        totalTaxableAllowances: 17000,
        totalNonTaxableAllowances: 0
    },
    'ict-tech-3': {
        title: 'ICT Technician III',
        baseSalary: 148051,
        taxableAllowances: {
            duty: 10000,
            uniform: 5000
        },
        nonTaxableAllowances: {
            travel: 0,
            telecom: 0
        },
        totalTaxableAllowances: 15000,
        totalNonTaxableAllowances: 0
    },
    'assist-ict-eng-3': {
        title: 'Assistant ICT Engineer III',
        baseSalary: 285685,
        taxableAllowances: {
            duty: 0,
            uniform: 5000
        },
        nonTaxableAllowances: {
            travel: 5000,
            telecom: 5000
        },
        totalTaxableAllowances: 5000,
        totalNonTaxableAllowances: 10000
    },
    'ict-eng-3': {
        title: 'ICT Engineer III',
        baseSalary: 393301,
        taxableAllowances: {
            uniform: 5000
        },
        nonTaxableAllowances: {
            travel: 10000,
            telecom: 5000
        },
        totalTaxableAllowances: 5000,
        totalNonTaxableAllowances: 15000
    },
    'admin-officer-2': {
        title: 'Administrative Officer II',
        baseSalary: 180000,
        taxableAllowances: {
            duty: 10000,
            uniform: 3000
        },
        nonTaxableAllowances: {
            travel: 0,
            telecom: 0
        },
        totalTaxableAllowances: 13000,
        totalNonTaxableAllowances: 0
    },
    'accounts-clerk-1': {
        title: 'Accounts Clerk I',
        baseSalary: 150000,
        taxableAllowances: {
            duty: 8000,
            uniform: 3000
        },
        nonTaxableAllowances: {
            travel: 0,
            telecom: 0
        },
        totalTaxableAllowances: 11000,
        totalNonTaxableAllowances: 0
    },
    'teacher-primary': {
        title: 'Primary School Teacher',
        baseSalary: 185000,
        taxableAllowances: {
            duty: 0,
            uniform: 0
        },
        nonTaxableAllowances: {
            travel: 15000,
            station: 5000
        },
        totalTaxableAllowances: 0,
        totalNonTaxableAllowances: 20000
    },
    'nurse-staff': {
        title: 'Staff Nurse',
        baseSalary: 220000,
        taxableAllowances: {
            duty: 20000,
            uniform: 5000
        },
        nonTaxableAllowances: {
            travel: 8000,
            station: 5000
        },
        totalTaxableAllowances: 25000,
        totalNonTaxableAllowances: 13000
    }
};

// Payment frequency configurations
const PAYMENT_FREQUENCIES = {
    'daily': {
        label: 'Daily',
        factor: 1/21.67, // Approximate working days per month
        personalAllowance: 4274,
        taxThreshold: 8548,
        nisRate: 0.056,
        nisCeiling: 12923,
        childAllowance: 462,
        overtimeMax: 2308,
        secondJobMax: 2308,
        insuranceMaxMonthly: 2308,
        periodLabel: 'per day',
        periodsPerYear: 260
    },
    'weekly': {
        label: 'Weekly',
        factor: 1/4.33,
        personalAllowance: 30000,
        taxThreshold: 60000,
        nisRate: 0.056,
        nisCeiling: 64615,
        childAllowance: 2308,
        overtimeMax: 11538,
        secondJobMax: 11538,
        insuranceMaxMonthly: 11538,
        periodLabel: 'per week',
        periodsPerYear: 52
    },
    'fortnightly': {
        label: 'Fortnightly',
        factor: 1/2.17,
        personalAllowance: 60000,
        taxThreshold: 120000,
        nisRate: 0.056,
        nisCeiling: 129231,
        childAllowance: 4615,
        overtimeMax: 23077,
        secondJobMax: 23077,
        insuranceMaxMonthly: 23077,
        periodLabel: 'per fortnight',
        periodsPerYear: 26
    },
    'monthly': {
        label: 'Monthly',
        factor: 1,
        personalAllowance: 130000,
        taxThreshold: 260000,
        nisRate: 0.056,
        nisCeiling: 280000,
        childAllowance: 10000,
        overtimeMax: 50000,
        secondJobMax: 50000,
        insuranceMaxMonthly: 50000,
        periodLabel: 'per month',
        periodsPerYear: 12
    },
    'yearly': {
        label: 'Yearly',
        factor: 12,
        personalAllowance: 1560000,
        taxThreshold: 3120000,
        nisRate: 0.056,
        nisCeiling: 3360000,
        childAllowance: 120000,
        overtimeMax: 600000,
        secondJobMax: 600000,
        insuranceMaxMonthly: 600000,
        periodLabel: 'per year',
        periodsPerYear: 1
    }
};

// Default frequency
const DEFAULT_FREQUENCY = 'monthly';

// Qualification allowances by frequency (starting January 2025)
const QUALIFICATION_ALLOWANCES_BY_FREQUENCY = {
    'daily': {
        'none': 0,
        'acca': 692,    // Daily equivalent of $15,000 monthly
        'masters': 1015, // Daily equivalent of $22,000 monthly
        'phd': 1477     // Daily equivalent of $32,000 monthly
    },
    'weekly': {
        'none': 0,
        'acca': 3462,   // Weekly equivalent of $15,000 monthly
        'masters': 5077, // Weekly equivalent of $22,000 monthly
        'phd': 7385     // Weekly equivalent of $32,000 monthly
    },
    'fortnightly': {
        'none': 0,
        'acca': 6923,   // Fortnightly equivalent of $15,000 monthly
        'masters': 10154, // Fortnightly equivalent of $22,000 monthly
        'phd': 14769    // Fortnightly equivalent of $32,000 monthly
    },
    'monthly': {
        'none': 0,
        'acca': 15000,
        'masters': 22000,
        'phd': 32000
    },
    'yearly': {
        'none': 0,
        'acca': 180000,  // Yearly equivalent of $15,000 monthly
        'masters': 264000, // Yearly equivalent of $22,000 monthly
        'phd': 384000    // Yearly equivalent of $32,000 monthly
    }
};

// Legacy qualification allowances (kept for backward compatibility)
const QUALIFICATION_ALLOWANCES = {
    'none': 0,
    'acca': 15000,    // ACCA Qualification
    'masters': 22000, // Master's Degree
    'phd': 32000      // Doctoral Degree
};

// PAYSLIP-VERIFIED: Common salary increase percentages
const COMMON_SALARY_INCREASES = [
    { value: 6, label: '6% (Standard Government)' },
    { value: 8, label: '8% (July 2025 Verified)' }, // VERIFIED from actual payslip
    { value: 10, label: '10% (Performance Based)' },
    { value: 12, label: '12% (Promotion)' },
    { value: 15, label: '15% (Significant Promotion)' },
    { value: 20, label: '20% (Major Advancement)' }
];

// ENHANCED: Retroactive calculation settings
const RETROACTIVE_SETTINGS = {
    includeGratuityDifferential: true,  // Include retroactive gratuity difference
    includeVacationAllowance: true,     // Include vacation allowance adjustment
    defaultRetroMonths: 6,              // Default retroactive period
    maxRetroMonths: 12                  // Maximum retroactive period
};

// Helper functions for frequency support
function getCurrentFrequency() {
    const frequencySelect = document.getElementById('payment-frequency');
    return frequencySelect ? frequencySelect.value : DEFAULT_FREQUENCY;
}

function getFrequencyConfig() {
    const frequency = getCurrentFrequency();
    return PAYMENT_FREQUENCIES[frequency] || PAYMENT_FREQUENCIES[DEFAULT_FREQUENCY];
}

function convertFromMonthly(monthlyAmount, targetFrequency = null) {
    const frequency = targetFrequency || getCurrentFrequency();
    const config = PAYMENT_FREQUENCIES[frequency];
    return monthlyAmount * config.factor;
}

function convertToMonthly(amount, sourceFrequency = null) {
    const frequency = sourceFrequency || getCurrentFrequency();
    const config = PAYMENT_FREQUENCIES[frequency];
    return amount / config.factor;
}

function getQualificationAllowanceForFrequency(qualificationType) {
    const frequency = getCurrentFrequency();
    return QUALIFICATION_ALLOWANCES_BY_FREQUENCY[frequency][qualificationType] || 0;
}

// Enhanced function to get position preset by ID
function getPositionPreset(presetId) {
    return POSITION_PRESETS[presetId] || null;
}

// Function to get all available position presets
function getAllPositionPresets() {
    return Object.keys(POSITION_PRESETS).map(key => ({
        id: key,
        ...POSITION_PRESETS[key]
    }));
}

// PAYSLIP VERIFICATION: Function to validate calculated values against known payslip
function validateAgainstPayslip(calculatedResults, actualPayslip) {
    const validationResults = {
        basicSalaryMatch: Math.abs(calculatedResults.basicSalary - actualPayslip.basicSalary) < 1,
        backpayMatch: Math.abs(calculatedResults.retroactiveBackpay - actualPayslip.backpay) < 5,
        gratuityMatch: Math.abs(calculatedResults.gratuity - actualPayslip.gratuity) < 1,
        retroGratuityMatch: Math.abs(calculatedResults.retroGratuityDifferential - actualPayslip.retroGratuityAllowance) < 5,
        retroVacationMatch: Math.abs(calculatedResults.retroVacationAllowance - actualPayslip.retroVacationAllowance) < 5,
        grossMatch: Math.abs(calculatedResults.totalGross - actualPayslip.grossTotal) < 10
    };
    
    return validationResults;
}
