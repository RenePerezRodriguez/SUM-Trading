'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, Send, Loader2, Minimize2, Trash2, RotateCcw, ArrowDown, ThumbsUp, ThumbsDown, Share2, Mic, Search, Volume2, VolumeX, Maximize2, Check, CheckCheck, Sparkles, Car, DollarSign, Calendar, Phone, Facebook, Instagram } from 'lucide-react';
import { SiTiktok } from 'react-icons/si';
import { cn } from '@/lib/utils';

// Componente de iconos sociales
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48" {...props}>
    <path fill="#fff" d="M4.9,43.3l2.7-9.8C5.9,30.6,5,27.3,5,24C5,13.5,13.5,5,24,5c5.1,0,9.8,2,13.4,5.6	C41,14.2,43,18.9,43,24c0,10.5-8.5,19-19,19c0,0,0,0,0,0h0c-3.2,0-6.3-0.8-9.1-2.3L4.9,43.3z"></path><path fill="#fff" d="M4.9,43.8c-0.1,0-0.3-0.1-0.4-0.1c-0.1-0.1-0.2-0.3-0.1-0.5L7,33.5c-1.6-2.9-2.5-6.2-2.5-9.6	C4.5,13.2,13.3,4.5,24,4.5c5.2,0,10.1,2,13.8,5.7c3.7,3.7,5.7,8.6,5.7,13.8c0,10.7-8.7,19.5-19.5,19.5c-3.2,0-6.3-0.8-9.1-2.3	L5,43.8C5,43.8,4.9,43.8,4.9,43.8z"></path><path fill="#cfd8dc" d="M24,5c5.1,0,9.8,2,13.4,5.6C41,14.2,43,18.9,43,24c0,10.5-8.5,19-19,19h0c-3.2,0-6.3-0.8-9.1-2.3	L4.9,43.3l2.7-9.8C5.9,30.6,5,27.3,5,24C5,13.5,13.5,5,24,5 M24,43L24,43L24,43 M24,43L24,43L24,43 M24,4L24,4C13,4,4,13,4,24	c0,3.4,0.8,6.7,2.5,9.6L3.9,43c-0.1,0.3,0,0.7,0.3,1c0.2,0.2,0.4,0.3,0.7,0.3c0.1,0,0.2,0,0.3,0l9.7-2.5c2.8,1.5,6,2.2,9.2,2.2	c11,0,20-9,20-20c0-5.3-2.1-10.4-5.8-14.1C34.4,6.1,29.4,4,24,4L24,4z"></path><path fill="#40c351" d="M35.2,12.8c-3-3-6.9-4.6-11.2-4.6C15.3,8.2,8.2,15.3,8.2,24c0,3,0.8,5.9,2.4,8.4L11,33l-1.6,5.8	l6-1.6l0.6,0.3c2.4,1.4,5.2,2.2,8,2.2h0c8.7,0,15.8-7.1,15.8-15.8C39.8,19.8,38.2,15.8,35.2,12.8z"></path><path fill="#fff" fillRule="evenodd" d="M19.3,16c-0.4-0.8-0.7-0.8-1.1-0.8c-0.3,0-0.6,0-0.9,0	s-0.8,0.1-1.3,0.6c-0.4,0.5-1.7,1.6-1.7,4s1.7,4.6,1.9,4.9s3.3,5.3,8.1,7.2c4,1.6,4.8,1.3,5.7,1.2c0.9-0.1,2.8-1.1,3.2-2.3	c0.4-1.1,0.4-2.1,0.3-2.3c-0.1-0.2-0.4-0.3-0.9-0.6s-2.8-1.4-3.2-1.5c-0.4-0.2-0.8-0.2-1.1,0.2c-0.3,0.5-1.2,1.5-1.5,1.9	c-0.3,0.3-0.6,0.4-1,0.1c-0.5-0.2-2-0.7-3.8-2.4c-1.4-1.3-2.4-2.8-2.6-3.3c-0.3-0.5,0-0.7,0.2-1c0.2-0.2,0.5-0.6,0.7-0.8	c0.2-0.3,0.3-0.5,0.5-0.8c0.2-0.3,0.1-0.6,0-0.8C20.6,19.3,19.7,17,19.3,16z" clipRule="evenodd"></path>
  </svg>
);

