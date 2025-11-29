'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Search, Wrench, PackageCheck, ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { Car } from '@/lib/placeholder-data';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

const ICONS: { [key: string]: React.ElementType } = {
  Search: Search,
  Wrench: Wrench,
  PackageCheck: PackageCheck,
};

const STEP_COLORS = [
  { bg: 'bg-accent/10', border: 'border-accent/30', text: 'text-accent', icon: 'bg-accent', number: 'text-accent' },
  { bg: 'bg-primary/10', border: 'border-primary/30', text: 'text-primary', icon: 'bg-primary', number: 'text-primary' },
  { bg: 'bg-secondary/10', border: 'border-secondary/30', text: 'text-secondary', icon: 'bg-secondary', number: 'text-secondary' },
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
      className="bg-background text-foreground relative py-8 sm:py-12 md:py-16 overflow-hidden scroll-mt-24"
      ref={ref}
    >
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
          {/* Left: Cómo Funciona */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8">
              <p className="font-semibold text-accent text-sm uppercase tracking-wider mb-3">
                {servicesContent.journey_title}
              </p>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline text-foreground mb-4">
                {servicesContent.title}
              </h2>
              <p className="text-muted-foreground text-base">
                {servicesContent.main_description}
              </p>
            </div>

            {/* Steps List */}
            <div className="space-y-6 relative">
              {/* Connecting Line */}
              <div className="hidden md:block absolute left-6 top-12 bottom-12 w-0.5 bg-gradient-to-b from-accent via-primary to-secondary opacity-30" />

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
                className="bg-accent text-white hover:bg-accent/90"
              >
                <Link href={`/${lang}/contact`}>
                  {dict.navigation.contact} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right: Destacados (Lista) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-primary text-sm uppercase tracking-wider">
                  {dict.featuredCars.badge || 'Destacados'}
                </p>
                <Link 
                  href={`/${lang}/cars`}
                  className="text-sm text-accent hover:text-accent/80 transition-colors flex items-center gap-1"
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
                  <Skeleton key={i} className="h-32 w-full rounded-xl" />
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
                      <div className="group bg-card border border-border rounded-xl p-4 hover:shadow-lg hover:border-accent/50 transition-all duration-300 cursor-pointer">
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
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-base sm:text-lg mb-1 group-hover:text-accent transition-colors duration-300 line-clamp-2">
                              {car.year} {car.make} {car.model}
                            </h3>
                            <div className="text-sm text-muted-foreground space-y-1 mb-2">
                              <p>{car.mileage?.toLocaleString() || '0'} km</p>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold text-primary">
                                ${car.price?.toLocaleString() || '0'}
                              </span>
                              <ArrowRight className="w-5 h-5 text-accent group-hover:translate-x-1 transition-transform" />
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
              <Button asChild size="lg" variant="outline" className="w-full">
                <Link href={`/${lang}/cars`}>
                  {dict.featuredCars.cta || 'Ver Catálogo Completo'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
