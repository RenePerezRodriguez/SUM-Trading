import { NextRequest, NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini';
import { getCachedChatResponse, setCachedChatResponse, COMMON_CHAT_RESPONSES } from '@/lib/cache';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatRequest {
  message: string;
  history?: Message[];
}

export async function POST(request: NextRequest) {
  try {
    const { message, history = [] }: ChatRequest = await request.json();

    if (!message?.trim()) {
      return NextResponse.json(
        { error: 'El mensaje no puede estar vacío' },
        { status: 400 }
      );
    }

    // 1. Verificar respuestas comunes pre-cacheadas
    const normalizedMessage = message.toLowerCase().trim();
    const commonResponse = COMMON_CHAT_RESPONSES[normalizedMessage];
    if (commonResponse) {
      return NextResponse.json({
        response: commonResponse,
        timestamp: new Date().toISOString(),
        cached: true,
      });
    }

    // 2. Verificar caché de respuestas
    const cachedResponse = getCachedChatResponse(message);
    if (cachedResponse) {
      return NextResponse.json({
        response: cachedResponse,
        timestamp: new Date().toISOString(),
        cached: true,
      });
    }

    // 3. Llamar a Gemini y cachear respuesta
    const response = await callGemini(message, history);
    setCachedChatResponse(message, response);

    return NextResponse.json({
      response,
      timestamp: new Date().toISOString(),
      cached: false,
    });
  } catch (error) {
    console.error('Chatbot API error:', error);
    return NextResponse.json(
      {
        error: 'Error al procesar la solicitud',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

