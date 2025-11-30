'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { Locale } from '@/lib/i18n-config';
import { PageHeader } from '@/components/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import useAuthModalStore from '@/hooks/use-auth-modal-store';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ShoppingBag, Package } from 'lucide-react';
import { collection, orderBy, query } from 'firebase/firestore';
import type { PurchaseRecord } from '@/lib/schemas';
import { LogisticsCard } from './logistics-card';

function PurchasesSkeleton() {
    return (
        <div className="container py-12 pt-44">
            <div className="text-center mb-12">
                <Skeleton className="h-10 w-1/2 mx-auto" />
                <Skeleton className="h-4 w-3/4 mx-auto mt-4" />
            </div>
            <div className="space-y-6 max-w-4xl mx-auto">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="border rounded-lg p-6 space-y-4">
                        <Skeleton className="h-6 w-1/3" />
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <Skeleton className="h-24 w-32" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-5 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                            </div>
                        </div>
                        <Skeleton className="h-8 w-1/4 ml-auto" />
                    </div>
                ))}
            </div>
        </div>
    )
}

function EmptyPurchases({ dict, lang }: { dict: any, lang: Locale }) {
    const content = dict.purchases_page;
    return (
        <div className="text-center py-20 border-2 border-dashed border-border rounded-lg bg-secondary/10">
            <div className="bg-secondary/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold font-headline mb-2">{content.empty_title}</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">{content.empty_description}</p>
            <Button asChild size="lg" className="font-bold uppercase tracking-wide">
                <Link href={`/${lang}/cars`}>{content.empty_cta}</Link>
            </Button>
        </div>
    )
}

export default function PurchasesClient({ dict, lang }: { dict: any, lang: Locale }) {
    const { user, isUserLoading } = useUser();
    const router = useRouter();
    const { openModal } = useAuthModalStore();
    const firestore = useFirestore();

    useEffect(() => {
        if (!isUserLoading && !user) {
            openModal('login');
            router.replace(`/${lang}`);
        }
    }, [isUserLoading, user, openModal, router, lang]);

    const purchasesCollectionRef = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        const ref = collection(firestore, 'users', user.uid, 'purchases');
        return query(ref, orderBy('purchaseDate', 'desc'));
    }, [firestore, user]);

    const { data: purchases, isLoading } = useCollection<PurchaseRecord>(purchasesCollectionRef);
    
    if (isUserLoading || isLoading) {
        return <PurchasesSkeleton />;
    }
    
    if (!user) {
        return <PurchasesSkeleton />;
    }

    const pageContent = dict.purchases_page;

    return (
        <div className="container py-12 pt-44">
            <PageHeader 
                title={pageContent.title}
                description={pageContent.description}
            />

            {purchases && purchases.length > 0 ? (
                <div className="max-w-5xl mx-auto space-y-8">
                    {purchases.map((purchase) => (
                        <LogisticsCard 
                            key={purchase.id} 
                            purchase={purchase} 
                            lang={lang} 
                            dict={dict} 
                        />
                    ))}
                </div>
            ) : (
                <EmptyPurchases dict={dict} lang={lang} />
            )}
        </div>
    );
}
