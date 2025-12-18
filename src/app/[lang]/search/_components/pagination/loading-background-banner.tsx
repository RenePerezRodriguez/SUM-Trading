'use client';

import { Loader2 } from 'lucide-react';

type PageState = 'NOT_STARTED' | 'LOADING' | 'LOADED';

interface LoadingBackgroundBannerProps {
  pageStates: Map<number, PageState>;
}

export function LoadingBackgroundBanner({ pageStates }: LoadingBackgroundBannerProps) {
  const loadingPages = Array.from(pageStates.entries())
    .filter(([_, state]) => state === 'LOADING')
    .map(([page]) => page);

  if (loadingPages.length === 0) return null;

  return (
    <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950 border-2 border-blue-300 dark:border-blue-700 rounded-lg">
      <div className="flex items-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        <div className="flex-1">
          <p className="font-semibold text-blue-900 dark:text-blue-100">
            🔄 Cargando batch en segundo plano
          </p>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Páginas {loadingPages.join(', ')} • Scraping desde Copart (~3-5 minutos)
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            💡 Puedes seguir navegando mientras tanto
          </p>
        </div>
      </div>
    </div>
  );
}
