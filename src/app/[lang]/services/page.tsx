import { getDictionary } from '@/lib/dictionaries';
import { Locale } from '@/lib/i18n-config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, FileCheck, Car } from 'lucide-react';
import TowingRatesAdvanced from '@/components/towing-rates-advanced';
import type { Metadata } from 'next';
import Link from 'next/link';
import { FadeIn, StaggerContainer, FadeInItem } from '@/components/animations/fade-in';

type Props = {
    params: Promise<{ lang: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sumtrading.us';
    
    return {
      title: dict.services_page.title,
      description: dict.services_page.description,
      keywords: ['servicios importación', 'arrastre vehículos', 'asesoría Copart', 'compra autos USA', 'logística importación', 'tarifas arrastre'],
      alternates: {
        canonical: `${baseUrl}/${lang}/services`,
        languages: {
          'en': `${baseUrl}/en/services`,
          'es': `${baseUrl}/es/services`,
        },
      },
      openGraph: {
        title: dict.services_page.title,
        description: dict.services_page.description,
        url: `${baseUrl}/${lang}/services`,
        type: 'website',
      },
    };
}

export default async function ServicesPage({ params }: Props) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const services = dict.services_page;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sumtrading.us';

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": lang === 'es' ? 'Inicio' : 'Home',
                "item": `${baseUrl}/${lang}`
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": lang === 'es' ? 'Servicios' : 'Services',
                "item": `${baseUrl}/${lang}/services`
            }
        ]
    };

    const servicesList = [
        {
            icon: Truck,
            title: services.towing_title,
            description: services.towing_desc,
            href: '#tarifas-arrastre',
        },
        {
            icon: FileCheck,
            title: services.auction_title,
            description: services.auction_desc,
            href: `/${lang}/search`,
        },
        {
            icon: Car,
            title: services.sum_cars_title,
            description: services.sum_cars_desc,
            href: `/${lang}#inventario-sum-trading`,
        },
    ];

    const servicesSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": [
            {
                "@type": "Service",
                "name": services.towing_title,
                "description": services.towing_desc,
                "provider": {
                    "@type": "Organization",
                    "name": "SUM Trading"
                },
                "serviceType": "Vehicle Towing",
                "areaServed": ["US", "MX", "AR", "CL", "CO", "PE", "EC", "VE", "BO", "UY", "PY", "CR", "PA", "GT", "HN", "SV", "NI", "DO", "CU"]
            },
            {
                "@type": "Service",
                "name": services.auction_title,
                "description": services.auction_desc,
                "provider": {
                    "@type": "Organization",
                    "name": "SUM Trading"
                },
                "serviceType": "Auction Consulting"
            },
            {
                "@type": "Service",
                "name": services.sum_cars_title,
                "description": services.sum_cars_desc,
                "provider": {
                    "@type": "Organization",
                    "name": "SUM Trading"
                },
                "serviceType": "Vehicle Sales"
            }
        ]
    };

    return (
        <>
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }}
        />
        <div className="container mx-auto px-4 py-8 md:py-12 pt-24 md:pt-32">
            <div className="max-w-4xl mx-auto">
                <FadeIn className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4 font-headline">{services.title}</h1>
                    <p className="text-xl text-muted-foreground">{services.description}</p>
                </FadeIn>

                <StaggerContainer className="grid gap-6 md:grid-cols-3 mb-16">
                    {servicesList.map((service, index) => {
                        const Icon = service.icon;
                        return (
                            <FadeInItem key={index} className="h-full">
                                <Link href={service.href} className="block h-full">
                                    <Card className="h-full border border-border/50 bg-gradient-to-b from-background to-accent/5 hover:from-accent/10 hover:to-accent/5 hover:border-accent/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                                        <CardHeader>
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 rounded-lg bg-accent/10">
                                                    <Icon className="h-6 w-6 text-accent" />
                                                </div>
                                                <CardTitle className="text-lg">{service.title}</CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <CardDescription className="text-base">
                                                {service.description}
                                            </CardDescription>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </FadeInItem>
                        );
                    })}
                </StaggerContainer>
            </div>

            {/* Sección de Tarifas de Arrastre Avanzada */}
            <FadeIn id="tarifas-arrastre" className="max-w-7xl mx-auto scroll-mt-24" delay={0.2}>
                <TowingRatesAdvanced dict={dict} lang={lang} />
            </FadeIn>
        </div>
        </>
    );
}
