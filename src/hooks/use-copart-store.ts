
'use client';

import { create } from 'zustand';
import type { NormalizedVehicle } from '@/lib/vehicle-normalizer';

type CopartState = {
  results: Record<string, NormalizedVehicle>; // Store by lot number for fast lookup
  addResults: (results: NormalizedVehicle[]) => void;
  getResultByLot: (lot: string) => NormalizedVehicle | undefined;
  clearResults: () => void; // Para limpiar cuando cambia la búsqueda
};

const useCopartStore = create<CopartState>()((set, get) => ({
  results: {},
  addResults: (newResults: NormalizedVehicle[]) => {
    console.log(`[Store] 📥 addResults called with ${newResults.length} vehicles`);
    console.log(`[Store] 📊 Current store size BEFORE: ${Object.keys(get().results).length}`);
    
    set((state) => {
      const newResultsMap = newResults.reduce((acc, vehicle) => {
        if (vehicle.lot_number) {
          acc[vehicle.lot_number] = vehicle;
        }
        return acc;
      }, {} as Record<string, NormalizedVehicle>);
      
      const updatedResults = { ...state.results, ...newResultsMap };
      console.log(`[Store] 📊 Store size AFTER: ${Object.keys(updatedResults).length}`);
      console.log(`[Store] 📋 New lot numbers:`, Object.keys(newResultsMap).slice(0, 5));
      
      return {
        results: updatedResults,
      };
    });
  },
  getResultByLot: (lot: string) => {
    return get().results[lot];
  },
  clearResults: () => {
    console.log('[Store] 🗑️ Clearing all results from store');
    set({ results: {} });
  },
}));

export default useCopartStore;
