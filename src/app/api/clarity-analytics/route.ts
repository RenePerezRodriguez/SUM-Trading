
import { NextResponse } from 'next/server';
import { URLSearchParams } from 'url';

const CLARITY_API_TOKEN = process.env.CLARITY_API_TOKEN;
const CLARITY_API_ENDPOINT = 'https://www.clarity.ms/export-data/api/v1/project-live-insights';

export async function GET(request: Request) {
    if (!CLARITY_API_TOKEN) {
        return NextResponse.json({ message: 'Clarity API token is not configured on the server.' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const numOfDays = searchParams.get('numOfDays') || '1';
    const dimension1 = searchParams.get('dimension1') || 'OS';

    const params = new URLSearchParams({
        numOfDays,
        dimension1,
    });
    
    try {
        const response = await fetch(`${CLARITY_API_ENDPOINT}?${params.toString()}`, {
            headers: {
                'Authorization': `Bearer ${CLARITY_API_TOKEN}`,
                'Content-Type': 'application/json',
            },
            // Use Next.js revalidation to cache results for a period of time
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { message: `Error from Clarity API: ${errorData.message || response.statusText}` }, 
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ message: `Internal Server Error: ${error.message}` }, { status: 500 });
    }
}
