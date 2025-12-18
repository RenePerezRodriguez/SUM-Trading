'use client';

import { Suspense } from 'react';
import { getDictionary } from '@/lib/dictionaries';
import { Locale } from '@/lib/i18n-config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
);

function SuccessContent() {
  const params = useParams();
  const lang = params.lang as Locale;
  const searchParams = useSearchParams();
  const [dict, setDict] = useState<any>(null);

  useEffect(() => {
    if (lang) {
        getDictionary(lang).then(setDict);
    }
  }, [lang]);

  if (!dict) {
    return <div>Loading...</div>; // Or a skeleton loader
  }
  
  const t = dict.checkout_success_page;
  const paymentId = searchParams.get('payment_id');
  const items = searchParams.get('items');
  const purchaseType = searchParams.get('type');
  
  const whatsappNumber = dict.contact_info.phone.number.replace(/\D/g, '');
  let whatsappMessage;

  if (purchaseType === 'copart_consultation') {
      whatsappMessage = t.whatsapp_message_consultation;
  } else {
      whatsappMessage = t.whatsapp_message_purchase
          .replace('{paymentId}', paymentId || 'N/A')
          .replace('{items}', items || t.items_not_available);
  }
  
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="container py-20 pt-44 flex items-center justify-center">
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20 mb-4">
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-3xl font-headline">{t.title}</CardTitle>
          <CardDescription className="text-lg">
            {t.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p className="text-muted-foreground">{t.confirmation_email}</p>
          {paymentId && (
            <div className="text-xs text-muted-foreground bg-secondary p-2 rounded-md">
                {t.payment_id}: {paymentId}
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
            <Button asChild>
              <Link href={`/${lang}/search`}>{t.continue_shopping}</Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon className="mr-2 h-5 w-5" />
                    {t.notify_whatsapp}
                </a>
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

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SuccessContent />
        </Suspense>
    )
}
