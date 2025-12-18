'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { NormalizedVehicle } from '@/lib/vehicle-normalizer';
import { usePathname } from 'next/navigation';
import { getDictionary } from '@/lib/dictionaries';

interface VehicleComparatorProps {
  vehicles: NormalizedVehicle[];
  onClose: () => void;
  isOpen: boolean;
}

export function VehicleComparator({ vehicles, onClose, isOpen }: VehicleComparatorProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [dict, setDict] = useState<any>(null);
  const pathname = usePathname();
  const lang = pathname?.split('/')[1] || 'es';

  useEffect(() => {
    getDictionary(lang as 'en' | 'es').then(setDict);
  }, [lang]);

  const handleToggleSelect = (vehicleId: string) => {
    setSelected(prev => {
      if (prev.includes(vehicleId)) {
        return prev.filter(id => id !== vehicleId);
      } else if (prev.length < 4) {
        return [...prev, vehicleId];
      }
      return prev;
    });
  };

  const selectedVehicles = vehicles.filter(v => 
    selected.includes(v.lot_number || v.vin || '')
  );

  const canScroll = scrollIndex > 0 || scrollIndex + 3 < selectedVehicles.length;
  const visibleVehicles = selectedVehicles.slice(scrollIndex, scrollIndex + 3);

  if (!isOpen || !dict) return null;

  const comparisonFields = [
    { key: 'current_bid', label: dict.common.vehicle_comparator.price },
    { key: 'year', label: dict.common.vehicle_comparator.year },
    { key: 'odometer', label: dict.common.vehicle_comparator.mileage },
    { key: 'primary_damage', label: dict.common.vehicle_comparator.primary_damage },
    { key: 'engine', label: dict.common.vehicle_comparator.engine },
    { key: 'transmission', label: dict.common.vehicle_comparator.transmission },
    { key: 'drive', label: dict.common.vehicle_comparator.drive },
    { key: 'fuel', label: dict.common.vehicle_comparator.fuel },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-bold">
            {dict.common.vehicle_comparator.title} ({selected.length}/4)
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Comparison Table */}
        {selectedVehicles.length > 0 ? (
          <div className="overflow-x-auto">
            <div className="flex gap-4 p-4">
              {/* Scroll Controls */}
              {selectedVehicles.length > 3 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setScrollIndex(Math.max(0, scrollIndex - 1))}
                    disabled={scrollIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* Vehicle Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
                <AnimatePresence>
                  {visibleVehicles.map((vehicle, idx) => (
                    <motion.div
                      key={vehicle.lot_number || vehicle.vin}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border rounded-lg overflow-hidden"
                    >
                      {/* Vehicle Image */}
                      <div className="aspect-video bg-gray-200 overflow-hidden">
                        <img
                          src={vehicle.imageUrl || '/placeholder.jpg'}
                          alt={`${vehicle.make} ${vehicle.model}`}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Vehicle Info */}
                      <div className="p-3 space-y-2">
                        <h3 className="font-bold text-sm">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </h3>

                        {comparisonFields.map(field => (
                          <div key={field.key} className="flex justify-between text-xs">
                            <span className="text-gray-600">{field.label}:</span>
                            <span className="font-semibold">
                              {(vehicle as any)[field.key] || 'N/A'}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleToggleSelect(vehicle.lot_number || vehicle.vin || '')}
                        className="w-full rounded-none"
                      >
                        {dict.common.vehicle_comparator.remove_from_comparison}
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Scroll Right */}
              {selectedVehicles.length > 3 && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setScrollIndex(Math.min(selectedVehicles.length - 3, scrollIndex + 1))}
                  disabled={scrollIndex + 3 >= selectedVehicles.length}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p>{dict.common.vehicle_comparator.select_to_compare}</p>
          </div>
        )}

        {/* Selection List */}
        {vehicles.length > 0 && (
          <div className="border-t p-4">
            <p className="text-sm font-semibold mb-2">{dict.common.vehicle_comparator.select_vehicles}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {vehicles.slice(0, 12).map(vehicle => (
                <button
                  key={vehicle.lot_number || vehicle.vin}
                  onClick={() => handleToggleSelect(vehicle.lot_number || vehicle.vin || '')}
                  className={`p-2 rounded text-xs text-center transition-all ${
                    selected.includes(vehicle.lot_number || vehicle.vin || '')
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-gray-200 hover:bg-gray-300'
                  } ${selected.length === 4 && !selected.includes(vehicle.lot_number || vehicle.vin || '') ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={selected.length === 4 && !selected.includes(vehicle.lot_number || vehicle.vin || '')}
                >
                  {vehicle.year} {vehicle.make}
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
