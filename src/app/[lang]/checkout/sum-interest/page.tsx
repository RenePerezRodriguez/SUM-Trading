'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n-config';
import { PageHeader } from '@/components/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import type { UserProfile } from '@/lib/user-profile';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import useAuthModalStore from '@/hooks/use-auth-modal-store';
import Image from 'next/image';
import type { Car } from '@/lib/placeholder-data';
import { Loader2, ServerCrash, CheckCircle, Heart } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { collection, query, where, documentId, getDocs } from 'firebase/firestore';
import useSumConsultationStore from '@/hooks/use-sum-consultation-store';
import { activateSumLeadAction } from './actions/activate-sum-lead-action';

// This prevents prerendering for this page
export const dynamic = 'force-dynamic';

function InterestConfirmationContent() {
    const params = useParams();
    const lang = (params.lang || 'es') as Locale;
    const searchParams = useSearchParams();
    const router = useRouter();

    const idsString = searchParams.get('ids') || '';
    const carIds = idsString ? idsString.split(',') : [];

    const [dict, setDict] = useState<any>(null);
    const { user, isUserLoading } = useUser();
    const { openModal } = useAuthModalStore();
    const firestore = useFirestore();
    const [vehicles, setVehicles] = useState<Car[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { clearItems } = useSumConsultationStore();

    useEffect(() => {
        getDictionary(lang).then(setDict);
    }, [lang]);

    useEffect(() => {
        const fullUrl = `/${lang}/checkout/sum-interest?${searchParams.toString()}`;
        if (!isUserLoading && !user) {
            localStorage.setItem('redirectAfterLogin', fullUrl);
            openModal('login');
            router.replace(`/${lang}/cars`);
        }
    }, [isUserLoading, user, openModal, router, lang, searchParams]);

    useEffect(() => {
        if (!firestore || carIds.length === 0) {
            setIsLoading(false);
            return;
        }

        const fetchVehicleData = async () => {
             const carsRef = collection(firestore, 'cars');
             const q = query(carsRef, where(documentId(), 'in', carIds));
             const querySnapshot = await getDocs(q);
             const carsData = querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id } as Car));
             
             const sortedVehicles = carIds
                .map(id => carsData.find(v => v.id === id))
                .filter((v): v is Car => v !== undefined);
             setVehicles(sortedVehicles);
             setIsLoading(false);
        }

        fetchVehicleData().catch(e => {
            setError(e.message);
            setIsLoading(false);
        });
    }, [firestore, carIds.join(',')]);

    const handleConfirmInterest = async () => {
        if (!user) return;
        setIsLoading(true);
        setError(null);
        try {
            const result = await activateSumLeadAction({
                userId: user.uid,
                vehicles,
            });

            if (result.success) {
                clearItems();
                const whatsappNumber = dict.contact_info.phone.number.replace(/\D/g, '');
                const vehicleNames = vehicles.map(v => `${v.make} ${v.model}`).join(', ');
                const message = dict.sum_interest_page.whatsapp_message.replace('{vehicles}', vehicleNames);
                const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
                router.push(`/${lang}/cars`);
            } else {
                throw new Error(result.error || "No se pudo registrar su interés.");
            }

        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading || !dict) {
        return (
            <div className="container py-12 pt-44 text-center">
                <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin" />
                <h2 className="mt-4 text-2xl font-semibold">Cargando...</h2>
            </div>
        );
    }
    
    const t = dict.sum_interest_page;

    if (error) {
        return (
             <div className="container py-12 pt-44 text-center max-w-2xl mx-auto">
                <Alert variant="destructive">
                    <ServerCrash className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        )
    }

    return (
        <div className="container py-12 pt-44">
            <PageHeader title={t.title} description={t.description} />
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>{t.vehicles_title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 divide-y">
                    {vehicles.map(vehicle => (
                        <div key={vehicle.id} className="flex items-center gap-4 pt-4 first:pt-0">
                            <div className="w-32 h-24 bg-secondary rounded-md flex-shrink-0 relative overflow-hidden">
                                <Image src={vehicle.images[0]?.url || 'https://placehold.co/128x96'} alt={vehicle.model} fill className="object-cover" />
                            </div>
                            <div>
                                <p className="font-bold">{vehicle.make} {vehicle.model}</p>
                                <p className="text-sm text-muted-foreground">{vehicle.year}</p>
                                <p className="text-lg font-bold text-primary">{new Intl.NumberFormat(lang, { style: 'currency', currency: 'USD' }).format(vehicle.price)}</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
                <CardFooter className="flex-col gap-4">
                    <p className="text-sm text-muted-foreground text-center">{t.next_step}</p>
                    <Button onClick={handleConfirmInterest} disabled={isLoading} className="w-full" size="lg">
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                        {t.confirm_button}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}


export default function SumInterestPage() {
    return (
        <Suspense fallback={<div className="container py-12 pt-44"><Skeleton className="h-[60vh] w-full" /></div>}>
            <InterestConfirmationContent />
        </Suspense>
    );
}
