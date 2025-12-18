'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SearchTimeCounterProps {
  isSearching: boolean;
}

export function SearchTimeCounter({ isSearching }: SearchTimeCounterProps) {
  const [elapsed, setElapsed] = useState(0);
  const [vehicleCount, setVehicleCount] = useState(0);

  useEffect(() => {
    if (!isSearching) {
      setElapsed(0);
      setVehicleCount(0);
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.floor((now - startTime) / 1000);
      setElapsed(diff);
      
      // Simular incremento de vehículos encontrados para dar sensación de progreso
      // Los números aumentan progresivamente para dar feedback visual
      const simulatedCount = Math.floor(diff * 2) + Math.floor(Math.random() * 3);
      setVehicleCount(Math.min(simulatedCount, 999));
    }, 300);

    return () => clearInterval(interval);
  }, [isSearching]);

  if (!isSearching) {
    return null;
  }

  const messages = [
    'Conectando con Copart...',
    'Buscando en subastas...',
    'Filtrando vehículos...',
    'Organizando resultados...',
    'Un momento más...',
  ];
  
  const messageIndex = Math.min(Math.floor(elapsed / 15), messages.length - 1);
  const currentMessage = messages[messageIndex];

  return (
    <TooltipProvider>
      <div className="flex items-center justify-center gap-4 py-8 px-4 bg-secondary/50 rounded-lg">
        <Loader2 className="w-6 h-6 text-primary animate-spin flex-shrink-0" />
        <div className="text-center flex-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="font-semibold text-foreground cursor-help">{currentMessage}</p>
            </TooltipTrigger>
            <TooltipContent>
              <p>La primera búsqueda tarda 1-2 minutos</p>
              <p>Las búsquedas posteriores son instantáneas desde caché</p>
            </TooltipContent>
          </Tooltip>
          
          <div className="flex items-center justify-center gap-4 mt-2 text-sm">
            <div className="text-muted-foreground">
              Vehículos encontrados: <span className="font-bold text-foreground">{vehicleCount}+</span>
            </div>
            <div className="text-xs text-muted-foreground">
              ⏱️ <span className="font-mono font-bold">{elapsed}s</span>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground mt-1">
            Tiempo estimado: 1-2 minutos (depende del servidor)
          </p>
        </div>
      </div>
    </TooltipProvider>
  );
}
