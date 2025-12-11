const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '../docs/arrastre/Tarifas Arrastre 2025-diciembre-11.xlsx');

try {
    const workbook = XLSX.readFile(filePath);

    // Solo inspeccionar la hoja 'Brownsville' como referencia
    const sheetName = 'Brownsville';
    const worksheet = workbook.Sheets[sheetName];

    console.log(`\nInspeccionando hoja: ${sheetName}`);

    // Convertir hoja a JSON array de arrays para ver filas crudas
    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 0, defval: null });

    // Mostrar primeras 20 filas
    rows.slice(0, 20).forEach((row, index) => {
        console.log(`Fila ${index}:`, JSON.stringify(row));
    });

} catch (error) {
    console.error('Error:', error.message);
}
