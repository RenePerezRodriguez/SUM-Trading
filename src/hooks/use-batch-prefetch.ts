'use client';

import { useEffect, MutableRefObject } from 'react';
import { useToast } from '@/hooks/use-toast';
import useCopartStore from '@/hooks/use-copart-store';

type PageState = 'NOT_STARTED' | 'LOADING' | 'LOADED';

interface UseBatchPrefetchProps {
  currentPage: number;
  pageStates: Map<number, PageState>;
  setPageStates: React.Dispatch<React.SetStateAction<Map<number, PageState>>>;
  query: string;
  hasMorePages: boolean;
  setHasMorePages: (value: boolean) => void;
  prefetchInProgressRef: MutableRefObject<boolean>;
  loadingPagesRef: MutableRefObject<Set<number>>;
}

export function useBatchPrefetch({
  currentPage,
  pageStates,
  setPageStates,
  query,
  hasMorePages,
  setHasMorePages,
  prefetchInProgressRef,
  loadingPagesRef,
}: UseBatchPrefetchProps) {
  const { toast } = useToast();
  const { addResults } = useCopartStore();

  useEffect(() => {
    if (!query || !hasMorePages) return;

    const PAGES_PER_BATCH = 10;
    const PREFETCH_TRIGGER_PAGE = 2; // Trigger al llegar a página 3 (índice 2)
    
    const batchNumber = Math.floor((currentPage - 1) / PAGES_PER_BATCH);
    const pageWithinBatch = (currentPage - 1) % PAGES_PER_BATCH;
    const nextBatchNumber = batchNumber + 1;
    const nextBatchStartPage = nextBatchNumber * PAGES_PER_BATCH + 1;
    const nextBatchEndPage = nextBatchStartPage + PAGES_PER_BATCH - 1;

    console.log(`[Prefetch Check] Current: ${currentPage}, Batch: ${batchNumber}, PageInBatch: ${pageWithinBatch}`);

    // Verificar si estamos en página 3, 13, 23, etc. (índice 2, 12, 22...)
    const shouldPrefetch = pageWithinBatch === PREFETCH_TRIGGER_PAGE;

    if (!shouldPrefetch) {
      console.log(`[Prefetch] Not at trigger page (need pageWithinBatch === 2)`);
      return;
    }

    // Verificar si siguiente batch ya tiene páginas cargadas/loading
    const nextBatchPages = Array.from({ length: PAGES_PER_BATCH }, (_, i) => nextBatchStartPage + i);
    const allAlreadyInitialized = nextBatchPages.every(p => 
      pageStates.has(p) && pageStates.get(p) !== 'NOT_STARTED'
    );

    if (allAlreadyInitialized) {
      console.log(`[Prefetch] ⏭️ Next batch ${nextBatchNumber} already initialized`);
      return;
    }

    if (prefetchInProgressRef.current) {
      console.log(`[Prefetch] ⏳ Prefetch already in progress, skipping...`);
      return;
    }

    console.log(`[Prefetch] 🚀 TRIGGER at page ${currentPage} → Prefetching Batch ${nextBatchNumber} (pages ${nextBatchStartPage}-${nextBatchEndPage})`);
    
    prefetchInProgressRef.current = true;
    
    // Inicializar páginas como NOT_STARTED
    const newPageStates = new Map(pageStates);
    nextBatchPages.forEach(p => {
      if (!newPageStates.has(p)) {
        newPageStates.set(p, 'NOT_STARTED');
      }
    });
    setPageStates(newPageStates);

    // Toast de inicio
    toast({
      title: `🔮 Precargando Batch ${nextBatchNumber}`,
      description: `Cargando páginas ${nextBatchStartPage}-${nextBatchEndPage} en segundo plano. Puedes seguir navegando.`,
      duration: 4000,
    });

    // Cargar todas las páginas del batch en paralelo
    const loadPromises = nextBatchPages.map(async (page) => {
      if (loadingPagesRef.current.has(page)) {
        console.log(`[Prefetch] ⏭️ Page ${page} already loading, skipping...`);
        return;
      }

      loadingPagesRef.current.add(page);
      
      setPageStates(prev => {
        const updated = new Map(prev);
        updated.set(page, 'LOADING');
        return updated;
      });

      try {
        const startTime = Date.now();
        const response = await fetch(`/api/copart-search?query=${encodeURIComponent(query)}&page=${page}`);
        
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
          
          addResults(normalized);
          
          setPageStates(prev => {
            const updated = new Map(prev);
            updated.set(page, 'LOADED');
            return updated;
          });
          
          console.log(`[Prefetch] ✅ Page ${page} loaded: ${normalized.length} vehicles (${duration}s, cache: ${data.fromCache})`);
        } else {
          console.log(`[Prefetch] 📭 Page ${page} empty - no more vehicles`);
          setPageStates(prev => {
            const updated = new Map(prev);
            updated.set(page, 'LOADED');
            return updated;
          });
          setHasMorePages(false);
        }
      } catch (error) {
        console.error(`[Prefetch] ❌ Page ${page} error:`, error);
        setPageStates(prev => {
          const updated = new Map(prev);
          updated.set(page, 'NOT_STARTED');
          return updated;
        });
      } finally {
        loadingPagesRef.current.delete(page);
      }
    });

    Promise.allSettled(loadPromises).then((results) => {
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;
      
      console.log(`[Prefetch] 🎉 Batch ${nextBatchNumber} complete: ${successful} loaded, ${failed} failed`);
      
      prefetchInProgressRef.current = false;
      
      toast({
        title: `✅ Batch ${nextBatchNumber} precargado`,
        description: `${successful} páginas listas. Navegación instantánea disponible.`,
        duration: 3000,
      });
    });

  }, [currentPage, pageStates, query, hasMorePages, setPageStates, setHasMorePages, toast, addResults, prefetchInProgressRef, loadingPagesRef]);
}
