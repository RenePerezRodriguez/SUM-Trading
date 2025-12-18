'use client';

import { useState, useMemo, useEffect } from 'react';
import type { NormalizedVehicle } from '@/lib/vehicle-normalizer';

export type ViewMode = 'list' | 'grid';

export default function useCopartFilters(allCars: NormalizedVehicle[], itemsPerPage: number = 9) {
  const [sortOrder, setSortOrder] = useState('price_asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('list'); // Default to list view
  
  const filteredAndSortedCars = useMemo(() => {
    if (!allCars) return [];
    
    return [...allCars].sort((a, b) => {
        const priceA = a.current_bid || 0;
        const priceB = b.current_bid || 0;
        const yearA = a.year || 0;
        const yearB = b.year || 0;

        switch (sortOrder) {
            case 'price_desc':
            return priceB - priceA;
            case 'year_desc':
            return yearB - yearA;
            case 'price_asc':
            default:
            return priceA - priceB;
      }
    });
  }, [allCars, sortOrder]);

  const totalResults = filteredAndSortedCars.length;
  const totalPages = Math.ceil(totalResults / itemsPerPage);

  const paginatedCars = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedCars.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedCars, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortOrder]);

  return {
    paginatedCars,
    totalResults,
    totalPages,
    currentPage,
    setCurrentPage,
    sortOrder,
    setSortOrder,
    viewMode,
    setViewMode,
  };
}
