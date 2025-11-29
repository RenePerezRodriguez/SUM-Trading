
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n-config';
import GarageClient from './_components/garage-client';

// This page now only fetches the dictionary and passes it to the client component.
// The client component will be responsible for fetching all necessary data.
export default async function GaragePage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);    return <GarageClient dict={dict} lang={lang} />;
}
