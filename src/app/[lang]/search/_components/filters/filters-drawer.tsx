'use client';

import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { FilterOptions } from '@/hooks/use-vehicle-filters';

interface FiltersDrawerProps {
  filters: FilterOptions;
  damageOptions: string[];
  engineOptions: string[];
  transmissionOptions: string[];
  onToggleDamage: (damage: string) => void;
  onToggleEngine: (engine: string) => void;
  onToggleTransmission: (trans: string) => void;
  onPriceChange: (range: [number, number]) => void;
  onMilesChange: (range: [number, number]) => void;
  onReset: () => void;
  isOpen: boolean;
  onClose: () => void;
  activeCount: number;
}

export function FiltersDrawer({
  filters,
  damageOptions,
  engineOptions,
  transmissionOptions,
  onToggleDamage,
  onToggleEngine,
  onToggleTransmission,
  onPriceChange,
  onMilesChange,
  onReset,
  isOpen,
  onClose,
  activeCount
}: FiltersDrawerProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('damage');

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed left-0 top-0 bottom-0 w-80 bg-white shadow-lg z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Filtros</h2>
          <div className="flex items-center gap-2">
            {activeCount > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                {activeCount}
              </span>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Damage Filter */}
          <Card className="p-3">
            <button
              onClick={() => setExpandedSection(expandedSection === 'damage' ? null : 'damage')}
              className="w-full flex items-center justify-between font-semibold text-sm hover:text-primary"
            >
              Daño Primario
              <ChevronDown className={cn('h-4 w-4 transition-transform', expandedSection === 'damage' && 'rotate-180')} />
            </button>
            {expandedSection === 'damage' && (
              <div className="mt-3 space-y-2">
                {damageOptions.map(damage => (
                  <label key={damage} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.damage.includes(damage)}
                      onChange={() => onToggleDamage(damage)}
                      className="rounded"
                    />
                    <span className="text-sm">{damage}</span>
                  </label>
                ))}
              </div>
            )}
          </Card>

          {/* Engine Filter */}
          <Card className="p-3">
            <button
              onClick={() => setExpandedSection(expandedSection === 'engine' ? null : 'engine')}
              className="w-full flex items-center justify-between font-semibold text-sm hover:text-primary"
            >
              Motor
              <ChevronDown className={cn('h-4 w-4 transition-transform', expandedSection === 'engine' && 'rotate-180')} />
            </button>
            {expandedSection === 'engine' && (
              <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                {engineOptions.map(engine => (
                  <label key={engine} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.engineType.includes(engine)}
                      onChange={() => onToggleEngine(engine)}
                      className="rounded"
                    />
                    <span className="text-sm">{engine}</span>
                  </label>
                ))}
              </div>
            )}
          </Card>

          {/* Transmission Filter */}
          <Card className="p-3">
            <button
              onClick={() => setExpandedSection(expandedSection === 'transmission' ? null : 'transmission')}
              className="w-full flex items-center justify-between font-semibold text-sm hover:text-primary"
            >
              Transmisión
              <ChevronDown className={cn('h-4 w-4 transition-transform', expandedSection === 'transmission' && 'rotate-180')} />
            </button>
            {expandedSection === 'transmission' && (
              <div className="mt-3 space-y-2">
                {transmissionOptions.map(trans => (
                  <label key={trans} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.transmission.includes(trans)}
                      onChange={() => onToggleTransmission(trans)}
                      className="rounded"
                    />
                    <span className="text-sm">{trans}</span>
                  </label>
                ))}
              </div>
            )}
          </Card>

          {/* Price Range */}
          <Card className="p-3">
            <button
              onClick={() => setExpandedSection(expandedSection === 'price' ? null : 'price')}
              className="w-full flex items-center justify-between font-semibold text-sm hover:text-primary"
            >
              Rango de Precio
              <ChevronDown className={cn('h-4 w-4 transition-transform', expandedSection === 'price' && 'rotate-180')} />
            </button>
            {expandedSection === 'price' && (
              <div className="mt-3 space-y-3">
                <div>
                  <label className="text-xs text-gray-600">Mínimo: ${filters.priceRange[0].toLocaleString()}</label>
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="5000"
                    value={filters.priceRange[0]}
                    onChange={(e) => onPriceChange([parseInt(e.target.value), filters.priceRange[1]])}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Máximo: ${filters.priceRange[1].toLocaleString()}</label>
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="5000"
                    value={filters.priceRange[1]}
                    onChange={(e) => onPriceChange([filters.priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </Card>

          {/* Miles Range */}
          <Card className="p-3">
            <button
              onClick={() => setExpandedSection(expandedSection === 'miles' ? null : 'miles')}
              className="w-full flex items-center justify-between font-semibold text-sm hover:text-primary"
            >
              Rango de Millas
              <ChevronDown className={cn('h-4 w-4 transition-transform', expandedSection === 'miles' && 'rotate-180')} />
            </button>
            {expandedSection === 'miles' && (
              <div className="mt-3 space-y-3">
                <div>
                  <label className="text-xs text-gray-600">Mínimo: {filters.miles[0].toLocaleString()} mi</label>
                  <input
                    type="range"
                    min="0"
                    max="300000"
                    step="10000"
                    value={filters.miles[0]}
                    onChange={(e) => onMilesChange([parseInt(e.target.value), filters.miles[1]])}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Máximo: {filters.miles[1].toLocaleString()} mi</label>
                  <input
                    type="range"
                    min="0"
                    max="300000"
                    step="10000"
                    value={filters.miles[1]}
                    onChange={(e) => onMilesChange([filters.miles[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t p-4 space-y-2">
          <Button
            onClick={onReset}
            variant="outline"
            className="w-full"
          >
            Limpiar Filtros
          </Button>
          <Button
            onClick={onClose}
            className="w-full"
          >
            Ver Resultados ({Math.max(0, activeCount)})
          </Button>
        </div>
      </div>
    </>
  );
}
