import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const SCRAPTPRESS_API_URL = process.env.SCRAPTPRESS_API_URL || 'http://localhost:3000';
const SCRAPTPRESS_API_KEY = process.env.SCRAPTPRESS_API_KEY;

/**
 * API route to fetch multiple Copart vehicles by lot numbers
 * Usage: /api/copart-vehicles?lots=12345,67890,11111
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lotsString = searchParams.get('lots');

    if (!lotsString) {
      return NextResponse.json({ message: 'Lots parameter required' }, { status: 400 });
    }

    if (!SCRAPTPRESS_API_KEY) {
      console.error('[API] SCRAPTPRESS_API_KEY not configured');
      return NextResponse.json({ message: 'API key not configured' }, { status: 500 });
    }

    const lotNumbers = lotsString.split(',').map(lot => lot.trim()).filter(Boolean);
    
    if (lotNumbers.length === 0) {
      return NextResponse.json({ message: 'No valid lot numbers provided' }, { status: 400 });
    }

    console.log(`[API] Fetching ${lotNumbers.length} vehicles: ${lotNumbers.join(', ')}`);

    // Fetch all vehicles in parallel
    const vehiclePromises = lotNumbers.map(async (lot) => {
      try {
        const url = new URL('/api/search/intelligent', SCRAPTPRESS_API_URL);
        url.searchParams.set('query', lot);
        url.searchParams.set('page', '1');

        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'X-API-Key': SCRAPTPRESS_API_KEY,
          },
        });

        if (!response.ok) {
          console.error(`[API] Error fetching lot ${lot}:`, response.status);
          return null;
        }

        const data = await response.json();
        
        // Return the first vehicle that matches the lot number
        const vehicle = data.vehicles?.find((v: any) => v.lot_number === lot);
        return vehicle || null;
      } catch (error) {
        console.error(`[API] Error fetching lot ${lot}:`, error);
        return null;
      }
    });

    const vehicles = (await Promise.all(vehiclePromises)).filter(Boolean);

    console.log(`[API] Successfully fetched ${vehicles.length}/${lotNumbers.length} vehicles`);

    return NextResponse.json(vehicles, {
      headers: {
        'Cache-Control': 'public, max-age=3600',
      }
    });

  } catch (error) {
    console.error('[API] Error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
