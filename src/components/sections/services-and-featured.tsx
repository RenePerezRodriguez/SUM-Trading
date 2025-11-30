'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Search, Wrench, PackageCheck, ArrowRight, ExternalLink, ShieldCheck, FileCheck, Award } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { Car } from '@/lib/placeholder-data';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ICONS: { [key: string]: React.ElementType } = {
  Search: Search,
  Wrench: Wrench,
  PackageCheck: PackageCheck,
};

const STEP_COLORS = [
  { bg: 'bg-accent/10', border: 'border-accent/20', text: 'text-accent', icon: 'bg-accent', number: 'text-accent' },
  { bg: 'bg-primary/10', border: 'border-primary/20', text: 'text-primary', icon: 'bg-primary', number: 'text-primary' },
  { bg: 'bg-accent/10', border: 'border-accent/20', text: 'text-accent', icon: 'bg-accent', number: 'text-accent' },
];

export default function ServicesAndFeatured({ dict, lang }: { dict: any; lang: string }) {
  const servicesContent = dict.services;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const firestore = useFirestore();
  
  const featuredQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    const carsCollection = collection(firestore, 'cars');
    return query(carsCollection, where('isFeatured', '==', true), limit(3));
  }, [firestore]);

  const { data: cars, isLoading } = useCollection<Car>(featuredQuery);
  const featuredCars = cars || [];

  return (
    <section
      id="inventario-sum-trading"
      className="bg-gradient-to-b from-accent/5 to-background text-foreground relative overflow-hidden scroll-mt-24 section-py"
      ref={ref}
    >
      
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          
          {/* Left: Destacados (Idea 6: Inverted Layout) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-primary text-sm uppercase tracking-wider">
                  {dict.featuredCars.badge || 'Destacados'}
                </p>
                <Link 
                  href={`/${lang}/cars`}
                  className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                >
                  Ver todos <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline text-foreground">
                {dict.featuredCars.title}
              </h2>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-32 w-full rounded-xl bg-muted" />
                ))}
              </div>
            ) : featuredCars.length > 0 ? (
              <div className="space-y-4">
                {featuredCars.map((car, index) => (
                  <motion.div
                    key={car.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  >
                    <Link href={`/${lang}/cars/${car.id}`}>
                      {/* Idea 2: Glassmorphism - Adapted for Light Mode */}
                      <div className="group bg-white border border-border/60 shadow-sm rounded-xl p-4 hover:shadow-xl hover:border-primary/30 transition-all duration-300 cursor-pointer">
                        <div className="flex gap-4">
                          {/* Image */}
                          <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                            {car.images && car.images.length > 0 ? (
                              <Image
                                src={car.images[0].url}
                                alt={`${car.make} ${car.model}`}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Search className="w-8 h-8 text-muted-foreground" />
                              </div>
                            )}
                            {car.status === 'Sold' && (
                              <Badge className="absolute top-2 right-2 bg-destructive">
                                Vendido
                              </Badge>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-base sm:text-lg mb-1 text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
                                {car.year} {car.make} {car.model}
                                </h3>
                                <div className="text-sm text-muted-foreground space-y-1 mb-2">
                                <p>{car.mileage?.toLocaleString() || '0'} km</p>
                                </div>
                            </div>
                            
                            {/* Idea 18: Trust Badges */}
                            <div className="flex items-center gap-3 mb-2">
                                <div className="flex items-center gap-1 text-[10px] text-green-600 bg-green-100 px-1.5 py-0.5 rounded border border-green-200">
                                    <ShieldCheck className="w-3 h-3" />
                                    <span>Verificado</span>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded border border-blue-200">
                                    <FileCheck className="w-3 h-3" />
                                    <span>Título Limpio</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-auto">
                              <span className="text-xl sm:text-2xl font-bold text-primary">
                                ${car.price?.toLocaleString() || '0'}
                              </span>
                              <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>No hay vehículos destacados disponibles.</p>
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-6"
            >
              <Button asChild size="lg" variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white transition-colors">
                <Link href={`/${lang}/cars`}>
                  {dict.featuredCars.cta || 'Ver Catálogo Completo'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right: Cómo Funciona (Idea 6: Inverted Layout) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <div className="mb-8">
              <p className="font-semibold text-primary text-sm uppercase tracking-wider mb-3">
                {servicesContent.journey_title}
              </p>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline text-foreground mb-4">
                {servicesContent.title}
              </h2>
              <p className="text-muted-foreground text-base">
                {servicesContent.main_description}
              </p>
            </div>

            {/* Idea 19: Mobile Accordion */}
            <div className="block md:hidden">
                <Accordion type="single" collapsible defaultValue="item-0" className="space-y-4">
                    {servicesContent.items.map((item: any, index: number) => {
                        const Icon = ICONS[Object.keys(ICONS)[index]] || Search;
                        const colors = STEP_COLORS[index % STEP_COLORS.length];
                        return (
                            <AccordionItem key={index} value={`item-${index}`} className="border-none">
                                <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                                    <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                                        <div className="flex items-center gap-3 text-left">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0 ${colors.icon}`}>
                                                <span className="font-bold text-sm">{index + 1}</span>
                                            </div>
                                            <span className={`font-bold text-base ${colors.text}`}>{item.title}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="px-4 pb-4 pt-0 text-muted-foreground">
                                        <div className="pl-[44px]">
                                            {item.description}
                                        </div>
                                    </AccordionContent>
                                </div>
                            </AccordionItem>
                        );
                    })}
                </Accordion>
            </div>

            {/* Desktop List */}
            <div className="hidden md:block space-y-6 relative">
              {/* Connecting Line */}
              <div className="absolute left-6 top-12 bottom-12 w-0.5 bg-gradient-to-b from-primary/20 via-primary/50 to-primary/20" />

              {servicesContent.items.map((item: any, index: number) => {
                const Icon = ICONS[Object.keys(ICONS)[index]] || Search;
                const colors = STEP_COLORS[index % STEP_COLORS.length];

                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
                    className="flex gap-4 relative z-10"
                  >
                    {/* Number Badge */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full ${colors.bg} ${colors.border} border-2 flex items-center justify-center bg-background`}>
                      <span className={`text-2xl font-bold ${colors.number}`}>
                        {index + 1}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <div className={`${colors.icon} w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <h3 className={`font-bold text-lg ${colors.text}`}>
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground ml-[52px]">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-8"
            >
              <Button
                asChild
                size="lg"
                className="bg-primary text-white hover:bg-primary/90 w-full sm:w-auto"
              >
                <Link href={`/${lang}/contact`}>
                  {dict.navigation.contact} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
