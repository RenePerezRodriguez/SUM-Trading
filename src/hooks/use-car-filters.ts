
'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { Car } from '@/lib/placeholder-data';
import { useDebounce } from 'use-debounce';

export type ViewMode = 'list' | 'grid';

// Get min/max values for filters
const getMinMax = (cars: Car[], key: keyof Car, defaultRange: [number, number] = [0, 0]): [number, number] => {
    if (cars.length === 0) return defaultRange;
    const values = cars.map(c => c[key] as number).filter(v => v && !isNaN(v));
    if (values.length === 0) return defaultRange;
    const min = Math.floor(Math.min(...values));
    const max = Math.ceil(Math.max(...values));
    // Ensure we don't return Infinity if all values are invalid
    return [isFinite(min) ? min : 0, isFinite(max) ? max : 0];
  };

export default function useCarFilters(allCars: Car[], itemsPerPage: number = 9) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Show all cars, not just available ones.
  const carsToShow = allCars;

  const [initialMinPrice, initialMaxPrice] = useMemo(() => getMinMax(carsToShow, 'price', [0, 250000]), [carsToShow]);
  const [initialMinYear, initialMaxYear] = useMemo(() => getMinMax(carsToShow, 'year', [1950, new Date().getFullYear()]), [carsToShow]);

  // Function to initialize state from URL or defaults
  const initializeState = useCallback(<T>(key: string, defaultValue: T, parser: (value: string) => T): T => {
    const value = searchParams.get(key);
    return value ? parser(value) : defaultValue;
  }, [searchParams]);

  const [naturalQuery, setNaturalQuery] = useState(() => initializeState('query', '', String));
  const [isAiSearchLoading, setIsAiSearchLoading] = useState(false);
  const [debouncedNaturalQuery] = useDebounce(naturalQuery, 1000);

  // Initialize filters with placeholders until real data is loaded
  const [selectedMake, setSelectedMake] = useState(() => initializeState('make', 'all', String));
  const [selectedTypes, setSelectedTypes] = useState<string[]>(() => initializeState('types', [], (v) => v.split(',')));
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [yearRange, setYearRange] = useState<[number, number]>([0, 0]);
  const [sortOrder, setSortOrder] = useState(() => initializeState('sort', 'price_asc', String));
  const [currentPage, setCurrentPage] = useState(() => initializeState('page', 1, Number));
  const [viewMode, setViewMode] = useState<ViewMode>(() => initializeState('view', 'list', (v) => v as ViewMode));


  const makes = useMemo(() => ['all', ...Array.from(new Set(carsToShow.map((car) => car.make)))], [carsToShow]);
  const types = useMemo(() => ['SUV', 'Sedan', 'Truck'], []);
  
  // Effect to set initial ranges once data is loaded
  useEffect(() => {
    if (initialMaxPrice > 0) {
      setPriceRange(initializeState('price', [initialMinPrice, initialMaxPrice], (v) => {
        const parts = v.split(',');
        return [Number(parts[0]), Number(parts[1])];
      }));
    }
    if (initialMaxYear > 0) {
      setYearRange(initializeState('year', [initialMinYear, initialMaxYear], (v) => {
        const parts = v.split(',');
        return [Number(parts[0]), Number(parts[1])];
      }));
    }
  }, [initialMinPrice, initialMaxPrice, initialMinYear, initialMaxYear, initializeState]);

  useEffect(() => {
    if (initialMaxPrice === 0 && initialMaxYear === 0) return;

    const params = new URLSearchParams(window.location.search);
    const updateParam = (key: string, value: string, condition: boolean) => {
        if (condition) params.set(key, value); else params.delete(key);
    };

    updateParam('query', naturalQuery, !!naturalQuery);
    updateParam('make', selectedMake, selectedMake !== 'all');
    updateParam('types', selectedTypes.join(','), selectedTypes.length > 0);
    updateParam('price', `${priceRange[0]},${priceRange[1]}`, priceRange[0] !== initialMinPrice || priceRange[1] !== initialMaxPrice);
    updateParam('year', `${yearRange[0]},${yearRange[1]}`, yearRange[0] !== initialMinYear || yearRange[1] !== initialMaxYear);
    updateParam('sort', sortOrder, sortOrder !== 'price_asc');
    updateParam('page', currentPage.toString(), currentPage !== 1);
    updateParam('view', viewMode, viewMode !== 'list');

    const handler = setTimeout(() => {
        const newUrl = `${pathname}?${params.toString()}`;
        window.history.pushState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl);
    }, 300);

    return () => clearTimeout(handler);
}, [naturalQuery, selectedMake, selectedTypes, priceRange, yearRange, sortOrder, currentPage, viewMode, pathname, initialMinPrice, initialMaxPrice, initialMinYear, initialMaxYear]);


  useEffect(() => {
    setCurrentPage(1);
  }, [naturalQuery, selectedMake, selectedTypes, priceRange, yearRange, sortOrder]);


  const filteredAndSortedCars = useMemo(() => {
    if (carsToShow.length === 0) return [];
    
    let filtered = carsToShow;

    if (selectedMake !== 'all') {
      filtered = filtered.filter((car) => car.make === selectedMake);
    }
    
    if (selectedTypes.length > 0) {
        filtered = filtered.filter(car => selectedTypes.some(type => car.type === type));
    }
    
    filtered = filtered.filter(car => car.price >= priceRange[0] && car.price <= priceRange[1]);
    filtered = filtered.filter(car => car.year >= yearRange[0] && car.year <= yearRange[1]);

    if (naturalQuery && !isAiSearchLoading) {
        const lowerCaseQuery = naturalQuery.toLowerCase();
        const noOtherFilters = selectedMake === 'all' && selectedTypes.length === 0 && priceRange[0] === initialMinPrice && priceRange[1] === initialMaxPrice && yearRange[0] === initialMinYear && yearRange[1] === initialMaxYear;
        
        if (noOtherFilters) {
            filtered = filtered.filter(car => 
                car.description.toLowerCase().includes(lowerCaseQuery) || 
                car.make.toLowerCase().includes(lowerCaseQuery) || 
                car.model.toLowerCase().includes(lowerCaseQuery)
            );
        }
    }

    return [...filtered].sort((a, b) => {
      switch (sortOrder) {
        case 'price_desc':
          return b.price - a.price;
        case 'year_desc':
          return b.year - a.year;
        case 'price_asc':
        default:
          return a.price - b.price;
      }
    });
  }, [carsToShow, selectedMake, sortOrder, naturalQuery, selectedTypes, priceRange, yearRange, isAiSearchLoading, initialMinPrice, initialMaxPrice, initialMinYear, initialMaxYear]);

  const totalResults = filteredAndSortedCars.length;
  const totalPages = Math.ceil(totalResults / itemsPerPage);

  const paginatedCars = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedCars.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedCars, currentPage, itemsPerPage]);

  const handleResetFilters = useCallback(() => {
    setNaturalQuery('');
    setSelectedMake('all');
    setSelectedTypes([]);
    setPriceRange([initialMinPrice, initialMaxPrice]);
    setYearRange([initialMinYear, initialMaxYear]);
    setSortOrder('price_asc');
    setCurrentPage(1);
  }, [initialMinPrice, initialMaxPrice, initialMinYear, initialMaxYear]);
  
  const handleResetSingleFilter = useCallback((filter: 'make' | 'types' | 'price' | 'year' | 'query') => {
    switch(filter) {
      case 'make':
        setSelectedMake('all');
        break;
      case 'types':
        setSelectedTypes([]);
        break;
      case 'price':
        setPriceRange([initialMinPrice, initialMaxPrice]);
        break;
      case 'year':
        setYearRange([initialMinYear, initialMaxYear]);
        break;
      case 'query':
        setNaturalQuery('');
        break;
    }
    setCurrentPage(1);
  }, [initialMinPrice, initialMaxPrice, initialMinYear, initialMaxYear]);

  return {
    filteredAndSortedCars,
    paginatedCars,
    totalResults,
    totalPages,
    currentPage,
    setCurrentPage,
    makes,
    types,
    naturalQuery,
    setNaturalQuery,
    isAiSearchLoading,
    selectedMake,
    setSelectedMake,
    selectedTypes,
    setSelectedTypes,
    priceRange,
    setPriceRange,
    minPrice: initialMinPrice,
    maxPrice: initialMaxPrice,
    yearRange,
    setYearRange,
    minYear: initialMinYear,
    maxYear: initialMaxYear,
    sortOrder,
    setSortOrder,
    handleResetFilters,
    handleResetSingleFilter,
    viewMode,
    setViewMode,
  };
}

    