import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n-config';
import UsersClient from './_components/users-client';

export default async function AdminUsersPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  
  return <UsersClient dict={dict} lang={lang} />;
}
