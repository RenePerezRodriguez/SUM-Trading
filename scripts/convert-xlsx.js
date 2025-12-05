const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../docs/arrastre/Tarifas Arrastre 2025-diciembre.xlsx');
const outputPath = path.join(__dirname, '../docs/arrastre/extracted-data.json');

try {
    if (!fs.existsSync(filePath)) {
        console.error('File not found:', filePath);
        process.exit(1);
    }

    const workbook = XLSX.readFile(filePath);
    const sheetNames = workbook.SheetNames;
    console.log('Sheets found:', sheetNames);

    const allData = {};

    sheetNames.forEach(name => {
        const worksheet = workbook.Sheets[name];
        allData[name] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    });

    fs.writeFileSync(outputPath, JSON.stringify(allData, null, 2));
    console.log('Data extracted to:', outputPath);

} catch (error) {
    console.error('Error reading file:', error);
    process.exit(1);
}
