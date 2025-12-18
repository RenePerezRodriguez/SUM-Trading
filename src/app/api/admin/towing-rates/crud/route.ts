import { NextRequest, NextResponse } from 'next/server';
import { getSdks } from '@/firebase/admin-init';

const COLLECTION = 'towing-rates';
const CURRENT_DOC = 'current';
const HISTORY_COLLECTION = 'towing-rates-history';

// Normalize key helper
const normalizeKey = (name: string): string => {
    return name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
};

// Helper to archive current data before changes
async function archiveCurrentData(db: any, reason: string) {
    const currentDoc = await db.collection(COLLECTION).doc(CURRENT_DOC).get();
    if (currentDoc.exists) {
        await db.collection(HISTORY_COLLECTION).add({
            ...currentDoc.data(),
            archivedAt: new Date().toISOString(),
            archivedBy: reason
        });
    }
}

/**
 * POST: Create destination, state, or city
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, destination, state, city, price } = body;

        const { firestore: db } = getSdks();
        const docRef = db.collection(COLLECTION).doc(CURRENT_DOC);
        let doc = await docRef.get();

        // Initialize if no data exists
        let data = doc.exists ? doc.data() as any : { destinations: {} };
        if (!data.destinations) data.destinations = {};

        switch (action) {
            case 'createDestination': {
                if (!destination) {
                    return NextResponse.json({ error: 'Nombre de destino requerido' }, { status: 400 });
                }
                const destKey = normalizeKey(destination);
                if (data.destinations[destKey]) {
                    return NextResponse.json({ error: 'El destino ya existe' }, { status: 400 });
                }

                await archiveCurrentData(db, 'add-destination');
                data.destinations[destKey] = {};
                await docRef.set({ ...data, updatedAt: new Date().toISOString() });

                return NextResponse.json({
                    success: true,
                    message: `Destino "${destination}" creado`,
                    destinationKey: destKey
                });
            }

            case 'createState': {
                if (!destination || !state) {
                    return NextResponse.json({ error: 'Destino y nombre de estado requeridos' }, { status: 400 });
                }
                const destKey = normalizeKey(destination);
                const stateKey = normalizeKey(state);

                if (!data.destinations[destKey]) {
                    return NextResponse.json({ error: 'Destino no encontrado' }, { status: 404 });
                }
                if (data.destinations[destKey][stateKey]) {
                    return NextResponse.json({ error: 'El estado ya existe' }, { status: 400 });
                }

                await archiveCurrentData(db, 'add-state');
                data.destinations[destKey][stateKey] = { name: state, cities: [] };
                await docRef.set({ ...data, updatedAt: new Date().toISOString() });

                return NextResponse.json({
                    success: true,
                    message: `Estado "${state}" creado en ${destination}`,
                    stateKey
                });
            }

            case 'createCity': {
                if (!destination || !state || !city || typeof price !== 'number') {
                    return NextResponse.json({ error: 'Destino, estado, ciudad y precio requeridos' }, { status: 400 });
                }
                const destKey = normalizeKey(destination);
                const stateKey = normalizeKey(state);

                if (!data.destinations[destKey]?.[stateKey]) {
                    return NextResponse.json({ error: 'Estado no encontrado' }, { status: 404 });
                }

                const existingCity = data.destinations[destKey][stateKey].cities.find(
                    (c: any) => c.name.toLowerCase() === city.toLowerCase()
                );
                if (existingCity) {
                    return NextResponse.json({ error: 'La ciudad ya existe' }, { status: 400 });
                }

                await archiveCurrentData(db, 'add-city');
                data.destinations[destKey][stateKey].cities.push({ name: city, price });
                await docRef.set({ ...data, updatedAt: new Date().toISOString() });

                return NextResponse.json({
                    success: true,
                    message: `Ciudad "${city}" ($${price}) agregada a ${state}`
                });
            }

            default:
                return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
        }
    } catch (error: any) {
        console.error('CRUD POST error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * PUT: Update state name or city price
 */
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, destination, state, city, newName, newPrice, newStateName } = body;

        const { firestore: db } = getSdks();
        const docRef = db.collection(COLLECTION).doc(CURRENT_DOC);
        const doc = await docRef.get();

        if (!doc.exists) {
            return NextResponse.json({ error: 'No hay datos' }, { status: 404 });
        }

        const data = doc.data() as any;
        const destKey = normalizeKey(destination);

        switch (action) {
            case 'updateDestinationName': {
                if (!destination || !newName) {
                    return NextResponse.json({ error: 'Parámetros inválidos' }, { status: 400 });
                }
                const newDestKey = normalizeKey(newName);
                if (data.destinations[newDestKey] && newDestKey !== destKey) {
                    return NextResponse.json({ error: 'Ya existe un destino con ese nombre' }, { status: 400 });
                }

                await archiveCurrentData(db, 'rename-destination');
                data.destinations[newDestKey] = data.destinations[destKey];
                if (newDestKey !== destKey) delete data.destinations[destKey];
                await docRef.set({ ...data, updatedAt: new Date().toISOString() });

                return NextResponse.json({ success: true, message: `Destino renombrado a "${newName}"` });
            }

            case 'updateStateName': {
                const stateKey = normalizeKey(state);
                if (!data.destinations[destKey]?.[stateKey]) {
                    return NextResponse.json({ error: 'Estado no encontrado' }, { status: 404 });
                }

                await archiveCurrentData(db, 'rename-state');
                const newStateKey = normalizeKey(newStateName);
                data.destinations[destKey][newStateKey] = {
                    ...data.destinations[destKey][stateKey],
                    name: newStateName
                };
                if (newStateKey !== stateKey) delete data.destinations[destKey][stateKey];
                await docRef.set({ ...data, updatedAt: new Date().toISOString() });

                return NextResponse.json({ success: true, message: `Estado renombrado a "${newStateName}"` });
            }

            case 'updateCityPrice': {
                const stateKey = normalizeKey(state);
                if (!data.destinations[destKey]?.[stateKey]) {
                    return NextResponse.json({ error: 'Estado no encontrado' }, { status: 404 });
                }

                const cityIdx = data.destinations[destKey][stateKey].cities.findIndex(
                    (c: any) => c.name === city
                );
                if (cityIdx === -1) {
                    return NextResponse.json({ error: 'Ciudad no encontrada' }, { status: 404 });
                }

                await archiveCurrentData(db, 'update-price');
                data.destinations[destKey][stateKey].cities[cityIdx].price = newPrice;
                await docRef.set({ ...data, updatedAt: new Date().toISOString() });

                return NextResponse.json({ success: true, message: `Precio actualizado a $${newPrice}` });
            }

            case 'updateCityName': {
                const stateKey = normalizeKey(state);
                if (!data.destinations[destKey]?.[stateKey]) {
                    return NextResponse.json({ error: 'Estado no encontrado' }, { status: 404 });
                }

                const cityIdx = data.destinations[destKey][stateKey].cities.findIndex(
                    (c: any) => c.name === city
                );
                if (cityIdx === -1) {
                    return NextResponse.json({ error: 'Ciudad no encontrada' }, { status: 404 });
                }

                await archiveCurrentData(db, 'rename-city');
                data.destinations[destKey][stateKey].cities[cityIdx].name = newName;
                await docRef.set({ ...data, updatedAt: new Date().toISOString() });

                return NextResponse.json({ success: true, message: `Ciudad renombrada a "${newName}"` });
            }

            default:
                return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
        }
    } catch (error: any) {
        console.error('CRUD PUT error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * DELETE: Remove destination, state, or city
 */
export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, destination, state, city } = body;

        const { firestore: db } = getSdks();
        const docRef = db.collection(COLLECTION).doc(CURRENT_DOC);
        const doc = await docRef.get();

        if (!doc.exists) {
            return NextResponse.json({ error: 'No hay datos' }, { status: 404 });
        }

        const data = doc.data() as any;
        const destKey = normalizeKey(destination);

        switch (action) {
            case 'deleteDestination': {
                if (!data.destinations[destKey]) {
                    return NextResponse.json({ error: 'Destino no encontrado' }, { status: 404 });
                }

                await archiveCurrentData(db, 'delete-destination');
                delete data.destinations[destKey];
                await docRef.set({ ...data, updatedAt: new Date().toISOString() });

                return NextResponse.json({ success: true, message: `Destino "${destination}" eliminado` });
            }

            case 'deleteState': {
                const stateKey = normalizeKey(state);
                if (!data.destinations[destKey]?.[stateKey]) {
                    return NextResponse.json({ error: 'Estado no encontrado' }, { status: 404 });
                }

                await archiveCurrentData(db, 'delete-state');
                delete data.destinations[destKey][stateKey];
                await docRef.set({ ...data, updatedAt: new Date().toISOString() });

                return NextResponse.json({ success: true, message: `Estado "${state}" eliminado` });
            }

            case 'deleteCity': {
                const stateKey = normalizeKey(state);
                if (!data.destinations[destKey]?.[stateKey]) {
                    return NextResponse.json({ error: 'Estado no encontrado' }, { status: 404 });
                }

                const cityIdx = data.destinations[destKey][stateKey].cities.findIndex(
                    (c: any) => c.name === city
                );
                if (cityIdx === -1) {
                    return NextResponse.json({ error: 'Ciudad no encontrada' }, { status: 404 });
                }

                await archiveCurrentData(db, 'delete-city');
                data.destinations[destKey][stateKey].cities.splice(cityIdx, 1);
                await docRef.set({ ...data, updatedAt: new Date().toISOString() });

                return NextResponse.json({ success: true, message: `Ciudad "${city}" eliminada` });
            }

            default:
                return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
        }
    } catch (error: any) {
        console.error('CRUD DELETE error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
