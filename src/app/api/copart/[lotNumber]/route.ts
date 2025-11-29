import { NextRequest, NextResponse } from 'next/server';

const SCRAPTPRESS_API_URL = process.env.SCRAPTPRESS_API_URL || 'http://localhost:3000';
const SCRAPTPRESS_API_KEY = process.env.SCRAPTPRESS_API_KEY;

/**
 * Get detailed information for a specific vehicle by lot number
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ lotNumber: string }> }) {
  try {
    const { lotNumber } = await params;

    if (!lotNumber) {
      return NextResponse.json({ message: 'Lot number required' }, { status: 400 });
    }

    if (!SCRAPTPRESS_API_KEY) {
      console.error('[API] SCRAPTPRESS_API_KEY not configured');
      return NextResponse.json({ message: 'API key not configured' }, { status: 500 });
    }

    // Try to get query parameter (from search context)
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('query');

    console.log(`[API] Fetching vehicle details for lot: ${lotNumber}${searchQuery ? ` (from search: "${searchQuery}")` : ''}`);

    // If we have a search query context, try to find the vehicle in Firestore batches first
    if (searchQuery) {
      try {
        const firestoreUrl = new URL('/api/search/firestore-lookup', SCRAPTPRESS_API_URL);
        firestoreUrl.searchParams.set('query', searchQuery);
        firestoreUrl.searchParams.set('lot', lotNumber);

        const firestoreResponse = await fetch(firestoreUrl.toString(), {
          method: 'GET',
          headers: {
            'X-API-Key': SCRAPTPRESS_API_KEY,
          },
        });

        if (firestoreResponse.ok) {
          const firestoreData = await firestoreResponse.json();
          if (firestoreData.found && firestoreData.vehicle) {
            console.log(`[API] ✅ Vehicle found in Firestore batch ${firestoreData.batch}`);
            return NextResponse.json({
              success: true,
              vehicle: firestoreData.vehicle,
              fromCache: true,
              source: `firestore-batch-${firestoreData.batch}`,
            }, {
              headers: {
                'Cache-Control': 'public, max-age=3600',
              }
            });
          }
        }
      } catch (e) {
        console.warn('[API] Firestore lookup failed, falling back to scrape:', e);
      }
    }

    // Fallback: Fetch from intelligent endpoint (will scrape if not cached)
    const url = new URL('/api/search/intelligent', SCRAPTPRESS_API_URL);
    url.searchParams.set('query', lotNumber);
    url.searchParams.set('page', '1');

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

    const data = await response.json();
    const vehicle = data.vehicles?.[0] || null;

    if (!vehicle) {
      return NextResponse.json(
        { message: 'Vehicle not found', details: 'No se encontró el vehículo en Copart' },
        { status: 404 }
      );
    }

    console.log(`[API] Vehicle found: ${vehicle.lot_number}`);

    return NextResponse.json({
      success: true,
      vehicle,
      fromCache: data.cached || false,
      source: data.cached ? 'scraptpress-cache' : 'fresh-scrape',
    }, {
      headers: {
        'Cache-Control': data.cached ? 'public, max-age=3600' : 'public, max-age=300',
      }
    });

  } catch (error) {
    console.error('[API] Error fetching vehicle details:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Error',
        details: 'Error al obtener datos del vehículo desde ScraptPress'
      },
      { status: 500 }
    );
  }
}
