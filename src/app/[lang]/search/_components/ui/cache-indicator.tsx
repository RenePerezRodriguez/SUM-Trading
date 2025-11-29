'use client';

import { AlertCircle, Zap, RefreshCw, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CacheIndicatorProps {
  isFromCache: boolean;
  cacheAge?: number; // Age in milliseconds
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function CacheIndicator({ isFromCache, cacheAge, onRefresh, isRefreshing }: CacheIndicatorProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isFromCache && !cacheAge) {
    return null;
  }

  const getCacheDaysAgo = (ageMs: number) => {
    const days = Math.floor(ageMs / (24 * 60 * 60 * 1000));
    const hours = Math.floor((ageMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    
    if (days > 0) {
      return `hace ${days} día${days > 1 ? 's' : ''}`;
    }
    if (hours > 0) {
      return `hace ${hours} hora${hours > 1 ? 's' : ''}`;
    }
    
    const minutes = Math.floor((ageMs % (60 * 60 * 1000)) / (60 * 1000));
    if (minutes > 0) {
      return `hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    }
    
    return 'hace unos segundos';
  };

  const handleRefreshClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmRefresh = () => {
    setShowConfirm(false);
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mb-6"
        >
          {isFromCache ? (
            <Alert className="bg-blue-50 border-blue-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <Zap className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-blue-900">⚡ Datos desde caché</p>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-200 hover:bg-blue-300 transition-colors cursor-help">
                              <HelpCircle className="w-4 h-4 text-blue-900" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="max-w-xs text-sm">
                            <div className="space-y-2">
                              <p>
                                <strong>¿Qué es el caché?</strong>
                              </p>
                              <p>Guardamos búsquedas anteriores hasta 15 días para evitar consultar Copart innecesariamente.</p>
                              <hr className="my-2 border-blue-300" />
                              <p>
                                <strong>¿De dónde vienen los datos?</strong>
                              </p>
                              <p>Estos datos fueron obtenidos de Copart hace unos días y están almacenados en nuestro servidor.</p>
                              <hr className="my-2 border-blue-300" />
                              <p>
                                <strong>¿Por qué es rápido?</strong>
                              </p>
                              <p>Servimos datos desde nuestro servidor (~30ms) en lugar de consultar Copart (1-2 minutos).</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    {cacheAge !== undefined && (
                      <AlertDescription className="text-blue-800 mt-2">
                        Guardado {getCacheDaysAgo(cacheAge)}. El caché dura 15 días.
                      </AlertDescription>
                    )}
                  </div>
                </div>
                {onRefresh && (
                  <Button
                    onClick={handleRefreshClick}
                    disabled={isRefreshing}
                    size="sm"
                    variant="outline"
                    className="ml-4 flex-shrink-0"
                    title="Hacer una nueva búsqueda en Copart para obtener datos actuales"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span className="ml-2">
                      {isRefreshing ? 'Buscando...' : 'Datos nuevos'}
                    </span>
                  </Button>
                )}
              </div>
            </Alert>
          ) : (
            <Alert className="bg-amber-50 border-amber-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-amber-900">🔄 Búsqueda en vivo desde Copart</p>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-200 hover:bg-amber-300 transition-colors cursor-help">
                            <HelpCircle className="w-4 h-4 text-amber-900" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs text-sm">
                          <div className="space-y-2">
                            <p>
                              <strong>¿Por qué tarda?</strong>
                            </p>
                            <p>Estamos consultando Copart en tiempo real para obtener datos actualizados de subastas.</p>
                            <hr className="my-2 border-amber-300" />
                            <p>
                              <strong>Tiempo estimado: 1-2 minutos</strong>
                            </p>
                            <p>La primera búsqueda siempre es más lenta porque consultamos Copart directamente.</p>
                            <hr className="my-2 border-amber-300" />
                            <p>
                              <strong>Después...</strong>
                            </p>
                            <p>Las búsquedas futuras serán instantáneas (servidas desde caché por 15 días).</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <AlertDescription className="text-amber-800 mt-2">
                    Buscando datos actualizados de Copart. Tiempo estimado: 1-2 minutos.
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Confirmación para refrescar */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Buscar datos nuevos?</AlertDialogTitle>
            <AlertDialogDescription>
              Esto hará una nueva búsqueda en Copart para obtener datos actualizados. 
              <br />
              <br />
              <strong>Tiempo estimado: 1-2 minutos</strong> (en lugar de milisegundos desde caché)
              <br />
              <br />
              ¿Deseas continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-3">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRefresh}>
              Sí, buscar datos nuevos
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
