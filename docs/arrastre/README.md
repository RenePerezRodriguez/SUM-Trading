# Guía de Implementación: Tarifas de Arrastre

Esta carpeta contiene los datos y scripts necesarios para generar las tarifas de arrastre utilizadas en la calculadora y el mapa del sitio web.

## Estructura de Archivos

*   `Tarifas Arrastre 2025-diciembre.xlsx`: **Fuente de verdad**. Archivo Excel proporcionado por el cliente con las tarifas actualizadas.
*   `towing-rates.json`: **Archivo final**. JSON generado que consume la aplicación web (`src/lib/towing-data.ts`).
*   `extracted-data.json`: Archivo intermedio generado por el primer script de extracción.

## Flujo de Datos

1.  **Excel** (`.xlsx`) -> `scripts/convert-xlsx.js` -> **JSON Crudo** (`extracted-data.json`)
2.  **JSON Crudo** -> `scripts/generate-towing-json.js` -> **JSON Final** (`towing-rates.json`)
3.  **JSON Final** -> `src/lib/towing-data.ts` -> **Componentes UI** (`TowingRatesAdvanced`, `TowingRatesMap`)

## Cómo Actualizar las Tarifas

Cuando recibas un nuevo archivo de Excel (ej. Enero 2026):

1.  **Colocar el archivo**: Guarda el nuevo `.xlsx` en esta carpeta (`docs/arrastre/`).
2.  **Actualizar Script**:
    *   Abre `scripts/convert-xlsx.js`.
    *   Modifica la línea `const filePath = ...` para que apunte al nuevo nombre de archivo.
3.  **Ejecutar Actualización**:
    Desde la raíz del proyecto, ejecuta:
    ```bash
    node scripts/convert-xlsx.js && node scripts/generate-towing-json.js
    ```
4.  **Verificar**:
    *   Revisa que `towing-rates.json` se haya actualizado.
    *   Verifica en la web (localhost) que los datos sean correctos.

## Notas Importantes

*   **Corrección de Typos**: El script `generate-towing-json.js` incluye una corrección automática para cambiar "North Calorina" a "North Carolina". Si el Excel corrige esto en el futuro, esa línea del script puede ser eliminada, aunque no hace daño dejarla.
*   **Formato del Excel**: Los scripts asumen que el Excel mantiene la estructura de columnas (Estado, Ciudad, Precio) en bloques repetidos. Si el formato del Excel cambia drásticamente, los scripts deberán ser ajustados.
