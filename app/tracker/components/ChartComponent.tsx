"use client";

import { useEffect, useRef } from 'react';

type Entry = {
  id: string | number;  // Updated to accept both string and number
  type: string;
  service?: string | null;
  amount: string | number;
  date: string;
  description?: string | null;
  quantity?: number | null;
};

type ChartComponentProps = {
  entries: Entry[];
  activeTab: string;
};

export default function ChartComponent({ entries, activeTab }: ChartComponentProps) {
  const serviceChartRef = useRef<any>(null);
  const monthlyChartRef = useRef<any>(null);
  const dailyChartRef = useRef<any>(null);
  const chartsInitialized = useRef(false);

  const initCharts = () => {
    if (typeof window === 'undefined' || !(window as any).Chart) return;
    
    // Service Chart (Pie)
    const serviceCtx = document.getElementById('serviceChart');
    if (serviceCtx) {
      const serviceData: { [key: string]: number } = {};
      entries.forEach(entry => {
        if (entry.type === 'haircut' && entry.service) {
          serviceData[entry.service] = (serviceData[entry.service] || 0) + parseFloat(entry.amount.toString());
        }
      });
      
      if (serviceChartRef.current) {
        serviceChartRef.current.destroy();
      }

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
          monthlyData[month].expenses += parseFloat(entry.amount.toString());
        } else {
          monthlyData[month].income += parseFloat(entry.amount.toString());
        }
      });
      
      const sortedMonths = Object.keys(monthlyData).sort();
      
      if (monthlyChartRef.current) {
        monthlyChartRef.current.destroy();
      }

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
      
      const dailyData = last7Days.map(date => {
        const dayEntries = entries.filter(entry => entry.date === date);
        const total = dayEntries.reduce((sum, entry) => {
          const amount = parseFloat(entry.amount.toString());
          return sum + (entry.type === 'expense' ? -amount : amount);
        }, 0);
        return total;
      });
      
      if (dailyChartRef.current) {
        dailyChartRef.current.destroy();
      }

      dailyChartRef.current = new (window as any).Chart(dailyCtx, {
        type: 'bar',
        data: {
          labels: last7Days.map(date => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })),
          datasets: [{
            label: 'Daily Net',
            data: dailyData,
            backgroundColor: dailyData.map(value => 
              value >= 0 ? 'rgba(40, 167, 69, 0.7)' : 'rgba(220, 53, 69, 0.7)'
            ),
            borderColor: dailyData.map(value => 
              value >= 0 ? 'rgba(40, 167, 69, 1)' : 'rgba(220, 53, 69, 1)'
            ),
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: false,
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

  // Initialize charts when dashboard tab is active and Chart.js is loaded
  useEffect(() => {
    if (activeTab === 'dashboard' && typeof window !== 'undefined' && (window as any).Chart) {
      // Reset charts flag when switching to dashboard
      chartsInitialized.current = true;
      initCharts();
    }
    
    // Cleanup function to destroy charts when component unmounts or tab changes
    return () => {
      [serviceChartRef, monthlyChartRef, dailyChartRef].forEach(chartRef => {
        if (chartRef.current) {
          chartRef.current.destroy();
          chartRef.current = null;
        }
      });
    };
  }, [activeTab, entries]);

  return null;
}
