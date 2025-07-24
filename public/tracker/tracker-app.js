/**
 * Lucy Scott Hair - Business Tracker Application
 * Main application logic for data entry and management
 */

class LucyTracker {
    constructor() {
        this.servicePrices = {
            'Dry cut': 20,
            'Wet cut': 35,
            'Cut and finish': 45,
            'Restyle': 55,
            'Fringe trim': 10,
            'Children\'s Dry cut': 15,
            'Children\'s Wet cut': 25,
            'Children\'s Cut and finish': 30,
            'Blow dry': 30,
            'Long hair blow dry': 35,
            'Straightening/curling': 10,
            'Consultation - 15min Free': 0,
            'T-section': 70,
            'Half head': 80,
            'Full head': 90,
            'Full head tint': 70,
            'Root tint': 65,
            'Toner': 15,
            'Balayage': 135
        };
        
        this.storageKey = 'lucyHairTrackerData';
        this.currentTab = 'entry';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setTodayAsDefault();
        this.updatePriceDisplay();
        this.loadRecentEntries();
        this.initializeFromURL();
        
        // Initialize dashboard if it's the active tab
        if (this.currentTab === 'dashboard') {
            setTimeout(() => this.updateDashboard(), 100);
        }
    }

    initializeFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const tab = urlParams.get('tab');
        if (tab) {
            this.switchTab(tab);
        }
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('[data-tab]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Entry type switching
        document.querySelectorAll('[data-type]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchEntryType(e.target.dataset.type);
            });
        });

        // Service type change handler
        document.getElementById('haircutType').addEventListener('change', (e) => {
            this.handleServiceTypeChange(e.target.value);
        });

        // Price and quantity change handlers
        document.getElementById('servicePrice').addEventListener('input', () => {
            this.validatePriceInput('servicePrice');
            this.updatePriceDisplay();
        });
        
        document.getElementById('miscAmount').addEventListener('input', () => {
            this.validatePriceInput('miscAmount');
        });
        
        document.getElementById('expenseAmount').addEventListener('input', () => {
            this.validatePriceInput('expenseAmount');
        });

        document.getElementById('quantity').addEventListener('input', () => {
            this.updatePriceDisplay();
        });

        // Form submission
        document.getElementById('trackerForm').addEventListener('submit', (e) => {
            this.handleFormSubmit(e);
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case '1':
                        e.preventDefault();
                        this.switchTab('entry');
                        break;
                    case '2':
                        e.preventDefault();
                        this.switchTab('dashboard');
                        break;
                    case '3':
                        e.preventDefault();
                        this.switchTab('entries');
                        break;
                }
            }
        });
    }

    validatePriceInput(fieldId) {
        const field = document.getElementById(fieldId);
        let value = parseFloat(field.value);
        
        if (isNaN(value)) return;
        
        // Round to nearest 0.5
        value = Math.round(value * 2) / 2;
        field.value = value;
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('[data-tab]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.style.display = 'none';
        });
        
        const activeTab = document.getElementById(`${tabName}-tab`);
        if (activeTab) {
            activeTab.style.display = 'block';
            this.currentTab = tabName;
            
            // Load specific tab content
            if (tabName === 'dashboard') {
                setTimeout(() => this.updateDashboard(), 100);
            } else if (tabName === 'entries') {
                this.loadRecentEntries();
            }
        }

        // Update URL without page reload
        const url = new URL(window.location);
        url.searchParams.set('tab', tabName);
        window.history.pushState({}, '', url);
    }

    switchEntryType(entryType) {
        // Update entry type buttons
        document.querySelectorAll('[data-type]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === entryType);
        });

        // Update form sections
        document.querySelectorAll('.form-section').forEach(section => {
            section.classList.remove('active');
        });
        
        const activeSection = document.getElementById(`${entryType}-section`);
        if (activeSection) {
            activeSection.classList.add('active');
        }
    }

    setTodayAsDefault() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('serviceDate').value = today;
        document.getElementById('miscDate').value = today;
        document.getElementById('expenseDate').value = today;
    }

    handleServiceTypeChange(serviceType) {
        const priceInput = document.getElementById('servicePrice');
        
        if (serviceType && this.servicePrices[serviceType] !== undefined) {
            priceInput.value = this.servicePrices[serviceType];
        } else {
            priceInput.value = '';
        }
        
        this.updatePriceDisplay();
    }

    updatePriceDisplay() {
        const priceInput = document.getElementById('servicePrice');
        const quantityInput = document.getElementById('quantity');
        const priceDisplay = document.getElementById('priceDisplay');
        
        const price = parseFloat(priceInput.value) || 0;
        const quantity = parseInt(quantityInput.value) || 1;
        const total = price * quantity;
        
        priceDisplay.textContent = `Total: £${total.toFixed(2)}`;
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const submitButton = e.target.querySelector('button[type="submit"]');
        const submitText = document.getElementById('submitText');
        const submitSpinner = document.getElementById('submitSpinner');
        
        // Show loading state
        submitText.style.display = 'none';
        submitSpinner.style.display = 'block';
        submitButton.disabled = true;

        try {
            const activeType = document.querySelector('[data-type].active').dataset.type;
            const entry = this.createEntryFromForm(activeType);
            
            // Save to local storage
            this.saveEntry(entry);
            
            // Try to save to Netlify database if available
            await this.saveToNetlify(entry);
            
            // Show success message
            this.showSuccessMessage('Entry saved successfully!');
            
            // Reset form
            e.target.reset();
            this.setTodayAsDefault();
            this.updatePriceDisplay();
            
            // Refresh displays
            this.loadRecentEntries();
            if (this.currentTab === 'dashboard') {
                this.updateDashboard();
            }
            
        } catch (error) {
            console.error('Error saving entry:', error);
            this.showSuccessMessage('Entry saved locally (sync pending)', 'warning');
        } finally {
            // Reset button state
            submitText.style.display = 'inline';
            submitSpinner.style.display = 'none';
            submitButton.disabled = false;
        }
    }

    createEntryFromForm(activeType) {
        const baseEntry = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            type: activeType
        };

        if (activeType === 'haircut') {
            const serviceType = document.getElementById('haircutType').value;
            const price = parseFloat(document.getElementById('servicePrice').value) || 0;
            const quantity = parseInt(document.getElementById('quantity').value) || 1;
            
            return {
                ...baseEntry,
                service: serviceType,
                price: price,
                quantity: quantity,
                date: document.getElementById('serviceDate').value,
                total: price * quantity
            };
        } else if (activeType === 'misc') {
            return {
                ...baseEntry,
                description: document.getElementById('miscDescription').value,
                amount: parseFloat(document.getElementById('miscAmount').value) || 0,
                date: document.getElementById('miscDate').value
            };
        } else if (activeType === 'expense') {
            return {
                ...baseEntry,
                description: document.getElementById('expenseDescription').value,
                amount: parseFloat(document.getElementById('expenseAmount').value) || 0,
                date: document.getElementById('expenseDate').value
            };
        }
    }

    saveEntry(entry) {
        let entries = this.getStoredEntries();
        entries.unshift(entry);
        entries = entries.slice(0, 1000); // Keep only last 1000 entries
        localStorage.setItem(this.storageKey, JSON.stringify(entries));
    }

    getStoredEntries() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        } catch (error) {
            console.error('Error loading stored entries:', error);
            return [];
        }
    }

    async saveToNetlify(entry) {
        // Try to save to Netlify Forms or Functions
        try {
            const response = await fetch('/.netlify/functions/save-entry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(entry)
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            return await response.json();
        } catch (error) {
            // Fallback: try to save via form submission
            try {
                const formData = new FormData();
                formData.append('form-name', 'tracker-entries');
                formData.append('entry-data', JSON.stringify(entry));
                
                await fetch('/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(formData).toString()
                });
            } catch (formError) {
                console.warn('Could not sync to server:', formError);
                throw formError;
            }
        }
    }

    showSuccessMessage(message, type = 'success') {
        const messageEl = document.getElementById('successMessage');
        messageEl.textContent = message;
        messageEl.style.display = 'block';
        
        if (type === 'warning') {
            messageEl.style.backgroundColor = '#fff3cd';
            messageEl.style.color = '#856404';
            messageEl.style.borderColor = '#ffeaa7';
        } else {
            messageEl.style.backgroundColor = '#d4edda';
            messageEl.style.color = '#155724';
            messageEl.style.borderColor = '#c3e6cb';
        }
        
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 3000);
    }

    loadRecentEntries() {
        const entries = this.getStoredEntries();
        const container = document.getElementById('recentEntries');
        
        if (entries.length === 0) {
            container.innerHTML = '<p class="text-center text-gray-500 body-font italic">No entries yet</p>';
            return;
        }
        
        container.innerHTML = entries.slice(0, 20).map(entry => {
            let description, amount, amountClass;
            
            if (entry.type === 'haircut') {
                description = `${entry.service} x${entry.quantity}`;
                amount = `+£${(entry.price * entry.quantity).toFixed(2)}`;
                amountClass = 'income';
            } else if (entry.type === 'misc') {
                description = entry.description;
                amount = `+£${entry.amount.toFixed(2)}`;
                amountClass = 'income';
            } else {
                description = entry.description;
                amount = `-£${entry.amount.toFixed(2)}`;
                amountClass = 'expense';
            }
            
            return `
                <div class="entry-item">
                    <div class="entry-details">
                        <div class="font-medium text-gray-700">${description}</div>
                        <div class="text-sm text-gray-500">${entry.date} • ${new Date(entry.timestamp).toLocaleTimeString()}</div>
                    </div>
                    <div class="entry-amount ${amountClass} text-lg">${amount}</div>
                </div>
            `;
        }).join('');
    }

    updateDashboard() {
        if (typeof updateAnalytics === 'function') {
            updateAnalytics();
        }
    }

    // Export functions
    exportCSV() {
        const entries = this.getStoredEntries();
        if (entries.length === 0) {
            alert('No data to export');
            return;
        }

        const headers = ['Date', 'Type', 'Description', 'Amount', 'Category'];
        const csvData = [headers];

        entries.forEach(entry => {
            let description, amount, category;
            
            if (entry.type === 'haircut') {
                description = `${entry.service} x${entry.quantity}`;
                amount = entry.price * entry.quantity;
                category = 'Service Income';
            } else if (entry.type === 'misc') {
                description = entry.description;
                amount = entry.amount;
                category = 'Other Income';
            } else {
                description = entry.description;
                amount = -Math.abs(entry.amount);
                category = 'Expense';
            }
            
            csvData.push([
                entry.date,
                entry.type,
                description,
                amount,
                category
            ]);
        });

        const csv = csvData.map(row => 
            row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
        ).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `lucy-hair-tracker-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    }

    exportJSON() {
        const entries = this.getStoredEntries();
        if (entries.length === 0) {
            alert('No data to export');
            return;
        }

        const dataStr = JSON.stringify(entries, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `lucy-hair-tracker-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    showConsoleSummary() {
        const entries = this.getStoredEntries();
        const analytics = this.calculateAnalytics(entries);
        
        console.log('=== LUCY SCOTT HAIR TRACKER SUMMARY ===');
        console.log('Total Entries:', entries.length);
        console.log('Total Income:', `£${analytics.totalIncome.toFixed(2)}`);
        console.log('Total Expenses:', `£${analytics.totalExpenses.toFixed(2)}`);
        console.log('Net Profit:', `£${analytics.netProfit.toFixed(2)}`);
        console.log('Analytics:', analytics);
    }

    calculateAnalytics(entries) {
        const currentYear = new Date().getFullYear();
        const currentYearEntries = entries.filter(entry => 
            new Date(entry.date).getFullYear() === currentYear
        );

        let totalIncome = 0;
        let totalExpenses = 0;
        const serviceBreakdown = {};
        const monthlyData = {};

        currentYearEntries.forEach(entry => {
            const month = new Date(entry.date).toLocaleString('default', { month: 'long' });
            
            if (!monthlyData[month]) {
                monthlyData[month] = { income: 0, expenses: 0 };
            }

            if (entry.type === 'haircut') {
                const amount = entry.price * entry.quantity;
                totalIncome += amount;
                monthlyData[month].income += amount;
                
                serviceBreakdown[entry.service] = (serviceBreakdown[entry.service] || 0) + amount;
            } else if (entry.type === 'misc') {
                totalIncome += entry.amount;
                monthlyData[month].income += entry.amount;
                
                serviceBreakdown['Other Income'] = (serviceBreakdown['Other Income'] || 0) + entry.amount;
            } else if (entry.type === 'expense') {
                totalExpenses += entry.amount;
                monthlyData[month].expenses += entry.amount;
            }
        });

        return {
            totalIncome,
            totalExpenses,
            netProfit: totalIncome - totalExpenses,
            serviceBreakdown,
            monthlyData,
            entryCount: entries.length
        };
    }

    clearAllData() {
        const confirmed = confirm(
            'Are you sure you want to delete all data? This action cannot be undone.\n\n' +
            'This will permanently delete all entries, analytics, and cannot be recovered.'
        );
        
        if (confirmed) {
            const doubleConfirmed = confirm(
                'This is your final warning. All data will be permanently deleted.\n\n' +
                'Type "DELETE" in the next prompt to confirm.'
            );
            
            if (doubleConfirmed) {
                const typedConfirmation = prompt('Type "DELETE" to confirm:');
                if (typedConfirmation === 'DELETE') {
                    localStorage.removeItem(this.storageKey);
                    this.loadRecentEntries();
                    if (this.currentTab === 'dashboard') {
                        this.updateDashboard();
                    }
                    this.showSuccessMessage('All data has been cleared');
                } else {
                    alert('Deletion cancelled - incorrect confirmation text');
                }
            }
        }
    }
}

// Global functions for button onclick handlers
function exportCSV() {
    if (window.tracker) {
        window.tracker.exportCSV();
    }
}

function exportJSON() {
    if (window.tracker) {
        window.tracker.exportJSON();
    }
}

function showConsoleSummary() {
    if (window.tracker) {
        window.tracker.showConsoleSummary();
    }
}

function clearAllData() {
    if (window.tracker) {
        window.tracker.clearAllData();
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.tracker = new LucyTracker();
});
