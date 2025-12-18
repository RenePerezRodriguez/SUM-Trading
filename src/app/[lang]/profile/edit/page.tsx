
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n-config';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import EditProfileClient from './_components/edit-profile-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default async function EditProfilePage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const content = dict.profile_page.cards.personal_info;

  return (
    <div className="container py-12 pt-44">
      <PageHeader 
        title={content.title}
        description={content.edit_description || 'Update your personal information below.'}
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
        <Card>
            <CardHeader>
                <CardTitle>{content.card_title}</CardTitle>
                <CardDescription>{content.card_description}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
                <EditProfileClient dict={dict} />
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
