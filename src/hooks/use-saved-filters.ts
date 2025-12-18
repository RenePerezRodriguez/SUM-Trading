import { useCallback, useEffect, useState } from 'react';

export interface SavedFilters {
  damage: string[];
  engineType: string[];
  transmission: string[];
  priceRange: [number, number];
  miles: [number, number];
  timestamp: number;
}

const STORAGE_KEY = 'copart_saved_filters';
const STORAGE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

export function useSavedFilters(query: string) {
  const [savedFilters, setSavedFilters] = useState<SavedFilters | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved filters on mount
  useEffect(() => {
    const loadSavedFilters = () => {
      try {
        const stored = localStorage.getItem(`${STORAGE_KEY}:${query}`);
        if (!stored) {
          setIsLoading(false);
          return;
        }

        const parsed = JSON.parse(stored) as SavedFilters;
        const age = Date.now() - parsed.timestamp;

        // Check if expired (7 days)
        if (age > STORAGE_TTL) {
          localStorage.removeItem(`${STORAGE_KEY}:${query}`);
          setSavedFilters(null);
        } else {
          setSavedFilters(parsed);
        }
      } catch (error) {
        console.error('Error loading saved filters:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedFilters();
  }, [query]);

  // Save filters
  const saveFilters = useCallback((filters: Omit<SavedFilters, 'timestamp'>) => {
    try {
      const toSave: SavedFilters = {
        ...filters,
        timestamp: Date.now(),
      };
      localStorage.setItem(`${STORAGE_KEY}:${query}`, JSON.stringify(toSave));
      setSavedFilters(toSave);
    } catch (error) {
      console.error('Error saving filters:', error);
    }
  }, [query]);

  // Clear saved filters for this query
  const clearSavedFilters = useCallback(() => {
    try {
      localStorage.removeItem(`${STORAGE_KEY}:${query}`);
      setSavedFilters(null);
    } catch (error) {
      console.error('Error clearing saved filters:', error);
    }
  }, [query]);

  // Get all saved filter queries
  const getAllSavedQueries = useCallback(() => {
    try {
      const keys = Object.keys(localStorage);
      return keys
        .filter(key => key.startsWith(STORAGE_KEY + ':'))
        .map(key => key.replace(STORAGE_KEY + ':', ''));
    } catch (error) {
      console.error('Error getting all saved queries:', error);
      return [];
    }
  }, []);

  return {
    savedFilters,
    isLoading,
    saveFilters,
    clearSavedFilters,
    getAllSavedQueries,
  };
}
