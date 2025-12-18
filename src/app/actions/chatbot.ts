'use server';

import { CHATBOT_SYSTEM_PROMPT } from './chatbot-knowledge';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// Configuration
const GENERATION_CONFIG = {
    temperature: 0.7,
    maxOutputTokens: 10000,
    topP: 0.9,
    topK: 40,
};

const SAFETY_SETTINGS = [
    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
];

// Types
export type ChatResponse =
    | { success: true; response: string; newHistory: GeminiContent[] }
    | { success: false; error: string };

export interface GeminiContent {
    role: string;
    parts: { text: string }[];
}

/**
 * Extracts text from Gemini API response safely
 */
function extractResponseText(candidate: any): string | null {
    try {
        if (!candidate?.content?.parts || !Array.isArray(candidate.content.parts)) {
            return null;
        }

        const textPart = candidate.content.parts.find((part: any) => part.text);
        return textPart?.text || null;
    } catch (error) {
        console.error('[Chatbot] Error extracting response text:', error);
        return null;
    }
}

/**
 * Builds the conversation history with system prompt on first message
 */
function buildConversation(message: string, history: GeminiContent[]): GeminiContent[] {
    // If this is the first message, include system prompt
    if (history.length === 0) {
        return [
            {
                role: 'user',
                parts: [{ text: CHATBOT_SYSTEM_PROMPT }]
            },
            {
                role: 'model',
                parts: [{ text: 'Entendido. Soy el asistente experto de SUM Trading con conocimiento completo de todos nuestros servicios, costos, procesos y políticas. Estoy listo para ayudar con cualquier pregunta sobre importación de vehículos desde Estados Unidos.' }]
            },
            {
                role: 'user',
                parts: [{ text: message }]
            }
        ];
    }

    // For subsequent messages, just append the new message
    return [
        ...history,
        {
            role: 'user',
            parts: [{ text: message }]
        }
    ];
}

/**
 * Main chatbot function - handles conversation with Gemini API
 */
export async function chatWithGemini(
    message: string,
    history: GeminiContent[] = []
): Promise<ChatResponse> {
    // Validate API key
    if (!GEMINI_API_KEY) {
        console.error('[Chatbot] API key not configured');
        return {
            success: false,
            error: 'Configuración del chatbot incompleta. Por favor, contacta al equipo de soporte al +1 (956) 747-6078.'
        };
    }

    try {
        const contents = buildConversation(message, history);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents,
                    generationConfig: GENERATION_CONFIG,
                    safetySettings: SAFETY_SETTINGS
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('[Chatbot] Gemini API Error:', response.status, errorData);

                if (response.status === 429) {
                    return {
                        success: false,
                        error: 'Estamos recibiendo muchas consultas en este momento. Por favor, intenta de nuevo en unos segundos.'
                    };
                }

                if (response.status === 503) {
                    return {
                        success: false,
                        error: 'El servicio de IA está temporalmente sobrecargado. Por favor, intenta más tarde.'
                    };
                }

                return {
                    success: false,
                    error: 'Lo siento, estoy teniendo problemas técnicos. Por favor, intenta de nuevo en un momento o contacta directamente a nuestro equipo al +1 (956) 747-6078.'
                };
            }

            const data = await response.json();

            if (!data.candidates || data.candidates.length === 0) {
                return {
                    success: false,
                    error: 'No pude generar una respuesta. Por favor, reformula tu pregunta o contacta a nuestro equipo al +1 (956) 747-6078 para asistencia directa.'
                };
            }

            const responseText = extractResponseText(data.candidates[0]);

            if (!responseText) {
                console.error('[Chatbot] Could not extract text from response:', data.candidates[0]);
                return {
                    success: false,
                    error: 'Hubo un problema al procesar la respuesta. Por favor, intenta de nuevo o contacta a nuestro equipo al +1 (956) 747-6078.'
                };
            }

            return {
                success: true,
                response: responseText,
                newHistory: [
                    ...contents,
                    {
                        role: 'model',
                        parts: [{ text: responseText }]
                    }
                ]
            };
        } catch (fetchError: any) {
            clearTimeout(timeoutId);
            if (fetchError.name === 'AbortError') {
                console.error('[Chatbot] Request timed out');
                return {
                    success: false,
                    error: 'La respuesta está tardando demasiado. Por favor, intenta con una pregunta más corta o intenta de nuevo.'
                };
            }
            throw fetchError;
        }

    } catch (error: any) {
        console.error('[Chatbot] Error calling Gemini API:', error);
        return {
            success: false,
            error: 'Error de conexión. Por favor, verifica tu conexión a internet e intenta de nuevo, o contacta a nuestro equipo directamente al +1 (956) 747-6078.'
        };
    }
}
