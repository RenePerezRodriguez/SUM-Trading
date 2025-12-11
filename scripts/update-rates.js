const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, '../docs/arrastre/Tarifas Arrastre 2025-diciembre-11.xlsx');
const OUTPUT_FILE = path.join(__dirname, '../docs/arrastre/towing-rates.json');

// Mapeo de nombres de hojas a claves de destino en JSON
const SHEET_TO_DESTINATION = {
    'Brownsville': 'brownsville',
    'FL, Launderdale': 'miami',
    'Delaware': 'delaware',
    'Houston': 'houston'
};

// Helper para limpiar strings
const cleanStr = (str) => str ? str.toString().trim() : '';
const cleanMoney = (val) => {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    // Quitar $ y ,
    const clean = val.toString().replace(/[$,]/g, '');
    return parseFloat(clean) || 0;
};

// Helper para slugify claves de estado
const slugify = (str) => {
    return cleanStr(str)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_|_$/g, '');
};

try {
    if (!fs.existsSync(INPUT_FILE)) {
        throw new Error(`Archivo no encontrado: ${INPUT_FILE}`);
    }

    const workbook = XLSX.readFile(INPUT_FILE);
    const result = { destinations: {} };

    Object.keys(SHEET_TO_DESTINATION).forEach(sheetName => {
        const destKey = SHEET_TO_DESTINATION[sheetName];
        const worksheet = workbook.Sheets[sheetName];

        if (!worksheet) {
            console.warn(`⚠️ Hoja '${sheetName}' no encontrada en el Excel.`);
            return;
        }

        console.log(`Procesando ${sheetName} -> ${destKey}...`);

        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null });
        const destData = {}; // stateSlug -> { name, cities: [] }

        let foundData = 0;

        rows.forEach((row, rowIndex) => {
            // Saltamos las primeras filas si no parecen contener datos válidos

            // Iteramos por bloques. Asumimos max 30 bloques horizontales
            for (let i = 0; i < 30; i += 4) { // Saltos de 4 (3 cols datos + 1 separación)
                const stateRaw = row[i];
                const cityRaw = row[i + 1];
                const priceRaw = row[i + 2];

                if (stateRaw && cityRaw && priceRaw) {
                    const price = cleanMoney(priceRaw);

                    // VALIDACIÓN MEJORADA:
                    // 1. Precio debe ser > 0
                    // 2. Ciudad debe ser string > 2 chars
                    // 3. Estado NO debe incluir "nota" o ser muy corto

                    if (price > 0 && typeof cityRaw === 'string' && cityRaw.length > 2) {
                        const stateName = cleanStr(stateRaw);

                        if (stateName.toLowerCase().includes('nota') || stateName.length < 3) {
                            continue; // Skip basura
                        }

                        const cityName = cleanStr(cityRaw);
                        const stateSlug = slugify(stateName);

                        if (!destData[stateSlug]) {
                            destData[stateSlug] = {
                                name: stateName,
                                cities: []
                            };
                        }

                        // Evitar duplicados si hay
                        const existingCity = destData[stateSlug].cities.find(c => c.name === cityName);
                        if (existingCity) {
                            existingCity.price = price;
                        } else {
                            destData[stateSlug].cities.push({
                                name: cityName,
                                price: price
                            });
                        }
                        foundData++;
                    }
                }
            }
        });

        console.log(`  -> Encontrados ${foundData} registros válidos.`);
        result.destinations[destKey] = destData;
    });

    // Guardar JSON
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));
    console.log(`\n✅ Éxito! Datos guardados en ${OUTPUT_FILE}`);

} catch (error) {
    console.error('❌ Error fatal:', error);
}
