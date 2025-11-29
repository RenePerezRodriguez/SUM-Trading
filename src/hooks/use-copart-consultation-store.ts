'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { NormalizedVehicle } from '@/lib/vehicle-normalizer';

type ConsultationItem = Pick<NormalizedVehicle, 'lot_number' | 'title' | 'imageUrl' | 'url'>;

type CopartConsultationState = {
  items: ConsultationItem[];
  addItem: (item: ConsultationItem) => void;
  removeItem: (lot_number: string | null) => void;
  clearItems: () => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
};

const useCopartConsultationStore = create<CopartConsultationState>()(
  persist(
    (set, get) => ({
      items: [],
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      addItem: (item) => {
        set((state) => {
          if (state.items.some(i => i.lot_number === item.lot_number)) {
            return state; // Do not add duplicates
          }
          if (state.items.length >= 10) {
            // Optional: Add a toast notification here to inform the user about the limit
            return state; // Limit the number of items
          }
          return { items: [...state.items, item] };
        });
      },
      removeItem: (lot_number) => {
        if (!lot_number) return;
        set((state) => ({
          items: state.items.filter((item) => item.lot_number !== lot_number),
        }));
      },
      clearItems: () => set({ items: [] }),
    }),
    {
      name: 'copart-consultation-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state.setHasHydrated(true);
      },
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export default useCopartConsultationStore;
