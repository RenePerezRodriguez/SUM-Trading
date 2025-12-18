'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { HelpCircle, Loader } from 'lucide-react';

const CREATIVE_MESSAGES = [
  'Recopilando información de Copart...',
  'Extrayendo datos de vehículos...',
  'Analizando fotos y detalles...',
  'Obteniendo historiales de daño...',
  'Procesando información de subastas...',
  'Trayendo datos en tiempo real...',
  'Recopilando especificaciones técnicas...',
  'Extrayendo precios y pujas actuales...',
  'Organizando resultados de búsqueda...',
];

export function SearchLoadingSkeleton() {
  const [vehicleCount, setVehicleCount] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(CREATIVE_MESSAGES[0]);
  const maxEstimate = 100; // Batch 0: 100 vehículos

  useEffect(() => {
    // Cambiar mensaje cada 3-4 segundos
    const messageInterval = setInterval(() => {
      setCurrentMessage(CREATIVE_MESSAGES[Math.floor(Math.random() * CREATIVE_MESSAGES.length)]);
    }, 3500);

    return () => clearInterval(messageInterval);
  }, []);

  useEffect(() => {
    // Simular progreso de carga de vehículos - 1 vehículo cada 3 segundos (300s total para 100)
    const vehicleInterval = setInterval(() => {
      setVehicleCount(prev => {
        if (prev >= maxEstimate) return maxEstimate;
        // Incrementar de 1 en 1
        return prev + 1;
      });
    }, 3000); // 3 segundos por vehículo = 300 segundos (5 min) total

    return () => clearInterval(vehicleInterval);
  }, [maxEstimate]);

  useEffect(() => {
    // Contador de tiempo
    const timeInterval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  return (
    <div className="mt-6">
      {/* Loading message with animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 bg-secondary/30 rounded-lg"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="flex justify-center mb-6"
        >
          <Loader className="w-10 h-10 text-primary" />
        </motion.div>
        
        {/* Help icon bigger and on top */}
        <div className="flex justify-center mb-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 hover:bg-red-500/20 transition-colors cursor-help"
                  aria-label="Información sobre la búsqueda"
                >
                  <HelpCircle className="w-8 h-8 text-red-500" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-sm text-sm">
                <div className="space-y-2">
                  <p className="font-medium">Primera búsqueda: ~4-5 minutos</p>
                  <p className="text-xs">Estamos analizando 100 vehículos con fotos y detalles completos desde Copart Auctions.</p>
                  <p className="text-xs mt-2">Búsquedas posteriores serán instantáneas (datos en caché 7 días).</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <motion.p 
          key={currentMessage}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.5 }}
          className="text-lg font-semibold text-foreground"
        >
          {currentMessage}
        </motion.p>
        
        <div className="flex items-center justify-center gap-2 mt-3">
          <p className="text-sm font-medium text-primary">
            {vehicleCount} de {maxEstimate} vehículos encontrados
          </p>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Tiempo transcurrido: {elapsedSeconds}s · Estimado total: 4-5 minutos
        </p>
      </motion.div>

      {/* Skeleton cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 mt-8">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="space-y-3"
          >
            <Skeleton className="aspect-[4/3] w-full rounded-lg" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
