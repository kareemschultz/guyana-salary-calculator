/**
 * Chart generation functions
 */
 
// Chart objects
let incomeChart = null;
let taxChart = null;

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
                backgroundColor: [
                    '#3b82f6', // Blue
                    '#ef4444', // Red
                    '#10b981', // Green
                    '#f59e0b'  // Amber
                ],
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
                    backgroundColor: '#3b82f6',
                    borderColor: '#2563eb',
                    borderWidth: 1
                },
                {
                    label: '35% Tax Bracket',
                    data: [taxableIncome > TAX_THRESHOLD ? taxableIncome - TAX_THRESHOLD : 0, taxAt35Percent],
                    backgroundColor: '#ef4444',
                    borderColor: '#dc2626',
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