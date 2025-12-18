'use client';

interface VehiclesCounterProps {
  totalLoaded: number;
}

export function VehiclesCounter({ totalLoaded }: VehiclesCounterProps) {
  if (totalLoaded === 0) return null;

  return (
    <div className="text-sm text-muted-foreground">
      📊 {totalLoaded} vehículos cargados
    </div>
  );
}
