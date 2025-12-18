'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Search, Car as CarIcon } from 'lucide-react';
import Link from 'next/link';

export default function RightPanel({lang, dict}: {lang: string, dict: any}) {
    const t = dict.hero.right_panel;

    // Accesos rápidos
    const quickActions = [
        { 
            label: 'Copart', 
            href: `http://localhost:9002/${lang}/search`, 
            icon: Search,
            color: 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20 text-blue-400'
        },
        { 
            label: 'IAA', 
            href: `http://localhost:9002/${lang}/search`, 
            icon: Search,
            color: 'bg-orange-500/10 border-orange-500/30 hover:bg-orange-500/20 text-orange-400'
        },
        { 
            label: 'Manheim', 
            href: `http://localhost:9002/${lang}/search`, 
            icon: Search,
            color: 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20 text-green-400'
        },
        { 
            label: 'Autos SUM', 
            href: `http://localhost:9002/${lang}/search`, 
            icon: CarIcon,
            color: 'bg-primary/10 border-primary/30 hover:bg-primary/20 text-primary'
        },
    ];

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 max-w-2xl mx-auto"
        >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-accent" />
                {t.quick_access || 'Accesos Directos'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    
                    return (
                        <Link key={index} href={action.href}>
                            <div className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all cursor-pointer ${action.color}`}>
                                <Icon className="w-6 h-6 mb-2" />
                                <span className="text-sm font-semibold">{action.label}</span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </motion.div>
    );
};
