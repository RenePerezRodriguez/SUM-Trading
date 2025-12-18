'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';

export default function NotFound() {
    const params = useParams();
    const lang = (params?.lang as string) || 'es';

    const content = {
        es: {
            title: 'Página no encontrada',
            description: 'Lo sentimos, la página que buscas no existe o ha sido movida.',
            home: 'Ir al Inicio',
            search: 'Buscar Vehículos',
            back: 'Volver atrás'
        },
        en: {
            title: 'Page not found',
            description: 'Sorry, the page you are looking for does not exist or has been moved.',
            home: 'Go Home',
            search: 'Search Vehicles',
            back: 'Go back'
        }
    };

    const t = content[lang as keyof typeof content] || content.es;

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-lg"
            >
                {/* 404 Number */}
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="relative"
                >
                    <h1 className="text-[150px] sm:text-[200px] font-bold font-headline text-primary/10 leading-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl sm:text-8xl font-bold font-headline text-primary">
                            404
                        </span>
                    </div>
                </motion.div>

                {/* Message */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-4 mt-8"
                >
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                        {t.title}
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        {t.description}
                    </p>
                </motion.div>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-3 justify-center mt-8"
                >
                    <Button asChild size="lg" className="gap-2">
                        <Link href={`/${lang}`}>
                            <Home className="w-4 h-4" />
                            {t.home}
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="gap-2">
                        <Link href={`/${lang}/search`}>
                            <Search className="w-4 h-4" />
                            {t.search}
                        </Link>
                    </Button>
                </motion.div>

                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-6"
                >
                    <button
                        onClick={() => window.history.back()}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {t.back}
                    </button>
                </motion.div>

                {/* Decorative Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
                </div>
            </motion.div>
        </div>
    );
}
