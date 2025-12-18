
'use client';

import { Suspense, useEffect, useState } from 'react';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n-config';
import { Skeleton } from '@/components/ui/skeleton';
import CopartDetailsClient from './_components/copart-details-client';
import type { NormalizedVehicle } from '@/lib/vehicle-normalizer';
import { ServerCrash, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { useParams } from 'next/navigation';
import useCopartStore from '@/hooks/use-copart-store';

function CopartLotContent() {
    const params = useParams();
    const lot = params.lot as string;
    const lang = (params.lang || 'es') as Locale;
    
    const [dict, setDict] = useState<any>(null);
    const [vehicle, setVehicle] = useState<NormalizedVehicle | null | undefined>(undefined);
    const [error, setError] = useState<string | null>(null);
    
    // Try to get from global store first
    const { getResultByLot } = useCopartStore();

    useEffect(() => {
        getDictionary(lang).then(setDict);
    }, [lang]);

    useEffect(() => {
        const fetchVehicle = async () => {
            if (!lot) {
                setError("Número de lote no proporcionado.");
                setVehicle(null);
                return;
            }

            // 1. Check global store first (from search results)
            const cached = getResultByLot(lot);
            if (cached) {
                console.log(`[Vehicle Details] ✅ Found in store cache for lot: ${lot}`);
                setVehicle(cached);
                return;
            }
            
            // 2. Check sessionStorage (may have been saved during search)
            if (typeof window !== 'undefined') {
                try {
                    const searchParams = new URLSearchParams(window.location.search);
                    const query = searchParams.get('query') || searchParams.get('from');
                    if (query) {
                        const storedCache = sessionStorage.getItem(`vehicles-cache-${query}`);
                        if (storedCache) {
                            const parsedCache = JSON.parse(storedCache);
                            if (parsedCache[lot]) {
                                console.log(`[Vehicle Details] ✅ Found in sessionStorage for lot: ${lot}`);
                                setVehicle(parsedCache[lot]);
                                return;
                            }
                        }
                    }
                } catch (e) {
                    console.warn('[Vehicle Details] Failed to check sessionStorage:', e);
                }
            }

            // 3. Try to get referrer query to check Firestore batches
            let referrerQuery = null;
            if (typeof window !== 'undefined') {
                const searchParams = new URLSearchParams(window.location.search);
                referrerQuery = searchParams.get('from') || searchParams.get('query');
                
                if (!referrerQuery && document.referrer) {
                    try {
                        const referrerUrl = new URL(document.referrer);
                        if (referrerUrl.pathname.includes('/search')) {
                            referrerQuery = referrerUrl.searchParams.get('query');
                        }
                    } catch (e) {
                        // Ignore invalid referrer
                    }
                }
            }

            // 4. Fetch from API (will check Firestore batches if query provided)
            try {
                console.log(`[Vehicle Details] 🔍 Fetching from API for lot: ${lot}${referrerQuery ? ` (from search: ${referrerQuery})` : ''}`);
                
                const url = referrerQuery 
                    ? `/api/copart/${lot}?query=${encodeURIComponent(referrerQuery)}`
                    : `/api/copart/${lot}`;
                
                const response = await fetch(url);
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.details || 'Error al obtener datos del vehículo.');
                }
                
                const data = await response.json();

                if (data.vehicle) {
                    // Normalize the vehicle data before setting
                    const { normalizeScraptpressData } = await import('@/lib/vehicle-normalizer');
                    const normalized = normalizeScraptpressData(data.vehicle);
                    setVehicle(normalized);
                    console.log(`[Vehicle Details] ✅ Loaded from ${data.source || (data.fromCache ? 'cache' : 'fresh scrape')}`);
                } else {
                    throw new Error('Vehículo no encontrado en el portal de Copart.');
                }
            } catch (e: any) {
                console.error('[Vehicle Details] ❌ Error:', e);
                setError(e.message);
                setVehicle(null);
            }
        };

        fetchVehicle();
    }, [lot, getResultByLot]);

    if (vehicle === undefined || !dict) {
       return (
            <div className="container py-12 pt-44 text-center">
                <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin" />
                <h2 className="mt-4 text-2xl font-semibold">Cargando información del vehículo...</h2>
                <p className="text-muted-foreground mt-2">Estamos recuperando los detalles. Esto puede tardar unos segundos.</p>
            </div>
        );
    }

    if (error) {
        return (
             <div className="container py-12 pt-44 text-center">
                 <ServerCrash className="mx-auto h-12 w-12 text-destructive mb-4" />
                <PageHeader 
                    title="Error al Cargar el Vehículo"
                    description={error}
                />
            </div>
        )
    }

    if (!vehicle) {
        return (
             <div className="container py-12 pt-44 text-center">
                <PageHeader 
                    title="Vehículo No Encontrado"
                    description={`No se encontró información para el lote ${lot}. Es posible que necesites volver a la búsqueda.`}
                />
            </div>
        )
    }
    
    return <CopartDetailsClient vehicle={vehicle} lang={lang} dict={dict} />;
}


export default function CopartLotPage() {
    return (
        <Suspense fallback={<div className="container py-12 pt-44"><Skeleton className="h-[80vh] w-full" /></div>}>
            <CopartLotContent />
        </Suspense>
    );
}