// Sonido de notificación (base64 para no depender de archivos externos)
const playNotificationSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  } catch (e) {
    console.log('Audio not supported');
  }
};

// Componente simple para renderizar markdown
const MarkdownText = ({ content }: { content: string }) => {
  const renderContent = () => {
    // Dividir por líneas
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let key = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Lista con bullets
      if (line.trim().startsWith('•') || line.trim().startsWith('*')) {
        const text = line.replace(/^[•\*]\s*/, '');
        elements.push(
          <li key={key++} className="ml-4" dangerouslySetInnerHTML={{ 
            __html: text
              .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>')
              .replace(/\*(.+?)\*/g, '<em>$1</em>')
          }} />
        );
      }
      // Texto normal
      else if (line.trim()) {
        elements.push(
          <p key={key++} className="mb-2" dangerouslySetInnerHTML={{
            __html: line
              .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>')
              .replace(/\*(.+?)\*/g, '<em>$1</em>')
          }} />
        );
      }
      // Línea vacía
      else {
        elements.push(<div key={key++} className="h-1" />);
      }
    }

    return elements;
  };

  return <div className="space-y-1">{renderContent()}</div>;
};

// Typing indicator con puntos animados
const TypingIndicator = () => (
  <div className="flex justify-start gap-2">
    {/* Avatar del bot */}
    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary flex items-center justify-center">
      <MessageCircle className="h-4 w-4 text-white" />
    </div>
    
    {/* Contenedor de puntos */}
    <div className="bg-card border shadow-sm rounded-lg px-4 py-3 flex items-center gap-1">
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1s' }}></div>
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms', animationDuration: '1s' }}></div>
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms', animationDuration: '1s' }}></div>
    </div>
  </div>
);

// Componente loading skeleton mejorado
const MessageSkeleton = () => (
  <div className="flex justify-start gap-2">
    {/* Avatar del bot */}
    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 animate-pulse"></div>
    
    {/* Contenido del mensaje */}
    <div className="flex-1 max-w-[80%] space-y-2">
      <div className="bg-card border shadow-sm rounded-lg px-3 py-2.5 space-y-2.5">
        {/* Línea principal */}
        <div className="flex items-center space-x-2">
          <div className="h-2.5 bg-gradient-to-r from-muted via-muted/60 to-muted rounded-full w-44 animate-pulse"></div>
          <div className="h-2.5 bg-gradient-to-r from-muted via-muted/60 to-muted rounded-full w-12 animate-pulse" style={{ animationDelay: '0.1s' }}></div>
        </div>
        
        {/* Línea secundaria */}
        <div className="flex items-center space-x-2">
          <div className="h-2.5 bg-gradient-to-r from-muted via-muted/60 to-muted rounded-full w-32 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="h-2.5 bg-gradient-to-r from-muted via-muted/60 to-muted rounded-full w-20 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
        </div>
        
        {/* Línea corta */}
        <div className="h-2.5 bg-gradient-to-r from-muted via-muted/60 to-muted rounded-full w-36 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
      
      {/* Timestamp placeholder */}
      <div className="h-2 bg-muted/40 rounded w-12 ml-3 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
    </div>
  </div>
);

// Empty state component con enfoque emocional
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
    <div className="relative mb-4">
      <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
      <div className="relative rounded-full bg-gradient-to-br from-primary to-primary/80 p-4 shadow-lg">
        <MessageCircle className="h-8 w-8 text-white" />
      </div>
    </div>
    <h3 className="text-base font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
      ¡Hola! 👋 Estoy aquí para ayudarte
    </h3>
    <p className="text-sm text-muted-foreground mb-4">
      Experto en importación de vehículos desde USA
    </p>
  </div>
);

