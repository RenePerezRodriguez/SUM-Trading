'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import HeroContent from './hero/hero-content';
import { shuffleArray } from '@/lib/utils';
import Image from 'next/image';
import type { Locale } from '@/lib/i18n-config';

export default function HeroSection({ dict, lang }: { dict: any; lang: Locale; }) {
  const [greetings, setGreetings] = useState<string[]>([]);
  
  useEffect(() => {
    // Client-side only effect
    const getGreetings = () => {
        let phrases: string[] = dict.hero.typewriter_phrases;
        return shuffleArray(phrases);
    };
    setGreetings(getGreetings());
  }, [dict.hero.typewriter_phrases]);


  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden -mt-28">
        <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1543465077-db45d34b88a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxN3x8Y2Fyc3xlbnwwfHx8fDE3NjE2MTY2Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Hero background image of mechanics working on a car"
              fill
              className="object-cover opacity-10"
              priority
              data-ai-hint="mechanic workshop"
            />
        </div>
       
       <div 
            className="absolute inset-0 z-10"
            style={{
                backgroundImage: `
                    linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 100%)
                `,
            }}
        />

      <div className="relative container z-20 pt-28 md:pt-40 pb-8 md:pb-12">
        <HeroContent greetings={greetings} dict={dict} lang={lang} />
      </div>
    </section>
  );
}
