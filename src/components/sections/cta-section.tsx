
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const findImage = (id: string) => {
  const img = PlaceHolderImages.find((p) => p.id === id);
  if (!img) return { url: 'https://placehold.co/1920x1080', hint: 'placeholder' };
  return { url: img.imageUrl, hint: img.imageHint };
};

const CtaContentCard = ({ dict, lang }: { dict: any; lang: string }) => {
  const content = dict?.cta || {
    title: 'Ready to Find Your Dream Car?',
    subtitle: 'Start your search today with our expert assistance.',
    description: 'Browse thousands of vehicles from top US auctions and get them delivered to your door.',
    button: 'Contact Us Now',
    catalog_title: 'Explorar Catálogo',
    catalog_desc: 'Busca entre miles de vehículos de subastas USA',
    advisor_title: 'Hablar con Experto',
    advisor_desc: 'Asesoría personalizada para tu importación',
  };

  return (
    <motion.div
      className="w-full max-w-4xl"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Title Section */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-headline mb-3 text-white drop-shadow-lg">
          {content.title}
        </h2>
        <p className="text-lg sm:text-xl text-white/90 drop-shadow">
          {content.subtitle}
        </p>
      </motion.div>

      {/* Split CTA Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Option 1: Ver Catálogo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Link href={`/${lang}/cars`} className="block group">
            <div className="h-full p-6 sm:p-8 rounded-2xl bg-white/95 backdrop-blur-sm border border-white/20 shadow-2xl hover:shadow-[0_20px_60px_rgba(237,35,29,0.3)] transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                  <svg className="w-7 h-7 text-primary group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                    {content.catalog_title || 'Explorar Catálogo'}
                  </h3>
                </div>
              </div>
              <p className="text-muted-foreground mb-6">
                {content.catalog_desc || 'Busca entre miles de vehículos de subastas USA'}
              </p>
              <div className="flex items-center text-primary font-semibold group-hover:gap-3 transition-all">
                Ver vehículos
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Option 2: Hablar con Asesor */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Link href={`/${lang}/contact`} className="block group">
            <div className="h-full p-6 sm:p-8 rounded-2xl bg-primary text-white shadow-2xl hover:shadow-[0_20px_60px_rgba(237,35,29,0.4)] transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
              {/* Subtle pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold">
                      {content.advisor_title || 'Hablar con Experto'}
                    </h3>
                  </div>
                </div>
                <p className="text-white/80 mb-6">
                  {content.advisor_desc || 'Asesoría personalizada para tu importación'}
                </p>
                <div className="flex items-center font-semibold group-hover:gap-3 transition-all">
                  Contactar ahora
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

const CtaBackgroundImage = () => {
  const ctaImage = findImage('cta-background');
  return (
    <div className="absolute inset-0 z-0">
      <motion.div
        initial={{ scale: 1 }}
        whileInView={{ scale: 1.05 }}
        transition={{ duration: 10, ease: "linear" }}
        viewport={{ once: false }}
        className="relative w-full h-full"
      >
        <Image
          src={ctaImage.url}
          alt="Car on a scenic road"
          fill
          className="object-cover"
          data-ai-hint={ctaImage.hint}
          sizes="100vw"
          priority={false}
        />
      </motion.div>
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
};

export default function CtaSection({ dict, lang }: { dict: any; lang: string }) {
  return (
    <section className="relative min-h-[500px] sm:min-h-[550px] lg:min-h-[600px] bg-background text-foreground overflow-hidden flex items-center">
      <CtaBackgroundImage />
      <div className="container relative z-10 py-12 lg:py-16">
        <CtaContentCard dict={dict} lang={lang} />
      </div>
    </section>
  );
}
