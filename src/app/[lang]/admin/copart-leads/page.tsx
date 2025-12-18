'use client';

import { Suspense, useEffect, useState } from 'react';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n-config';
import LeadsClient from './_components/leads-client';
import { usePathname } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

function CopartLeadsPageContent() {
    const pathname = usePathname();
    const lang = (pathname.split('/')[1] || 'es') as Locale;
    const [dict, setDict] = useState<any>(null);

    useEffect(() => {
        getDictionary(lang).then(setDict);
    }, [lang]);

    if (!dict) {
        return (
            <div className="container py-12 pt-44">
                <Skeleton className="h-12 w-1/2 mb-4" />
                <Skeleton className="h-8 w-3/4 mb-8" />
                <div className="space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        );
    }

    return <LeadsClient dict={dict} lang={lang} />;
}

export default function AdminLeadsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CopartLeadsPageContent />
        </Suspense>
    );
}
