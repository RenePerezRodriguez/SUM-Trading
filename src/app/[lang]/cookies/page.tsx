
import { getDictionary } from '@/lib/dictionaries';
import { Locale } from '@/lib/i18n-config';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ lang: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sumtrading.us';
  
  return {
    title: dict.legal.content.cookies.title,
    description: lang === 'es' ? 'Política de Cookies de SUM Trading. Información sobre el uso de cookies en nuestro sitio web.' : 'SUM Trading Cookie Policy. Information about the use of cookies on our website.',
    robots: {
      index: false,
      follow: true,
      noarchive: true,
    },
    alternates: {
      canonical: `${baseUrl}/${lang}/cookies`,
      languages: {
        'en': `${baseUrl}/en/cookies`,
        'es': `${baseUrl}/es/cookies`,
      },
    },
  };
}

export default async function CookiesPage({ params }: Props) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const content = dict.legal.content.cookies;

  return (
    <div className="container py-12 pt-44">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">{content.title}</CardTitle>
          <CardDescription>{content.last_updated}</CardDescription>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          {content.sections.map((section: any, index: number) => (
            <div key={index}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph: string, pIndex: number) => (
                <p key={pIndex}>{paragraph}</p>
              ))}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
