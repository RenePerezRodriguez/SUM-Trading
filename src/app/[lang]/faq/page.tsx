
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n-config';
import FaqSection from '@/components/sections/faq-section';
import type { Metadata } from 'next';

type Props = {
    params: Promise<{ lang: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const content = dict.faq_page;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sumtrading.us';

    return {
        title: content.meta_title,
        description: content.meta_description,
        keywords: lang === 'es'
            ? ['preguntas frecuentes importación', 'FAQ autos subasta', 'costos importar carro USA', 'documentos importación vehículos', 'tiempos entrega autos', 'dudas compra Copart']
            : ['car import FAQ', 'auction car questions', 'import costs USA', 'vehicle documentation', 'delivery times', 'Copart buying FAQ'],
        alternates: {
            canonical: `${baseUrl}/${lang}/faq`,
            languages: {
                'en': `${baseUrl}/en/faq`,
                'es': `${baseUrl}/es/faq`,
            },
        },
        openGraph: {
            title: content.meta_title,
            description: content.meta_description,
            url: `${baseUrl}/${lang}/faq`,
            type: 'website',
        },
    };
}

export default async function FaqPage({ params }: Props) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
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
                "name": 'FAQ',
                "item": `${baseUrl}/${lang}/faq`
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <FaqSection dict={dict} lang={lang} />
        </>
    );
}
