import { MetadataRoute } from 'next';

const URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sumtrading.us';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/profile/', '/checkout/', '/garage/', '/purchases/'],
    },
    sitemap: `${URL}/sitemap.xml`,
  };
}
