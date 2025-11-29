import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BrokerCarCard } from '@/components/broker-car-card';
import BrokerCarListItem from './broker-car-list-item';
import type { NormalizedVehicle } from '@/lib/vehicle-normalizer';

interface VehicleGridProps {
  vehicles: NormalizedVehicle[];
  currentView: 'grid' | 'list';
  lang?: string;
  dict?: any;
  query?: string; // Query actual para pasarlo a la página de detalle
}

export function VehicleGrid({ vehicles, currentView, lang = 'es', dict = {}, query }: VehicleGridProps) {
  if (currentView === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {vehicles.map((vehicle) => (
            <motion.div
              key={vehicle.lot_number}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <BrokerCarCard car={vehicle} lang={lang} dict={dict} query={query} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {vehicles.map((vehicle) => (
          <motion.div
            key={vehicle.lot_number}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <BrokerCarListItem car={vehicle} lang={lang} dict={dict} query={query} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
