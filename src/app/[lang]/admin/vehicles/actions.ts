'use server';

type VinVariable = {
  Value: string | null;
  ValueId: string | null;
  Variable: string;
  VariableId: number;
};

type NhtsaResponse = {
  Results: VinVariable[];
};

type DecodedVin = {
  make?: string;
  model?: string;
  year?: number;
};

// Helper function to find a value by VariableId from the API response
const findValue = (results: VinVariable[], variableId: number): string | null => {
  const found = results.find(v => v.VariableId === variableId);
  return found?.Value || null;
};

/**
 * Decodes a VIN using the NHTSA vPIC API.
 * This function is designed to be robust and handle cases where the primary 'Model' field is null.
 */
export async function fetchNhtsaVinData(vin: string): Promise<{ success: boolean; data?: any; error?: string; decoded?: DecodedVin; }> {
  if (vin.length < 17) {
    return { success: false, error: 'El VIN debe tener 17 caracteres.' };
  }

  const url = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`La API de NHTSA falló con el estado: ${response.status}`);
    }

    const rawData: NhtsaResponse = await response.json();

    if (!rawData || !rawData.Results || rawData.Results.length === 0) {
      throw new Error("No se encontraron resultados para este VIN.");
    }
    
    const errorCode = findValue(rawData.Results, 143);
    const errorText = findValue(rawData.Results, 191);

    if (errorCode && errorCode !== "0") {
        console.warn(`NHTSA API returned error for VIN ${vin}: ${errorText}`);
    }

    const make = findValue(rawData.Results, 26);
    const yearStr = findValue(rawData.Results, 29);
    let model = findValue(rawData.Results, 28);
    const makeId = findValue(rawData.Results, 27);

    const decodedData: DecodedVin = {};

    if (make) decodedData.make = make;
    if (yearStr) {
        const year = parseInt(yearStr, 10);
        if (!isNaN(year)) decodedData.year = year;
    }

    // Fallback logic for model
    if (!model || model.trim().toLowerCase() === 'not available' || model.trim() === '') {
        // First fallback: Check Series or Trim from the initial response
        const series = findValue(rawData.Results, 34); // 34: Series
        const trim = findValue(rawData.Results, 38);   // 38: Trim
        if (series) {
            model = series;
        } else if (trim) {
            model = trim;
        }
    }
    
    // Second fallback: Use the secondary API if model is still missing
    if ((!model || model.trim().toLowerCase() === 'not available' || model.trim() === '') && makeId && decodedData.year) {
        try {
            const modelsUrl = `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeIdYear/makeId/${makeId}/modelyear/${decodedData.year}?format=json`;
            const modelsResponse = await fetch(modelsUrl);
            const modelsData = await modelsResponse.json();
            if (modelsData.Count > 0 && modelsData.Results.length > 0) {
                const foundModel = modelsData.Results.find((m: any) => m.Model_Name && m.Model_Name.toLowerCase() !== 'not specified' && m.Model_Name.trim() !== '');
                if (foundModel) {
                    model = foundModel.Model_Name;
                }
            }
        } catch (e) {
            console.warn("Could not fetch specific models from secondary API, continuing without it.", e);
        }
    }

    if (model) {
        decodedData.model = model;
    }
    
    return {
      success: true,
      data: rawData.Results,
      decoded: decodedData,
    };

  } catch (error: any) {
    console.error("Error procesando los datos del VIN de la NHTSA:", error);
    return { success: false, error: error.message || "Ocurrió un error desconocido al procesar el VIN." };
  }
}
