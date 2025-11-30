'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import HeroContent from './hero/hero-content';
import { shuffleArray } from '@/lib/utils';
import Image from 'next/image';
import type { Locale } from '@/lib/i18n-config';
import GridPatternBackground from './hero/grid-pattern-background';

export default function HeroSection({ dict, lang }: { dict: any; lang: Locale; }) {
  const [greetings, setGreetings] = useState<string[]>([]);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]); // Parallax effect

  useEffect(() => {
    // Client-side only effect
    const getGreetings = () => {
      let phrases: string[] = dict?.hero?.typewriter_phrases || [];
      return shuffleArray(phrases);
    };
    setGreetings(getGreetings());
  }, [dict.hero.typewriter_phrases]);


  return (
    <section className="relative bg-gray-900 text-white overflow-hidden -mt-28 min-h-[85vh] flex flex-col">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/home/portada-home.png"
          alt="Hero Background"
          fill
          className="object-cover opacity-20"
          priority
          sizes="100vw"
        />
        <GridPatternBackground />
      </div>

      <div
        className="absolute inset-0 z-10"
        style={{
          background: 'radial-gradient(circle at center, transparent 35%, rgba(0,0,0,0.9) 100%), linear-gradient(to bottom, transparent 65%, #000000 100%)'
        }}
      />

      <div className="relative container z-20 pt-52 md:pt-60 pb-8 md:pb-12 flex-grow flex flex-col justify-center">
        <HeroContent greetings={greetings} dict={dict} lang={lang} />
      </div>
    </section>
  );
}
