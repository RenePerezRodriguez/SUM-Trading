'use client';

import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageLoadingIndicatorProps {
  page: number;
  isLoading: boolean;
}

export function PageLoadingIndicator({ page, isLoading }: PageLoadingIndicatorProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mb-6 p-4 bg-accent/5 border border-accent/20 rounded-lg flex items-center gap-3"
        >
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-blue-900 text-sm">
              Cargando página {page}...
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Los datos estarán listos en unos segundos
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
