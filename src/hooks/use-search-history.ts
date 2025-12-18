'use client';

import { useState, useEffect } from 'react';

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
}

const STORAGE_KEY = 'copart_search_history';
const MAX_ITEMS = 5;

export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const items = JSON.parse(stored) as SearchHistoryItem[];
        setHistory(items.sort((a, b) => b.timestamp - a.timestamp));
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever history changes
  useEffect(() => {
    if (isLoaded && history.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      } catch (error) {
        console.error('Error saving search history:', error);
      }
    }
  }, [history, isLoaded]);

  const addSearch = (query: string) => {
    if (!query.trim()) return;
    
    setHistory(prev => {
      // Remove if already exists
      const filtered = prev.filter(item => item.query.toLowerCase() !== query.toLowerCase());
      // Add to top
      const updated = [{ query: query.trim(), timestamp: Date.now() }, ...filtered];
      // Keep only MAX_ITEMS
      return updated.slice(0, MAX_ITEMS);
    });
  };

  const removeSearch = (query: string) => {
    setHistory(prev => prev.filter(item => item.query !== query));
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  };

  const getFormattedTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Justo ahora';
    if (minutes < 60) return `Hace ${minutes}m`;
    if (hours < 24) return `Hace ${hours}h`;
    if (days < 7) return `Hace ${days}d`;
    return 'Hace más de una semana';
  };

  return {
    history,
    addSearch,
    removeSearch,
    clearHistory,
    getFormattedTime,
    isLoaded
  };
}