// Componente para sugerencias contextuales
const ContextualSuggestions = ({ suggestions, onSelect }: { suggestions: string[], onSelect: (text: string) => void }) => {
  const suggestionIcons: Record<string, any> = {
    'catálogo': Car,
    'cotización': DollarSign,
    'contactar': Phone,
    'ver inventario': Car,
    'tipos disponibles': Car,
    'proceso': Sparkles,
    'ver proceso': Sparkles,
    'agendar llamada': Calendar,
    'agendar inspección': Calendar,
    'más info': Sparkles,
    'ver servicios': Sparkles,
    'enviar email': Phone,
    'ver oficinas': Phone,
  };
  
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {suggestions.map((suggestion, idx) => {
        const Icon = suggestionIcons[suggestion] || Sparkles;
        return (
          <button
            key={idx}
            onClick={() => onSelect(suggestion)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary/10 hover:bg-primary hover:text-white border border-primary/20 hover:border-primary rounded-full transition-all duration-200"
          >
            <Icon className="h-3 w-3" />
            {suggestion}
          </button>
        );
      })}
    </div>
  );
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  error?: boolean;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  error?: boolean;
}

const QUICK_REPLIES = [
  { text: '¿Cómo funciona?', icon: '✨', color: 'from-blue-500 to-cyan-500' },
  { text: 'Ver precios', icon: '💰', color: 'from-green-500 to-emerald-500' },
  { text: 'Catálogo completo', icon: '🚗', color: 'from-purple-500 to-pink-500' },
  { text: 'Hablar con experto', icon: '👨‍💼', color: 'from-orange-500 to-red-500' },
];

const STORAGE_KEY = 'sumtrading-chat-history';
const STORAGE_MINIMIZED_KEY = 'sumtrading-chat-minimized';

// Función para obtener saludo según hora
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return '¡Buenos días!';
  if (hour < 19) return '¡Buenas tardes!';
  return '¡Buenas noches!';
};

