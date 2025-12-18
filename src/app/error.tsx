'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-lg"
            >
                {/* Error Icon */}
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="flex justify-center mb-8"
                >
                    <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center">
                        <AlertTriangle className="w-12 h-12 text-destructive" />
                    </div>
                </motion.div>

                {/* Message */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-4"
                >
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                        ¡Algo salió mal!
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Lo sentimos, ha ocurrido un error inesperado. Por favor, intenta de nuevo.
                    </p>
                    {error.digest && (
                        <p className="text-xs text-muted-foreground font-mono">
                            Código de error: {error.digest}
                        </p>
                    )}
                </motion.div>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-3 justify-center mt-8"
                >
                    <Button onClick={reset} size="lg" className="gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Intentar de nuevo
                    </Button>
                    <Button asChild variant="outline" size="lg" className="gap-2">
                        <Link href="/es">
                            <Home className="w-4 h-4" />
                            Ir al Inicio
                        </Link>
                    </Button>
                </motion.div>

                {/* Decorative Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-destructive/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                </div>
            </motion.div>
        </div>
    );
}
