'use client';

import { Suspense, FormEvent, useState, useEffect, useTransition } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n-config';
import { PageHeader } from '@/components/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import SumTradingResults from './_components/sum-trading-results';
import CopartResults from './_components/copart-results-simple';
import { SearchLoadingSkeleton } from './_components/loading/search-loading-skeleton';
import { CacheIndicator } from './_components/ui/cache-indicator';
import { SearchHistoryDropdown } from './_components/ui/search-history-dropdown';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { NormalizedVehicle } from '@/lib/vehicle-normalizer';
import { normalizeScraptpressData } from '@/lib/vehicle-normalizer';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ServerCrash } from 'lucide-react';
import useCopartStore from '@/hooks/use-copart-store';
import { useSearchHistory } from '@/hooks/use-search-history';
import { useToast } from '@/hooks/use-toast';

function SearchBar({ initialQuery, dict, onSearch, isSearching }: { initialQuery: string, dict: any, onSearch: (query: string, limit: number) => void, isSearching: boolean }) {
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [showHistory, setShowHistory] = useState(false);
    const [batchSize, setBatchSize] = useState<'10' | '50' | '100'>('10');
    const { addSearch } = useSearchHistory();
    const t = dict.hero;

    const batchOptions = {
        '10': { label: '10 vehículos', time: '~2 min', description: 'Rápido' },
        '50': { label: '50 vehículos', time: '~10 min', description: 'Equilibrado' },
        '100': { label: '100 vehículos', time: '~20 min', description: 'Completo' }
    };

    useEffect(() => {
        setSearchQuery(initialQuery);
    }, [initialQuery]);

    const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmedQuery = searchQuery.trim();
        if (trimmedQuery) {
            addSearch(trimmedQuery);
            onSearch(trimmedQuery, parseInt(batchSize));
            setShowHistory(false);
        }
    };

    const handleSelectFromHistory = (query: string) => {
        setSearchQuery(query);
        addSearch(query);
        onSearch(query, parseInt(batchSize));
        setShowHistory(false);
    };

    return (
        <form onSubmit={handleSearchSubmit} className="relative mt-8 mb-12 max-w-3xl mx-auto space-y-4">
            {/* Selector de cantidad de resultados */}
            <div className="flex items-center gap-4 justify-center">
                <Label htmlFor="batch-size" className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Cantidad de resultados:
                </Label>
                <Select value={batchSize} onValueChange={(value) => setBatchSize(value as '10' | '50' | '100')}>
                    <SelectTrigger id="batch-size" className="w-[280px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(batchOptions).map(([value, option]) => (
                            <SelectItem key={value} value={value}>
                                <div className="flex items-center justify-between w-full gap-4">
                                    <span className="font-medium">{option.label}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {option.time} • {option.description}
                                    </span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Barra de búsqueda */}
            <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="text"
                    name="search"
                    placeholder={t.search_placeholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowHistory(true)}
                    className="w-full h-16 pl-14 pr-32 rounded-xl border-2 text-base shadow-lg focus-visible:shadow-xl transition-shadow"
                    disabled={isSearching}
                />
                {showHistory && <SearchHistoryDropdown onSelectQuery={handleSelectFromHistory} />}
                <Button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 h-12 px-6 font-semibold" size="lg" disabled={isSearching}>
                    {isSearching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : t.search_button}
                </Button>
            </div>
        </form>
    );
}

