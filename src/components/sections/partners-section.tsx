
'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Users, Trophy } from 'lucide-react';

const partners = [
  { 
    name: 'Copart', 
    logo: '/images/copart-logo.svg',
    href: 'https://www.copart.com/',
    license: '157272',
    status: 'active'
  },
  { 
    name: 'Manheim', 
    logo: 'https://mcom-header-footer.manheim.com/assets/common/OMIY_lockup.svg',
    href: 'https://site.manheim.com/en/locations.html',
    status: 'active'
  },
  { 
    name: 'IAA', 
    logo: 'https://cdn.freelogovectors.net/wp-content/uploads/2022/07/iaa-logo-freelogovectors.net_.png',
    href: 'https://www.iaai.com/',
    license: '632946',
    status: 'active'
  },
];

const trustStats = [
    { icon: ShieldCheck, value: '100%', label: 'Transacciones Seguras', tooltip: 'Encriptación SSL 256-bit / Pagos Verificados' },
    { icon: Users, value: '+500', label: 'Clientes Satisfechos', tooltip: 'Usuarios activos en los últimos 12 meses' },
    { icon: Trophy, value: 'Top', label: 'Broker Certificado', tooltip: 'Licencia Oficial de Importador Registrado' },
];

// Hook para contador animado
const useCounter = (end: number, duration: number = 2000) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let startTime: number;
        let animationFrame: number;
        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = (currentTime - startTime) / duration;
            if (progress < 1) {
                setCount(Math.floor(end * progress));
                animationFrame = requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };
        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration]);
    return count;
};
  
export default function PartnersSection({ dict }: { dict: any }) {
  const partnersContent = dict.partners;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const clientCount = useCounter(500, 2500);

  return (
    <section className="relative py-2 bg-black border-b border-white/10 overflow-hidden" ref={ref}>
      {/* 8. Heatmap/Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:14px_14px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black pointer-events-none" />

      <div className="container relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-12">
            
            {/* Left: Partners Logos */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 w-full lg:w-auto"
            >
                <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap font-mono mb-2 sm:mb-0 w-full sm:w-auto text-left">
                    {partnersContent.title}
                </span>
                {/* 6. Diagonal Separator */}
                <div className="hidden sm:block text-gray-700 font-mono text-lg">/</div>
                
                <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-4 sm:gap-12 px-0">
                    {partners.map((partner, index) => {
                        const isManheim = partner.name === 'Manheim';
                        return (
                            <motion.div
                            key={partner.name}
                            whileHover={{ scale: 1.05 }}
                            className="flex flex-col items-center gap-1 group relative"
                            >
                            <Link
                                href={partner.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block opacity-90 hover:opacity-100 transition-all duration-100"
                                title={partner.name}
                            >
                                <div className="relative">
                                    <Image
                                        src={partner.logo}
                                        alt={partner.name}
                                        height={24}
                                        width={100}
                                        className={`object-contain h-6 w-auto transition-all duration-300 ${
                                            isManheim 
                                            ? 'grayscale invert hover:grayscale-0 hover:invert-0' 
                                            : ''
                                        }`}
                                    />
                                    {/* 3. Status Indicators */}
                                    <span className="absolute -top-1 -right-2 w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                                </div>
                            </Link>
                            {partner.license && (
                                <span className="text-[9px] text-gray-600 font-mono tracking-wider group-hover:text-green-500 transition-colors">
                                    Lic: {partner.license}
                                </span>
                            )}
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Right: Trust Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full lg:w-auto mt-4 sm:mt-0"
            >
                {/* Mobile View: Minimalist Row */}
                <div className="flex sm:hidden items-center justify-between w-full border-t border-white/10 pt-4">
                    {trustStats.map((stat, index) => {
                        const Icon = stat.icon;
                        const isCounter = stat.value.includes('500');
                        const displayValue = isCounter ? `+${clientCount}` : stat.value;
                        
                        return (
                            <div key={index} className="flex flex-col items-center gap-1">
                                <div className="flex items-center gap-1.5">
                                    <Icon className="w-3.5 h-3.5 text-green-500" />
                                    <span className="font-mono font-bold text-sm text-white">{displayValue}</span>
                                </div>
                                <span className="text-[9px] text-gray-500 uppercase tracking-wider text-center max-w-[80px] leading-tight">
                                    {stat.label.split(' ')[0]} {/* Show only first word on mobile if needed, or keep full */}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Desktop View: Full Details */}
                <div className="hidden sm:flex items-center gap-10">
                    {trustStats.map((stat, index) => {
                        const Icon = stat.icon;
                        const isCounter = stat.value.includes('500');
                        const displayValue = isCounter ? `+${clientCount}` : stat.value;

                        return (
                            <div key={index} className="flex items-center gap-3 group relative cursor-help" title={stat.tooltip}>
                                <div className="relative w-8 h-8 flex items-center justify-center transition-colors shrink-0">
                                    <div className="absolute inset-0 border border-white/10 rounded-sm group-hover:border-green-500/50 transition-colors" />
                                    <Icon className="w-4 h-4 text-gray-500 group-hover:text-green-400 transition-colors" />
                                </div>
                                <div className="flex flex-col items-start">
                                    <span className="font-mono font-bold text-sm leading-none text-gray-200 group-hover:text-white transition-colors">
                                        {displayValue}
                                    </span>
                                    <span className="text-[9px] text-gray-600 font-medium uppercase tracking-wide mt-0.5 group-hover:text-gray-400 transition-colors text-left">
                                        {stat.label}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </motion.div>
        </div>
      </div>
    </section>
  );
}
