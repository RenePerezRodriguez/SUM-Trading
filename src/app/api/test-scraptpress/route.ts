import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const SCRAPTPRESS_API_URL = process.env.SCRAPTPRESS_API_URL;
    
    if (!SCRAPTPRESS_API_URL) {
      return NextResponse.json({ error: 'URL not configured' }, { status: 500 });
    }

    console.log('[TEST] Fetching from:', SCRAPTPRESS_API_URL);
    
    const response = await fetch(SCRAPTPRESS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'honda', count: 3, page: 1 }),
      signal: AbortSignal.timeout(30000),
    });

    console.log('[TEST] Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `ScraptPress returned ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('[TEST] Data received, vehicles:', data.vehicles?.length || 0);

    return NextResponse.json({
      success: true,
      status: response.status,
      vehiclesCount: data.vehicles?.length || 0,
      firstVehicle: data.vehicles?.[0] || null
    });

  } catch (error) {
    console.error('[TEST] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
