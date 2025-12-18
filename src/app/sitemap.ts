
import { MetadataRoute } from 'next';
import { getSdks } from '@/firebase/admin-init';
import type { Car } from '@/lib/placeholder-data';
import { i18n } from '@/lib/i18n-config';

const URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sumtrading.us';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {


  // Static pages
  const staticRoutes = [
    '',
    '/about',
    '/cars',
    '/contact',
    '/how-it-works',
    '/faq',
    '/search',
    '/copart-favorites',
    '/garage',
    '/privacy',
    '/cookies',
    '/terms',
    '/sitemap'
  ];

  const staticPages = staticRoutes.map(route => {
    const frequency: "daily" | "weekly" = route === '' ? 'daily' : 'weekly';
    return {
      url: `${URL}/en${route}`,
      lastModified: new Date().toISOString(),
      changeFrequency: frequency,
      priority: route === '' ? 1 : 0.8,
      alternates: {
        languages: {
          en: `${URL}/en${route}`,
          es: `${URL}/es${route}`,
        },
      },
    };
  });

  // Dynamic car pages
  let carPages: MetadataRoute.Sitemap = [];
  try {
    const { firestore } = getSdks();
    const carsSnapshot = await firestore.collection('cars').where('status', '==', 'Available').get();
    const cars = carsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Car));

    carPages = cars.map(car => {
      const route = `/cars/${car.id}`;
      return {
        url: `${URL}/en${route}`,
        lastModified: new Date().toISOString(), // In a real app, you'd use a car's last updated date
        changeFrequency: 'weekly' as const,
        priority: 0.9,
        alternates: {
          languages: {
            en: `${URL}/en${route}`,
            es: `${URL}/es${route}`,
          },
        },
      };
    });
  } catch (error) {
    console.warn('Failed to fetch dynamic sitemap data (likely during build), returning static only:', error);
  }

  return [...staticPages, ...carPages];

}
