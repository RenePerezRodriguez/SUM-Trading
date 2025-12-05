const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../docs/arrastre/extracted-data.json');
const outputPath = path.join(__dirname, '../docs/arrastre/towing-rates.json');

const DESTINATION_MAP = {
    'Brownsville': 'brownsville',
    'Houston': 'houston',
    'Delaware': 'delaware',
    'FL, Launderdale': 'miami'
};

try {
    const rawData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
    const finalData = { destinations: {} };

    Object.entries(rawData).forEach(([sheetName, rows]) => {
        const destinationKey = DESTINATION_MAP[sheetName];
        if (!destinationKey) {
            console.warn(`Skipping unknown sheet: ${sheetName}`);
            return;
        }

        finalData.destinations[destinationKey] = {};
        const destinationData = finalData.destinations[destinationKey];

        // Find the header row index (where "Estado" appears)
        let headerRowIndex = -1;
        for (let i = 0; i < rows.length; i++) {
            if (rows[i] && rows[i].includes('Estado ')) {
                headerRowIndex = i;
                break;
            }
        }

        if (headerRowIndex === -1) {
            console.warn(`No header row found for ${sheetName}`);
            return;
        }

        // Visual inspection of extracted-data.json shows blocks at indices 0, 4, 8...
        const blocks = [0, 4, 8];

        blocks.forEach(colIndex => {
            // Iterate rows starting from headerRowIndex + 1
            for (let i = headerRowIndex + 1; i < rows.length; i++) {
                const row = rows[i];
                if (!row) continue;

                const state = row[colIndex];
                const city = row[colIndex + 1];
                const price = row[colIndex + 2];

                // Stop if we hit a new header or empty/invalid data
                if (!state || state === 'Tarifas Terrestres' || state === 'Estado ') continue;

                // Clean up data
                let cleanState = String(state).trim();
                const cleanCity = String(city).trim();
                const cleanPrice = Number(price);

                // Fix typos
                if (cleanState === 'North Calorina') cleanState = 'North Carolina';

                if (!cleanState || !cleanCity || isNaN(cleanPrice)) continue;

                // Normalize state key (lowercase, replace spaces with underscores)
                const stateKey = cleanState.toLowerCase().replace(/\s+/g, '_');

                if (!destinationData[stateKey]) {
                    destinationData[stateKey] = {
                        name: cleanState,
                        cities: []
                    };
                }

                destinationData[stateKey].cities.push({
                    name: cleanCity,
                    price: cleanPrice
                });
            }
        });
    });

    fs.writeFileSync(outputPath, JSON.stringify(finalData, null, 2));
    console.log('Successfully generated:', outputPath);

} catch (error) {
    console.error('Error processing data:', error);
    process.exit(1);
}
