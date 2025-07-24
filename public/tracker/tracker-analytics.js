/**
 * Lucy Scott Hair - Analytics Engine
 * Handles chart rendering and data visualization
 */

// Global chart instances to prevent memory leaks
window.chartInstances = {
    serviceChart: null,
    monthlyChart: null,
    dailyChart: null
};

function updateAnalytics() {
    const entries = (window.tracker) ? window.tracker.getStoredEntries() : [];
    const analytics = calculateAnalytics(entries);

    renderDashboard(analytics);
    renderServiceChart(analytics.serviceBreakdown);
    renderMonthlyChart(analytics.monthlyData);
    renderDailyChart(analytics.dailyData);

    console.log('Analytics updated:', analytics);
}

function calculateAnalytics(entries) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const dailyData = {};

    let totalIncome = 0;
    let totalExpenses = 0;
    const serviceBreakdown = {};
    const monthlyData = {};

    entries.forEach(entry => {
        const year = new Date(entry.date).getFullYear();
        if (year !== currentYear) return;

        const month = new Date(entry.date).toLocaleString('default', { month: 'long' });
        const day = new Date(entry.date).toISOString().split('T')[0];

        if (!monthlyData[month]) {
            monthlyData[month] = { income: 0, expenses: 0 };
        }
        if (!dailyData[day]) {
            dailyData[day] = { income: 0, expenses: 0 };
        }

        if (entry.type === 'haircut' || entry.type === 'misc') {
            const amount = (entry.type === 'haircut') ? entry.price * entry.quantity : entry.amount;
            totalIncome += amount;
            monthlyData[month].income += amount;
            dailyData[day].income += amount;
            
            serviceBreakdown[entry.service || 'Other Income'] = (serviceBreakdown[entry.service || 'Other Income'] || 0) + amount;
        } else if (entry.type === 'expense') {
            totalExpenses += entry.amount;
            monthlyData[month].expenses += entry.amount;
            dailyData[day].expenses += entry.amount;
        }
    });

    return {
        totalIncome,
        totalExpenses,
        netProfit: totalIncome - totalExpenses,
        serviceBreakdown,
        monthlyData,
        dailyData,
        entryCount: entries.length
    };
}

function renderDashboard(analytics) {
    const totalIncomeEl = document.getElementById('totalIncome');
    const totalExpensesEl = document.getElementById('totalExpenses');
    const netProfitEl = document.getElementById('netProfit');

    totalIncomeEl.textContent = `£${analytics.totalIncome.toFixed(2)}`;
    totalExpensesEl.textContent = `£${analytics.totalExpenses.toFixed(2)}`;
    netProfitEl.textContent = `£${analytics.netProfit.toFixed(2)}`;
}

