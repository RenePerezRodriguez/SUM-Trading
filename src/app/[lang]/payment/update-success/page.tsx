'use client';

import { Suspense } from 'react';
import { getDictionary } from '@/lib/dictionaries';
import { Locale } from '@/lib/i18n-config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

function SuccessContent() {
  const params = useParams();
  const lang = params.lang as Locale;
  const [dict, setDict] = useState<any>(null);

  useEffect(() => {
    if (lang) {
        getDictionary(lang).then(setDict);
    }
  }, [lang]);

  if (!dict) {
    return <div>Loading...</div>; // Or a skeleton loader
  }
  
  const t = dict.update_success_page;

  return (
    <div className="container py-20 pt-44 flex items-center justify-center">
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50 mb-4">
            <CheckCircle className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-3xl font-headline">{t.title}</CardTitle>
          <CardDescription className="text-lg">
            {t.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p className="text-muted-foreground">{t.next_steps}</p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
            <Button asChild>
              <Link href={`/${lang}/search`}>{t.continue_searching}</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/${lang}`}>{t.go_home}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function UpdateSuccessPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SuccessContent />
        </Suspense>
    )
}
