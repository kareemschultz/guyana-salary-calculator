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