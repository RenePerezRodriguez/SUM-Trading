'use client';

import { useEffect } from 'react';

interface UseKeyboardNavigationProps {
  currentPage: number;
  prevPageButtonDisabled: boolean;
  nextPageButtonDisabled: boolean;
  onPageChange: (page: number) => void;
}

export function useKeyboardNavigation({
  currentPage,
  prevPageButtonDisabled,
  nextPageButtonDisabled,
  onPageChange,
}: UseKeyboardNavigationProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Evitar navegación si el usuario está escribiendo
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      if (e.key === 'ArrowLeft' && !prevPageButtonDisabled) {
        e.preventDefault();
        console.log(`[Keyboard] ⬅️ Arrow Left → Page ${currentPage - 1}`);
        onPageChange(currentPage - 1);
      } else if (e.key === 'ArrowRight' && !nextPageButtonDisabled) {
        e.preventDefault();
        console.log(`[Keyboard] ➡️ Arrow Right → Page ${currentPage + 1}`);
        onPageChange(currentPage + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, prevPageButtonDisabled, nextPageButtonDisabled, onPageChange]);
}
