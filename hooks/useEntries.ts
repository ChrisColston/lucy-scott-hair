import { useState, useEffect } from 'react';
import { TrackerEntry } from '@/lib/schema';

export function useEntries() {
  const [entries, setEntries] = useState<TrackerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all entries
  const fetchEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/entries', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`Failed to fetch entries: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Fetched entries:', data);
      setEntries(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Fetch entries error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  // Create new entry
  const createEntry = async (entryData: Omit<TrackerEntry, 'id' | 'createdAt' | 'updatedAt' | 'timestamp'>) => {
    try {
      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entryData),
      });

      if (!response.ok) {
        throw new Error('Failed to create entry');
      }

      const newEntry = await response.json();
      setEntries(prev => [newEntry, ...prev]);
      return newEntry;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  // Update entry
  const updateEntry = async (id: string, entryData: Partial<TrackerEntry>) => {
    try {
      const response = await fetch(`/api/entries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entryData),
      });

      if (!response.ok) {
        throw new Error('Failed to update entry');
      }

      const updatedEntry = await response.json();
      setEntries(prev =>
      prev.map(entry => entry.id.toString() === id ? updatedEntry : entry)
      );
      return updatedEntry;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  // Delete entry
  const deleteEntry = async (id: string) => {
    try {
      const response = await fetch(`/api/entries/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete entry');
      }

      setEntries(prev => prev.filter(entry => entry.id.toString() !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  // Calculate analytics
  const calculateAnalytics = () => {
    const currentYear = new Date().getFullYear();
    const currentYearEntries = entries.filter(entry =>
      new Date(entry.date).getFullYear() === currentYear
    );

    let totalIncome = 0;
    let totalExpenses = 0;
    const monthlyData: { [key: string]: { income: number; expenses: number } } = {};

    currentYearEntries.forEach(entry => {
      const amount = parseFloat(entry.amount);
      const month = new Date(entry.date).toLocaleString('default', { month: 'long' });

      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expenses: 0 };
      }

      if (entry.type === 'expense') {
        totalExpenses += amount;
        monthlyData[month].expenses += amount;
      } else {
        totalIncome += amount;
        monthlyData[month].income += amount;
      }
    });

    return {
      totalIncome,
      totalExpenses,
      netProfit: totalIncome - totalExpenses,
      monthlyData,
      entryCount: entries.length,
    };
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return {
    entries,
    loading,
    error,
    fetchEntries,
    createEntry,
    updateEntry,
    deleteEntry,
    calculateAnalytics,
  };
}