'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, RotateCcw } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

type ActiveFiltersProps = {
  filters: {
    make: string;
    types: string[];
    price: [number, number];
    year: [number, number];
  };
  minPrice: number;
  maxPrice: number;
  minYear: number;
  maxYear: number;
  onResetFilter: (filter: 'make' | 'types' | 'price' | 'year' | 'query') => void;
  onResetAll: () => void;
  dict: any;
};

export default function ActiveFilters({
  filters,
  minPrice,
  maxPrice,
  minYear,
  maxYear,
  onResetFilter,
  onResetAll,
  dict,
}: ActiveFiltersProps) {

  const lang = dict.lang === 'es-ES' ? 'es' : 'en';

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(lang, { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
  }

  const activeFilterPills = [];

  if (filters.make !== 'all') {
    activeFilterPills.push({
      key: 'make',
      label: `${dict.car_catalog.make_filter_title}: ${filters.make}`,
      action: () => onResetFilter('make'),
    });
  }

  if (filters.types.length > 0) {
    activeFilterPills.push({
      key: 'types',
      label: `${dict.car_catalog.type_filter_title}: ${filters.types.join(', ')}`,
      action: () => onResetFilter('types'),
    });
  }

  if (filters.price[0] !== minPrice || filters.price[1] !== maxPrice) {
    activeFilterPills.push({
      key: 'price',
      label: `${dict.car_catalog.price_range_title}: ${formatCurrency(filters.price[0])} - ${formatCurrency(filters.price[1])}`,
      action: () => onResetFilter('price'),
    });
  }

  if (filters.year[0] !== minYear || filters.year[1] !== maxYear) {
    activeFilterPills.push({
      key: 'year',
      label: `${dict.car_catalog.year_range_title}: ${filters.year[0]} - ${filters.year[1]}`,
      action: () => onResetFilter('year'),
    });
  }

  if (activeFilterPills.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 pb-6 border-b">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-muted-foreground">{dict.car_catalog.active_filters}</h4>
        <Button variant="ghost" size="sm" onClick={onResetAll} className="text-muted-foreground">
            <RotateCcw className="w-3 h-3 mr-2" />
            {dict.car_catalog.clear_all}
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {activeFilterPills.map((pill) => (
            <motion.div
              key={pill.key}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <Badge variant="secondary" className="text-sm py-1.5 pr-2 pl-3">
                {pill.label}
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={pill.action}
                  className="ml-2 h-5 w-5 rounded-full"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
