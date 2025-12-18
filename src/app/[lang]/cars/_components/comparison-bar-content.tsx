'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Scale, Trash2 } from 'lucide-react';
import ComparisonCarList from './comparison-car-list';
import type { CarImage } from '@/lib/placeholder-data';

type CompareItem = {
  id: string;
  make: string;
  model: string;
  image: CarImage | null;
};

type ComparisonBarContentProps = {
  compareItems: CompareItem[];
  toggleCompare: (car: CompareItem) => void;
  clearCompare: () => void;
  openModal: () => void;
  dict: any;
};

export default function ComparisonBarContent({
  compareItems,
  toggleCompare,
  clearCompare,
  openModal,
  dict,
}: ComparisonBarContentProps) {
  return (
    <motion.div
      initial={{ y: 150 }}
      animate={{ y: 0 }}
      exit={{ y: 150 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4"
    >
      <div className="bg-secondary/95 backdrop-blur-sm p-4 rounded-lg shadow-2xl border border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 w-full max-w-4xl">
        <div className="flex w-full items-center gap-4">
          <p className="font-bold text-lg hidden sm:block whitespace-nowrap">
            {dict.car_catalog.compare_title}:
          </p>
          <div className="flex-1 flex items-center gap-2 overflow-x-auto min-w-0 pb-2 -mb-2">
            <ComparisonCarList
              compareItems={compareItems}
              toggleCompare={toggleCompare}
              dict={dict}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto flex-shrink-0 mt-4 sm:mt-0">
          <Button onClick={openModal} disabled={compareItems.length < 2} className="w-full sm:w-auto">
            <Scale className="mr-2 h-4 w-4" />
            {dict.car_catalog.compare_button} ({compareItems.length})
          </Button>
          {compareItems.length > 0 && (
            <Button variant="ghost" size="icon" onClick={clearCompare} aria-label="Limpiar comparación">
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
