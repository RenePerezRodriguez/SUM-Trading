import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n-config';
import { PageHeader } from '@/components/page-header';
import CtaSection from '@/components/sections/cta-section';
import ProcessTimeline from './_components/process-timeline';
import type { Metadata } from 'next';
import { Shield, Clock, DollarSign, Award, Headphones, Globe } from 'lucide-react';
import { FadeIn, StaggerContainer, FadeInItem } from '@/components/animations/fade-in';

type Props = {
    params: Promise<{ lang: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sumtrading.us';

    return {
        title: dict.how_it_works_page.title,
        description: dict.how_it_works_page.description,
        keywords: lang === 'es'
            ? ['cómo comprar auto subasta', 'proceso importación vehículos', 'pasos para importar carro', 'guía compra Copart', 'tutorial subasta USA']
            : ['how to buy auction cars', 'car import process', 'Copart buying guide', 'salvage car buying steps', 'auction purchase tutorial'],
        alternates: {
            canonical: `${baseUrl}/${lang}/how-it-works`,
            languages: {
                'en': `${baseUrl}/en/how-it-works`,
                'es': `${baseUrl}/es/how-it-works`,
            },
        },
        openGraph: {
            title: dict.how_it_works_page.title,
            description: dict.how_it_works_page.description,
            url: `${baseUrl}/${lang}/how-it-works`,
            type: 'website',
        },
    };
}

export default async function HowItWorksPage({ params }: Props) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const content = dict.how_it_works_page;
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
                "name": lang === 'es' ? 'Cómo Funciona' : 'How It Works',
                "item": `${baseUrl}/${lang}/how-it-works`
            }
        ]
    };

    const benefits = [
        {
            icon: Shield,
            title: lang === 'es' ? 'Totalmente Seguro' : 'Fully Secure',
            description: lang === 'es'
                ? 'Pagos seguros y documentación legal en cada paso'
                : 'Secure payments and legal documentation at every step'
        },
        {
            icon: Clock,
            title: lang === 'es' ? 'Proceso Rápido' : 'Fast Process',
            description: lang === 'es'
                ? '4-8 semanas desde la compra hasta tu puerta'
                : '4-8 weeks from purchase to your door'
        },
        {
            icon: DollarSign,
            title: lang === 'es' ? 'Precios Transparentes' : 'Transparent Pricing',
            description: lang === 'es'
                ? 'Sin costos ocultos, todo detallado desde el inicio'
                : 'No hidden costs, everything detailed from the start'
        },
        {
            icon: Award,
            title: lang === 'es' ? 'Calidad Garantizada' : 'Guaranteed Quality',
            description: lang === 'es'
                ? 'Inspección profesional y reportes completos'
                : 'Professional inspection and complete reports'
        },
        {
            icon: Headphones,
            title: lang === 'es' ? 'Soporte 24/7' : '24/7 Support',
            description: lang === 'es'
                ? 'Asistencia personalizada en cada etapa del proceso'
                : 'Personalized assistance at every stage'
        },
        {
            icon: Globe,
            title: lang === 'es' ? 'Entrega Internacional' : 'International Delivery',
            description: lang === 'es'
                ? 'Enviamos a toda Latinoamérica con seguimiento'
                : 'We ship to all of Latin America with tracking'
        }
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <div className="container py-12 pt-44">
                <FadeIn>
                    <PageHeader
                        title={content.title}
                        description={content.description}
                    />
                </FadeIn>

                {/* Benefits Grid */}
                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20 max-w-6xl mx-auto">
                    {benefits.map((benefit, index) => {
                        const Icon = benefit.icon;
                        return (
                            <FadeInItem
                                key={index}
                                className="h-full"
                            >
                                <div className="h-full group p-6 rounded-xl border border-border/50 bg-gradient-to-b from-background to-accent/5 hover:from-accent/10 hover:to-accent/5 hover:border-accent/50 hover:shadow-lg transition-all duration-300">
                                    <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <Icon className="h-6 w-6 text-accent" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {benefit.description}
                                    </p>
                                </div>
                            </FadeInItem>
                        );
                    })}
                </StaggerContainer>

                <FadeIn delay={0.2}>
                    <ProcessTimeline dict={content} />
                </FadeIn>
            </div>
            <CtaSection dict={dict} lang={lang} />
        </>
    );
}
