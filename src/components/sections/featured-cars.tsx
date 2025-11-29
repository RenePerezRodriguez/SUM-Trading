
'use client';

import type { Car } from '@/lib/placeholder-data';
import { CarCard } from '@/components/car-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';
import SectionHeader from './section-header';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { motion } from 'framer-motion';

export default function FeaturedCars({ dict, lang }: { dict: any, lang: string }) {
  const firestore = useFirestore();
  
  const featuredQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    const carsCollection = collection(firestore, 'cars');
    return query(carsCollection, where('isFeatured', '==', true));
  }, [firestore]);

  const { data: cars, isLoading } = useCollection<Car>(featuredQuery);

  const featuredCars = cars || [];

  return (
    <section className="bg-background py-20">
      <div className="container">
        <div className="mb-12">
          <SectionHeader 
              title={dict.featuredCars.title}
              description={dict.featuredCars.description}
          />
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-96 gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-accent" />
            <p className="text-muted-foreground font-medium">Cargando vehículos destacados...</p>
          </div>
        ) : featuredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-fr">
            {featuredCars.slice(0, 7).map((car, index) => {
              // Bento Grid layout patterns
              let gridClass = '';
              
              if (index === 0) {
                // Featured principal - grande
                gridClass = 'md:col-span-2 md:row-span-2';
              } else if (index === 1 || index === 2) {
                // Medianos horizontales
                gridClass = 'md:col-span-1 md:row-span-1';
              } else if (index === 3) {
                // Mediano vertical
                gridClass = 'md:col-span-1 md:row-span-2';
              } else {
                // Pequeños normales
                gridClass = 'md:col-span-1 md:row-span-1';
              }

              return (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={gridClass}
                >
                  <CarCard car={car} lang={lang} dict={dict} />
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center h-48 flex flex-col items-center justify-center text-muted-foreground gap-4">
            <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <p className="font-medium">No hay vehículos destacados en este momento.</p>
          </div>
        )}
        
        <div className="mt-12 text-center">
          <Button asChild size="lg" className="font-semibold bg-accent hover:bg-accent/90">
            <Link href={`/${lang}/cars`}>
              {dict.featuredCars.cta}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
