'use client';

import { Loader2 } from 'lucide-react';

type PageState = 'NOT_STARTED' | 'LOADING' | 'LOADED';

interface PaginationControlsProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  prevDisabled: boolean;
  nextDisabled: boolean;
  isLoadingPage: boolean;
  loadingPageNumber: number | null;
}

export function PaginationControls({
  currentPage,
  onPageChange,
  prevDisabled,
  nextDisabled,
  isLoadingPage,
  loadingPageNumber
}: PaginationControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={prevDisabled}
        className="px-3 py-2 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary transition-colors"
        aria-label="Página anterior"
      >
        <>← Anterior</>
      </button>

      <span className="text-sm text-muted-foreground font-medium min-w-[100px] text-center">
        Página <span className="text-foreground font-bold">{currentPage}</span>
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={nextDisabled}
        className="px-3 py-2 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary transition-colors"
        aria-label="Página siguiente"
      >
        {isLoadingPage && loadingPageNumber === currentPage + 1 ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>Siguiente →</>
        )}
      </button>
    </div>
  );
}
