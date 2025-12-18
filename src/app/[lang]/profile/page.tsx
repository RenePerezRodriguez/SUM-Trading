
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n-config';
import ProfileClient from './_components/profile-client';

export default async function ProfilePage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);    return <ProfileClient dict={dict} lang={lang} />;
}
