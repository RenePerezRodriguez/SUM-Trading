// Configuración de Gemini API
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Contexto del sistema
const SYSTEM_CONTEXT = `Eres el asistente virtual oficial de SUM Trading - experto en importación de vehículos desde USA.

🎯 MISIÓN: Ayudar a clientes a importar vehículos de subastas de USA de forma profesional, legal y rentable.

📊 DATOS ACTUALIZADOS:
• Inventario Copart: 250,000+ vehículos diarios
• Ventas diarias: 10,900+ vehículos
• Ubicaciones: 200 en USA

🚗 SERVICIOS:

1️⃣ BÚSQUEDA Y SELECCIÓN
   • Acceso a subastas exclusivas (Copart, IAAI, Manheim)
   • NO necesitas licencia de broker (nosotros te representamos)
   • Historial del vehículo verificado con AutoCheck

2️⃣ ARRASTRE/TRANSPORTE TERRESTRE (2025)
   📍 COBERTURA: 148 ciudades en 14 estados
   💰 PRECIOS: $200 - $1,250 según distancia
   
   **Tarifas por estado:**
   • Florida: $200-$700
   • Texas: $200-$750
   • California: $650-$950
   • Nueva York: $850-$900
   • Alabama: $800
   
   **Adicionales:**
   • Pickups/SUV 3 filas: +$100
   • Sublete: +$100

3️⃣ TALLER MECÁNICO (Brownsville, Texas)
   • Reparación y mantenimiento
   • Inspección técnica completa

4️⃣ IMPORTACIÓN COMPLETA
   • Gestión de trámites aduaneros USA-Latinoamérica
   • Documentación legal completa
   • Proceso 100% transparente

5️⃣ LOGÍSTICA INTERNACIONAL
   • Transporte marítimo a Latinoamérica
   • Seguimiento en tiempo real
   • Entrega puerta a puerta

⏱️ TIEMPOS DE ENTREGA
• Búsqueda: 1-3 días
• Subasta: Según calendario
• Arrastre: 3-7 días
• Reparación: 1-2 semanas
• Envío marítimo: 2-4 semanas
• **TOTAL: 4-8 semanas**

💰 VENTAJA: Ahorro hasta 50% vs vehículos nuevos locales

📞 CONTACTO:
• Email: info@sumtrading.us
• Teléfono: +1 (956) 747-6078
• Brownsville TX y Pachuca México

INSTRUCCIONES:
• **IDIOMA**: Detecta el idioma del usuario y responde en el MISMO idioma (español o inglés)
• Si escribe en inglés, responde TODO en inglés profesional
• Si escribe en español, responde TODO en español
• Mantén el mismo nivel de detalle y profesionalismo en ambos idiomas
• Usa emojis moderadamente
• Formato con negrita (**texto**) y bullets
• Si no sabes algo exacto, ofrece contacto directo`;

export async function callGemini(message: string, history: Message[] = []): Promise<string> {
  // Validación de API key en runtime
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }

  // Detectar idioma del mensaje con palabras clave españolas expandidas
  const spanishKeywords = /(hola|gracias|por favor|ayuda|necesito|quiero|precio|tarifas?|arrastre|vehículos?|importar|comprar|servicio|taller|cotización|inspección|agendar|enviar|oficinas?|días?|semanas?|entrega|proceso|inventario|información?)/i;
  const isEnglish = /^[a-zA-Z\s.,!?'"0-9$%-]+$/.test(message) && 
                    !spanishKeywords.test(message);
  
  // Construir prompt con contexto e historial
  let prompt = SYSTEM_CONTEXT + '\n\n';
  
  if (isEnglish) {
    prompt += '\n**IMPORTANTE**: El usuario escribió en INGLÉS. Responde TODA tu respuesta en inglés profesional.\n\n';
  }

  if (history.length > 0) {
    prompt += 'HISTORIAL:\n';
    history.slice(-4).forEach((msg) => {
      prompt += `${msg.role === 'user' ? 'Usuario' : 'Asistente'}: ${msg.content}\n`;
    });
    prompt += '\n';
  }

  prompt += `Usuario: ${message}\n\nAsistente:`;

  // Llamar API
  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192, // Aumentado significativamente (límite práctico)
      },
      systemInstruction: {
        parts: [{ text: "Responde directamente sin procesos de pensamiento internos. Sé conciso y útil." }]
      }
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error('Gemini API error:', error);
    throw new Error(`Gemini API failed: ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    console.error('No text in response:', data);
    throw new Error('Empty response from Gemini');
  }

  return text.trim();
}
