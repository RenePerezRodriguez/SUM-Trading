'use client';

import { Sliders } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyPageMessageProps {
  currentPage: number;
  totalVehicles: number;
  onResetFilters: () => void;
}

export function EmptyPageMessage({ currentPage, totalVehicles, onResetFilters }: EmptyPageMessageProps) {
  return (
    <div className="col-span-full text-center py-16 bg-secondary/30 rounded-lg">
      <Sliders className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <p className="text-lg font-semibold">
        No hay vehículos en esta página con los filtros actuales
      </p>
      <p className="text-sm text-muted-foreground mt-2">
        Hay {totalVehicles} vehículos cargados, pero ninguno en la página {currentPage} cumple los filtros.
      </p>
      <Button 
        onClick={onResetFilters}
        variant="outline"
        className="mt-4"
      >
        Limpiar filtros
      </Button>
    </div>
  );
}
