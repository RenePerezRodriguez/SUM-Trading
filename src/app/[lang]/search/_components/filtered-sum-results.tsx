'use client';

import { useState } from 'react';
import type { Car } from '@/lib/placeholder-data';
import useCarFilters from '@/hooks/use-car-filters';
import CarFilters from '../../cars/_components/car-filters';
import CatalogResults from '../../cars/_components/catalog-results';
import { Sheet, SheetContent } from "@/components/ui/sheet";

export default function FilteredSumResults({ initialCars, lang, dict }: { initialCars: Car[]; lang: string; dict: any }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const {
    paginatedCars,
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
    minPrice,
    maxPrice,
    yearRange,
    setYearRange,
    minYear,
    maxYear,
    sortOrder,
    setSortOrder,
    handleResetFilters,
    currentPage,
    setCurrentPage,
    totalPages,
    totalResults,
    viewMode,
    setViewMode,
  } = useCarFilters(initialCars, 6);

  const FilterComponent = (
    <CarFilters
      dict={dict}
      makes={makes}
      types={types}
      naturalQuery={naturalQuery}
      setNaturalQuery={setNaturalQuery}
      isAiSearchLoading={isAiSearchLoading}
      selectedMake={selectedMake}
      setSelectedMake={setSelectedMake}
      selectedTypes={selectedTypes}
      setSelectedTypes={setSelectedTypes}
      priceRange={priceRange}
      setPriceRange={setPriceRange}
      minPrice={minPrice}
      maxPrice={maxPrice}
      yearRange={yearRange}
      setYearRange={setYearRange}
      minYear={minYear}
      maxYear={maxYear}
      onReset={handleResetFilters}
    />
  );

  return (
    <div className="grid lg:grid-cols-[300px_1fr] gap-4 lg:gap-8 items-start mt-6">
      <aside className="hidden lg:block">
        <div className="rounded-lg border p-4 sticky top-24">
          {FilterComponent}
        </div>
      </aside>
      
      {/* Mobile Filters Sheet */}
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto p-6">
          <div className="mt-4">
            {FilterComponent}
          </div>
        </SheetContent>
      </Sheet>

      <main>
        <CatalogResults
          cars={paginatedCars}
          dict={dict}
          lang={lang}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          viewMode={viewMode}
          setViewMode={setViewMode}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          totalResults={totalResults}
          onOpenFilters={() => setIsFilterOpen(true)}
        />
      </main>
    </div>
  );
}