// Función para formatear tiempo relativo
const getRelativeTime = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  
  if (minutes < 1) return 'Ahora';
  if (minutes < 60) return `Hace ${minutes}m`;
  if (hours < 24) return `Hace ${hours}h`;
  return date.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
};

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSocial, setShowSocial] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showRating, setShowRating] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isCompactMode, setIsCompactMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const [messageQueue, setMessageQueue] = useState<string[]>([]);
  const [isOffline, setIsOffline] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Detectar dark mode
  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(isDark);
  }, []);

  // Detectar conexión online/offline
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      // Procesar queue cuando vuelve la conexión
      if (messageQueue.length > 0) {
        messageQueue.forEach(msg => handleSend(msg));
        setMessageQueue([]);
      }
    };
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [messageQueue]);

  // Cargar preferencia de sonido
  useEffect(() => {
    const savedSound = localStorage.getItem('sumtrading-chat-sound');
    if (savedSound !== null) {
      setIsSoundEnabled(savedSound === 'true');
    }
  }, []);

  // Guardar preferencia de sonido
  useEffect(() => {
    localStorage.setItem('sumtrading-chat-sound', isSoundEnabled.toString());
  }, [isSoundEnabled]);

  // Cargar modo compacto
  useEffect(() => {
    const savedCompact = localStorage.getItem('sumtrading-chat-compact');
    if (savedCompact !== null) {
      setIsCompactMode(savedCompact === 'true');
    }
  }, []);

  // Guardar modo compacto
  useEffect(() => {
    localStorage.setItem('sumtrading-chat-compact', isCompactMode.toString());
  }, [isCompactMode]);

  // Cargar historial y estado minimizado del localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    const savedMinimized = localStorage.getItem(STORAGE_MINIMIZED_KEY);
    
    if (savedMinimized) {
      setIsMinimized(savedMinimized === 'true');
    }
    
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setMessages(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })));
      } catch (e) {
        console.error('Error loading chat history:', e);
      }
    } else {
      // Mensaje inicial dinámico según hora del día
      setMessages([
        {
          role: 'assistant',
          content: `${getGreeting()} 👋 Soy tu asistente virtual de **SUM Trading**.\n\n¿Te gustaría importar un vehículo desde USA? Puedo ayudarte con información sobre:\n\n• **Inventario**: 250,000+ vehículos diarios\n• **Tarifas** de arrastre en 14 estados\n• **Tiempos** de entrega (4-8 semanas)\n• **Proceso** completo paso a paso\n\n¿En qué puedo ayudarte hoy?`,
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  // Guardar historial en localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  // Guardar estado minimizado
  useEffect(() => {
    localStorage.setItem(STORAGE_MINIMIZED_KEY, isMinimized.toString());
  }, [isMinimized]);

  // Scroll automático mejorado
  const scrollToBottom = useCallback((force = false) => {
    if (!messagesContainerRef.current) return;
    
    const container = messagesContainerRef.current;
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    
    if (force || isNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Detectar si debe mostrar botón de scroll
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Actualizar contador de no leídos cuando está minimizado
  useEffect(() => {
    if (isMinimized && messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
      setUnreadCount(prev => prev + 1);
    }
    if (!isMinimized) {
      setUnreadCount(0);
    }
  }, [messages, isMinimized]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || isLoading) return;

    // Comando especial /clear
    if (textToSend === '/clear') {
      handleClearHistory();
      setInput('');
      return;
    }

    // Si está offline, agregar a queue
    if (isOffline) {
      setMessageQueue(prev => [...prev, textToSend]);
      setInput('');
      const queueMessage: Message = {
        role: 'assistant',
        content: '📡 Sin conexión. Tu mensaje se enviará cuando vuelva la conexión.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, queueMessage]);
      return;
    }

    // Cancelar request anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();

    const userMessage: Message = {
      role: 'user',
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages.slice(-6),
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error('Error al obtener respuesta');
      }

      const data = await response.json();

      // Simular typing realista según longitud del mensaje
      const typingDelay = Math.min(data.response.length * 10, 2000);
      
      setTimeout(() => {
        setIsTyping(false);
        
        // Agregar mensaje principal
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        
        // Determinar sugerencias contextuales dinámicas según el contenido
        const content = data.response.toLowerCase();
        let suggestions = '';
        
        // Análisis más inteligente de keywords
        if (content.includes('precio') || content.includes('tarifa') || content.includes('costo') || content.includes('price') || content.includes('cost')) {
          suggestions = '__SUGGESTIONS__:catálogo,cotización,contactar';
        } else if (content.includes('vehículo') || content.includes('auto') || content.includes('carro') || content.includes('vehicle') || content.includes('car')) {
          suggestions = '__SUGGESTIONS__:ver inventario,tipos disponibles,proceso';
        } else if (content.includes('tiempo') || content.includes('semana') || content.includes('entrega') || content.includes('delivery') || content.includes('time')) {
          suggestions = '__SUGGESTIONS__:agendar llamada,más info,ver servicios';
        } else if (content.includes('contacto') || content.includes('hablar') || content.includes('llamar') || content.includes('contact') || content.includes('call')) {
          suggestions = '__SUGGESTIONS__:enviar email,agendar llamada,ver oficinas';
        } else if (content.includes('servicio') || content.includes('taller') || content.includes('reparación') || content.includes('service') || content.includes('repair')) {
          suggestions = '__SUGGESTIONS__:ver servicios,agendar inspección,más info';
        } else if (content.includes('importar') || content.includes('comprar') || content.includes('adquirir') || content.includes('import') || content.includes('buy')) {
          suggestions = '__SUGGESTIONS__:ver proceso,cotización,ver inventario';
        }
        
        // Agregar sugerencias como mensaje separado
        if (suggestions) {
          setTimeout(() => {
            const suggestionMessage: Message = {
              role: 'assistant',
              content: suggestions,
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, suggestionMessage]);
          }, 100);
        }
        
        setRetryCount(0);
        
        // Reproducir sonido si está habilitado
        if (isSoundEnabled && !isMinimized) {
          playNotificationSound();
        }
        
        // Mostrar rating después de 6+ mensajes
        if (messages.length >= 6) {
          setTimeout(() => setShowRating(true), 1000);
        }
      }, typingDelay);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request cancelled');
        return;
      }
      
      console.error('Error sending message:', error);
      setIsTyping(false);
      
      // Solo reintentar UNA vez
      if (retryCount < 1) {
        const retryMessage: Message = {
          role: 'assistant',
          content: '🔄 Lo siento, hubo un problema. Reintentando automáticamente...',
          timestamp: new Date(),
          error: true,
        };
        
        setMessages((prev) => [...prev, retryMessage]);
        setRetryCount(1);
        setTimeout(() => handleSend(textToSend), 2000);
      } else {
        // Después del reintento, mostrar error final
        const errorMessage: Message = {
          role: 'assistant',
          content: '⚠️ Parece que tenemos problemas técnicos. Por favor, intenta más tarde o contáctanos directamente al **+1 (305) 555-0100**.',
          timestamp: new Date(),
          error: true,
        };
        
        setMessages((prev) => [...prev, errorMessage]);
        setRetryCount(0); // Resetear para el próximo mensaje
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleClearHistory = () => {
    if (confirm('¿Estás seguro de que quieres borrar todo el historial del chat?')) {
      localStorage.removeItem(STORAGE_KEY);
      setMessages([
        {
          role: 'assistant',
          content: `${getGreeting()} 👋 Soy tu asistente virtual de **SUM Trading**.\n\n¿Te gustaría importar un vehículo desde USA? Puedo ayudarte con información sobre:\n\n• **Inventario**: 250,000+ vehículos diarios\n• **Tarifas** de arrastre en 14 estados\n• **Tiempos** de entrega (4-8 semanas)\n• **Proceso** completo paso a paso\n\n¿En qué puedo ayudarte hoy?`,
          timestamp: new Date(),
        },
      ]);
      setShowRating(false);
    }
  };

  const handleQuickReply = (reply: string) => {
    handleSend(reply);
  };

  const handleShareChat = () => {
    const chatText = messages
      .map(m => `${m.role === 'user' ? 'Tú' : 'Asistente'}: ${m.content}`)
      .join('\n\n');
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(chatText);
      alert('📋 Conversación copiada al portapapeles');
    }
  };

  const handleRating = (isPositive: boolean) => {
    // Aquí podrías enviar analytics
    console.log('Rating:', isPositive ? 'positive' : 'negative');
    setShowRating(false);
    
    const thankYouMessage: Message = {
      role: 'assistant',
      content: isPositive 
        ? '¡Gracias por tu feedback positivo! 😊 ¿Hay algo más en lo que pueda ayudarte?'
        : 'Gracias por tu feedback. Trabajaremos para mejorar. ¿Puedo ayudarte con algo más?',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, thankYouMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Shortcut Ctrl+K para abrir
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="group flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-primary/50"
          aria-label="Abrir chat"
          title="Presiona Ctrl+K para abrir"
        >
          <MessageCircle className="h-6 w-6 transition-transform group-hover:scale-110" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-green-400"></span>
          </span>
          {unreadCount > 0 && (
            <span className="absolute -top-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-lg animate-in zoom-in-50">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'fixed z-50 flex flex-col bg-card border shadow-xl transition-all duration-300 animate-in slide-in-from-bottom-4 fade-in-0',
        isMinimized 
          ? 'bottom-20 right-4 w-[calc(100vw-2rem)] max-w-sm h-16 rounded-2xl'
          : 'bottom-4 right-4 rounded-2xl',
        !isMinimized && (isCompactMode 
          ? 'w-[calc(100vw-2rem)] sm:w-[420px] h-[70vh] sm:h-[520px]' 
          : 'w-[calc(100vw-2rem)] sm:w-[440px] h-[82vh] sm:h-[620px] max-h-[700px]')
      )}
      style={{ maxHeight: isMinimized ? 'auto' : 'calc(100vh - 7rem)' }}
    >
      {/* Header */}
      <div className="border-b bg-gradient-to-r from-card to-card/95 text-foreground rounded-t-2xl shadow-sm">
        {/* Fila principal: Título, redes sociales y controles */}
        <div className="flex items-center justify-between gap-2 p-3 sm:p-3.5">
          {/* Izquierda: Avatar + Título + Redes Sociales */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              <MessageCircle className="h-6 w-6 text-primary" />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white animate-pulse"></span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold truncate">Asistente SUM Trading</h3>
              {!isMinimized && <p className="text-xs text-muted-foreground">En línea • Responde en segundos</p>}
            </div>
            
            {/* Redes sociales eliminadas del header para limpieza */}
            
            {isMinimized && unreadCount > 0 && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 text-xs font-bold text-white shadow-lg animate-bounce">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          
          {/* Derecha: Controles */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSearch(!showSearch)}
              className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
              title="Buscar"
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClearHistory}
              className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
              title="Limpiar"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
              title="Minimizar"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
              title="Cerrar"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Redes sociales móviles eliminadas */}
      </div>

      {!isMinimized && (
        <>
          {/* Barra de búsqueda */}
          {showSearch && (
            <div className="px-3 py-2 border-b bg-card">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar en conversación..."
                  className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          )}
          
          {/* Messages */}
          <div ref={messagesContainerRef} className={cn("flex-1 overflow-y-auto space-y-3 sm:space-y-4 bg-gradient-to-b from-muted/20 to-muted/10 relative scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent", isCompactMode ? "p-3 sm:p-4" : "p-4 sm:p-5")}>
            {messages.length === 0 && <EmptyState />}
            
            {/* Quick Replies dentro del chat (solo cuando está vacío) */}
            {messages.length === 0 && !isLoading && (
              <div className="space-y-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
                <p className="text-xs font-semibold text-center text-muted-foreground">Preguntas frecuentes</p>
                <div className="grid grid-cols-2 gap-2">
                  {QUICK_REPLIES.map((reply, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickReply(reply.text)}
                      className={cn(
                        "group relative overflow-hidden text-xs sm:text-sm px-3 py-3 rounded-xl transition-all duration-300 flex flex-col items-center gap-2 justify-center font-medium shadow-md hover:shadow-xl hover:scale-105 border border-transparent hover:border-white/20",
                        "bg-gradient-to-br", reply.color,
                        "text-white"
                      )}
                      disabled={isLoading}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <span className="text-2xl group-hover:scale-125 transition-transform duration-300">{reply.icon}</span>
                      <span className="text-center font-semibold">{reply.text}</span>
                      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300"></div>
                    </button>
                  ))}
                </div>

                {/* Social Links in Empty State */}
                <div className="flex justify-center gap-4 pt-4 pb-2">
                  <a href="https://wa.me/19567476078" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] transition-all hover:scale-110 hover:shadow-md" title="WhatsApp">
                    <WhatsAppIcon className="h-5 w-5 fill-current" />
                  </a>
                  <a href="https://www.facebook.com/SUMTrading" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] transition-all hover:scale-110 hover:shadow-md" title="Facebook">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href="https://www.instagram.com/sum.trading/" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-[#E1306C]/10 hover:bg-[#E1306C]/20 text-[#E1306C] transition-all hover:scale-110 hover:shadow-md" title="Instagram">
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a href="https://www.tiktok.com/@sum25177" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-black/5 hover:bg-black/10 text-black dark:text-white transition-all hover:scale-110 hover:shadow-md" title="TikTok">
                    <SiTiktok className="h-5 w-5" />
                  </a>
                </div>

                <div className="flex items-center justify-center gap-2 pt-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent"></div>
                  <span className="text-xs text-muted-foreground">o escribe tu pregunta</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent"></div>
                </div>
              </div>
            )}
            
            {messages
              .filter(msg => !searchQuery || msg.content.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((message, index) => {
                // Detectar sugerencias contextuales
                if (message.content.startsWith('__SUGGESTIONS__:')) {
                  const suggestions = message.content.replace('__SUGGESTIONS__:', '').split(',');
                  return (
                    <div key={index} className="flex justify-start">
                      <ContextualSuggestions 
                        suggestions={suggestions} 
                        onSelect={(text) => handleSend(text)} 
                      />
                    </div>
                  );
                }
                
                return (
              <div
                key={index}
                className={cn(
                  'flex animate-in fade-in-0 slide-in-from-bottom-1 duration-200',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {/* Avatar del bot */}
                {message.role === 'assistant' && !message.error && (
                  <div className="flex-shrink-0 mr-2 sm:mr-3">
                    <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <MessageCircle className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-primary" />
                    </div>
                  </div>
                )}
                
                <div
                  className={cn(
                    'max-w-[85%] sm:max-w-[80%] text-sm sm:text-base break-words shadow-sm transition-all',
                    isCompactMode ? "px-3 py-2 sm:px-3.5 sm:py-2.5" : "px-4 py-3 sm:px-5 sm:py-3.5",
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-2xl rounded-tr-none shadow-md'
                      : message.error
                      ? 'bg-red-50 text-red-900 border-2 border-red-200 rounded-2xl'
                      : 'bg-card border rounded-2xl rounded-tl-none shadow-sm'
                  )}
                >
                  {message.role === 'assistant' && !message.error ? (
                    <MarkdownText content={message.content} />
                  ) : (
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  )}
                  <div className="flex items-center justify-between mt-2 gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs sm:text-sm opacity-70" title={message.timestamp.toLocaleString('es')}>
                        {getRelativeTime(message.timestamp)}
                      </span>
                      {message.role === 'user' && !message.error && (
                        <span className="text-xs sm:text-sm opacity-70">
                          {index === messages.length - 1 && isLoading ? (
                            <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 inline" />
                          ) : (
                            <CheckCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 inline" />
                          )}
                        </span>
                      )}
                    </div>
                    {message.error && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm rounded-lg"
                        onClick={() => handleSend(messages[index - 1]?.content)}
                      >
                        <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                        Reintentar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
                );
              })}
            
            {isTyping && <TypingIndicator />}
            
            {showRating && (
              <div className="flex justify-center animate-in fade-in-0 slide-in-from-bottom-2">
                <div className="bg-card border shadow-sm rounded-lg px-4 py-3 flex flex-col items-center gap-2">
                  <p className="text-xs text-muted-foreground text-center">¿Te fue útil esta conversación?</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRating(true)}
                      className="h-8 gap-1"
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      Sí
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRating(false)}
                      className="h-8 gap-1"
                    >
                      <ThumbsDown className="h-3.5 w-3.5" />
                      No
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
            
            {/* Scroll to bottom button */}
            {showScrollButton && (
              <button
                onClick={() => scrollToBottom(true)}
                className="absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-all hover:scale-110 animate-in zoom-in-50"
              >
                <ArrowDown className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Input */}
          <div className="p-3 sm:p-4 border-t bg-gradient-to-t from-card/50 to-card backdrop-blur-sm rounded-b-2xl">
            <div className="flex gap-2 items-center relative">
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isLoading ? "Escribiendo..." : "Escribe tu pregunta..."}
                  disabled={isLoading}
                  maxLength={500}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-background text-sm sm:text-base transition-all disabled:opacity-50 shadow-sm hover:shadow-md focus:shadow-lg"
                />
                {input.length > 400 && (
                  <span className={cn(
                    "absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium px-2 py-0.5 rounded-full",
                    input.length > 450 ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                  )}>
                    {500 - input.length}
                  </span>
                )}
              </div>
              <Button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                size="icon"
                className={cn(
                  "h-11 w-11 rounded-xl flex-shrink-0 transition-all duration-300 shadow-lg",
                  input.trim() && !isLoading
                    ? "bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 hover:scale-110 hover:rotate-12 hover:shadow-primary/50"
                    : "bg-muted opacity-50 cursor-not-allowed"
                )}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                ) : (
                  <Send className="h-5 w-5 text-white" />
                )}
              </Button>
            </div>
            <div className="flex items-center justify-between mt-2 px-1">
              <a 
                href="https://safesoft.tech" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] text-muted-foreground/70 hover:text-primary transition-colors flex items-center gap-1"
              >
                Powered by <strong className="font-semibold">SafeSoft.tech</strong>
              </a>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground/60 hidden sm:inline">Ctrl+K</span>
                {input.length > 0 && (
                  <span className={cn(
                    "text-xs font-medium transition-all duration-300",
                    input.length > 450 ? "text-red-500 scale-110" : "text-muted-foreground"
                  )}>
                    {input.length}/500
                  </span>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
