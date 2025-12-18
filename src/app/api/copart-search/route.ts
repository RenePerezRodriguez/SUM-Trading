import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const SCRAPTPRESS_API_URL = process.env.SCRAPTPRESS_API_URL || 'http://localhost:3000';
const SCRAPTPRESS_API_KEY = process.env.SCRAPTPRESS_API_KEY;

interface ScraptPressResponse {
  success: boolean;
  source: 'firestore' | 'copart' | 'redis-cache';
  cached: boolean;
  fresh: boolean;
  query: string;
  page: number;
  limit: number;
  returned: number;
  totalAvailable?: number; // Total de vehículos disponibles
  hasMore: boolean; // Solo esto importa para paginación
  scrapeDurationSeconds?: number;
  copartPagesScraped?: number;
  vehicles: any[];
  timestamp?: string;
  batch?: {
    number: number;
    size: number;
    offsetInBatch: number;
    totalInBatch: number;
    totalPagesInBatch: number;
    hasMoreInBatch: boolean;
    currentPageInBatch: number;
  };
  prefetch?: {
    recommended: boolean;
    nextBatch: number;
    url: string;
  };
}

interface SearchResponse {
  success: boolean;
  vehicles: any[];
  pagination: {
    hasMore: boolean; // ¿Hay más páginas disponibles?
    currentPage: number;
    totalAvailable?: number; // Total conocido
    batch?: {
      number: number;
      currentPageInBatch: number;
      totalPagesInBatch: number;
    };
  };
  fromCache: boolean;
  source: string;
  scrapeDuration?: number;
  prefetch?: {
    recommended: boolean;
    nextBatch: number;
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');
    const lot = searchParams.get('lot');
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || searchParams.get('count') || '10';
    const forceRefresh = searchParams.get('forceRefresh') === 'true';

    const searchQuery = lot || query;

    if (!searchQuery) {
      return NextResponse.json({ message: 'Query required' }, { status: 400 });
    }

    if (!SCRAPTPRESS_API_KEY) {
      console.error('[API] SCRAPTPRESS_API_KEY not configured');
      return NextResponse.json({ message: 'API key not configured' }, { status: 500 });
    }

    console.log(`[API] Searching: query="${searchQuery}", page=${page}, limit=${limit}, forceRefresh=${forceRefresh}`);

    // Build URL for v3.2 ScraptPress endpoint with dynamic limit
    const url = new URL('/api/search/vehicles', SCRAPTPRESS_API_URL);
    url.searchParams.set('query', searchQuery);
    url.searchParams.set('page', page);
    url.searchParams.set('limit', limit); // ✅ Pasar limit al backend

    // NO timeout - Copart puede bloquear y tomar mucho más tiempo
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'X-API-Key': SCRAPTPRESS_API_KEY,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API] ScraptPress error:', response.status, errorText);
      throw new Error(`ScraptPress API error: ${response.status}`);
    }

    const data: ScraptPressResponse = await response.json();
    console.log(`[API] Results: ${data.returned} vehicles (limit=${data.limit}), source=${data.source}, cached=${data.cached}, hasMore=${data.hasMore}`);

    if (data.batch) {
      console.log(`[API] Batch info: batch=${data.batch.number}, page ${data.batch.currentPageInBatch}/${data.batch.totalPagesInBatch} in batch`);
    }

    if (data.prefetch?.recommended) {
      console.log(`[API] Background scraping recommended for batch ${data.prefetch.nextBatch}`);
    }

    const responseData: SearchResponse = {
      success: true,
      vehicles: data.vehicles || [],
      pagination: {
        hasMore: data.hasMore,
        currentPage: data.page,
        totalAvailable: data.totalAvailable,
        batch: data.batch ? {
          number: data.batch.number,
          currentPageInBatch: data.batch.currentPageInBatch,
          totalPagesInBatch: data.batch.totalPagesInBatch,
        } : undefined,
      },
      fromCache: data.cached,
      source: data.source,
      scrapeDuration: data.scrapeDurationSeconds,
      prefetch: data.prefetch ? {
        recommended: data.prefetch.recommended,
        nextBatch: data.prefetch.nextBatch,
      } : undefined,
    };

    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': data.cached ? 'public, max-age=3600' : 'public, max-age=300',
        'X-Cache': data.cached ? 'HIT' : 'MISS',
        'X-Source': data.source,
      }
    });

  } catch (error) {
    console.error('[API] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        vehicles: [],
        pagination: { hasMore: false, currentPage: 1 },
        fromCache: false,
      },
      { status: 500 }
    );
  }
}
