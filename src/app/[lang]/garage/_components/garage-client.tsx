
'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Car } from '@/lib/placeholder-data';
import type { Locale } from '@/lib/i18n-config';
import { PageHeader } from '@/components/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import useAuthModalStore from '@/hooks/use-auth-modal-store';
import { CarCard } from '@/components/car-card';
import useFavoriteStore, { useFavoriteSync } from '@/hooks/use-favorite-store';
import { collection } from 'firebase/firestore';


function GarageSkeleton() {
    return (
        <div className="container py-12 pt-44">
            <div className="text-center mb-12">
                <Skeleton className="h-10 w-1/2 mx-auto" />
                <Skeleton className="h-4 w-3/4 mx-auto mt-4" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                ))}
            </div>
        </div>
    )
}

function EmptyGarage({ dict, lang }: { dict: any, lang: Locale }) {
    const content = dict.garage_page;
    return (
        <div className="text-center py-20">
            <Heart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">{content.empty_title}</h2>
            <p className="text-muted-foreground mb-6">{content.empty_description}</p>
            <Button asChild>
                <Link href={`/${lang}/cars`}>{content.empty_cta}</Link>
            </Button>
        </div>
    )
}

export default function GarageClient({ dict, lang }: { dict: any, lang: Locale }) {
    const { user, isUserLoading } = useUser();
    const router = useRouter();
    const { openModal } = useAuthModalStore();
    const { favoriteIds, isSynced } = useFavoriteStore();
    useFavoriteSync();
    
    const firestore = useFirestore();
    const carsCollectionRef = useMemoFirebase(() => firestore ? collection(firestore, 'cars') : null, [firestore]);
    const { data: allCars, isLoading: areCarsLoading } = useCollection<Car>(carsCollectionRef);

    useEffect(() => {
        if (!isUserLoading && !user) {
            openModal('login');
            router.replace(`/${lang}`);
        }
    }, [isUserLoading, user, openModal, router, lang]);
    
    const favoriteCars = useMemo(() => {
        if (!allCars || !isSynced || favoriteIds.length === 0) {
            return [];
        }
        const favoriteIdSet = new Set(favoriteIds);
        return allCars.filter(car => favoriteIdSet.has(car.id));
    }, [allCars, favoriteIds, isSynced]);
    
    const pageContent = dict.garage_page;

    // Show skeleton if user auth state is loading, cars are loading, or favorites haven't been synced from Firestore yet
    if (isUserLoading || areCarsLoading || !isSynced) {
        return <GarageSkeleton />;
    }

    if (!user) {
        // This case is handled by the useEffect redirect, but as a fallback, show a skeleton or a message.
        return <GarageSkeleton />;
    }

    return (
        <div className="container py-12 pt-44">
            <PageHeader 
                title={pageContent.title}
                description={pageContent.description}
            />

            {favoriteCars.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {favoriteCars.map(car => (
                        <CarCard key={car.id} car={car} lang={lang} dict={dict} />
                    ))}
                </div>
            ) : (
                <EmptyGarage dict={dict} lang={lang} />
            )}
        </div>
    );
}
