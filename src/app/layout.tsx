import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ServiceWorkerRegister } from '@/components/service-worker-register';
import { CookieConsent } from '@/components/cookie-consent';
import type { Locale } from '@/lib/i18n-config';

const APP_NAME = "SUM Trading";
const APP_DEFAULT_TITLE = "SUM Trading Portal";
const APP_TITLE_TEMPLATE = "%s - SUM Trading";
const APP_DESCRIPTION = "Your trusted partner in importing auction vehicles.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://sumtrading.us'),
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    images: [
        {
          url: '/images/og-image.png',
          width: 1200,
          height: 630,
          alt: APP_NAME,
        },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    images: ['/images/og-image.png'],
  },
};

export const viewport: Viewport = {
  themeColor: "#ED231D",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.clarity.ms" />
        <link rel="dns-prefetch" href="https://cs.copart.com" />
        <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
        <meta name="theme-color" content="#ED231D" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "SUM Trading",
              "alternateName": "SUM Trading & Repair",
              "url": "https://sumtrading.us",
              "logo": "https://sumtrading.us/images/logo_sum_trading.webp",
              "description": "Empresa internacional especializada en la compra, importación, reparación y venta de vehículos de subastas en Estados Unidos con servicio a toda Latinoamérica.",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "9675 Joe G Garza Sr Rd",
                "addressLocality": "Brownsville",
                "addressRegion": "TX",
                "postalCode": "78521",
                "addressCountry": "US"
              },
              "contactPoint": [
                {
                  "@type": "ContactPoint",
                  "telephone": "+1-956-747-6078",
                  "contactType": "Customer Service",
                  "areaServed": ["US", "MX", "AR", "CL", "CO", "PE", "EC", "VE", "BO", "UY", "PY", "CR", "PA", "GT", "HN", "SV", "NI", "DO", "CU"],
                  "availableLanguage": ["English", "Spanish"]
                },
                {
                  "@type": "ContactPoint",
                  "email": "info@sumtrading.us",
                  "contactType": "Sales"
                }
              ],
              "sameAs": [
                "https://www.facebook.com/SUMTrading",
                "https://www.instagram.com/sum.trading/",
                "https://www.tiktok.com/@sum25177"
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "SUM Trading",
              "url": "https://sumtrading.us",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://sumtrading.us/en/search?query={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            },
            {
              "@context": "https://schema.org",
              "@type": "AutoDealer",
              "name": "SUM Trading",
              "image": "https://sumtrading.us/images/logo_sum_trading.webp",
              "priceRange": "$$",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "9675 Joe G Garza Sr Rd",
                "addressLocality": "Brownsville",
                "addressRegion": "TX",
                "postalCode": "78521",
                "addressCountry": "US"
              },
              "telephone": "+1-956-747-6078",
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  "opens": "09:00",
                  "closes": "18:00"
                }
              ]
            }
          ]) }}
        />
      </head>
      <body className="font-body antialiased bg-background text-foreground flex flex-col min-h-screen">
          <ServiceWorkerRegister />
          <CookieConsent />
          {children}
          <Toaster />
      </body>
    </html>
  );
}
