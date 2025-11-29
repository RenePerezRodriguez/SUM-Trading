
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n-config';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import AnalyticsClient from './_components/analytics-client';

export default async function AdminAnalyticsPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const content = dict.admin_analytics_page;

  return (
    <div className="container py-12">
      <PageHeader 
        title={content.title}
        description={content.description}
      />
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link href={`/${lang}/admin`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {content.back_to_panel}
              </Link>
            </Button>
            <Button asChild variant="outline">
              <a href="https://clarity.microsoft.com/projects/view/txhzx5cayw/dashboard?date=Last%203%20days" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                {content.view_in_clarity}
              </a>
            </Button>
        </div>
        <AnalyticsClient dict={dict} />
      </div>
    </div>
  );
}
