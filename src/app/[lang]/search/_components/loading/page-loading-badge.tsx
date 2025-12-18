'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface PageLoadingBadgeProps {
  isLoading: boolean;
  pageNumber: number;
}

export function PageLoadingBadge({ isLoading, pageNumber }: PageLoadingBadgeProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="sticky top-20 z-50 flex justify-center mb-6"
        >
          <div className="bg-accent rounded-lg shadow-2xl overflow-hidden">
            <div className="px-6 py-3 flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-white" />
              <div>
                <p className="font-bold text-white text-base">🔄 Cargando página {pageNumber}</p>
                <p className="text-blue-100 text-xs">Trayendo vehículos desde Copart...</p>
              </div>
            </div>
            {/* Barra de progreso animada */}
            <motion.div
              className="h-1 bg-white/30"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{
                duration: 30,
                ease: 'linear',
                repeat: Infinity,
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
