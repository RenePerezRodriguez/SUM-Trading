
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n-config';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Logo } from '@/components/layout/logo';
import Link from 'next/link';
import AdminRegisterForm from './_components/admin-register-form';
import { createUser } from './actions';

export default async function AdminRegisterPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const t = dict.admin_register_page;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary p-4">
       <Link href={`/${lang}/admin`} className="mb-6 flex items-center gap-3 text-2xl font-bold font-headline">
        <Logo className="h-8 w-8 text-primary" />
        <h1>SUM Trading - Admin</h1>
      </Link>
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">{t.title}</CardTitle>
          <CardDescription>
            {t.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminRegisterForm dict={dict} lang={lang} createUserAction={createUser} />
        </CardContent>
      </Card>
    </div>
  );
}
