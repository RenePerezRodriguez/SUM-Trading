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
import { CreditCard, ShoppingBag, Receipt, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { collection, orderBy, query } from 'firebase/firestore';
import type { PurchaseRecord } from '@/lib/schemas';
import type { CarImage } from '@/lib/placeholder-data';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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
        <div className="text-center py-20">
            <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">{content.empty_title}</h2>
            <p className="text-muted-foreground mb-6">{content.empty_description}</p>
            <Button asChild>
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

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString(lang, { year: 'numeric', month: 'long', day: 'numeric' });
        } catch (e) {
            return "Fecha inválida";
        }
    }

    return (
        <div className="container py-12 pt-44">
            <PageHeader 
                title={pageContent.title}
                description={pageContent.description}
            />

            {purchases && purchases.length > 0 ? (
                <div className="max-w-4xl mx-auto space-y-8">
                    {purchases.map((purchase) => {
                        const isConsultation = purchase.purchaseType === 'Copart Consultation';
                        const CardIcon = isConsultation ? MessageSquare : CreditCard;
                        const items = purchase.items || [];
                        
                        return (
                            <Card key={purchase.id} className="overflow-hidden">
                                <CardHeader>
                                    <div className="flex justify-between items-center gap-4 flex-wrap">
                                        <div>
                                            <CardTitle className="flex items-center gap-2 text-xl font-headline">
                                                <CardIcon className="w-5 h-5 text-primary" />
                                                {isConsultation ? pageContent.consultation_service_title : `${pageContent.purchase_date}: ${formatDate(purchase.purchaseDate)}`}
                                            </CardTitle>
                                            <CardDescription>
                                                {isConsultation ? `${pageContent.purchase_date}: ${formatDate(purchase.purchaseDate)}` : `ID del Pedido: ${purchase.id}`}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                     {items.map((item: any, index: number) => {
                                        const isService = item.type === 'service';
                                        const mainImage: CarImage | null = item.image;
                                        const title = item.name || `${item.make} ${item.model}`;
                                        const subtitle = item.description || item.year;
                                        const price = item.price;
                                        const url = item.url || (item.id ? `/${lang}/cars/${item.id}` : '#');

                                        return (
                                            <div key={index} className="flex items-center gap-4 border-b pb-4 last:border-b-0">
                                                <div className="relative aspect-video w-24 overflow-hidden rounded-md shadow-lg flex-shrink-0 bg-secondary">
                                                    { mainImage?.url ? (
                                                        <Image
                                                            src={mainImage.url}
                                                            alt={title || 'Purchase item'}
                                                            fill
                                                            className="object-cover"
                                                            sizes="100px"
                                                            data-ai-hint={mainImage.hint}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                                                            {isService ? "Servicio" : "Sin imagen"}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-grow">
                                                     <Link href={url} target={url.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer" className="font-semibold hover:underline">{title}</Link>
                                                     <p className="text-sm text-muted-foreground">{subtitle}</p>
                                                </div>
                                                {price > 0 && (
                                                    <p className="font-semibold">{new Intl.NumberFormat(lang, { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price)}</p>
                                                )}
                                            </div>
                                        )
                                    })}
                                </CardContent>
                                <CardFooter className="bg-secondary/50 flex justify-end items-center gap-4 py-4 px-6">
                                   <p className="font-semibold text-muted-foreground">{pageContent.total_paid}:</p>
                                   <p className="text-xl font-bold text-primary">{new Intl.NumberFormat(lang, { style: 'currency', currency: 'USD' }).format(purchase.total)}</p>
                                </CardFooter>
                            </Card>
                        )
                    })}
                </div>
            ) : (
                <EmptyPurchases dict={dict} lang={lang} />
            )}
        </div>
    );
}
