
'use client';

import { useState, useMemo, useEffect } from 'react';
import useCompareStore from '@/hooks/use-compare-store';
import useFavoriteStore, { useFavoriteSync } from '@/hooks/use-favorite-store';
import type { Car } from '@/lib/placeholder-data';
import ComparisonBarContent from './comparison-bar-content';
import ComparisonModal from './comparison-modal';
import { AnimatePresence } from 'framer-motion';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

type ComparisonBarProps = {
  lang: string;
  dict: any;
}

export default function ComparisonBar({ lang, dict }: ComparisonBarProps) {
  useFavoriteSync();
  const firestore = useFirestore();
  const { compareItems, toggleCompare, clearCompare } = useCompareStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const carsCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'cars');
  }, [firestore]);

  const { data: allCars } = useCollection<Car>(carsCollection);

  const carsForModal = useMemo(() => {
    if (!allCars) return [];
    const compareIdSet = new Set(compareItems.map(item => item.id));
    return allCars.filter(car => compareIdSet.has(car.id));
  }, [allCars, compareItems]);

  const showBar = compareItems.length > 0;

  if (!allCars || !showBar) {
    return null;
  }

  const toggleCompareWithImage = (car: any) => {
    const mainImage = car.images && car.images.length > 0 ? car.images[0] : { url: '', hint: '' };
    toggleCompare({
      id: car.id,
      make: car.make,
      model: car.model,
      image: mainImage,
    });
  }

  return (
    <>
      <AnimatePresence>
        {showBar && (
          <ComparisonBarContent
            compareItems={compareItems}
            toggleCompare={toggleCompareWithImage}
            clearCompare={clearCompare}
            openModal={() => setIsModalOpen(true)}
            dict={dict}
          />
        )}
      </AnimatePresence>

      <ComparisonModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        cars={carsForModal}
        dict={dict}
        lang={lang}
      />
    </>
  );
}
