'use client';

import { Loader2, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface PageLoadingStateProps {
  currentPage: number;
}

export function PageLoadingState({ currentPage }: PageLoadingStateProps) {
  const batchNumber = Math.floor((currentPage - 1) / 10);
  const isFirstBatch = batchNumber === 0;

  return (
    <div className="col-span-full space-y-6 py-8">
      <div className="text-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">Analizando fotos y detalles...</h3>
        <p className="text-muted-foreground">Cargando página {currentPage}...</p>
      </div>
      
      <Alert className="max-w-2xl mx-auto border-primary/50 bg-primary/5">
        <Info className="h-5 w-5 text-primary" />
        <AlertTitle className="text-lg font-semibold">Tiempo estimado: ~5 minutos</AlertTitle>
        <AlertDescription className="mt-2 space-y-2">
          <p className="text-base">
            {isFirstBatch 
              ? '🔍 Estamos analizando más de 100 vehículos desde Copart por primera vez. Esto incluye:'
              : '🔍 Cargando el siguiente lote de 100 vehículos. Esto incluye:'}
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm pl-2">
            <li>Extracción de fotos de alta calidad</li>
            <li>Análisis detallado de daños y características</li>
            <li>Verificación de precios y subastas</li>
          </ul>
          <p className="text-base font-medium mt-3">
            ⚡ <strong>Buenas noticias:</strong> Una vez cargado, las próximas {isFirstBatch ? '10' : '10'} páginas serán <span className="text-primary">instantáneas</span> gracias a nuestro sistema de caché.
          </p>
        </AlertDescription>
      </Alert>
    </div>
  );
}
