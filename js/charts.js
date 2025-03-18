/**
 * Chart generation functions
 */
 
// Chart objects
let incomeChart = null;
let taxChart = null;
let cashFlowChart = null;
let taxSavingsChart = null;
let netVsGrossChart = null;

/**
 * Create the income breakdown pie chart
 * @param {number} basicSalary - Basic salary amount
 * @param {number} taxableAllowances - Total taxable allowances
 * @param {number} nonTaxableAllowances - Total non-taxable allowances
 * @param {number} gratuity - Monthly gratuity accrual
 */
function createIncomeChart(basicSalary, taxableAllowances, nonTaxableAllowances, gratuity) {
    const ctx = document.getElementById('income-chart')?.getContext('2d');
    if (!ctx) return;

    // Determine chart colors based on theme
    const isDark = isDarkMode();
    const chartColors = isDark 
        ? ['#60a5fa', '#f87171', '#34d399', '#fbbf24'] 
        : ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'];

    // Destroy existing chart if it exists
    if (incomeChart) {
        incomeChart.destroy();
    }

    incomeChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Basic Salary', 'Taxable Allowances', 'Non-Taxable Allowances', 'Gratuity'],
            datasets: [{
                data: [basicSalary, taxableAllowances, nonTaxableAllowances, gratuity],
                backgroundColor: chartColors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Create the tax bracket visualization
 * @param {number} taxableIncome - Total taxable income
 * @param {number} incomeTax - Total income tax
 */
function createTaxChart(taxableIncome, incomeTax) {
    const ctx = document.getElementById('tax-chart')?.getContext('2d');
    if (!ctx) return;

    // Determine chart colors based on theme
    const isDark = isDarkMode();
    const primaryColor = isDark ? '#60a5fa' : '#3b82f6';
    const secondaryColor = isDark ? '#f87171' : '#ef4444';

    // Destroy existing chart if it exists
    if (taxChart) {
        taxChart.destroy();
    }

    // Calculate tax breakdown
    let taxAt25Percent = Math.min(taxableIncome, TAX_THRESHOLD) * TAX_RATE_1;
    let taxAt35Percent = taxableIncome > TAX_THRESHOLD ? 
                        (taxableIncome - TAX_THRESHOLD) * TAX_RATE_2 : 0;

    taxChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Taxable Income', 'Income Tax'],
            datasets: [
                {
                    label: '25% Tax Bracket',
                    data: [Math.min(taxableIncome, TAX_THRESHOLD), taxAt25Percent],
                    backgroundColor: primaryColor,
                    borderColor: primaryColor,
                    borderWidth: 1
                },
                {
                    label: '35% Tax Bracket',
                    data: [taxableIncome > TAX_THRESHOLD ? taxableIncome - TAX_THRESHOLD : 0, taxAt35Percent],
                    backgroundColor: secondaryColor,
                    borderColor: secondaryColor,
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    stacked: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const value = context.raw || 0;
                            return `${label}: ${formatCurrency(value)}`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Create the annual cash flow chart showing income spikes at gratuity months
 * @param {number} monthlyNetSalary - Regular monthly net salary
 * @param {number} sixMonthGratuity - Gratuity payment at 6 months
 * @param {number} vacationAllowance - Annual vacation allowance
 */
function createCashFlowChart(monthlyNetSalary, sixMonthGratuity, vacationAllowance) {
    const ctx = document.getElementById('cash-flow-chart')?.getContext('2d');
    if (!ctx) return;

    // Determine chart colors based on theme
    const isDark = isDarkMode();
    const lineColor = isDark ? '#60a5fa' : '#3b82f6';
    const pointColor = isDark ? '#2563eb' : '#1d4ed8';

    // Destroy existing chart if it exists
    if (cashFlowChart) {
        cashFlowChart.destroy();
    }

    // Create monthly data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = Array(12).fill(monthlyNetSalary);
    
    // Add gratuity payments (assume at month 6 and 12)
    monthlyData[5] += sixMonthGratuity; // June
    monthlyData[11] += sixMonthGratuity; // December
    
    // Add vacation allowance (assume at month 12)
    monthlyData[11] += vacationAllowance;
    
    cashFlowChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Monthly Income',
                data: monthlyData,
                borderColor: lineColor,
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                pointBackgroundColor: pointColor,
                pointRadius: 5,
                pointHoverRadius: 7,
                fill: true,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    },
                    title: {
                        display: true,
                        text: 'Monthly Income (GYD)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = 'Income: ' + formatCurrency(context.raw);
                            
                            // Add special notes for gratuity months
                            if (context.dataIndex === 5) {
                                label += ` (includes ${formatCurrency(sixMonthGratuity)} gratuity)`;
                            } else if (context.dataIndex === 11) {
                                label += ` (includes ${formatCurrency(sixMonthGratuity)} gratuity`;
                                if (vacationAllowance > 0) {
                                    label += ` and ${formatCurrency(vacationAllowance)} vacation allowance`;
                                }
                                label += `)`;
                            }
                            
                            return label;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Create the tax savings visualization
 * @param {Object} results - Calculation results
 */
function createTaxSavingsChart(results) {
    const ctx = document.getElementById('tax-savings-chart')?.getContext('2d');
    if (!ctx) return;

    // Determine chart colors based on theme
    const isDark = isDarkMode();
    const chartColors = isDark 
        ? ['#60a5fa', '#34d399', '#fbbf24', '#a78bfa'] 
        : ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

    // Destroy existing chart if it exists
    if (taxSavingsChart) {
        taxSavingsChart.destroy();
    }

    // Calculate potential tax without deductions (rough estimate)
    const grossTaxableIncome = results.basicSalary + results.taxableAllowances;
    let potentialTax = 0;
    
    if (grossTaxableIncome <= TAX_THRESHOLD) {
        potentialTax = grossTaxableIncome * TAX_RATE_1;
    } else {
        potentialTax = (TAX_THRESHOLD * TAX_RATE_1) + 
                      ((grossTaxableIncome - TAX_THRESHOLD) * TAX_RATE_2);
    }
    
    // Calculate tax savings from each deduction/allowance
    const personalAllowanceSaving = results.personalAllowance * (grossTaxableIncome > TAX_THRESHOLD ? TAX_RATE_2 : TAX_RATE_1);
    const childAllowanceSaving = results.childAllowance * (grossTaxableIncome > TAX_THRESHOLD ? TAX_RATE_2 : TAX_RATE_1);
    const insuranceSaving = results.insurancePremium * (grossTaxableIncome > TAX_THRESHOLD ? TAX_RATE_2 : TAX_RATE_1);
    const nisSaving = results.nisContribution * (grossTaxableIncome > TAX_THRESHOLD ? TAX_RATE_2 : TAX_RATE_1);
    
    // Actual tax paid
    const actualTax = results.incomeTax;
    
    taxSavingsChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [
                'Personal Allowance Savings', 
                'Child Allowance Savings',
                'Insurance Premium Savings',
                'NIS Contribution Savings',
                'Tax Paid'
            ],
            datasets: [{
                data: [
                    personalAllowanceSaving,
                    childAllowanceSaving,
                    insuranceSaving,
                    nisSaving,
                    actualTax
                ],
                backgroundColor: [...chartColors, isDark ? '#f87171' : '#ef4444'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Create the net vs gross income comparison chart
 * @param {Object} results - Calculation results
 */
function createNetVsGrossChart(results) {
    const ctx = document.getElementById('net-vs-gross-chart')?.getContext('2d');
    if (!ctx) return;

    // Determine chart colors based on theme
    const isDark = isDarkMode();
    const primaryColor = isDark ? '#60a5fa' : '#3b82f6';
    const secondaryColor = isDark ? '#34d399' : '#10b981';

    // Destroy existing chart if it exists
    if (netVsGrossChart) {
        netVsGrossChart.destroy();
    }

    // Calculate deductions and taxes
    const deductions = results.nisContribution + results.loanPayment + results.gpsuDeduction;
    const taxes = results.incomeTax;
    
    // Calculate net and gross values for regular monthly income
    const regularGross = results.regularMonthlyGrossIncome;
    const regularNet = results.monthlyNetSalary;
    
    // Calculate net and gross for month 6 (with gratuity)
    const month6Gross = regularGross + results.sixMonthGratuity;
    const month6Net = results.monthSixTotal;
    
    // Calculate net and gross for month 12 (with gratuity and vacation)
    const month12Gross = regularGross + results.sixMonthGratuity + results.vacationAllowance;
    const month12Net = results.monthTwelveTotal;
    
    // Calculate annual totals
    const annualGross = results.annualGrossIncome + (results.sixMonthGratuity * 2) + results.vacationAllowance;
    const annualNet = results.annualTotal;
    
    netVsGrossChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Regular Month', 'Month 6', 'Month 12', 'Annual'],
            datasets: [
                {
                    label: 'Gross Income',
                    data: [regularGross, month6Gross, month12Gross, annualGross],
                    backgroundColor: primaryColor,
                    barPercentage: 0.7
                },
                {
                    label: 'Net Income',
                    data: [regularNet, month6Net, month12Net, annualNet],
                    backgroundColor: secondaryColor,
                    barPercentage: 0.7
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    },
                    title: {
                        display: true,
                        text: 'Income Amount (GYD)'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const value = context.raw || 0;
                            return `${label}: ${formatCurrency(value)}`;
                        },
                        afterBody: function(tooltipItems) {
                            const grossValue = tooltipItems[0].raw;
                            const netValue = tooltipItems[1]?.raw || 0;
                            
                            if (grossValue && netValue) {
                                const retentionRate = Math.round((netValue / grossValue) * 100);
                                return `Income Retention: ${retentionRate}%`;
                            }
                            return '';
                        }
                    }
                }
            }
        }
    });
}