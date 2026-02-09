import { useState, useCallback } from 'react';

/**
 * Custom hook for wrapping localStorage with async-like interface
 * Storage key patterns:
 * - daily-logs:{YYYY-MM-DD}
 * - weekly-reviews:{YYYY-Www}
 */
export const useStorage = () => {
  const [error, setError] = useState<string | null>(null);

  /**
   * Retrieve and parse JSON data from localStorage
   */
  const get = useCallback(async <T,>(key: string): Promise<T | null> => {
    try {
      setError(null);
      const item = window.localStorage.getItem(key);
      if (!item) {
        return null;
      }
      return JSON.parse(item) as T;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get item from storage';
      setError(errorMessage);
      console.error('Storage get error:', errorMessage);
      return null;
    }
  }, []);

  /**
   * Stringify and save data to localStorage
   */
  const set = useCallback(async <T,>(key: string, value: T): Promise<boolean> => {
    try {
      setError(null);
      const serialized = JSON.stringify(value);
      window.localStorage.setItem(key, serialized);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to set item in storage';
      setError(errorMessage);
      console.error('Storage set error:', errorMessage);
      return false;
    }
  }, []);

  /**
   * Remove an item from localStorage
   */
  const remove = useCallback(async (key: string): Promise<boolean> => {
    try {
      setError(null);
      window.localStorage.removeItem(key);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove item from storage';
      setError(errorMessage);
      console.error('Storage remove error:', errorMessage);
      return false;
    }
  }, []);

  /**
   * List all keys matching a prefix
   */
  const list = useCallback(async (prefix: string): Promise<string[]> => {
    try {
      setError(null);
      const keys: string[] = [];

      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          keys.push(key);
        }
      }

      return keys.sort();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to list keys from storage';
      setError(errorMessage);
      console.error('Storage list error:', errorMessage);
      return [];
    }
  }, []);

  /**
   * Clear all items from localStorage
   */
  const clear = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);
      window.localStorage.clear();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear storage';
      setError(errorMessage);
      console.error('Storage clear error:', errorMessage);
      return false;
    }
  }, []);

  return {
    get,
    set,
    remove,
    list,
    clear,
    error,
  };
};

// Helper functions for generating storage keys
export const storageKeys = {
  dailyLog: (date: string) => `daily-logs:${date}`,
  weeklyReview: (weekId: string) => `weekly-reviews:${weekId}`,

  // Generate week ID in format YYYY-Www (e.g., 2024-W01)
  getWeekId: (date: Date): string => {
    const year = date.getFullYear();
    const onejan = new Date(year, 0, 1);
    const weekNumber = Math.ceil(
      ((date.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7
    );
    return `${year}-W${weekNumber.toString().padStart(2, '0')}`;
  },

  // Format date as YYYY-MM-DD
  formatDate: (date: Date): string => {
    return date.toISOString().split('T')[0];
  },
};
