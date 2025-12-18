
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n-config';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import SettingsClient from './_components/settings-client';

export default async function ProfileSettingsPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const content = dict.profile_page.cards.account_settings;

  return (
    <div className="container py-12 pt-44">
      <PageHeader 
        title={content.title}
        description={content.edit_description || 'Manage your account security and preferences.'}
      />
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
            <Button asChild variant="outline">
              <Link href={`/${lang}/profile`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {dict.profile_page.back_to_profile}
              </Link>
            </Button>
        </div>
        <SettingsClient dict={dict} lang={lang} />
      </div>
    </div>
  );
}
