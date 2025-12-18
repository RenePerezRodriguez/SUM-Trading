
'use client';

import { useMemo } from 'react';
import type { Car } from '@/lib/placeholder-data';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Frown } from 'lucide-react';
import FilteredSumResults from './filtered-sum-results';

export default function SumTradingResults({ query, lang, dict }: { query: string; lang: string; dict: any }) {
  const firestore = useFirestore();

  const carsCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'cars');
  }, [firestore]);

  const { data: allCars, isLoading } = useCollection<Car>(carsCollection);

  const initialFilteredCars = useMemo(() => {
    if (!allCars) return [];
    if (!query) return allCars;
    
    const lowerCaseQuery = query.toLowerCase();
    return allCars.filter(car => 
        (car.make?.toLowerCase().includes(lowerCaseQuery)) ||
        (car.model?.toLowerCase().includes(lowerCaseQuery)) ||
        (car.description?.toLowerCase().includes(lowerCaseQuery)) ||
        (car.year?.toString().includes(lowerCaseQuery))
    );
  }, [allCars, query]);

  if (isLoading) {
    return (
        <div className="grid lg:grid-cols-[300px_1fr] gap-8 mt-6">
            <Skeleton className="h-[600px] w-full hidden lg:block" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-96 w-full" />
                ))}
            </div>
      </div>
    );
  }
  
  if (initialFilteredCars.length === 0) {
    return (
      <div className="text-center py-16 bg-secondary/30 rounded-lg mt-6">
        <Frown className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-4 text-lg font-semibold">No se encontraron resultados</p>
        <p className="text-muted-foreground">No hay vehículos en nuestro inventario que coincidan con "{query}".</p>
      </div>
    );
  }

  return <FilteredSumResults initialCars={initialFilteredCars} lang={lang} dict={dict} />;
}
