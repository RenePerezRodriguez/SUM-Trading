'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type PageState = 'NOT_STARTED' | 'LOADING' | 'LOADED';

interface PageStatesIndicatorProps {
  currentPage: number;
  pageStates: Map<number, PageState>;
}

export function PageStatesIndicator({ currentPage, pageStates }: PageStatesIndicatorProps) {
  const currentBatch = Math.floor((currentPage - 1) / 10);
  const startPage = currentBatch * 10 + 1;
  const pagesInBatch = Array.from({ length: 10 }, (_, i) => startPage + i);

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-muted-foreground">Estado de páginas:</span>
      {pagesInBatch.map(pageNum => {
        const state = pageStates.get(pageNum);
        const isCurrent = pageNum === currentPage;
        
        if (!state) return null;
        
        return (
          <div
            key={pageNum}
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-md",
              isCurrent && "ring-2 ring-primary"
            )}
          >
            <span className="font-medium">{pageNum}</span>
            {state === 'LOADED' && <span className="text-green-600">✅</span>}
            {state === 'LOADING' && <Loader2 className="h-3 w-3 animate-spin text-blue-600" />}
            {state === 'NOT_STARTED' && <span className="text-gray-400">⭕</span>}
          </div>
        );
      })}
    </div>
  );
}
