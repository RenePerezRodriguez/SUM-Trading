
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n-config';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import CompleteProfileForm from './_components/complete-profile-form';

export default async function CompleteProfilePage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const content = dict.complete_profile_page;

  return (
    <div className="container flex min-h-screen items-center justify-center py-12 pt-44">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">{content.title}</CardTitle>
            <CardDescription>{content.description}</CardDescription>
        </CardHeader>
        <CardContent>
            <CompleteProfileForm dict={dict} lang={lang} />
        </CardContent>
      </Card>
    </div>
  );
}
