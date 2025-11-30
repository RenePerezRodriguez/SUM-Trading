import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n-config';
import { PageHeader } from '@/components/page-header';
import OurMission from './_components/our-mission';
import OurValues from './_components/our-values';
import CtaSection from '@/components/sections/cta-section';
import { Award, TrendingUp, Users2, Globe2 } from 'lucide-react';
import type { Metadata } from 'next';
import { FadeIn, StaggerContainer, FadeInItem } from '@/components/animations/fade-in';

type Props = {
    params: Promise<{ lang: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sumtrading.us';
    
    return {
      title: dict.about_page.title,
      description: dict.about_page.description,
      keywords: ['sobre SUM Trading', 'empresa importación autos', 'equipo SUM Trading', 'misión visión', 'valores'],
      alternates: {
        canonical: `${baseUrl}/${lang}/about`,
        languages: {
          'en': `${baseUrl}/en/about`,
          'es': `${baseUrl}/es/about`,
        },
      },
      openGraph: {
        title: dict.about_page.title,
        description: dict.about_page.description,
        url: `${baseUrl}/${lang}/about`,
        type: 'website',
      },
    };
}

export default async function AboutPage({ params }: Props) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const content = dict.about_page;
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
                "name": lang === 'es' ? 'Sobre Nosotros' : 'About Us',
                "item": `${baseUrl}/${lang}/about`
            }
        ]
    };

    const stats = [
        {
            icon: Award,
            value: lang === 'es' ? '7+ Años' : '7+ Years',
            label: lang === 'es' ? 'de Experiencia' : 'of Experience',
        },
        {
            icon: Users2,
            value: '500+',
            label: lang === 'es' ? 'Clientes Satisfechos' : 'Happy Clients',
        },
        {
            icon: TrendingUp,
            value: '1000+',
            label: lang === 'es' ? 'Vehículos Importados' : 'Vehicles Imported',
        },
        {
            icon: Globe2,
            value: '10+',
            label: lang === 'es' ? 'Países Atendidos' : 'Countries Served',
        },
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <div className="container pt-44 pb-12">
                <FadeIn>
                    <PageHeader 
                        title={content.title}
                        description={content.description}
                    />
                </FadeIn>

                {/* Stats Section */}
                <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20 max-w-5xl mx-auto">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <FadeInItem 
                                key={index}
                                className="h-full"
                            >
                                <div className="h-full group text-center p-6 rounded-xl border border-border/50 bg-gradient-to-b from-background to-accent/5 hover:from-accent/10 hover:to-accent/5 hover:border-accent/50 hover:shadow-lg transition-all duration-300">
                                    <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <Icon className="h-6 w-6 text-accent" />
                                    </div>
                                    <div className="text-3xl font-bold text-foreground mb-1">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {stat.label}
                                    </div>
                                </div>
                            </FadeInItem>
                        );
                    })}
                </StaggerContainer>

                <FadeIn delay={0.2}>
                    <OurMission dict={content} />
                </FadeIn>
            </div>
            
            <FadeIn>
                <OurValues dict={content} />
            </FadeIn>
            
            <CtaSection dict={dict} lang={lang} />
        </>
    );
}
