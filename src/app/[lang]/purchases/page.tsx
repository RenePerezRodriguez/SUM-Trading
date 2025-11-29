
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n-config';
import PurchasesClient from './_components/purchases-client';

export default async function PurchasesPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);    return <PurchasesClient dict={dict} lang={lang} />;
}
