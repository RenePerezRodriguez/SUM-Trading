
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n-config';
import AdminDashboardClient from './admin-dashboard-client';

export default async function AdminPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return <AdminDashboardClient dict={dict} lang={lang} />;
}
