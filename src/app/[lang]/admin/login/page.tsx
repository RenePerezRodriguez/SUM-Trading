
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n-config';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import LoginForm from '@/components/auth/login-form';
import { Logo } from '@/components/layout/logo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function AdminLoginPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const content = dict.login_page;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary p-4">
      <div className="mb-6 flex items-center gap-3 text-2xl font-bold font-headline">
        <Logo className="h-8 w-8 text-primary" />
        <h1>SUM Trading - Admin</h1>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">{content.title}</CardTitle>
          <CardDescription>
            {dict.admin_page.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm dict={dict} lang={lang} isAdminLogin={true} />
        </CardContent>
      </Card>
    </div>
  );
}
