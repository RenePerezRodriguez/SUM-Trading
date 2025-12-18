import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n-config';
import EditVehicleClient from './edit-vehicle-client';

export default async function AdminEditVehiclePage({ params }: { params: Promise<{ lang: Locale, id: string }> }) {
  const { lang, id } = await params;
  const dict = await getDictionary(lang);
  
  return <EditVehicleClient lang={lang} id={id} dict={dict} />;
}
