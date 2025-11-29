import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const url = 'https://scraptpress-901398474203.southamerica-east1.run.app/api/scraper/vehicles';
    const body = JSON.stringify({ query: 'test', count: 1, page: 1 });
    
    console.log('[SIMPLE TEST] Calling:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    
    console.log('[SIMPLE TEST] Response:', response.status);
    
    const data = await response.json();
    console.log('[SIMPLE TEST] Got data:', data.vehicles?.length || 0);
    
    return NextResponse.json({
      status: 'ok',
      scraptpressStatus: response.status,
      vehicleCount: data.vehicles?.length || 0
    });
  } catch (e) {
    console.error('[SIMPLE TEST] Error:', e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
