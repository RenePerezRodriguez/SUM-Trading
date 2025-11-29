'use client';

import { notFound, useParams, useRouter } from 'next/navigation';
import { getDictionary } from '@/lib/dictionaries';
import { Locale } from '@/lib/i18n-config';
import CarImage from './_components/car-image';
import CarSpecifications from './_components/car-specifications';
import CarDetails from './_components/car-details';
import CarPurchaseCard from './_components/car-purchase-card';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import type { Car } from '@/lib/placeholder-data';
import Head from 'next/head';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function CarDetailPage() {
  const params = useParams();
  const router = useRouter();
  const lang = params.lang as Locale;
  const id = params.id as string;
  const [dict, setDict] = useState<any>(null);

  useEffect(() => {
    if (lang) {
      getDictionary(lang).then(setDict);
    }
  }, [lang]);

  const firestore = useFirestore();
  
  const carDocRef = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'cars', id);
  }, [firestore, id]);

  const { data: car, isLoading } = useDoc<Car>(carDocRef);

  if (isLoading || !dict) {
    return (
      <div className="container py-12 pt-44">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-8">
                <Skeleton className="aspect-[4/3] w-full rounded-xl" />
            </div>
            <div className="space-y-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-20 w-full" />
            </div>
        </div>
        <div className="mt-12 space-y-8">
            <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!car) {
    notFound();
  }

  const title = `${car.year} ${car.make} ${car.model} | SUM Trading`;
  const description = car.description;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${car.make} ${car.model}`,
    "image": car.images.map(img => img.url),
    "description": car.description,
    "sku": car.id,
    "mpn": car.vin,
    "brand": {
      "@type": "Brand",
      "name": car.make
    },
    "offers": {
      "@type": "Offer",
      "url": `${process.env.NEXT_PUBLIC_SITE_URL}/${lang}/cars/${car.id}`,
      "priceCurrency": "USD",
      "price": car.price,
      "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(), // Valid for 1 year
      "itemCondition": car.titleType === 'Clean Title' ? "https://schema.org/UsedCondition" : "https://schema.org/DamagedCondition",
      "availability": car.status === 'Available' ? "https://schema.org/InStock" : "https://schema.org/SoldOut"
    },
    "vehicleEngine": {
        "@type": "EngineSpecification",
        "name": car.engine,
        "fuelType": car.fuel
    },
    "productionDate": car.year.toString(),
    "vehicleIdentificationNumber": car.vin,
    "color": car.color
  };

  return (
    <>
    <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        {car.images && car.images.length > 0 && <meta property="og:image" content={car.images[0].url} />}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        {car.images && car.images.length > 0 && <meta property="twitter:image" content={car.images[0].url} />}
    </Head>
    <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
    />
    <div className="container py-12 pt-44">
        <div className="mb-6">
            <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {dict.register_page.back_button}
            </Button>
        </div>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-8">
            <CarImage car={car} />
            </div>
            <div className="flex flex-col">
            <CarDetails car={car} />
            <div className="mt-auto pt-8">
                <CarPurchaseCard car={car} dict={dict} lang={lang} />
            </div>
            </div>
        </div>

        <div className="mt-12">
            <CarSpecifications car={car} dict={dict} lang={lang} />
        </div>
    </div>
    </>
  );
}
