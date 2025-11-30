const https = require('https');

const apiKey = process.argv[2] || process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error('Por favor proporciona una API KEY como argumento o define la variable de entorno GEMINI_API_KEY');
    console.error('Uso: node scripts/test-gemini.js TU_API_KEY');
    process.exit(1);
}

const prompt = process.argv[3] || 'Hola, ¿esto funciona?';

const data = JSON.stringify({
    contents: [{
        role: 'user',
        parts: [{ text: prompt }]
    }],
    generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
    }
});

const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
    }
};

console.log(`Probando API Key con modelo gemini-2.5-flash...`);

const req = https.request(options, (res) => {
    let responseBody = '';

    res.on('data', (chunk) => {
        responseBody += chunk;
    });

    res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
                const parsedData = JSON.parse(responseBody);
                if (parsedData.candidates && parsedData.candidates.length > 0) {
                    console.log('✅ ÉXITO: La API respondió correctamente.');
                    const content = parsedData.candidates[0].content;
                    if (content && content.parts && content.parts.length > 0) {
                        console.log('Respuesta:', content.parts[0].text);
                    } else {
                        console.log('Respuesta (Estructura completa):', JSON.stringify(parsedData, null, 2));
                    }
                } else {
                    console.log('⚠️ La API respondió pero no hubo candidatos (posiblemente bloqueado por seguridad).');
                    console.log(responseBody);
                }
            } catch (e) {
                console.error('❌ Error al parsear respuesta JSON:', e);
                console.log(responseBody);
            }
        } else {
            console.error(`❌ ERROR: La solicitud falló con código ${res.statusCode}`);
            try {
                const errorData = JSON.parse(responseBody);
                console.error('Detalle del error:', errorData.error.message);
                console.error('Razón:', errorData.error.status);
            } catch (e) {
                console.error('Respuesta cruda:', responseBody);
            }
        }
    });
});

req.on('error', (error) => {
    console.error('❌ Error de red:', error);
});

req.write(data);
// req.write(data); // GET request has no body
req.end();
