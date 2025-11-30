'use client';

import React from 'react';
import { FirebaseProvider } from '@/firebase';
import { useEffect, useState, ComponentType, FC, Suspense } from 'react';
import { usePathname, useParams } from 'next/navigation';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n-config';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import LanguageSwitcher from '@/components/layout/language-switcher';
import AuthModal from '@/components/auth/auth-modal';
import ComparisonBar from '@/app/[lang]/cars/_components/comparison-bar';
import SumConsultationBar from '@/app/[lang]/_components/sum-consultation-bar';
import CopartConsultationBar from '@/app/[lang]/search/_components/copart-consultation-bar';
import { Skeleton } from '@/components/ui/skeleton';
import { Analytics } from '@/components/analytics';
import { Clarity } from '@/components/analytics/clarity';


function AppContent({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const lang = params.lang as Locale;
  const pathname = usePathname();
  const [dict, setDict] = useState<any>(null);
  
  useEffect(() => {
    if (lang) {
        getDictionary(lang).then(setDict);
    }
  }, [lang]);

  const isAdminRoute = pathname.startsWith(`/${lang}/admin`);
  const isAuthRoute = pathname.startsWith(`/${lang}/login`) || pathname.startsWith(`/${lang}/register`) || pathname.startsWith(`/${lang}/auth/complete-profile`);
  const headerHeight = (isAdminRoute || isAuthRoute) ? 0 : 28;


  if (!dict) {
    return (
        <main className="flex-grow">
             <div className="pt-16">
                <Skeleton className="h-96 w-full" />
                <div className="container py-12">
                    <Skeleton className="h-10 w-1/2 mx-auto mb-6" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Skeleton className="h-80 w-full" />
                        <Skeleton className="h-80 w-full" />
                        <Skeleton className="h-80 w-full" />
                    </div>
                </div>
            </div>
        </main>
    );
  }

  return (
    <>
      <Suspense>
        <Analytics />
      </Suspense>
      <Clarity />
      {!isAdminRoute && !isAuthRoute && <Header lang={lang} dict={dict} />}
      <main className={`flex-grow ${headerHeight > 0 ? `pt-${headerHeight}`: ''}`}>{children}</main>
      {!isAdminRoute && !isAuthRoute && (
        <>
          <ComparisonBar lang={lang} dict={dict} />
          <SumConsultationBar lang={lang} dict={dict} />
          <CopartConsultationBar lang={lang} dict={dict} />
        </>
      )}
      {!isAdminRoute && !isAuthRoute && <Footer lang={lang} dict={dict} />}

      <LanguageSwitcher lang={lang} />
      <AuthModal dict={dict} lang={lang} />
    </>
  );
}

export default function LangLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseProvider>
      <AppContent>{children}</AppContent>
    </FirebaseProvider>
  );
}
