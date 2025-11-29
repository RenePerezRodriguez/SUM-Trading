'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import type { NormalizedVehicle } from '@/lib/vehicle-normalizer';

type PageState = 'NOT_STARTED' | 'LOADING' | 'LOADED';

interface UsePaginationProps {
  initialPage: number;
  query: string;
  hasMore: boolean;
  addVehicles: (vehicles: NormalizedVehicle[]) => void;
}

export function usePagination({ initialPage, query, hasMore, addVehicles }: UsePaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  // Restaurar página desde sessionStorage o usar initialPage
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedPage = sessionStorage.getItem(`search-page-${query}`);
      return savedPage ? parseInt(savedPage) : initialPage;
    }
    return initialPage;
  });
  
  const [pageStates, setPageStates] = useState<Map<number, PageState>>(new Map([[1, 'LOADED']]));
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [loadingPageNumber, setLoadingPageNumber] = useState<number | null>(null);
  const [hasMorePages, setHasMorePages] = useState(hasMore);
  const prefetchInProgressRef = useRef(false);
  const loadingPagesRef = useRef<Set<number>>(new Set());
  
  // Guardar página actual en sessionStorage cuando cambia
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`search-page-${query}`, currentPage.toString());
    }
  }, [currentPage, query]);

  // Inicializar batch 0 (páginas 1-10)
  useEffect(() => {
    if (hasMorePages && pageStates.size === 1) {
      console.log(`[Batch Init] Initializing batch 0 pages (1-10)...`);
      const newPageStates = new Map(pageStates);
      for (let i = 1; i <= 10; i++) {
        if (!newPageStates.has(i)) {
          newPageStates.set(i, 'NOT_STARTED');
        }
      }
      setPageStates(newPageStates);
    }
  }, [hasMorePages, pageStates]);

  // Auto-agregar siguiente batch cuando te acercas al límite del batch actual
  useEffect(() => {
    const PAGES_PER_BATCH = 10;
    const currentBatch = Math.floor((currentPage - 1) / PAGES_PER_BATCH);
    const pageWithinBatch = (currentPage - 1) % PAGES_PER_BATCH;
    
    // Si estás en página 8, 9 o 10 del batch actual, preparar el siguiente batch
    if (pageWithinBatch >= 7 && hasMorePages) {
      const nextBatchStartPage = (currentBatch + 1) * PAGES_PER_BATCH + 1;
      const nextBatchEndPage = nextBatchStartPage + 9; // Páginas 11-20, 21-30, etc.
      
      const needsUpdate = !pageStates.has(nextBatchStartPage);
      
      if (needsUpdate) {
        console.log(`[Batch Prep] 🎯 User near batch ${currentBatch} limit (page ${currentPage}), adding pages ${nextBatchStartPage}-${nextBatchEndPage} as NOT_STARTED`);
        const newPageStates = new Map(pageStates);
        for (let i = nextBatchStartPage; i <= nextBatchEndPage; i++) {
          newPageStates.set(i, 'NOT_STARTED');
        }
        setPageStates(newPageStates);
      }
    }
  }, [currentPage, hasMorePages, pageStates, setPageStates]);

  const handlePageChange = async (page: number) => {
    const pageState = pageStates.get(page);
    
    // Si ya está LOADED, navegar inmediatamente (sin scroll)
    if (pageState === 'LOADED') {
      console.log(`[Page Nav] ✅ Page ${page} already loaded, navigating...`);
      setCurrentPage(page);
      return;
    }
    
    // Si está LOADING, no permitir navegar
    if (pageState === 'LOADING') {
      console.warn(`[Page Nav] ⚠️ Cannot navigate to page ${page} - still loading`);
      return;
    }
    
    // Si es NOT_STARTED, iniciar carga manual
    console.log(`[Page Load] 🚀 Starting manual load for page ${page}...`);
    
    // Cambiar a la página INMEDIATAMENTE para actualizar UI
    setCurrentPage(page);
    setIsLoadingPage(true);
    setLoadingPageNumber(page);
    setPageStates(prev => new Map(prev).set(page, 'LOADING'));
    
    const PAGES_PER_BATCH = 10;
    const batchNumber = Math.floor((page - 1) / PAGES_PER_BATCH);
    const isFirstBatch = batchNumber === 0;
    
    const loadingToastId = toast({
      title: `🔄 Cargando Batch ${batchNumber}`,
      description: isFirstBatch 
        ? '⏱️ Primera búsqueda (~5 minutos). Las siguientes serán instantáneas desde caché.' 
        : '⏱️ Cargando desde Copart (~3-5 minutos)',
      duration: Infinity, // No auto-dismiss
    });

    // Después de 6 minutos, mostrar mensaje informativo sin cancelar la carga
    const warningTimeout = setTimeout(() => {
      toast({
        title: '⏳ Tomando más tiempo de lo normal',
        description: 'Copart está restringiendo el acceso. Esto puede tomar más tiempo. Puedes esperar o volver más tarde.',
        duration: Infinity,
        variant: 'default',
      });
    }, 360000); // 6 minutos
    
    try {
      const startTime = Date.now();
      const response = await fetch(`/api/copart-search?query=${encodeURIComponent(query)}&page=${page}`);
      
      clearTimeout(warningTimeout);
      if (loadingToastId?.dismiss) loadingToastId.dismiss();
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      
      if (data.pagination?.hasMore !== undefined) {
        setHasMorePages(data.pagination.hasMore);
      }
      
      if (data?.vehicles && data.vehicles.length > 0) {
        const { normalizeScraptpressData } = await import('@/lib/vehicle-normalizer');
        const normalized = data.vehicles.map((v: any) => normalizeScraptpressData(v));
        
        addVehicles(normalized);
        setPageStates(prev => new Map(prev).set(page, 'LOADED'));
        
        console.log(`[Page Load] ✅ Page ${page} loaded: ${normalized.length} vehicles`);
        
        toast({
          title: `${data.fromCache ? '⚡' : '🔄'} Página ${page} cargada`,
          description: data.fromCache 
            ? `${normalized.length} vehículos desde caché (instantáneo)`
            : `${normalized.length} vehículos scraped en ${duration}s`,
          duration: 3000,
        });
      } else {
        console.log(`[Page Load] ⚠️ Page ${page} is empty`);
        setPageStates(prev => new Map(prev).set(page, 'LOADED'));
        setHasMorePages(false);
        
        toast({
          title: `📭 No hay más vehículos`,
          description: `La página ${page} está vacía.`,
        });
      }
    } catch (error) {
      clearTimeout(warningTimeout);
      if (loadingToastId?.dismiss) loadingToastId.dismiss();
      
      console.error(`[Page Load] ❌ Error:`, error);
      setPageStates(prev => new Map(prev).set(page, 'NOT_STARTED'));
      
      toast({
        title: `❌ Error al cargar página ${page}`,
        description: 'Inténtalo nuevamente',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingPage(false);
      setLoadingPageNumber(null);
    }
  };

  return {
    currentPage,
    setCurrentPage,
    pageStates,
    setPageStates,
    isLoadingPage,
    loadingPageNumber,
    hasMorePages,
    setHasMorePages,
    handlePageChange,
    prefetchInProgressRef,
    loadingPagesRef,
  };
}
