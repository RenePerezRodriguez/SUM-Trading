import { getSdks } from '@/firebase/admin-init';

export interface CityRate {
    name: string;
    price: number;
}

export interface StateData {
    name: string;
    cities: CityRate[];
}

export interface DestinationData {
    [stateKey: string]: StateData;
}

export interface TowingRates {
    destinations: {
        [destinationKey: string]: DestinationData;
    };
    updatedAt?: string;
}

const COLLECTION = 'towing-rates';
const CURRENT_DOC = 'current';

// Cache for server-side data (revalidates on deploy or after TTL)
let cachedData: TowingRates | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

/**
 * Fetch towing rates from Firestore (server-side only)
 * Uses in-memory cache to avoid repeated Firestore reads
 */
export async function getTowingRates(): Promise<TowingRates> {
    const now = Date.now();

    // Return cached data if still valid
    if (cachedData && (now - cacheTimestamp) < CACHE_TTL_MS) {
        return cachedData;
    }

    try {
        const { firestore } = getSdks();
        const doc = await firestore.collection(COLLECTION).doc(CURRENT_DOC).get();

        if (!doc.exists) {
            console.warn('[TowingData] No data in Firestore, returning empty');
            return { destinations: {} };
        }

        const data = doc.data() as TowingRates;

        // Update cache
        cachedData = data;
        cacheTimestamp = now;

        return data;
    } catch (error) {
        console.error('[TowingData] Error fetching from Firestore:', error);
        // Return cached data if available, even if expired
        if (cachedData) {
            console.warn('[TowingData] Returning stale cached data');
            return cachedData;
        }
        return { destinations: {} };
    }
}

/**
 * Get all available destinations
 */
export async function getDestinations(): Promise<{ id: string; label: string }[]> {
    const data = await getTowingRates();
    return Object.keys(data.destinations).map(key => ({
        id: key,
        label: key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, ' ')
    }));
}

/**
 * Get all states for a destination
 */
export async function getStatesByDestination(destinationId: string): Promise<{ id: string; name: string }[]> {
    const data = await getTowingRates();
    const destination = data.destinations[destinationId];
    if (!destination) return [];

    return Object.keys(destination).map(key => ({
        id: key,
        name: destination[key].name
    })).sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get all cities for a state
 */
export async function getCitiesByState(destinationId: string, stateId: string): Promise<CityRate[]> {
    const data = await getTowingRates();
    const destination = data.destinations[destinationId];
    if (!destination) return [];

    const state = destination[stateId];
    if (!state) return [];

    return [...state.cities].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get rate for a specific city
 */
export async function getRate(destinationId: string, stateId: string, cityName: string): Promise<number> {
    const cities = await getCitiesByState(destinationId, stateId);
    return cities.find(c => c.name === cityName)?.price || 0;
}

/**
 * Force refresh the cache (call after updates)
 */
export function invalidateTowingCache(): void {
    cachedData = null;
    cacheTimestamp = 0;
}
