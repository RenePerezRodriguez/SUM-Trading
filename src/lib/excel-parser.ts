import * as XLSX from 'xlsx';

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
}

export interface ParseResult {
    success: boolean;
    data?: TowingRates;
    error?: string;
    stats?: {
        destinations: number;
        states: number;
        cities: number;
    };
}

// Known typo corrections
const TYPO_CORRECTIONS: Record<string, string> = {
    'North Calorina': 'North Carolina',
    'Wahington': 'Washington',
    'Pensylvania': 'Pennsylvania',
    'Nort Carolina': 'North Carolina',
    'Noth Carolina': 'North Carolina',
};

// Normalize state name to key (lowercase, hyphens)
const normalizeKey = (name: string): string => {
    return name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
};

// Fix known typos in state names
const fixTypos = (name: string): string => {
    const trimmed = name.trim();
    return TYPO_CORRECTIONS[trimmed] || trimmed;
};

// Check if a row contains the header pattern (Estado, Ciudad, Monto)
const isHeaderRow = (row: any[]): boolean => {
    if (!row || row.length < 3) return false;

    const rowStr = row.map(c => String(c || '').toLowerCase().trim()).join('|');
    return rowStr.includes('estado') && (rowStr.includes('ciudad') || rowStr.includes('city')) &&
        (rowStr.includes('monto') || rowStr.includes('price') || rowStr.includes('precio'));
};

// Find column groups in header row - looking for Estado/Ciudad/Monto patterns
const findColumnGroups = (row: any[]): { stateCol: number; cityCol: number; priceCol: number }[] => {
    const groups: { stateCol: number; cityCol: number; priceCol: number }[] = [];

    for (let i = 0; i < row.length; i++) {
        const header = String(row[i] || '').toLowerCase().trim();

        // Found Estado/State column
        if (header === 'estado' || header === 'state') {
            // Look for Ciudad next
            let cityCol = -1;
            let priceCol = -1;

            for (let j = i + 1; j < Math.min(i + 4, row.length); j++) {
                const nextHeader = String(row[j] || '').toLowerCase().trim();
                if ((nextHeader === 'ciudad' || nextHeader === 'city') && cityCol === -1) {
                    cityCol = j;
                }
                if ((nextHeader === 'monto' || nextHeader === 'price' || nextHeader === 'precio') && priceCol === -1) {
                    priceCol = j;
                }
            }

            if (cityCol !== -1 && priceCol !== -1) {
                groups.push({ stateCol: i, cityCol, priceCol });
            }
        }
    }

    return groups;
};

/**
 * Parse Excel file buffer into TowingRates structure
 * Auto-detects column structure by finding "Estado/Ciudad/Monto" headers
 */