function renderServiceChart(serviceBreakdown) {
    const ctx = document.getElementById('serviceChart');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (window.chartInstances.serviceChart) {
        window.chartInstances.serviceChart.destroy();
    }

    // Check if we have data to display
    if (!serviceBreakdown || Object.keys(serviceBreakdown).length === 0) {
        ctx.getContext('2d').clearRect(0, 0, ctx.width, ctx.height);
        const context = ctx.getContext('2d');
        context.font = '16px Source Sans 3';
        context.fillStyle = '#4E4A47';
        context.textAlign = 'center';
        context.fillText('No service data available', ctx.width / 2, ctx.height / 2);
        return;
    }

    const labels = Object.keys(serviceBreakdown);
    const data = Object.values(serviceBreakdown);
    const colors = [
        '#D8A7B1', // Lucy accent
        '#F8E5D6', // Lucy secondary
        '#E5D5C8', // Lucy border
        '#28a745', // Green
        '#dc3545', // Red
        '#ffc107', // Yellow
        '#17a2b8', // Teal
        '#6f42c1', // Purple
        '#fd7e14', // Orange
        '#20c997'  // Mint
    ];

    window.chartInstances.serviceChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: colors.slice(0, labels.length),
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            family: 'Source Sans 3',
                            size: 12
                        },
                        padding: 15
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: £${context.parsed.toFixed(2)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

function renderMonthlyChart(monthlyData) {
    const ctx = document.getElementById('monthlyChart');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (window.chartInstances.monthlyChart) {
        window.chartInstances.monthlyChart.destroy();
    }

    // Check if we have data to display
    if (!monthlyData || Object.keys(monthlyData).length === 0) {
        ctx.getContext('2d').clearRect(0, 0, ctx.width, ctx.height);
        const context = ctx.getContext('2d');
        context.font = '16px Source Sans 3';
        context.fillStyle = '#4E4A47';
        context.textAlign = 'center';
        context.fillText('No monthly data available', ctx.width / 2, ctx.height / 2);
        return;
    }

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    
    // Sort months properly
    const sortedKeys = Object.keys(monthlyData).sort((a, b) => 
        months.indexOf(a) - months.indexOf(b)
    );
    
    const incomeData = sortedKeys.map(month => monthlyData[month].income);
    const expensesData = sortedKeys.map(month => monthlyData[month].expenses);

    window.chartInstances.monthlyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedKeys,
            datasets: [
                {
                    label: 'Income',
                    backgroundColor: 'rgba(216, 167, 177, 0.7)', // Lucy accent with transparency
                    borderColor: '#D8A7B1',
                    borderWidth: 2,
                    data: incomeData
                },
                {
                    label: 'Expenses',
                    backgroundColor: 'rgba(220, 53, 69, 0.7)',
                    borderColor: '#dc3545',
                    borderWidth: 2,
                    data: expensesData
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            family: 'Source Sans 3'
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: £${context.parsed.y.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '£' + value.toFixed(0);
                        }
                    }
                }
            }
        }
    });
}

function renderDailyChart(dailyData) {
    const ctx = document.getElementById('dailyChart');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (window.chartInstances.dailyChart) {
        window.chartInstances.dailyChart.destroy();
    }

    // Check if we have data to display
    if (!dailyData || Object.keys(dailyData).length === 0) {
        ctx.getContext('2d').clearRect(0, 0, ctx.width, ctx.height);
        const context = ctx.getContext('2d');
        context.font = '16px Source Sans 3';
        context.fillStyle = '#4E4A47';
        context.textAlign = 'center';
        context.fillText('No daily data available', ctx.width / 2, ctx.height / 2);
        return;
    }

    // Sort dates chronologically
    const sortedDates = Object.keys(dailyData).sort((a, b) => new Date(a) - new Date(b));
    
    // Get last 30 days or available data, whichever is shorter
    const recentDates = sortedDates.slice(-30);
    
    const incomeData = recentDates.map(day => dailyData[day].income);
    const expensesData = recentDates.map(day => dailyData[day].expenses);
    
    // Format dates for display
    const formattedLabels = recentDates.map(date => {
        const d = new Date(date);
        return d.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' });
    });

    window.chartInstances.dailyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: formattedLabels,
            datasets: [
                {
                    label: 'Income',
                    backgroundColor: 'rgba(216, 167, 177, 0.2)',
                    borderColor: '#D8A7B1',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    data: incomeData
                },
                {
                    label: 'Expenses',
                    backgroundColor: 'rgba(220, 53, 69, 0.2)',
                    borderColor: '#dc3545',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    data: expensesData
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            family: 'Source Sans 3'
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            const index = tooltipItems[0].dataIndex;
                            const date = new Date(recentDates[index]);
                            return date.toLocaleDateString('en-GB', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            });
                        },
                        label: function(context) {
                            return `${context.dataset.label}: £${context.parsed.y.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Date',
                        font: {
                            family: 'Source Sans 3'
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Amount (£)',
                        font: {
                            family: 'Source Sans 3'
                        }
                    },
                    ticks: {
                        callback: function(value) {
                            return '£' + value.toFixed(0);
                        }
                    }
                }
            }
        }
    });
}
