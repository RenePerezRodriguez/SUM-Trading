
'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const partners = [
  { 
    name: 'Copart', 
    logo: '/images/copart-logo.svg',
    href: 'https://www.copart.com/',
    license: '157272'
  },
  { 
    name: 'Manheim', 
    logo: 'https://mcom-header-footer.manheim.com/assets/common/OMIY_lockup.svg',
    href: 'https://site.manheim.com/en/locations.html'
  },
  { 
    name: 'IAA', 
    logo: 'https://cdn.freelogovectors.net/wp-content/uploads/2022/07/iaa-logo-freelogovectors.net_.png',
    href: 'https://www.iaai.com/',
    license: '632946'
  },
];
  
export default function PartnersSection({ dict }: { dict: any }) {
  const partnersContent = dict.partners;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <section className="py-8 md:py-12" ref={ref}>
      <div className="container">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="text-center"
        >
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-8">
                {partnersContent.title}
            </h2>
            <div className="flow-root">
                <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 sm:gap-x-16 lg:gap-x-20">
                    {partners.map((partner, index) => (
                        <motion.div
                          key={partner.name}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                          className="flex flex-col items-center gap-2"
                        >
                          <Link
                            href={partner.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300 hover:scale-105"
                            title={partner.name}
                          >
                              <Image
                                src={partner.logo}
                                alt={partner.name}
                                height={40}
                                width={130}
                                className="object-contain text-foreground"
                                style={{ height: '40px', width: 'auto', maxWidth: '130px' }}
                            />
                          </Link>
                          {partner.license && (
                            <p className="text-xs text-muted-foreground font-mono">
                              Licencia: {partner.license}
                            </p>
                          )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-sm text-muted-foreground mt-8 max-w-2xl mx-auto"
        >
          {partnersContent?.description || 
            'Trabajamos directamente con las principales casas de subastas de Estados Unidos para ofrecerte el mejor inventario y los precios más competitivos.'}
        </motion.p>
      </div>
    </section>
  );
}
