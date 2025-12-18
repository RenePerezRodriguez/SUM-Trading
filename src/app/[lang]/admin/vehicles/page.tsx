
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n-config';
import VehiclesClient from './_components/vehicles-client';

export default async function AdminVehiclesPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  
  return <VehiclesClient dict={dict} lang={lang} />;
}
