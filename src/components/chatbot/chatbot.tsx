'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, X, Send, Loader2, Minimize2, Sparkles } from 'lucide-react';
import { chatWithGemini } from '@/app/actions/chatbot';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
    role: 'user' | 'model';
    text: string;
}

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    // Fixed markdown syntax with proper spacing for lists
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'model',
            text: '¡Hola! Soy el asistente virtual de SUM Trading. Puedo ayudarte con información sobre:\n\n*   Importación de vehículos desde EE.UU.\n*   Subastas Copart, IAA y Manheim\n*   Costos y tiempos de importación\n*   Proceso de compra y envío\n*   Reparaciones y servicios\n*   Países de destino y regulaciones\n\n¿En qué puedo ayudarte?'
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [history, setHistory] = useState<any[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
        setIsLoading(true);

        try {
            const result = await chatWithGemini(userMessage, history);

            if (!result.success) {
                const errorText = 'error' in result ? result.error : 'Lo siento, ocurrió un error. Por favor, intenta de nuevo.';
                setMessages((prev) => [...prev, {
                    role: 'model',
                    text: errorText
                }]);
            } else {
                setMessages((prev) => [...prev, { role: 'model', text: result.response }]);
                setHistory(result.newHistory);
            }
        } catch (err) {
            console.error('[CHATBOT CLIENT] Error:', err);
            setMessages((prev) => [...prev, {
                role: 'model',
                text: 'Lo siento, ocurrió un error inesperado. Por favor, intenta de nuevo más tarde.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-4 font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="w-[calc(100vw-2rem)] sm:w-[420px] shadow-2xl rounded-2xl overflow-hidden border border-border/40 backdrop-blur-xl ring-1 ring-black/5 origin-bottom-right"
                    >
                        <Card className="h-[75vh] sm:h-[600px] flex flex-col border-0 bg-white shadow-none">
                            {/* Header - More elegant gradient */}
                            <CardHeader className="relative bg-gradient-to-r from-red-600 to-rose-600 text-white p-4 flex flex-row items-center justify-between space-y-0 shadow-md z-10 shrink-0">
                                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 mix-blend-overlay" />
                                <div className="flex items-center gap-3 relative z-10">
                                    <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md shadow-inner border border-white/10">
                                        <Sparkles className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base font-bold tracking-wide">Asistente SUM</CardTitle>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                                            </span>
                                            <p className="text-[11px] text-white/90 font-medium uppercase tracking-wider">En línea</p>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-white hover:bg-white/20 h-8 w-8 rounded-lg relative z-10 transition-all duration-200"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Minimize2 className="h-4 w-4" />
                                </Button>
                            </CardHeader>

                            {/* Messages Area */}
                            <CardContent className="flex-grow overflow-y-auto p-4 space-y-5 bg-slate-50 scroll-smooth">
                                {messages.map((msg, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={cn(
                                            "flex w-full",
                                            msg.role === 'user' ? "justify-end" : "justify-start"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "max-w-[85%] px-4 py-3 shadow-sm relative group",
                                                msg.role === 'user'
                                                    ? "bg-gradient-to-br from-red-600 to-rose-600 text-white rounded-2xl rounded-br-sm"
                                                    : "bg-white text-slate-800 border border-slate-200 rounded-2xl rounded-bl-sm"
                                            )}
                                        >
                                            {msg.role === 'model' ? (
                                                <div className="prose prose-sm max-w-none 
                                                    prose-p:my-1 prose-p:leading-relaxed 
                                                    prose-headings:font-bold prose-headings:text-slate-800 dark:prose-headings:text-slate-100 prose-headings:mt-3 prose-headings:mb-2 prose-headings:text-sm
                                                    prose-ul:my-2 prose-ul:list-disc prose-ul:pl-4 
                                                    prose-li:my-0.5 prose-li:marker:text-red-500
                                                    prose-strong:font-bold prose-strong:text-slate-900 dark:prose-strong:text-white
                                                    text-[13.5px]">
                                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                        {msg.text}
                                                    </ReactMarkdown>
                                                </div>
                                            ) : (
                                                <p className="text-[13.5px] leading-relaxed">{msg.text}</p>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                                {isLoading && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex justify-start w-full"
                                    >
                                        <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-3">
                                            <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                                            <span className="text-xs text-slate-500 font-medium">Escribiendo...</span>
                                        </div>
                                    </motion.div>
                                )}
                                <div ref={messagesEndRef} />
                            </CardContent>

                            {/* Footer */}
                            <CardFooter className="p-3 bg-white border-t border-slate-200">
                                <div className="flex w-full items-center gap-2 bg-slate-50 p-1.5 rounded-full border border-slate-200 focus-within:ring-2 focus-within:ring-red-100 transition-all duration-200">
                                    <Input
                                        ref={inputRef}
                                        placeholder="Escribe tu mensaje..."
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="flex-grow border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-4 h-9 text-sm placeholder:text-slate-400"
                                        disabled={isLoading}
                                    />
                                    <Button
                                        size="icon"
                                        onClick={handleSendMessage}
                                        disabled={!input.trim() || isLoading}
                                        className="shrink-0 h-9 w-9 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-sm transition-all duration-200 disabled:opacity-50 disabled:hover:bg-red-600"
                                    >
                                        <Send className="h-4 w-4 ml-0.5" />
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Button - More refined */}
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    size="lg"
                    variant="ghost"
                    className={cn(
                        "h-14 w-14 rounded-full shadow-xl transition-all duration-300 relative overflow-hidden",
                        isOpen
                            ? "bg-slate-800 hover:bg-slate-900 text-white"
                            : "bg-gradient-to-br from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white"
                    )}
                >
                    <AnimatePresence mode="wait">
                        {isOpen ? (
                            <motion.div
                                key="close"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <X className="h-6 w-6" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="open"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="relative"
                            >
                                <MessageCircle className="h-7 w-7" />
                                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-400 border-2 border-red-600" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Button>
            </motion.div>
        </div>
    );
}
