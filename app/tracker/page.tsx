"use client"

import Script from 'next/script'
import { useEffect, useState, useRef, useCallback } from 'react'
import { useEntries } from '@/hooks/useEntries'
import ChartComponent from './components/ChartComponent'
import { 
  FiPlus, 
  FiBarChart, 
  FiList, 
  FiDownload, 
  FiEdit3, 
  FiTrash2, 
  FiCheck,
  FiX
} from 'react-icons/fi'

const servicePrices: { [key: string]: number } = {
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

// Move all hooks to the top of the component
export default function Tracker() {
  // State hooks - all hooks must be called unconditionally at the top level
  const [activeTab, setActiveTab] = useState('entry');
  const [activeEntryType, setActiveEntryType] = useState('haircut');
  const [serviceType, setServiceType] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<any>({});
  const serviceChartRef = useRef<any>(null);
  const [analytics, setAnalytics] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netProfit: 0,
    monthlyData: {},
    entryCount: 0
  });
  
  // Refs
  const chartsInitialized = useRef(false);
  
  // Use the database hook - must be called unconditionally
  const { 
    entries = [], 
    loading = true, 
    error = null, 
    createEntry = () => Promise.resolve(), 
    updateEntry = () => Promise.resolve(), 
    deleteEntry: deleteEntryFromDB = () => Promise.resolve(),
    calculateAnalytics = () => ({
      totalIncome: 0,
      totalExpenses: 0,
      netProfit: 0,
      monthlyData: {},
      entryCount: 0
    })
  } = useEntries();
  
  // Derived state
  const today = new Date().toISOString().split('T')[0];
  
  // Helper functions
  const formatAmount = (amount: string | number | null): string => {
    if (amount === null || amount === undefined) return '0.00';
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  // Update analytics when entries change
  useEffect(() => {
    if (!loading && !error) {
      try {
        setAnalytics(calculateAnalytics());
      } catch (err) {
        console.error('Error calculating analytics:', err);
      }
    }
  }, [entries, loading, error, calculateAnalytics]);

  // Initialize Chart.js when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined' && !(window as any).Chart) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.async = true;
      script.onload = () => {
        console.log('Chart.js loaded');
      };
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);


  const handleServiceTypeChange = (value: string) => {
    setServiceType(value);
    if (value && servicePrices[value] !== undefined) {
      setServicePrice(servicePrices[value].toString());
    } else {
      setServicePrice('');
    }
  };

  const validatePriceInput = (value: string): string => {
    if (!value) return '';
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return '';
    return (Math.round(numValue * 2) / 2).toString(); // Round to nearest 0.5
  };

  const handlePriceChange = (value: string) => {
    const validated = validatePriceInput(value);
    setServicePrice(validated);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    let entryData: any = {};

    if (activeEntryType === 'haircut') {
      entryData = {
        type: 'haircut',
        service: formData.get('haircutType') as string,
        quantity: parseInt(formData.get('quantity') as string) || 1,
        amount: (parseFloat(formData.get('servicePrice') as string) || 0) * (parseInt(formData.get('quantity') as string) || 1),
        date: formData.get('serviceDate') as string
      };
    } else if (activeEntryType === 'misc') {
      entryData = {
        type: 'misc',
        description: formData.get('miscDescription') as string,
        amount: parseFloat(formData.get('miscAmount') as string) || 0,
        date: formData.get('miscDate') as string
      };
    } else if (activeEntryType === 'expense') {
      entryData = {
        type: 'expense',
        description: formData.get('expenseDescription') as string,
        amount: parseFloat(formData.get('expenseAmount') as string) || 0,
        date: formData.get('expenseDate') as string
      };
    }

    try {
      await createEntry(entryData);
      
      // Show success message
      const successMsg = document.getElementById('successMessage');
      if (successMsg) {
        successMsg.style.display = 'block';
        setTimeout(() => {
          successMsg.style.display = 'none';
        }, 3000);
      }
      
      // Reset form
      (e.target as HTMLFormElement).reset();
      setServiceType('');
      setServicePrice('');
      setQuantity(1);
    } catch (error) {
      alert('Failed to save entry. Please try again.');
    }
  };

  const exportCSV = () => {
    if (entries.length === 0) {
      alert('No entries to export');
      return;
    }

    const headers = ['Date', 'Type', 'Description/Service', 'Amount', 'Quantity'];
    const csvContent = [headers.join(',')];

    entries.forEach(entry => {
      const row = [
        entry.date,
        entry.type,
        entry.service || entry.description || '',
        entry.amount,
        entry.quantity || 1
      ];
      csvContent.push(row.join(','));
    });

    const blob = new Blob([csvContent.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lucy-hair-tracker-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    if (entries.length === 0) {
      alert('No entries to export');
      return;
    }

    const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lucy-hair-tracker-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearAllData = async () => {
    if (confirm("Are you sure you want to delete all entries? This cannot be undone.")) {
      try {
        // Delete all entries from database
        for (const entry of entries) {
          await deleteEntryFromDB(entry.id.toString());
        }
        alert("All data has been cleared.");
      } catch (error) {
        alert("Failed to clear all data. Please try again.");
      }
    }
  };
  const showConsumeSummary = () => {
    console.log("=== LUCY SCOTT HAIR TRACKER SUMMARY ===");
    console.log(`Total Entries: ${entries.length}`);
    console.log(`Total Income: £${analytics.totalIncome.toFixed(2)}`);
    console.log(`Total Expenses: £${analytics.totalExpenses.toFixed(2)}`);
    console.log(`Net Profit: £${analytics.netProfit.toFixed(2)}`);
    console.log("=== DETAILED ENTRIES ===");
    console.table(entries);
    alert("Summary logged to console. Open Developer Tools to view.");
  };
  const handleDeleteEntry = async (entryId: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      try {
        await deleteEntryFromDB(entryId);
      } catch (error) {
        alert('Failed to delete entry. Please try again.');
      }
    }
  };

  const startEditing = (entry: any) => {
    setEditingEntry(entry.id.toString());
    setEditingData({ ...entry });
  };

  const cancelEditing = () => {
    setEditingEntry(null);
    setEditingData({});
  };

  const saveEdit = async () => {
    if (!editingEntry) return;
    
    try {
      await updateEntry(editingEntry, editingData);
      setEditingEntry(null);
      setEditingData({});
    } catch (error) {
      alert('Failed to update entry. Please try again.');
    }
  };

  const initCharts = () => {
    if (typeof window === 'undefined' || !(window as any).Chart) return;
    
    // Service Chart (Pie)
    const serviceCtx = document.getElementById('serviceChart');
    if (serviceCtx) {
      const serviceData: { [key: string]: number } = {};
      entries.forEach(entry => {
        if (entry.type === 'haircut' && entry.service) {
          serviceData[entry.service] = (serviceData[entry.service] || 0) + parseFloat(entry.amount);
        }
      });
      
      serviceChartRef.current = new (window as any).Chart(serviceCtx, {
        type: 'pie',
        data: {
          labels: Object.keys(serviceData),
          datasets: [{
            data: Object.values(serviceData),
            backgroundColor: [
              '#D8A7B1', '#F8E5D6', '#E5D5C8', '#FDF5EA',
              '#B8A6D8', '#D6E5F8', '#C8D5E5', '#EAF5FD'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    }
    
    // Monthly Chart (Line)
    const monthlyCtx = document.getElementById('monthlyChart');
    if (monthlyCtx) {
      const monthlyData: { [key: string]: { income: number; expenses: number } } = {};
      entries.forEach(entry => {
        const month = entry.date ? entry.date.substring(0, 7) : new Date().toISOString().substring(0, 7);
        if (!monthlyData[month]) {
          monthlyData[month] = { income: 0, expenses: 0 };
        }
        if (entry.type === 'expense') {
          monthlyData[month].expenses += parseFloat(entry.amount);
        } else {
          monthlyData[month].income += parseFloat(entry.amount);
        }
      });
      
      const sortedMonths = Object.keys(monthlyData).sort();
      
      monthlyChartRef.current = new (window as any).Chart(monthlyCtx, {
        type: 'line',
        data: {
          labels: sortedMonths,
          datasets: [{
            label: 'Income',
            data: sortedMonths.map(month => monthlyData[month].income),
            borderColor: '#28a745',
            backgroundColor: 'rgba(40, 167, 69, 0.1)',
            tension: 0.4
          }, {
            label: 'Expenses',
            data: sortedMonths.map(month => monthlyData[month].expenses),
            borderColor: '#dc3545',
            backgroundColor: 'rgba(220, 53, 69, 0.1)',
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value: any) {
                  return '£' + value.toFixed(0);
                }
              }
            }
          }
        }
      });
    }
    
    // Daily Chart (Bar)
    const dailyCtx = document.getElementById('dailyChart');
    if (dailyCtx) {
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last7Days.push(date.toISOString().split('T')[0]);
      }
      
      const dailyData: { [key: string]: { income: number; expenses: number } } = {};
      last7Days.forEach(date => {
        dailyData[date] = { income: 0, expenses: 0 };
      });
      
      entries.forEach(entry => {
        if (dailyData[entry.date]) {
          if (entry.type === 'expense') {
            dailyData[entry.date].expenses += parseFloat(entry.amount);
          } else {
            dailyData[entry.date].income += parseFloat(entry.amount);
          }
        }
      });
      
      dailyChartRef.current = new (window as any).Chart(dailyCtx, {
        type: 'bar',
        data: {
          labels: last7Days.map(date => new Date(date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' })),
          datasets: [{
            label: 'Income',
            data: last7Days.map(date => dailyData[date].income),
            backgroundColor: '#28a745'
          }, {
            label: 'Expenses',
            data: last7Days.map(date => dailyData[date].expenses),
            backgroundColor: '#dc3545'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value: any) {
                  return '£' + value.toFixed(0);
                }
              }
            }
          }
        }
      });
    }
  };
  
  const updateCharts = () => {
    if (serviceChartRef.current) {
      serviceChartRef.current.destroy();
      serviceChartRef.current = null;
    }
    if (monthlyChartRef.current) {
      monthlyChartRef.current.destroy();
      monthlyChartRef.current = null;
    }
    if (dailyChartRef.current) {
      dailyChartRef.current.destroy();
      dailyChartRef.current = null;
    }
    
    if (activeTab === 'dashboard') {
      setTimeout(() => {
        initCharts();
      }, 100);
    }
  };

  return (
    <>
      
      <div className="min-h-screen" style={{
        fontFamily: "'Source Sans 3', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        fontWeight: 300,
        color: '#4E4A47',
        background: 'linear-gradient(-45deg, #FDF5EA, #F8E5D6, #FDF5EA, #F8E5D6)',
        backgroundSize: '400% 400%',
        animation: 'gradientAnimation 15s ease infinite'
      }}>
        <style jsx>{`
          @keyframes gradientAnimation {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          .lucy-button {
            background-color: #FDF5EA;
            border: 2px solid #E5D5C8;
            border-radius: 12px;
            color: #4E4A47;
            font-family: 'Source Sans 3', sans-serif;
            font-weight: 400;
            padding: 12px 32px;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(78, 74, 71, 0.1);
            cursor: pointer;
            display: inline-block;
            text-decoration: none;
          }
          
          .lucy-button:hover {
            background-color: #F8E5D6;
            border-color: #D8A7B1;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(78, 74, 71, 0.15);
          }
          
          .lucy-button.active {
            background-color: #D8A7B1;
            color: white;
            border-color: #D8A7B1;
          }
          
          .lucy-input, .lucy-select {
            border: 2px solid #F8E5E8;
            border-radius: 12px;
            padding: 18px 24px;
            font-size: 16px;
            font-family: 'Source Sans 3', sans-serif;
            transition: border-color 0.3s ease;
            background: white;
            width: 100%;
          }
          
          .lucy-select {
            background: #FDF5EA;
            box-shadow: 0 2px 8px rgba(78, 74, 71, 0.1);
          }
          
          .lucy-input:focus, .lucy-select:focus {
            outline: none;
            border-color: #D8A7B1;
            box-shadow: 0 4px 12px rgba(78, 74, 71, 0.15);
          }
          
          .lucy-card {
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(12px);
            border: 4px solid #E5D5C8;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          }
          
          .nav-tabs {
            display: flex;
            gap: 4px;
            margin-bottom: 24px;
            flex-wrap: nowrap;
            overflow-x: auto;
          }
          
          .nav-tab {
            flex: 1;
            min-width: 100px;
            text-align: center;
            white-space: nowrap;
            font-size: 14px;
            padding: 8px 12px;
          }
          
          .nav-tab-icon {
            display: inline-block;
            margin-right: 4px;
          }
          
          .form-section {
            display: none;
          }
          
          .form-section.active {
            display: block;
          }
          
          .price-display {
            background: rgba(216, 167, 177, 0.1);
            border: 2px solid #D8A7B1;
            border-radius: 12px;
            padding: 16px;
            text-align: center;
            font-weight: 600;
            color: #D8A7B1;
            font-size: 1.2rem;
            margin-top: 12px;
          }
          
          .total-submit-row {
            display: flex;
            gap: 16px;
            align-items: center;
            margin-top: 24px;
          }
          
          .total-submit-row .price-display {
            flex: 1;
            margin-top: 0;
          }
          
          .total-submit-row .lucy-button {
            flex: 1;
            margin: 0;
          }
          
          .entry-actions {
            display: flex;
            gap: 8px;
            align-items: center;
          }
          
          .icon-button {
            background: none;
            border: none;
            color: #4E4A47;
            cursor: pointer;
            padding: 8px;
            border-radius: 8px;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .icon-button:hover {
            background-color: rgba(78, 74, 71, 0.1);
          }
          
          .icon-button.edit {
            color: #007bff;
          }
          
          .icon-button.delete {
            color: #dc3545;
          }
          
          .icon-button.save {
            color: #28a745;
          }
          
          .editing-input {
            border: 1px solid #D8A7B1;
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 14px;
            width: 100%;
            margin: 2px 0;
          }
          
          .success-message {
            background: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 12px;
            margin-bottom: 20px;
            display: none;
            border: 2px solid #c3e6cb;
          }
          
          .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 24px;
          }
          
          .chart-container {
            position: relative;
            height: 300px;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 16px;
            padding: 20px;
          }
          
          .stat-card {
            text-align: center;
            padding: 24px;
          }
          
          .stat-number {
            font-size: 2.5rem;
            font-weight: 700;
            color: #D8A7B1;
            margin-bottom: 8px;
          }
          
          .stat-label {
            font-size: 1rem;
            color: #4E4A47;
          }
          
          .entry-item {
            background: rgba(255, 255, 255, 0.7);
            border: 2px solid #E5D5C8;
            padding: 16px;
            border-radius: 12px;
            margin-bottom: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.3s ease;
          }
          
          .entry-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(78, 74, 71, 0.15);
          }
          
          .entry-amount.income {
            color: #28a745;
            font-weight: 600;
          }
          
          .entry-amount.expense {
            color: #dc3545;
            font-weight: 600;
          }
          
          @media (max-width: 768px) {
            .nav-tab {
              font-size: 12px;
              padding: 6px 8px;
              min-width: 80px;
            }
            .nav-tab-icon {
              margin-right: 2px;
            }
            .dashboard-grid {
              grid-template-columns: 1fr;
            }
            .total-submit-row {
              flex-direction: column;
              gap: 12px;
            }
            .total-submit-row .price-display,
            .total-submit-row .lucy-button {
              width: 100%;
            }
          }
        `}</style>
        
        {/* Header */}
        <div className="text-center py-8 px-4">
          <img src="/lucy-scott-wordmark.png" alt="Lucy Scott Hair" className="mx-auto mb-4" style={{maxWidth: '250px', height: 'auto'}} />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-700 mb-2" style={{fontFamily: "'Playfair Display', serif"}}>Business Tracker</h1>
          <p className="text-lg text-gray-600" style={{fontFamily: "'Source Sans 3', sans-serif", fontWeight: 300}}>Track your income, expenses, and analytics</p>
        </div>

        {/* Main Container */}
        <div className="max-w-6xl mx-auto px-4 pb-8">
          {/* Success Message */}
          <div id="successMessage" className="success-message">
            Entry saved successfully!
          </div>

          {/* Navigation Tabs */}
        <div className="nav-tabs">
            <button 
              className={`lucy-button nav-tab ${activeTab === 'entry' ? 'active' : ''}`} 
              onClick={() => setActiveTab('entry')}
            >
              <span className="nav-tab-icon"><FiPlus /></span>
              New Entry
            </button>
            <button 
              className={`lucy-button nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`} 
              onClick={() => setActiveTab('dashboard')}
            >
              <span className="nav-tab-icon"><FiBarChart /></span>
              Dashboard
            </button>
            <button 
              className={`lucy-button nav-tab ${activeTab === 'entries' ? 'active' : ''}`} 
              onClick={() => setActiveTab('entries')}
            >
              <span className="nav-tab-icon"><FiList /></span>
              Entries
            </button>
            <button 
              className={`lucy-button nav-tab ${activeTab === 'export' ? 'active' : ''}`} 
              onClick={() => setActiveTab('export')}
            >
              <span className="nav-tab-icon"><FiDownload /></span>
              Export
            </button>
          </div>

          {/* Entry Tab */}
          {activeTab === 'entry' && (
            <div className="lucy-card p-8">
              {/* Entry Type Selector */}
              <div className="flex gap-3 mb-8 flex-wrap">
                <button 
                  className={`lucy-button ${activeEntryType === 'haircut' ? 'active' : ''} flex-1 min-w-[120px]`}
                  onClick={() => setActiveEntryType('haircut')}
                >
                  Hair Service
                </button>
                <button 
                  className={`lucy-button ${activeEntryType === 'misc' ? 'active' : ''} flex-1 min-w-[120px]`}
                  onClick={() => setActiveEntryType('misc')}
                >
                  Other Income
                </button>
                <button 
                  className={`lucy-button ${activeEntryType === 'expense' ? 'active' : ''} flex-1 min-w-[120px]`}
                  onClick={() => setActiveEntryType('expense')}
                >
                  Expense
                </button>
              </div>

              <form onSubmit={handleFormSubmit}>
                {/* Hair Service Section */}
                {activeEntryType === 'haircut' && (
                  <div className="space-y-8">
                    <div>
                      <label className="block text-sm font-black text-gray-700 mb-2">Service Type:</label>
                      <select 
                        name="haircutType" 
                        className="lucy-select" 
                        required
                        value={serviceType}
                        onChange={(e) => handleServiceTypeChange(e.target.value)}
                      >
                        <option value="">Select a service...</option>
                        <optgroup label="CUTS">
                          <option value="Dry cut">Dry cut</option>
                          <option value="Wet cut">Wet cut</option>
                          <option value="Cut and finish">Cut and finish</option>
                          <option value="Restyle">Restyle</option>
                          <option value="Fringe trim">Fringe trim</option>
                        </optgroup>
                        <optgroup label="CHILDREN'S CUTS">
                          <option value="Children's Dry cut">Children's Dry cut</option>
                          <option value="Children's Wet cut">Children's Wet cut</option>
                          <option value="Children's Cut and finish">Children's Cut and finish</option>
                        </optgroup>
                        <optgroup label="STYLING">
                          <option value="Blow dry">Blow dry</option>
                          <option value="Long hair blow dry">Long hair blow dry</option>
                          <option value="Straightening/curling">Straightening/curling</option>
                        </optgroup>
                        <optgroup label="COLOURING">
                          <option value="Consultation - 15min Free">Consultation - 15min Free</option>
                          <option value="T-section">T-section</option>
                          <option value="Half head">Half head</option>
                          <option value="Full head">Full head</option>
                          <option value="Full head tint">Full head tint</option>
                          <option value="Root tint">Root tint</option>
                          <option value="Toner">Toner</option>
                          <option value="Balayage">Balayage</option>
                        </optgroup>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div>
                        <label className="block text-sm font-black text-gray-700 mb-2">Price (£):</label>
                        <input 
                          type="number" 
                          id="servicePrice" 
                          name="servicePrice" 
                          className="lucy-input" 
                          step="0.5" 
                          min="0" 
                          placeholder="0.00" 
                          value={servicePrice}
                          onChange={(e) => handlePriceChange(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-black text-gray-700 mb-2">Quantity:</label>
                        <input 
                          type="number" 
                          id="quantity" 
                          name="quantity" 
                          className="lucy-input" 
                          min="1" 
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-black text-gray-700 mb-2">Date:</label>
                        <input type="date" id="serviceDate" name="serviceDate" className="lucy-input" defaultValue={today} required />
                      </div>
                    </div>
                    
                    <div className="total-submit-row">
                      <div className="price-display">
                        Total: £{(parseFloat(servicePrice) * quantity || 0).toFixed(2)}
                      </div>
                      <button type="submit" className="lucy-button">
                        Save Entry
                      </button>
                    </div>
                  </div>
                )}

                {/* Other Income Section */}
                {activeEntryType === 'misc' && (
                  <div className="space-y-8">
                    <div>
                      <label className="block text-sm font-black text-gray-700 mb-2">Description:</label>
                      <input type="text" id="miscDescription" name="miscDescription" className="lucy-input" placeholder="e.g., consultation fee, product sale" required />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-black text-gray-700 mb-2">Amount (£):</label>
                        <input type="number" id="miscAmount" name="miscAmount" className="lucy-input" step="0.5" min="0" placeholder="0.00" required />
                      </div>
                      <div>
                        <label className="block text-sm font-black text-gray-700 mb-2">Date:</label>
                        <input type="date" id="miscDate" name="miscDate" className="lucy-input" defaultValue={today} required />
                      </div>
                    </div>
                    
                    <button type="submit" className="lucy-button w-full mt-6">
                      Save Entry
                    </button>
                  </div>
                )}

                {/* Expense Section */}
                {activeEntryType === 'expense' && (
                  <div className="space-y-8">
                    <div>
                      <label className="block text-sm font-black text-gray-700 mb-2">Description:</label>
                      <input type="text" id="expenseDescription" name="expenseDescription" className="lucy-input" placeholder="e.g., hair products, utilities" required />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-black text-gray-700 mb-2">Amount (£):</label>
                        <input type="number" id="expenseAmount" name="expenseAmount" className="lucy-input" step="0.5" min="0" placeholder="0.00" required />
                      </div>
                      <div>
                        <label className="block text-sm font-black text-gray-700 mb-2">Date:</label>
                        <input type="date" id="expenseDate" name="expenseDate" className="lucy-input" defaultValue={today} required />
                      </div>
                    </div>
                    
                    <button type="submit" className="lucy-button w-full mt-6">
                      Save Entry
                    </button>
                  </div>
                )}

              </form>
            </div>
          )}

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="dashboard-grid">
              {/* Stats Cards */}
              <div className="lucy-card stat-card">
                <div className="stat-number">£{analytics.totalIncome.toFixed(2)}</div>
                <div className="stat-label">Total Income</div>
              </div>
              
              <div className="lucy-card stat-card">
                <div className="stat-number">£{analytics.totalExpenses.toFixed(2)}</div>
                <div className="stat-label">Total Expenses</div>
              </div>
              
              <div className="lucy-card stat-card">
                <div className="stat-number">£{analytics.netProfit.toFixed(2)}</div>
                <div className="stat-label">Net Profit</div>
              </div>

              {/* Charts */}
              <div className="lucy-card">
                <h3 className="text-xl font-black text-gray-700 mb-4 text-center">Income by Service Type</h3>
                <div className="chart-container">
                  <canvas id="serviceChart"></canvas>
                </div>
              </div>

              <div className="lucy-card">
                <h3 className="text-xl font-black text-gray-700 mb-4 text-center">Monthly Trends</h3>
                <div className="chart-container">
                  <canvas id="monthlyChart"></canvas>
                </div>
              </div>

              <div className="lucy-card">
                <h3 className="text-xl font-black text-gray-700 mb-4 text-center">Daily Performance</h3>
                <div className="chart-container">
                  <canvas id="dailyChart"></canvas>
                </div>
              </div>
            </div>
          )}

          {/* Recent Entries Tab */}
          {activeTab === 'entries' && (
            <div className="lucy-card p-8">
              <h3 className="text-2xl font-black text-gray-700 mb-6 text-center">Recent Entries</h3>
              <div>
                {entries.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No entries yet. Add your first entry to get started!</p>
                ) : (
                  entries.slice().reverse().map((entry) => (
                    <div key={entry.id} className="entry-item">
                      {editingEntry === entry.id.toString() ? (
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                          <div>
                            <input
                              type="text"
                              className="editing-input"
                              value={editingData.service || editingData.description || ''}
                              onChange={(e) => setEditingData({
                                ...editingData,
                                [entry.service ? 'service' : 'description']: e.target.value
                              })}
                            />
                          </div>
                          <div>
                            <input
                              type="number"
                              className="editing-input"
                              step="0.5"
                              min="0"
                              value={editingData.amount || ''}
                              onChange={(e) => setEditingData({
                                ...editingData,
                                amount: parseFloat(e.target.value) || 0
                              })}
                            />
                          </div>
                          <div className="entry-actions">
                            <button className="icon-button save" onClick={saveEdit}>
                              <FiCheck size={16} />
                            </button>
                            <button className="icon-button" onClick={cancelEditing}>
                              <FiX size={16} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex-1">
                            <div className="font-semibold">
                              {entry.service || entry.description}
                            </div>
                            <div className="text-sm text-gray-500">
                              {entry.date} • {entry.type}
                              {entry.quantity && entry.quantity > 1 && ` • Qty: ${entry.quantity}`}
                            </div>
                          </div>
                          <div className={`entry-amount ${entry.type === 'expense' ? 'expense' : 'income'}`}>
                            {entry.type === 'expense' ? '-' : '+'}£{formatAmount(entry.amount)}
                          </div>
                          <div className="entry-actions">
                            <button className="icon-button edit" onClick={() => startEditing(entry)}>
                              <FiEdit3 size={16} />
                            </button>
                            <button className="icon-button delete" onClick={() => handleDeleteEntry(entry.id.toString())}>
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Export Tab */}
          {activeTab === 'export' && (
            <div className="lucy-card p-8">
              <h3 className="text-2xl font-black text-gray-700 mb-6 text-center">Export & Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <button onClick={exportCSV} className="lucy-button w-full mb-4">Export CSV</button>
                  <p className="text-sm text-gray-600">Download all entries as CSV for spreadsheet analysis</p>
                </div>
                <div className="text-center">
                  <button onClick={exportJSON} className="lucy-button w-full mb-4">Export JSON</button>
                  <p className="text-sm text-gray-600">Download raw data in JSON format</p>
                </div>
                <div className="text-center">
                  <button onClick={showConsumeSummary} className="lucy-button w-full mb-4">View Summary</button>
                  <p className="text-sm text-gray-600">Display detailed analytics in console</p>
                </div>
                <div className="text-center">
                  <button onClick={clearAllData} className="lucy-button w-full mb-4" style={{backgroundColor: '#dc3545', borderColor: '#dc3545', color: 'white'}}>Clear All Data</button>
                  <p className="text-sm text-gray-600">⚠️ Permanently delete all entries</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* PWA Install Button */}
        <button id="installButton" className="fixed bottom-5 right-5 lucy-button" style={{display: 'none'}}>
          📱 Install App
        </button>
      </div>
      
      {/* Chart Component */}
      <ChartComponent entries={entries} activeTab={activeTab} />
      
      {/* Scripts */}
      <Script src="https://cdn.jsdelivr.net/npm/date-fns@2.29.3/index.min.js" strategy="beforeInteractive" />
      <Script src="/tracker/tracker-app.js" strategy="afterInteractive" />
      <Script src="/tracker/tracker-analytics.js" strategy="afterInteractive" />
      <Script src="/tracker/tracker-pwa.js" strategy="afterInteractive" />
    </>
  );
}

