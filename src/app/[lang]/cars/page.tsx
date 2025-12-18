
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n-config';
import CarCatalogClient from './_components/car-catalog-client';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ lang: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sumtrading.us';

  return {
    title: lang === 'es' ? 'Catálogo de Vehículos Disponibles | SUM Trading' : 'Available Vehicles Catalog | SUM Trading',
    description: lang === 'es'
      ? 'Explora nuestro catálogo completo de vehículos importados de subastas USA. Autos verificados, precios competitivos, entrega garantizada. Encuentra tu próximo auto.'
      : 'Explore our complete catalog of vehicles imported from USA auctions. Verified cars, competitive prices, guaranteed delivery. Find your next car.',
    keywords: lang === 'es'
      ? ['catálogo autos subasta', 'vehículos importados USA', 'carros disponibles Copart', 'inventario autos americanos', 'comprar auto salvage', 'autos título limpio']
      : ['auction car catalog', 'vehicles for sale USA', 'Copart inventory', 'salvage cars available', 'clean title cars', 'imported vehicles catalog'],
    alternates: {
      canonical: `${baseUrl}/${lang}/cars`,
      languages: {
        'en': `${baseUrl}/en/cars`,
        'es': `${baseUrl}/es/cars`,
      },
    },
    openGraph: {
      title: lang === 'es' ? 'Catálogo de Vehículos | SUM Trading' : 'Vehicle Catalog | SUM Trading',
      description: lang === 'es'
        ? 'Explora nuestro catálogo de vehículos importados de subastas USA'
        : 'Explore our catalog of vehicles imported from USA auctions',
      url: `${baseUrl}/${lang}/cars`,
      type: 'website',
      images: [{
        url: `${baseUrl}/images/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'SUM Trading - Catálogo de Vehículos',
      }],
    },
  };
}

export default async function CarsPage({ params }: Props) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return <CarCatalogClient dict={dict} lang={lang} />;
}