export function parseExcelBuffer(buffer: Buffer): ParseResult {
    try {
        const workbook = XLSX.read(buffer, { type: 'buffer' });

        const result: TowingRates = { destinations: {} };
        let totalStates = 0;
        let totalCities = 0;

        console.log('[Excel Parser] Processing sheets:', workbook.SheetNames);

        // Process each sheet as a destination
        for (const sheetName of workbook.SheetNames) {
            // Normalize destination name (FL, Launderdale -> florida-launderdale)
            const destinationKey = sheetName.toLowerCase()
                .replace(/,/g, '')
                .replace(/\s+/g, '-')
                .replace(/^-+|-+$/g, '')
                .trim();

            const sheet = workbook.Sheets[sheetName];
            if (!sheet) continue;

            // Convert to JSON array (include empty cells)
            const rows = XLSX.utils.sheet_to_json<any>(sheet, { header: 1, defval: null });
            if (rows.length < 3) continue;

            const destinationData: DestinationData = {};

            // Find the header row (contains Estado, Ciudad, Monto pattern)
            let headerRowIdx = -1;
            let columnGroups: { stateCol: number; cityCol: number; priceCol: number }[] = [];

            for (let i = 0; i < Math.min(15, rows.length); i++) {
                if (isHeaderRow(rows[i])) {
                    headerRowIdx = i;
                    columnGroups = findColumnGroups(rows[i]);
                    console.log(`[Excel Parser] Sheet "${sheetName}": Found headers at row ${i}, ${columnGroups.length} column groups`);
                    break;
                }
            }

            if (headerRowIdx === -1 || columnGroups.length === 0) {
                console.warn(`[Excel Parser] Sheet "${sheetName}": No valid header row found, skipping`);
                continue;
            }

            // Process data rows (start after header row)
            for (let rowIdx = headerRowIdx + 1; rowIdx < rows.length; rowIdx++) {
                const row = rows[rowIdx] as any[];
                if (!row || row.every(c => c === null || c === undefined || c === '')) continue;

                for (const group of columnGroups) {
                    const rawState = row[group.stateCol];
                    const rawCity = row[group.cityCol];
                    const rawPrice = row[group.priceCol];

                    const stateName = String(rawState || '').trim();
                    const cityName = String(rawCity || '').trim();

                    // Skip if no valid state or city name
                    if (!stateName || !cityName || stateName.toLowerCase() === 'estado' || cityName.toLowerCase() === 'ciudad') {
                        continue;
                    }

                    // Parse price
                    let price = 0;
                    if (typeof rawPrice === 'number') {
                        price = rawPrice;
                    } else if (typeof rawPrice === 'string') {
                        price = parseFloat(rawPrice.replace(/[$,]/g, '')) || 0;
                    }

                    // Skip rows without valid price
                    if (price <= 0) continue;

                    // Normalize and fix typos
                    const correctedState = fixTypos(stateName);
                    const stateKey = normalizeKey(correctedState);

                    // Add to destination data
                    if (!destinationData[stateKey]) {
                        destinationData[stateKey] = {
                            name: correctedState,
                            cities: []
                        };
                        totalStates++;
                    }

                    // Check if city already exists (avoid duplicates)
                    const existingCity = destinationData[stateKey].cities.find(
                        c => c.name.toLowerCase() === cityName.toLowerCase()
                    );

                    if (!existingCity) {
                        destinationData[stateKey].cities.push({
                            name: cityName,
                            price
                        });
                        totalCities++;
                    }
                }
            }

            if (Object.keys(destinationData).length > 0) {
                result.destinations[destinationKey] = destinationData;
                console.log(`[Excel Parser] Sheet "${sheetName}": Parsed ${Object.keys(destinationData).length} states`);
            }
        }

        const destinationCount = Object.keys(result.destinations).length;

        if (destinationCount === 0) {
            return {
                success: false,
                error: 'No se encontraron datos válidos. El archivo debe tener hojas con columnas: Estado, Ciudad, Monto (o Price/Precio).'
            };
        }

        console.log(`[Excel Parser] Success: ${destinationCount} destinations, ${totalStates} states, ${totalCities} cities`);

        return {
            success: true,
            data: result,
            stats: {
                destinations: destinationCount,
                states: totalStates,
                cities: totalCities
            }
        };
    } catch (error: any) {
        console.error('[Excel Parser] Error:', error);
        return {
            success: false,
            error: `Error al procesar el archivo: ${error.message}`
        };
    }
}

/**
 * Compare two TowingRates objects and return differences
 */
export function compareTowingRates(
    oldData: TowingRates,
    newData: TowingRates
): {
    added: { destination: string; state: string; city: string; price: number }[];
    removed: { destination: string; state: string; city: string; price: number }[];
    changed: { destination: string; state: string; city: string; oldPrice: number; newPrice: number }[];
} {
    const added: any[] = [];
    const removed: any[] = [];
    const changed: any[] = [];

    // Check new data against old
    for (const [destKey, destData] of Object.entries(newData.destinations)) {
        const oldDest = oldData.destinations[destKey];

        for (const [stateKey, stateData] of Object.entries(destData)) {
            const oldState = oldDest?.[stateKey];

            for (const city of stateData.cities) {
                const oldCity = oldState?.cities.find(c => c.name === city.name);

                if (!oldCity) {
                    added.push({
                        destination: destKey,
                        state: stateData.name,
                        city: city.name,
                        price: city.price
                    });
                } else if (oldCity.price !== city.price) {
                    changed.push({
                        destination: destKey,
                        state: stateData.name,
                        city: city.name,
                        oldPrice: oldCity.price,
                        newPrice: city.price
                    });
                }
            }
        }
    }

    // Check for removed items
    for (const [destKey, destData] of Object.entries(oldData.destinations)) {
        const newDest = newData.destinations[destKey];

        for (const [stateKey, stateData] of Object.entries(destData)) {
            const newState = newDest?.[stateKey];

            for (const city of stateData.cities) {
                const newCity = newState?.cities.find(c => c.name === city.name);

                if (!newCity) {
                    removed.push({
                        destination: destKey,
                        state: stateData.name,
                        city: city.name,
                        price: city.price
                    });
                }
            }
        }
    }

    return { added, removed, changed };
}
