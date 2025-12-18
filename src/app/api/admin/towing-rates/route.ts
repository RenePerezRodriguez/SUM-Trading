import { NextRequest, NextResponse } from 'next/server';
import { getSdks } from '@/firebase/admin-init';
import { parseExcelBuffer, compareTowingRates, TowingRates } from '@/lib/excel-parser';

const COLLECTION = 'towing-rates';
const CURRENT_DOC = 'current';
const HISTORY_COLLECTION = 'towing-rates-history';

/**
 * GET: Fetch current towing rates from Firestore
 */
export async function GET() {
    try {
        const { firestore: db } = getSdks();
        const doc = await db.collection(COLLECTION).doc(CURRENT_DOC).get();

        if (!doc.exists) {
            return NextResponse.json({
                destinations: {},
                message: 'No towing rates data. Please upload an Excel file.'
            });
        }

        return NextResponse.json(doc.data());
    } catch (error: any) {
        console.error('Error fetching towing rates:', error);
        return NextResponse.json(
            { error: 'Error al obtener tarifas de arrastre' },
            { status: 500 }
        );
    }
}

/**
 * POST: Upload Excel file, parse it, and optionally save to Firestore
 * Query params:
 *   - preview=true: Only return parsed data without saving
 */
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const previewOnly = request.nextUrl.searchParams.get('preview') === 'true';

        if (!file) {
            return NextResponse.json(
                { error: 'No se proporcionó archivo' },
                { status: 400 }
            );
        }

        // Validate file type
        const validTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel'
        ];
        if (!validTypes.includes(file.type) && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
            return NextResponse.json(
                { error: 'El archivo debe ser un Excel (.xlsx o .xls)' },
                { status: 400 }
            );
        }

        // Read file buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // Parse Excel
        const parseResult = parseExcelBuffer(buffer);

        if (!parseResult.success || !parseResult.data) {
            return NextResponse.json(
                { error: parseResult.error || 'Error al procesar el archivo' },
                { status: 400 }
            );
        }

        const { firestore: db } = getSdks();

        // Get current data for comparison
        const currentDoc = await db.collection(COLLECTION).doc(CURRENT_DOC).get();
        const currentData = currentDoc.exists
            ? currentDoc.data() as TowingRates
            : { destinations: {} };

        // Compare old and new data
        const diff = compareTowingRates(currentData, parseResult.data);

        // If preview only, return without saving
        if (previewOnly) {
            return NextResponse.json({
                success: true,
                preview: true,
                data: parseResult.data,
                stats: parseResult.stats,
                diff
            });
        }

        // Save to Firestore
        const batch = db.batch();

        // Save current version to history first
        if (currentDoc.exists) {
            const historyRef = db.collection(HISTORY_COLLECTION).doc();
            batch.set(historyRef, {
                ...currentData,
                archivedAt: new Date().toISOString(),
                archivedBy: 'admin'
            });
        }

        // Update current rates
        const currentRef = db.collection(COLLECTION).doc(CURRENT_DOC);
        batch.set(currentRef, {
            ...parseResult.data,
            updatedAt: new Date().toISOString(),
            fileName: file.name
        });

        await batch.commit();

        return NextResponse.json({
            success: true,
            message: 'Tarifas actualizadas correctamente',
            stats: parseResult.stats,
            diff
        });
    } catch (error: any) {
        console.error('Error processing towing rates:', error);
        return NextResponse.json(
            { error: `Error interno: ${error.message}` },
            { status: 500 }
        );
    }
}

/**
 * PUT: Update a single rate manually OR save all data from preview
 */
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();

        // Handle saveAll (from preview confirmation)
        if (body.saveAll && body.data) {
            const { firestore: db } = getSdks();
            const docRef = db.collection(COLLECTION).doc(CURRENT_DOC);
            const currentDoc = await docRef.get();

            const batch = db.batch();

            // Archive current version first
            if (currentDoc.exists) {
                const historyRef = db.collection(HISTORY_COLLECTION).doc();
                batch.set(historyRef, {
                    ...currentDoc.data(),
                    archivedAt: new Date().toISOString(),
                    archivedBy: 'admin'
                });
            }

            // Save new data
            batch.set(docRef, {
                ...body.data,
                updatedAt: new Date().toISOString(),
                fileName: body.fileName || 'Upload'
            });

            await batch.commit();

            return NextResponse.json({
                success: true,
                message: 'Tarifas actualizadas correctamente'
            });
        }

        // Handle single rate update
        const { destination, stateKey, cityName, newPrice } = body;

        if (!destination || !stateKey || !cityName || typeof newPrice !== 'number') {
            return NextResponse.json(
                { error: 'Parámetros inválidos' },
                { status: 400 }
            );
        }

        const { firestore: db } = getSdks();
        const docRef = db.collection(COLLECTION).doc(CURRENT_DOC);
        const doc = await docRef.get();

        if (!doc.exists) {
            return NextResponse.json(
                { error: 'No hay datos de tarifas. Por favor sube un archivo Excel primero.' },
                { status: 404 }
            );
        }

        const data = doc.data() as TowingRates;

        // Navigate to the city and update
        if (!data.destinations[destination]) {
            return NextResponse.json({ error: 'Destino no encontrado' }, { status: 404 });
        }
        if (!data.destinations[destination][stateKey]) {
            return NextResponse.json({ error: 'Estado no encontrado' }, { status: 404 });
        }

        const cityIndex = data.destinations[destination][stateKey].cities.findIndex(
            c => c.name === cityName
        );

        if (cityIndex === -1) {
            return NextResponse.json({ error: 'Ciudad no encontrada' }, { status: 404 });
        }

        // Get old price for history
        const oldPrice = data.destinations[destination][stateKey].cities[cityIndex].price;

        // Update the price
        data.destinations[destination][stateKey].cities[cityIndex].price = newPrice;

        // Save updated data
        await docRef.update({
            destinations: data.destinations,
            updatedAt: new Date().toISOString(),
            lastManualEdit: {
                destination,
                stateKey,
                cityName,
                oldPrice,
                newPrice,
                editedAt: new Date().toISOString()
            }
        });

        return NextResponse.json({
            success: true,
            message: `Precio actualizado: ${cityName} de $${oldPrice} a $${newPrice}`
        });
    } catch (error: any) {
        console.error('Error updating rate:', error);
        return NextResponse.json(
            { error: `Error interno: ${error.message}` },
            { status: 500 }
        );
    }
}
