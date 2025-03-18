/**
 * Tax and benefit constants for Guyana 2025
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

// Position presets for ICT positions
const POSITION_PRESETS = {
    'ict-tech-1': {
        title: 'ICT Technician I',
        baseSalary: 206300,
        taxableAllowances: {
            duty: 15000,
            uniform: 5000
        },
        nonTaxableAllowances: {
            travel: 0,
            telecom: 0
        },
        // Vacation allowance is calculated dynamically as gross salary
        totalTaxableAllowances: 20000, // Sum of all taxable allowances
        totalNonTaxableAllowances: 0    // Sum of all non-taxable allowances (excluding vacation)
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
        baseSalary: 370000,
        taxableAllowances: {
            duty: 80000,
            uniform: 5000
        },
        nonTaxableAllowances: {
            travel: 10000,
            telecom: 5000
        },
        totalTaxableAllowances: 85000,
        totalNonTaxableAllowances: 15000
    }
};