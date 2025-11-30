
'use client';

import { useState } from 'react';
import type { Car } from '@/lib/placeholder-data';
import CarFilters from './car-filters';
import CatalogResults from './catalog-results';
import ActiveFilters from './active-filters';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, Sparkles } from 'lucide-react';
import useCarFilters from '@/hooks/use-car-filters';
import type { ViewMode } from '@/hooks/use-car-filters';
import { Skeleton } from '@/components/ui/skeleton';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';


type CarCatalogClientProps = {
  dict: any;
  lang: string;
};

function CatalogSkeleton() {
  return (
    <div className="grid lg:grid-cols-[320px_1fr] lg:gap-8 items-start">
      <aside className="hidden lg:block">
        <Skeleton className="h-[700px] w-full" />
      </aside>
      <main>
        <div className="text-center mb-12">
          <Skeleton className="h-12 w-1/2 mx-auto" />
          <Skeleton className="h-6 w-3/4 mx-auto mt-4" />
        </div>
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <Skeleton className="h-6 w-24" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 items-start gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-96 w-full" />
          ))}
        </div>
      </main>
    </div>
  )
}

export default function CarCatalogClient({ dict, lang }: CarCatalogClientProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const firestore = useFirestore();

  const carsCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'cars');
  }, [firestore]);

  const { data: allCars, isLoading } = useCollection<Car>(carsCollection);

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
    handleResetSingleFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    totalResults,
    viewMode,
    setViewMode,
  } = useCarFilters(allCars || [], 9);

  if (isLoading || !dict) {
    return <div className="container py-8 md:py-12 pt-24 md:pt-32"><CatalogSkeleton /></div>;
  }

  const filtersComponent = (
    <div className="p-4">
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
    </div>
  );

  return (
    <div className="container py-8 md:py-12 pt-24 md:pt-32">
      {/* Enhanced Header Section */}
      <div className="text-center mb-12 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-semibold text-primary mb-6">
          <Sparkles className="h-4 w-4" />
          <span>{dict.car_catalog.badge || 'Premium Selection'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter font-headline mb-4">
          {dict.car_catalog.title}
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {dict.car_catalog.description}
        </p>
      </div>

      <div className="grid lg:grid-cols-[320px_1fr] gap-6 lg:gap-8 items-start">
        {/* Desktop Filters */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-xl border-2 border-border bg-background shadow-sm">
            {filtersComponent}
          </div>
        </aside>

        <main>
          {/* Mobile Filters Trigger */}
          <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <SheetTrigger asChild className="lg:hidden mb-4 w-full">
              <Button variant="outline" size="lg" className="w-full">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                {dict.car_catalog.filters_title}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle>{dict.car_catalog.filters_title}</SheetTitle>
              </SheetHeader>
              {filtersComponent}
            </SheetContent>
          </Sheet>

          <ActiveFilters
            filters={{
              make: selectedMake,
              types: selectedTypes,
              price: priceRange,
              year: yearRange,
            }}
            minPrice={minPrice}
            maxPrice={maxPrice}
            minYear={minYear}
            maxYear={maxYear}
            onResetFilter={handleResetSingleFilter}
            onResetAll={handleResetFilters}
            dict={dict}
          />

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
          />
        </main>
      </div>
    </div>
  );
}
