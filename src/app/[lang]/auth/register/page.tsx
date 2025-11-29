
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n-config';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import RegisterForm from '@/components/auth/register-form';
import { Logo } from '@/components/layout/logo';
import Link from 'next/link';

export default async function RegisterPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const content = dict.register_page;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary p-4">
       <Link href={`/${lang}`} className="mb-6 flex items-center gap-3 text-2xl font-bold font-headline">
        <Logo className="h-8 w-8 text-primary" />
        <h1>SUM Trading</h1>
      </Link>
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">{content.title}</CardTitle>
          <CardDescription>
            {content.description}{' '}
            <Link href={`/${lang}/login`} className="font-bold text-primary hover:underline cursor-pointer">
                {content.login_link}
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm dict={dict} lang={lang} roleToAssign='user' />
        </CardContent>
      </Card>
    </div>
  );
}
