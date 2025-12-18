import { NextRequest, NextResponse } from 'next/server';
import { getSdks } from '@/firebase/admin-init';

const COLLECTION = 'towing-rates';
const CURRENT_DOC = 'current';

/**
 * Public API to fetch towing rates for the calculator
 * GET /api/towing-rates
 * Query params:
 *   - destination: optional, filter by specific destination
 */
export async function GET(request: NextRequest) {
    try {
        const { firestore } = getSdks();
        const doc = await firestore.collection(COLLECTION).doc(CURRENT_DOC).get();

        if (!doc.exists) {
            return NextResponse.json({ destinations: {} });
        }

        const data = doc.data();
        const destination = request.nextUrl.searchParams.get('destination');

        // If specific destination requested, filter
        if (destination && data?.destinations?.[destination]) {
            return NextResponse.json({
                destinations: {
                    [destination]: data.destinations[destination]
                }
            });
        }

        return NextResponse.json({
            destinations: data?.destinations || {}
        });
    } catch (error: any) {
        console.error('[Towing Rates API] Error:', error);
        return NextResponse.json(
            { error: 'Error fetching towing rates' },
            { status: 500 }
        );
    }
}
