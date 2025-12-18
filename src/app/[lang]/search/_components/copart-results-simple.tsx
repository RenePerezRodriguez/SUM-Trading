'use client';

import type { NormalizedVehicle } from '@/lib/vehicle-normalizer';
import { Frown, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

// Components
import { PageLoadingState } from './loading/page-loading-state';
import { VehicleGrid } from './vehicle-display/vehicle-grid';
import { PaginationControls } from './pagination/pagination-controls';
import { FilterToolbarSection } from './filters/filter-toolbar-section';

const NoResults = ({ dict, query }: { dict: any, query: string }) => (
    <div className="text-center py-16 bg-secondary/30 rounded-lg mt-6">
      <Frown className="mx-auto h-12 w-12 text-muted-foreground" />
      <p className="mt-4 text-lg font-semibold">{dict.search_page.no_results_broker}</p>
      <p className="text-muted-foreground">No se encontraron vehículos que coincidan con "{query}".</p>
    </div>
);

interface CopartResultsProps {
  results: NormalizedVehicle[];
  query: string;
  lang: string;
  dict: any;
  pagination: { hasMore: boolean };
  initialPage?: number;
}

export default function CopartResults({ 
  results, 
  query, 
  lang, 
  dict, 
  pagination, 
  initialPage = 1 
}: CopartResultsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // ESTRATEGIA SIMPLE: Mostrar solo la página actual, fetch directo al backend
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageVehicles, setPageVehicles] = useState<NormalizedVehicle[]>(results);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(pagination.hasMore);
  
  // UI State
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Sincronizar con prop results cuando cambia (por ej. nueva búsqueda)
  useEffect(() => {
    setPageVehicles(results);
    setHasMore(pagination.hasMore);
  }, [results, pagination.hasMore]);

  // Función para cargar una página específica desde el backend
  const loadPage = async (page: number) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setCurrentPage(page);

    try {
      // Obtener limit del URL (usuario puede haber cambiado el selector)
      const currentLimit = parseInt(searchParams.get('limit') || '10');
      console.log(`[Page Load] 🚀 Fetching page ${page} (limit: ${currentLimit}) from backend (Firestore → Scraping fallback)...`);
      
      const response = await fetch(
        `/api/copart-search?query=${encodeURIComponent(query)}&page=${page}&limit=${currentLimit}`,
        {
          signal: AbortSignal.timeout(960000), // 16 minute timeout
        }
      );
      
      if (!response.ok) {
        if (response.status === 504) {
          throw new Error('⏱️ Timeout: El scraping tardó más de 15 minutos. Verifica el backend.');
        }
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data?.vehicles && data.vehicles.length > 0) {
        const { normalizeScraptpressData } = await import('@/lib/vehicle-normalizer');
        const normalized = data.vehicles.map((v: any) => normalizeScraptpressData(v));
        
        const source = data.fromCache ? '⚡ Firestore cache' : '🔄 Fresh scrape';
        console.log(`[Page Load] ✅ Page ${page}: ${normalized.length} vehicles from ${source}`);
        
        setPageVehicles(normalized);
        setHasMore(data.pagination?.hasMore ?? true);
        
        toast({
          title: `${data.fromCache ? '⚡' : '🔄'} Página ${page} cargada`,
          description: `${normalized.length} vehículos desde ${data.fromCache ? 'caché' : 'scraping'}`,
          duration: 3000,
        });
      } else {
        console.log(`[Page Load] ⚠️ Page ${page} is empty`);
        setPageVehicles([]);
        setHasMore(false);
        
        toast({
          title: `📭 No hay más vehículos`,
          description: `La página ${page} está vacía.`,
        });
      }
    } catch (error: any) {
      console.error(`[Page Load] ❌ Error loading page ${page}:`, error);
      
      toast({
        title: `❌ Error al cargar página ${page}`,
        description: error.message || 'Inténtalo nuevamente',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handler para cambio de página
  const handlePageChange = (newPage: number) => {
    if (newPage === currentPage) return;
    if (newPage < 1) return;
    
    // Actualizar URL sin reload
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`, { scroll: false });
    
    // Cargar nueva página
    loadPage(newPage);
  };

  // Aplicar ordenamiento
  const sortedVehicles = [...pageVehicles].sort((a, b) => {
    if (sortOrder === 'asc') {
      return (a.current_bid || 0) - (b.current_bid || 0);
    } else {
      return (b.current_bid || 0) - (a.current_bid || 0);
    }
  });

  // Early return: sin resultados
  if (!isLoading && pageVehicles.length === 0 && currentPage === 1) {
    return <NoResults dict={dict} query={query} />;
  }

  // Render principal
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Toolbar de filtros y vistas */}
      <FilterToolbarSection
        currentView={viewMode}
        onViewChange={setViewMode}
        sortBy={sortOrder === 'asc' ? 'price' : 'date'}
        onSortChange={(sort) => setSortOrder(sort === 'price' ? 'asc' : 'desc')}
        onOpenFilters={() => {}} // Sin filtros por ahora
        totalLoadedVehicles={pageVehicles.length}
      />

      {/* Info de página actual */}
      <div className="mb-6 text-center">
        <p className="text-sm text-muted-foreground">
          Página {currentPage} • {pageVehicles.length} vehículos mostrados
          {hasMore && ' • Más resultados disponibles'}
        </p>
      </div>

      {/* Paginación Superior */}
      <div className="mb-6">
        <PaginationControls
          currentPage={currentPage}
          onPageChange={handlePageChange}
          prevDisabled={currentPage === 1 || isLoading}
          nextDisabled={!hasMore || isLoading}
          isLoadingPage={isLoading}
          loadingPageNumber={currentPage}
        />
      </div>

      {/* Grid de vehículos */}
      {isLoading ? (
        <PageLoadingState currentPage={currentPage} />
      ) : pageVehicles.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg font-semibold">No hay vehículos en esta página</p>
          <p className="text-muted-foreground mt-2">Intenta navegar a una página anterior</p>
        </div>
      ) : (
        <VehicleGrid vehicles={sortedVehicles} currentView={viewMode} lang={lang} dict={dict} query={query} />
      )}

      {/* Paginación Inferior */}
      <div className="mt-8">
        <PaginationControls
          currentPage={currentPage}
          onPageChange={handlePageChange}
          prevDisabled={currentPage === 1 || isLoading}
          nextDisabled={!hasMore || isLoading}
          isLoadingPage={isLoading}
          loadingPageNumber={currentPage}
        />
      </div>
    </div>
  );
}