function SearchPageContent() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const { addResults, clearResults } = useCopartStore();
    const { toast } = useToast();

    const query = searchParams.get('query') || '';
    const lang = (pathname.split('/')[1] || 'es') as Locale;

    const [dict, setDict] = useState<any>(null);
    const [isSearching, startTransition] = useTransition();
    const [copartResults, setCopartResults] = useState<{vehicles: NormalizedVehicle[], pagination: { hasMore: boolean }}>({ vehicles: [], pagination: { hasMore: false } });
    const [searchError, setSearchError] = useState<string | null>(null);
    const [cacheInfo, setCacheInfo] = useState<{isFromCache: boolean, cacheAge?: number, cacheTimestamp?: number} | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [prevQuery, setPrevQuery] = useState<string>('');

    useEffect(() => {
        getDictionary(lang).then(setDict);
    }, [lang]);

    useEffect(() => {
        if (!query || !dict) {
          setCopartResults({ vehicles: [], pagination: { hasMore: false } });
          setSearchError(null);
          setCacheInfo(null);
          return;
        };
        
        // Limpiar store si cambió el query
        if (query !== prevQuery && prevQuery !== '') {
            console.log(`[Search] Query changed: "${prevQuery}" → "${query}", clearing store`);
            clearResults();
        }
        setPrevQuery(query);

        startTransition(async () => {
            await performSearch(query, false);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, dict]); // performSearch, clearResults, startTransition son estables

    const handleSearch = (newQuery: string, limit: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('query', newQuery);
        params.set('page', '1'); // Reset a página 1 en nueva búsqueda
        params.set('limit', limit.toString()); // Agregar limit seleccionado
        router.push(`${pathname}?${params.toString()}`);
    };

    const performSearch = async (searchQuery: string, forceRefresh: boolean = false, retryCount: number = 0) => {
        setSearchError(null);
        setCacheInfo(null);
        
        try {
            // NUEVA ESTRATEGIA OPTIMIZADA:
            // Solo cargar página 1 al inicio
            // Las demás páginas se cargan bajo demanda cuando el usuario navega
            // Prefetch automático de página siguiente en background
            
            const startTime = Date.now();
            const currentPage = parseInt(searchParams.get('page') || '1');
            const currentLimit = parseInt(searchParams.get('limit') || '10');
            
            const response = await fetch(
              `/api/copart-search?query=${encodeURIComponent(searchQuery)}&page=${currentPage}&limit=${currentLimit}${forceRefresh ? '&forceRefresh=true' : ''}`,
              {
                signal: AbortSignal.timeout(960000), // 16 minute timeout (1 min more than backend)
              }
            );
            
            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error('⚠️ Demasiadas solicitudes a Copart. Usaremos datos en caché. Intenta refrescar en unos minutos.');
                }
                if (response.status === 504 && retryCount < 2) {
                    // Timeout - retry after 3 seconds
                    toast({
                        title: "⏱️ Búsqueda en progreso",
                        description: `El backend está procesando tu búsqueda. Reintentando (${retryCount + 1}/2)...`,
                    });
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    return performSearch(searchQuery, forceRefresh, retryCount + 1);
                }
                const errorData = await response.json();
                throw new Error(errorData.message || errorData.details || 'Error al buscar en Copart');
            }
            
            const data = await response.json();
            const duration = ((Date.now() - startTime) / 1000).toFixed(1);
            
            // Guardar info del caché
            const cacheInfo = {
                isFromCache: data.fromCache || false,
                cacheAge: data.cacheAge,
                cacheTimestamp: data.cacheTimestamp
            };
            setCacheInfo(cacheInfo);
            
            // Normalizar y guardar vehículos
            const normalized = data.vehicles ? data.vehicles.map((v: any) => normalizeScraptpressData(v)) : [];
            
            setCopartResults({
              vehicles: normalized,
              pagination: { 
                hasMore: true, // Siempre asumir que hay más páginas (backend filtra en caso de no haber)
              }
            });
            
            // Guardar en store global
            if (normalized.length > 0) {
                addResults(normalized);
            }
            
            // Toast de éxito
            const source = data.fromCache ? 'caché' : 'scraping nuevo';
            const icon = data.fromCache ? '⚡' : '🔄';
            toast({
                title: `${icon} Búsqueda completada`,
                description: `${normalized.length} vehículos encontrados desde ${source} (${duration}s)`,
            });
        } catch (e: any) {
            setSearchError(e.message || 'Failed to connect to the search service.');
            setCopartResults({ vehicles: [], pagination: { hasMore: false } });
            
            // Toast de error
            toast({
                title: "❌ Error en la búsqueda",
                description: e.message || 'No se pudo conectar al servicio de búsqueda',
                variant: "destructive",
            });
        }
    };

    const handleRefreshSearch = async () => {
        setIsRefreshing(true);
        await performSearch(query, true, 0);
        setIsRefreshing(false);
    };


    if (!dict) {
        return (
            <div className="container py-12 pt-44">
                <Skeleton className="h-10 w-1/2 mx-auto" />
                <Skeleton className="h-4 w-3/4 mx-auto mt-4" />
                <Skeleton className="h-12 w-full mt-8" />
                <Skeleton className="h-[60vh] w-full mt-4" />
            </div>
        )
    }

    const t_search = dict.search_page;
    
    return (
        <div className="container py-12 pt-44">
            {/* Enhanced Header */}
            <div className="text-center mb-8 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-semibold text-primary mb-6">
                    <Search className="h-4 w-4" />
                    <span>{t_search.badge || 'Live Auctions'}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter font-headline mb-4">
                    {t_search.title}
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                    {t_search.description}
                </p>
            </div>

            <SearchBar initialQuery={query} dict={dict} onSearch={handleSearch} isSearching={isSearching} />

            <Tabs defaultValue="copart" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-lg mx-auto h-12 p-1 bg-secondary/50 border-2 border-border">
                <TabsTrigger value="copart" className="font-semibold data-[state=active]:shadow-md">{t_search.copart_tab_title}</TabsTrigger>
                <TabsTrigger value="sum" className="font-semibold data-[state=active]:shadow-md">{t_search.sum_tab_title}</TabsTrigger>
              </TabsList>
              <TabsContent value="copart" className="mt-6">
                <p className="text-center text-muted-foreground mb-6">{t_search.copart_description}</p>
                 
                {query ? (
                    isSearching ? (
                        <SearchLoadingSkeleton />
                    ) : searchError ? (
                        <div className="text-center py-16 bg-destructive/10 rounded-lg mt-6">
                             <Alert variant="destructive">
                                <ServerCrash className="h-4 w-4" />
                                <AlertTitle>Error de Conexión</AlertTitle>
                                <AlertDescription>{searchError}</AlertDescription>
                            </Alert>
                        </div>
                    ) : (
                        <>
                          {cacheInfo && (
                            <CacheIndicator 
                              isFromCache={cacheInfo.isFromCache}
                              cacheAge={cacheInfo.cacheAge}
                              onRefresh={handleRefreshSearch}
                              isRefreshing={isRefreshing}
                            />
                          )}
                          <CopartResults results={copartResults.vehicles} pagination={copartResults.pagination} query={query} lang={lang} dict={dict} initialPage={parseInt(searchParams.get('page') || '1')} />
                        </>
                    )
                ) : (
                  <div className="text-center py-16 bg-secondary/30 rounded-lg">
                    <p className="text-lg font-semibold">{t_search.no_query_title}</p>
                    <p className="text-muted-foreground">{t_search.no_query_subtitle}</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="sum" className="mt-6">
                  <p className="text-center text-muted-foreground mb-6">{t_search.sum_description}</p>
                  <SumTradingResults query={query} lang={lang} dict={dict} />
              </TabsContent>
            </Tabs>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="container py-12 pt-44"><Skeleton className="h-[80vh] w-full" /></div>}>
            <SearchPageContent />
        </Suspense>
    );
}
