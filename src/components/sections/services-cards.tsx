'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, FileCheck, Car, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function ServicesCards({ dict, lang }: { dict: any; lang: string }) {
    const services = dict.services_page;

    const servicesList = [
        {
            icon: Truck,
            title: services.towing_title,
            description: services.towing_desc,
            href: `/${lang}/services#tarifas-arrastre`,
            step: '01',
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
            border: 'group-hover:border-blue-500/50'
        },
        {
            icon: FileCheck,
            title: services.auction_title,
            description: services.auction_desc,
            href: `/${lang}/search`,
            step: '02',
            color: 'text-purple-400',
            bg: 'bg-purple-500/10',
            border: 'group-hover:border-purple-500/50'
        },
        {
            icon: Car,
            title: services.sum_cars_title,
            description: services.sum_cars_desc,
            href: `/${lang}#inventario-sum-trading`,
            step: '03',
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            border: 'group-hover:border-emerald-500/50'
        },
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <section className="relative py-16 md:py-24 bg-[#0B0F17] overflow-hidden border-t border-white/10">

            <div className="container relative z-10">
                <div className="text-center mb-12 md:mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl lg:text-5xl font-bold font-headline mb-6 text-white"
                    >
                        {services.title}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed"
                    >
                        {services.description}
                    </motion.p>
                </div>

                {/* Process Flow Header */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="hidden md:flex justify-center items-center gap-4 mb-8"
                >
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center">
                            <span className="text-blue-400 font-bold">1</span>
                        </div>
                        <span className="text-gray-400 text-sm">Transporte</span>
                    </div>
                    <div className="flex-1 max-w-[80px] h-[2px] bg-gradient-to-r from-blue-500/50 to-purple-500/50 relative">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-6 border-transparent border-l-purple-500/70" />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center">
                            <span className="text-purple-400 font-bold">2</span>
                        </div>
                        <span className="text-gray-400 text-sm">Subasta</span>
                    </div>
                    <div className="flex-1 max-w-[80px] h-[2px] bg-gradient-to-r from-purple-500/50 to-emerald-500/50 relative">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-6 border-transparent border-l-emerald-500/70" />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center">
                            <span className="text-emerald-400 font-bold">3</span>
                        </div>
                        <span className="text-gray-400 text-sm">Entrega</span>
                    </div>
                </motion.div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="relative grid gap-6 md:grid-cols-3 max-w-7xl mx-auto mb-12"
                >

                    {servicesList.map((service, index) => {
                        const Icon = service.icon;
                        return (
                            <motion.div key={index} variants={item} className="relative z-10">
                                <Link href={service.href} className="block group h-full">
                                    <div className={cn(
                                        "relative h-full rounded-2xl border border-white/10 p-8 transition-all duration-500",
                                        "bg-white/5 hover:shadow-xl hover:-translate-y-2 hover:bg-white/10",
                                        service.border
                                    )}>
                                        {/* Step Badge - Top Left (inside card) */}
                                        <div className={cn(
                                            "absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg z-20",
                                            index === 0 ? "bg-blue-500" : index === 1 ? "bg-purple-500" : "bg-emerald-500"
                                        )}>
                                            {index + 1}
                                        </div>

                                        {/* Step Number Background */}
                                        <div className="absolute top-4 right-6 text-7xl font-bold text-white/5 select-none group-hover:text-white/10 transition-colors font-headline">
                                            {service.step}
                                        </div>

                                        <div className="relative z-10 flex flex-col h-full">
                                            <div className={cn(
                                                "w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 group-hover:scale-110",
                                                service.bg
                                            )}>
                                                <Icon className={cn("h-8 w-8 transition-colors", service.color)} />
                                            </div>

                                            <h3 className="text-2xl font-bold mb-4 text-white transition-colors">
                                                {service.title}
                                            </h3>

                                            <p className="text-gray-400 mb-8 leading-relaxed flex-grow transition-colors">
                                                {service.description}
                                            </p>

                                            <div className={cn(
                                                "flex items-center text-sm font-bold uppercase tracking-wider transition-all group-hover:gap-3",
                                                service.color
                                            )}>
                                                Ver más <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="text-center"
                >
                    <Button asChild size="lg" className="shadow-lg px-8 h-12 text-base font-semibold rounded-full">
                        <Link href={`/${lang}/services`}>
                            Ver Todos los Servicios
                        </Link>
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}
