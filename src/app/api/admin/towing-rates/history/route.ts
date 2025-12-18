import { NextRequest, NextResponse } from 'next/server';
import { getSdks } from '@/firebase/admin-init';

const COLLECTION = 'towing-rates';
const CURRENT_DOC = 'current';
const HISTORY_COLLECTION = 'towing-rates-history';

/**
 * GET: Fetch version history
 */
export async function GET(request: NextRequest) {
    try {
        const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10');

        const { firestore: db } = getSdks();
        const historySnap = await db.collection(HISTORY_COLLECTION)
            .orderBy('archivedAt', 'desc')
            .limit(limit)
            .get();

        const history = historySnap.docs.map(doc => ({
            id: doc.id,
            archivedAt: doc.data().archivedAt,
            fileName: doc.data().fileName || 'Unknown',
            destinationCount: Object.keys(doc.data().destinations || {}).length
        }));

        return NextResponse.json({ history });
    } catch (error: any) {
        console.error('Error fetching history:', error);
        return NextResponse.json(
            { error: 'Error al obtener historial' },
            { status: 500 }
        );
    }
}

/**
 * POST: Restore a version from history
 */
export async function POST(request: NextRequest) {
    try {
        const { versionId } = await request.json();

        if (!versionId) {
            return NextResponse.json(
                { error: 'ID de versión requerido' },
                { status: 400 }
            );
        }

        const { firestore: db } = getSdks();

        // Get the history version
        const historyDoc = await db.collection(HISTORY_COLLECTION).doc(versionId).get();

        if (!historyDoc.exists) {
            return NextResponse.json(
                { error: 'Versión no encontrada' },
                { status: 404 }
            );
        }

        const historyData = historyDoc.data()!;

        // Get current data to archive
        const currentDoc = await db.collection(COLLECTION).doc(CURRENT_DOC).get();

        const batch = db.batch();

        // Archive current version first
        if (currentDoc.exists) {
            const archiveRef = db.collection(HISTORY_COLLECTION).doc();
            batch.set(archiveRef, {
                ...currentDoc.data(),
                archivedAt: new Date().toISOString(),
                archivedBy: 'admin-rollback'
            });
        }

        // Restore history version as current
        const currentRef = db.collection(COLLECTION).doc(CURRENT_DOC);
        batch.set(currentRef, {
            destinations: historyData.destinations,
            updatedAt: new Date().toISOString(),
            restoredFrom: versionId,
            fileName: historyData.fileName || 'Restored'
        });

        await batch.commit();

        return NextResponse.json({
            success: true,
            message: 'Versión restaurada correctamente'
        });
    } catch (error: any) {
        console.error('Error restoring version:', error);
        return NextResponse.json(
            { error: `Error al restaurar: ${error.message}` },
            { status: 500 }
        );
    }
}
