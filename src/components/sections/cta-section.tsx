
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
  const content = dict.cta;

  return (
    <motion.div
      className="bg-primary text-primary-foreground p-6 sm:p-8 md:p-12 rounded-lg max-w-lg w-full shadow-xl"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-2xl sm:text-3xl md:text-4xl font-bold font-headline mb-2"
      >
        {content.title}
      </motion.h2>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-lg sm:text-xl md:text-2xl font-headline mb-4 opacity-90"
      >
        {content.subtitle}
      </motion.p>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mb-8 text-base opacity-80"
      >
        {content.description}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Button asChild variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold border-2 border-transparent hover:border-white/20 shadow-none">
          <Link href={`/${lang}/contact`}>
            {content.button}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </motion.div>
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
              className="w-full h-full"
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
    <section className="relative min-h-[400px] sm:min-h-[500px] lg:h-[600px] bg-background text-foreground overflow-hidden">
      <CtaBackgroundImage />
      <div className="container relative z-10 flex items-center justify-center lg:justify-end h-full py-12 lg:py-0">
        <CtaContentCard dict={dict} lang={lang} />
      </div>
    </section>
  );
}
