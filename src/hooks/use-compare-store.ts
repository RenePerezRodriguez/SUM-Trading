
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Car, CarImage } from '@/lib/placeholder-data';

type CompareItem = {
  id: string;
  make: string;
  model: string;
  image: CarImage | null;
};

type CompareState = {
  compareItems: CompareItem[];
  isComparing: (id: string) => boolean;
  toggleCompare: (car: CompareItem) => void;
  clearCompare: () => void;
};

const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      compareItems: [],
      isComparing: (id: string) => get().compareItems.some(item => item.id === id),
      toggleCompare: (car: CompareItem) => {
        set((state) => {
          const isCurrentlyComparing = state.compareItems.some(item => item.id === car.id);
          
          if (isCurrentlyComparing) {
            return {
              compareItems: state.compareItems.filter((item) => item.id !== car.id),
            };
          }
          
          if (state.compareItems.length >= 4) {
            // Optional: Add a toast notification here to inform the user
            return state; // Do not add more than 4 items
          }
          
          return { compareItems: [...state.compareItems, car] };
        });
      },
      clearCompare: () => {
        set({ compareItems: [] });
      }
    }),
    {
      name: 'compare-cars-storage-v2', // Changed name to avoid conflicts with old structure
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCompareStore;
