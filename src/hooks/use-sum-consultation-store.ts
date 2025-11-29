'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Car } from '@/lib/placeholder-data';

type ConsultationItem = Car;

type SumConsultationState = {
  items: ConsultationItem[];
  addItem: (item: ConsultationItem) => void;
  removeItem: (id: string) => void;
  clearItems: () => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
};

const useSumConsultationStore = create<SumConsultationState>()(
  persist(
    (set) => ({
      items: [],
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      addItem: (item) => {
        set((state) => {
          if (state.items.some(i => i.id === item.id)) {
            return state; // Do not add duplicates
          }
          if (state.items.length >= 10) {
            // Optional: Add a toast notification here to inform the user about the limit
            return state; // Limit the number of items
          }
          return { items: [...state.items, item] };
        });
      },
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },
      clearItems: () => set({ items: [] }),
    }),
    {
      name: 'sum-consultation-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state.setHasHydrated(true);
      },
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export default useSumConsultationStore;
