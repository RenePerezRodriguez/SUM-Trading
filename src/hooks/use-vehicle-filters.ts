'use client';

import { useState, useEffect } from 'react';
import type { NormalizedVehicle } from '@/lib/vehicle-normalizer';

export interface FilterOptions {
  damage: string[];
  engineType: string[];
  transmission: string[];
  priceRange: [number, number]; // [min, max]
  miles: [number, number]; // [min, max]
}

const DEFAULT_FILTERS: FilterOptions = {
  damage: [],
  engineType: [],
  transmission: [],
  priceRange: [0, 100000],
  miles: [0, 300000],
};

export function useVehicleFilters(vehicles: NormalizedVehicle[]) {
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);
  const [filteredVehicles, setFilteredVehicles] = useState<NormalizedVehicle[]>(vehicles);

  // Extract unique values for filter options
  const damageOptions = Array.from(new Set(
    vehicles
      .map(v => v.primary_damage)
      .filter((v): v is string => v !== null && v !== undefined && v !== '')
      .sort()
  ));

  const engineOptions = Array.from(new Set(
    vehicles
      .map(v => v.engine_type)
      .filter((v): v is string => v !== null && v !== undefined && v !== '')
      .sort()
  ));

  const transmissionOptions = Array.from(new Set(
    vehicles
      .map(v => v.transmission)
      .filter((v): v is string => v !== null && v !== undefined && v !== '')
      .sort()
  ));

  // Apply filters whenever filters or vehicles change
  useEffect(() => {
    const filtered = vehicles.filter(vehicle => {
      // Damage filter
      if (filters.damage.length > 0 && !filters.damage.includes(vehicle.primary_damage || '')) {
        return false;
      }

      // Engine filter
      if (filters.engineType.length > 0 && !filters.engineType.includes(vehicle.engine_type || '')) {
        return false;
      }

      // Transmission filter
      if (filters.transmission.length > 0 && !filters.transmission.includes(vehicle.transmission || '')) {
        return false;
      }

      // Price range filter
      const price = vehicle.current_bid || 0;
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
        return false;
      }

      // Miles filter
      const miles = typeof vehicle.odometer === 'string' 
        ? parseInt(vehicle.odometer) || 0 
        : vehicle.odometer || 0;
      if (miles < filters.miles[0] || miles > filters.miles[1]) {
        return false;
      }

      return true;
    });

    setFilteredVehicles(filtered);
  }, [filters, vehicles]);

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleDamage = (damage: string) => {
    setFilters(prev => ({
      ...prev,
      damage: prev.damage.includes(damage)
        ? prev.damage.filter(d => d !== damage)
        : [...prev.damage, damage]
    }));
  };

  const toggleEngineType = (engine: string) => {
    setFilters(prev => ({
      ...prev,
      engineType: prev.engineType.includes(engine)
        ? prev.engineType.filter(e => e !== engine)
        : [...prev.engineType, engine]
    }));
  };

  const toggleTransmission = (trans: string) => {
    setFilters(prev => ({
      ...prev,
      transmission: prev.transmission.includes(trans)
        ? prev.transmission.filter(t => t !== trans)
        : [...prev.transmission, trans]
    }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const hasActiveFilters = () => {
    return (
      filters.damage.length > 0 ||
      filters.engineType.length > 0 ||
      filters.transmission.length > 0 ||
      filters.priceRange[0] !== 0 ||
      filters.priceRange[1] !== 100000 ||
      filters.miles[0] !== 0 ||
      filters.miles[1] !== 300000
    );
  };

  return {
    filters,
    filteredVehicles,
    damageOptions,
    engineOptions,
    transmissionOptions,
    updateFilter,
    toggleDamage,
    toggleEngineType,
    toggleTransmission,
    resetFilters,
    hasActiveFilters,
  };
}
