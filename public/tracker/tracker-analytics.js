/**
 * Analyze Tracker Data and Render Charts
 */

function updateAnalytics() {
    const entries = (window.tracker) ? window.tracker.getStoredEntries() : [];
    const analytics = calculateAnalytics(entries);

    renderDashboard(analytics);
    renderServiceChart(analytics.serviceBreakdown);
    renderMonthlyChart(analytics.monthlyData);
    renderDailyChart(analytics.dailyData);
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
    if (!ctx || !serviceBreakdown) return;

    const labels = Object.keys(serviceBreakdown);
    const data = Object.values(serviceBreakdown);
    const colors = new Array(labels.length).fill().map((_, i) => `hsl(${i * 30}, 70%, 70%)`);

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: colors,
                borderWidth: 1,
                borderColor: '#ffffff90'
            }]
        },
        options: {
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });
}

function renderMonthlyChart(monthlyData) {
    const ctx = document.getElementById('monthlyChart');
    if (!ctx || !monthlyData) return;

    const labels = Object.keys(monthlyData);
    const incomeData = labels.map(month => monthlyData[month].income);
    const expensesData = labels.map(month => monthlyData[month].expenses);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    label: 'Income',
                    backgroundColor: 'rgba(40, 167, 69, 0.7)',
                    borderColor: 'rgba(40, 167, 69, 1)',
                    data: incomeData
                },
                {
                    label: 'Expenses',
                    backgroundColor: 'rgba(220, 53, 69, 0.7)',
                    borderColor: 'rgba(220, 53, 69, 1)',
                    data: expensesData
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function renderDailyChart(dailyData) {
    const ctx = document.getElementById('dailyChart');
    if (!ctx || !dailyData) return;

    const labels = Object.keys(dailyData);
    const incomeData = labels.map(day => dailyData[day].income);
    const expensesData = labels.map(day => dailyData[day].expenses);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Income',
                    backgroundColor: 'rgba(40, 167, 69, 0.7)',
                    borderColor: 'rgba(40, 167, 69, 1)',
                    fill: false,
                    data: incomeData
                },
                {
                    label: 'Expenses',
                    backgroundColor: 'rgba(220, 53, 69, 0.7)',
                    borderColor: 'rgba(220, 53, 69, 1)',
                    fill: false,
                    data: expensesData
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day',
                        tooltipFormat: 'MMM dd, yyyy',
                        displayFormats: {
                            day: 'MMM dd'
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return `£${value.toFixed(2)}`;
                        }
                    }
                }
            }
        }
    });
}
