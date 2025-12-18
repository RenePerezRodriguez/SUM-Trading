
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight,
  Banknote,
  FileCheck,
  FileText,
  MapPin,
  Search,
  ShieldCheck,
  Ship,
  Truck,
  CreditCard,
  Wrench,
  PackageCheck,
  MoveRight,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import LogisticsMap from './logistics-map';

const ICONS: { [key: string]: React.ElementType } = {
  Search: Search,
  Wrench: Wrench,
  PackageCheck: PackageCheck,
};

const TRUST_ICONS: { [key: string]: React.ElementType } = {
  Search: Search,
  FileCheck: FileCheck,
  Banknote: Banknote,
  FileText: FileText,
  Ship: Ship,
  MapPin: MapPin,
  CreditCard: CreditCard,
  Wrench: Wrench
};

const findImage = (id: string) => {
  const img = PlaceHolderImages.find((p) => p.id === id);
  if (!img) return { url: 'https://placehold.co/600x400', hint: 'placeholder' };
  return { url: img.imageUrl, hint: img.imageHint };
};

const roadImage = findImage('road-background');

// Colores para cada paso del flujo
const STEP_COLORS = [
  { bg: 'bg-accent/10', border: 'border-accent/30', text: 'text-accent', icon: 'bg-accent' },
  { bg: 'bg-primary/10', border: 'border-primary/30', text: 'text-primary', icon: 'bg-primary' },
  { bg: 'bg-secondary/10', border: 'border-secondary/30', text: 'text-secondary', icon: 'bg-secondary' },
];

export default function ServicesSection({
  dict,
  lang,
}: {
  dict: any;
  lang: string;
}) {
  const servicesContent = dict.services;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      className="bg-background text-foreground relative py-20 sm:py-32 overflow-hidden"
      id="services"
      ref={ref}
    >
      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-semibold text-accent text-sm uppercase tracking-wider mb-3">
            {servicesContent.journey_title}
          </p>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline text-foreground mb-4">
            {servicesContent.title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {servicesContent.main_description}
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {servicesContent.items.map((item: any, index: number) => {
            const Icon = ICONS[Object.keys(ICONS)[index]] || Search;
            const colors = STEP_COLORS[index % STEP_COLORS.length];
            
            // Bento Grid layout patterns
            let gridClass = '';
            if (index === 0) {
              // Paso 1 - Principal más grande
              gridClass = 'md:col-span-2 md:row-span-2';
            } else {
              // Pasos 2 y 3 - Medianos
              gridClass = 'md:col-span-1 md:row-span-1';
            }

            return (
              <Dialog key={item.title}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
                  className={gridClass}
                >
                  <DialogTrigger asChild>
                    <div className={`group cursor-pointer relative ${colors.bg} ${colors.border} border-2 rounded-2xl p-8 h-full hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col`}>
                      {/* Step Number Badge */}
                      <div className={`absolute -top-3 -right-3 ${colors.icon} text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shadow-lg z-10`}>
                        {index + 1}
                      </div>
                      
                      {/* Icon */}
                      <div className={`${colors.icon} ${index === 0 ? 'w-16 h-16' : 'w-14 h-14'} rounded-xl flex items-center justify-center mb-6 text-white shadow-md`}>
                        <Icon className={index === 0 ? 'w-8 h-8' : 'w-7 h-7'} />
                      </div>
                      
                      {/* Title */}
                      <h3 className={`font-bold ${index === 0 ? 'text-2xl' : 'text-xl'} mb-3 ${colors.text}`}>
                        {item.title}
                      </h3>
                      
                      {/* Description */}
                      <p className={`text-muted-foreground ${index === 0 ? 'text-base' : 'text-sm'} mb-6 flex-grow`}>
                        {item.description}
                      </p>

                      {/* Trust Points - Solo para el principal */}
                      {index === 0 && item.trustPoints && (
                        <div className="space-y-2 mt-auto">
                          {item.trustPoints.slice(0, 3).map((point: any) => {
                            const TrustIcon = TRUST_ICONS[point.icon];
                            return (
                              <div key={point.text} className="flex items-start gap-2">
                                <TrustIcon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${colors.text}`} />
                                <span className="text-xs text-muted-foreground">{point.text}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Click hint */}
                      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground group-hover:text-accent transition-colors">
                        <span>Ver detalles</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </DialogTrigger>
                  
                  <DialogContent className="sm:max-w-xl bg-card border-border text-foreground overflow-hidden flex flex-col max-h-[90vh]">
                    <div className="p-6 overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="font-headline text-2xl text-accent">
                          {item.modal.title}
                        </DialogTitle>
                      </DialogHeader>
                      <div 
                        className="prose prose-sm dark:prose-invert text-muted-foreground mt-4" 
                        dangerouslySetInnerHTML={{ __html: item.modal.description }}
                      />
                      {index === 2 && <div className="mt-4 h-48 rounded-lg overflow-hidden border"><LogisticsMap /></div>}
                    </div>
                  </DialogContent>
                </motion.div>
              </Dialog>
            );
          })}
        </div>

        {/* CTA Button */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
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
      </div>
    </section>
  );
}
