import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const SCRAPTPRESS_API_URL = process.env.SCRAPTPRESS_API_URL || 'http://localhost:3000';
const SCRAPTPRESS_API_KEY = process.env.SCRAPTPRESS_API_KEY;

/**
 * GET /api/popular-searches
 * Obtiene las búsquedas más populares desde el backend
 * Estas búsquedas ya tienen datos en cache y pueden servirse instantáneamente
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') || '8';

    if (!SCRAPTPRESS_API_KEY) {
      console.error('[API] SCRAPTPRESS_API_KEY not configured');
      return NextResponse.json({ 
        success: false,
        searches: [] 
      }, { status: 500 });
    }

    const url = new URL('/api/search/popular', SCRAPTPRESS_API_URL);
    url.searchParams.set('limit', limit);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'X-API-Key': SCRAPTPRESS_API_KEY,
      },
      // Cache for 5 minutes
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      console.error('[API] Failed to fetch popular searches:', response.status);
      return NextResponse.json({ 
        success: false,
        searches: [] 
      }, { status: response.status });
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      searches: data.searches || [],
      timestamp: new Date().toISOString()
    }, {
      headers: {
        'Cache-Control': 'public, max-age=300', // 5 minutes
      }
    });

  } catch (error) {
    console.error('[API] Error fetching popular searches:', error);
    return NextResponse.json(
      { 
        success: false,
        searches: [],
        error: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}
