import React from 'react';
import { Button } from '@/components/ui/button';
import { VehiclesCounter } from '../ui/vehicles-counter';
import { SlidersHorizontal, LayoutGrid, List } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FilterToolbarSectionProps {
  currentView: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
  sortBy: 'date' | 'price' | 'mileage';
  onSortChange: (sort: 'date' | 'price' | 'mileage') => void;
  onOpenFilters: () => void;
  totalLoadedVehicles: number;
}

export function FilterToolbarSection({
  currentView,
  onViewChange,
  sortBy,
  onSortChange,
  onOpenFilters,
  totalLoadedVehicles,
}: FilterToolbarSectionProps) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 p-4 rounded-xl border-2 border-border bg-secondary/20">
      {/* Counter with animated dot */}
      <div className="flex items-center gap-2 w-full md:w-auto justify-center md:justify-start">
        <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
        <VehiclesCounter totalLoaded={totalLoadedVehicles} />
      </div>
      
      {/* View controls and sort */}
      <div className="flex flex-wrap items-center justify-center gap-3 w-full md:w-auto">
        <div className="flex items-center gap-1 p-1 rounded-lg bg-background border">
          <Button 
            variant={currentView === 'list' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => onViewChange('list')}
            aria-label="Vista de lista"
            className="transition-all"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button 
            variant={currentView === 'grid' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => onViewChange('grid')}
            aria-label="Vista de cuadrícula"
            className="transition-all"
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
        </div>
        
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px] bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Más recientes</SelectItem>
            <SelectItem value="price">Precio</SelectItem>
            <SelectItem value="mileage">Kilometraje</SelectItem>
          </SelectContent>
        </Select>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenFilters}
          className="gap-2 hover:border-primary/50 transition-colors"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtros
        </Button>
      </div>
    </div>
  );
}
