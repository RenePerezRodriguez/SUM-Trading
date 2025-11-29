'use client';

import { useState, useEffect } from 'react';

export interface Favorite {
  lot_number: string;
  title: string;
  imageUrl: string;
  current_bid: number;
  timestamp: number;
}

const STORAGE_KEY = 'copart_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Map<string, Favorite>>(new Map());
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const favArray = JSON.parse(stored);
        setFavorites(new Map(favArray.map((fav: Favorite) => [fav.lot_number, fav])));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever favorites change
  useEffect(() => {
    if (isLoaded && favorites.size > 0) {
      try {
        const favArray = Array.from(favorites.values());
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favArray));
      } catch (error) {
        console.error('Error saving favorites:', error);
      }
    }
  }, [favorites, isLoaded]);

  const addFavorite = (vehicle: Omit<Favorite, 'timestamp'>) => {
    setFavorites(prev => new Map(prev).set(vehicle.lot_number, {
      ...vehicle,
      timestamp: Date.now()
    }));
  };

  const removeFavorite = (lotNumber: string) => {
    setFavorites(prev => {
      const next = new Map(prev);
      next.delete(lotNumber);
      return next;
    });
  };

  const isFavorite = (lotNumber: string) => {
    return favorites.has(lotNumber);
  };

  const getFavorites = () => {
    return Array.from(favorites.values()).sort((a, b) => b.timestamp - a.timestamp);
  };

  return {
    favorites: Array.from(favorites.values()),
    addFavorite,
    removeFavorite,
    isFavorite,
    getFavorites,
    favoritesCount: favorites.size,
    isLoaded
  };
}
