
import { getDictionary } from '@/lib/dictionaries';
import { Locale } from '@/lib/i18n-config';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default async function CoordinacionArrastresPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const content = dict.legal.content.coordinacion_arrastres;

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
