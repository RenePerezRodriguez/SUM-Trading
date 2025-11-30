
import { getDictionary } from '@/lib/dictionaries';
import { Locale } from '@/lib/i18n-config';
import HeroSection from '@/components/sections/hero-section';
import PartnersSection from '@/components/sections/partners-section';
import ServicesAndFeatured from '@/components/sections/services-and-featured';
import ServicesCards from '@/components/sections/services-cards';
import TowingRatesAdvanced from '@/components/towing-rates-advanced';
import CtaSection from '@/components/sections/cta-section';
import WaveDivider from '@/components/ui/wave-divider';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ lang: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sumtrading.us';
  
  return {
    title: dict.metadata.title,
    description: dict.metadata.description,
    keywords: ['vehículos subasta USA', 'importación autos Estados Unidos', 'Copart', 'IAA', 'Manheim', 'autos salvage', 'compra autos subasta', 'SUM Trading', 'importación vehículos', 'autos americanos'],
    authors: [{ name: 'SUM Trading' }],
    creator: 'SUM Trading',
    publisher: 'SUM Trading',
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: {
        'en': `${baseUrl}/en`,
        'es': `${baseUrl}/es`,
        'x-default': `${baseUrl}/en`,
      },
    },
    openGraph: {
      title: dict.metadata.title,
      description: dict.metadata.description,
      url: `${baseUrl}/${lang}`,
      siteName: 'SUM Trading',
      locale: lang === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
      images: [{
        url: `${baseUrl}/images/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'SUM Trading - Importación de Vehículos de Subasta',
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.metadata.title,
      description: dict.metadata.description,
      images: [`${baseUrl}/images/og-image.png`],
      creator: '@sumtrading',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function Home({ params }: Props) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <>
      {/* Hero - Full bleed */}
      <HeroSection dict={dict} lang={lang} />
      
      {/* Partners (Brokers) - Trust Signal immediately after Hero */}
      <PartnersSection dict={dict} />

      {/* Featured Cars (Desire) */}
      <ServicesAndFeatured dict={dict} lang={lang} />

      {/* Tarifas (Transparency) - Clean White Background */}
      <div className="bg-background section-py border-t border-gray-100">
        <div>
          <div className="container">
            <TowingRatesAdvanced dict={dict} lang={lang} />
          </div>
        </div>
      </div>
      
      {/* Servicios (How we help) */}
      <ServicesCards dict={dict} lang={lang} />

      {/* CTA - Clean White Background */}
      <div className="bg-white border-t border-gray-100">
        <CtaSection dict={dict} lang={lang} />
      </div>
    </>
  );
}
