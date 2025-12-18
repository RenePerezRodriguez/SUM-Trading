'use client';

import { Suspense, useEffect, useState, useTransition } from 'react';
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n-config';
import { PageHeader } from '@/components/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/user-profile';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import useAuthModalStore from '@/hooks/use-auth-modal-store';
import CopartCheckoutForm from './_components/copart-checkout-form';
import Image from 'next/image';
import type { NormalizedVehicle } from '@/lib/vehicle-normalizer';
import { Loader2, ServerCrash, CheckCircle, MessageSquare, CreditCard } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import useCopartStore from '@/hooks/use-copart-store';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import useCopartConsultationStore from '@/hooks/use-copart-consultation-store';
import { updateExistingPurchaseRecordAction } from './actions/update-existing-purchase-record-action';
import { createCopartInquiryAction } from './actions/create-copart-inquiry-action';
import { Button } from '@/components/ui/button';

const InfoCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
    <div className="flex gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
            <Icon className="h-6 w-6" />
        </div>
        <div>
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="text-muted-foreground text-sm">{description}</p>
        </div>
    </div>
);


function CopartCheckoutContent() {
    const params = useParams();
    const lang = (params.lang || 'es') as Locale;
    const searchParams = useSearchParams();
    const router = useRouter();
    const { getResultByLot, addResults } = useCopartStore();
    const { clearItems } = useCopartConsultationStore();

    const lotsString = searchParams.get('lots') || '';
    const lotNumbers = lotsString ? lotsString.split(',') : [];

    const [dict, setDict] = useState<any>(null);
    const { user, isUserLoading } = useUser();
    const { openModal } = useAuthModalStore();
    const firestore = useFirestore();
    const [vehicles, setVehicles] = useState<NormalizedVehicle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdatingLead, startUpdatingTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [showPaymentForm, setShowPaymentForm] = useState(false);

    // We fetch userProfile directly to ensure we have the most up-to-date data.
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isProfileLoading, setIsProfileLoading] = useState(true);
    const [isWhatsAppLoading, setIsWhatsAppLoading] = useState(false);

    useEffect(() => {
        getDictionary(lang).then(setDict);
    }, [lang]);

    useEffect(() => {
        const fullUrl = `/${lang}/checkout/copart?${searchParams.toString()}`;
        if (!isUserLoading && !user) {
            localStorage.setItem('redirectAfterLogin', fullUrl);
            openModal('login');
            const firstLot = lotNumbers[0];
            router.replace(firstLot ? `/${lang}/copart/${firstLot}` : `/${lang}/search`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isUserLoading, user]);


    useEffect(() => {
        if (!user || !firestore) {
            if (!isUserLoading) setIsProfileLoading(false);
            return;
        };

        const fetchProfile = async () => {
            setIsProfileLoading(true);
            const userDocRef = doc(firestore, 'users', user.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                setUserProfile(userDocSnap.data() as UserProfile);
            }
            setIsProfileLoading(false);
        };

        fetchProfile();

    }, [user, firestore, isUserLoading]);


    useEffect(() => {
        if (isUserLoading || isProfileLoading || !dict || !userProfile) return;

        if (user && !userProfile?.country) {
            const fullUrl = `/${lang}/checkout/copart?${searchParams.toString()}`;
            localStorage.setItem('redirectAfterProfileCompletion', fullUrl);
            router.replace(`/${lang}/auth/complete-profile`);
            return;
        }

        const fetchVehicleData = async () => {
            if (lotNumbers.length === 0) {
                setIsLoading(false);
                return;
            }
            const vehiclesFromCache: NormalizedVehicle[] = lotNumbers.map(lot => getResultByLot(lot)).filter(Boolean as any);
            const missingLots = lotNumbers.filter(lot => !vehiclesFromCache.some(v => v.lot_number === lot));

            let allVehicles: NormalizedVehicle[] = [...vehiclesFromCache];

            if (missingLots.length > 0) {
                const response = await fetch(`/api/copart-vehicles?lots=${missingLots.join(',')}`);
                if (!response.ok) throw new Error('Error al obtener datos de los vehículos.');
                const fetchedVehicles = await response.json();
                addResults(fetchedVehicles);
                allVehicles = [...allVehicles, ...fetchedVehicles];
            }

            const sortedVehicles = lotNumbers
                .map(lot => allVehicles.find(v => v.lot_number === lot))
                .filter((v): v is NormalizedVehicle => v !== undefined);
            setVehicles(sortedVehicles);
            return sortedVehicles;
        }

        const handleActiveConsultation = (vehiclesForUpdate: NormalizedVehicle[]) => {
            // Only auto-update if the consultation is fully active (paid)
            const isPaid = userProfile?.copartConsultation?.paymentId && !userProfile.copartConsultation.paymentId.startsWith('inquiry_');
            const isActiveStatus = userProfile?.copartConsultation?.status === 'active' || userProfile?.copartConsultation?.status === 'in-progress';

            if (!user || !isPaid || !isActiveStatus) return;

            startUpdatingTransition(async () => {
                try {
                    const idToken = await user.getIdToken(true);
                    const result = await updateExistingPurchaseRecordAction({
                        idToken: idToken,
                        userId: user.uid,
                        paymentId: userProfile.copartConsultation!.paymentId!,
                        newVehicles: vehiclesForUpdate.map(item => ({
                            lotNumber: item.lot_number || 'N/A',
                            vehicleTitle: item.title || 'N/A',
                            vehicleUrl: item.url || '#',
                            imageUrl: item.imageUrl || null
                        }))
                    });

                    if (result.success) {
                        clearItems();
                        router.push(`/${lang}/checkout/update-success`);
                    } else {
                        throw new Error(result.error || "No se pudieron añadir los vehículos a tu consulta.");
                    }
                } catch (e: any) {
                    setError(e.message);
                }
            });
        };

        fetchVehicleData()
            .then(fetchedVehicles => {
                const isPaid = userProfile?.copartConsultation?.paymentId && !userProfile.copartConsultation.paymentId.startsWith('inquiry_');
                const isActiveStatus = userProfile?.copartConsultation?.status === 'active' || userProfile?.copartConsultation?.status === 'in-progress';

                if (fetchedVehicles && isPaid && isActiveStatus) {
                    handleActiveConsultation(fetchedVehicles);
                } else {
                    setIsLoading(false);
                }
            })
            .catch(e => {
                setError(e.message)
                setIsLoading(false);
            });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, userProfile, isUserLoading, isProfileLoading, dict]);

    if (!dict || isUserLoading || isProfileLoading || isLoading) {
        const t = dict?.copart_checkout_page;
        let message = t?.loading_vehicle_desc || "Cargando...";
        if (isUpdatingLead) message = "Actualizando tu consulta activa...";
        if (isLoading) message = "Verificando tu consulta y vehículos...";

        return (
            <div className="container py-12 pt-44 text-center">
                <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin" />
                <h2 className="mt-4 text-2xl font-semibold">{message}</h2>
                <p className="text-muted-foreground mt-2">Esto puede tardar unos segundos.</p>
            </div>
        );
    }

    if (isUpdatingLead) {
        return (
            <div className="container py-12 pt-44 text-center">
                <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin" />
                <h2 className="mt-4 text-2xl font-semibold">Actualizando tu consulta activa...</h2>
                <p className="text-muted-foreground mt-2">Añadiendo los nuevos vehículos a tu historial.</p>
            </div>
        );
    }

    const t = dict.copart_checkout_page;

    if (error) {
        return (
            <div className="container py-12 pt-44 text-center max-w-2xl mx-auto">
                <Alert variant="destructive">
                    <ServerCrash className="h-4 w-4" />
                    <AlertTitle>{t.error_title}</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        )
    }

    if (!userProfile) {
        return <div className="container py-12 pt-44 text-center">{t.redirecting}</div>
    }

    const isPaid = userProfile.copartConsultation?.paymentId && !userProfile.copartConsultation.paymentId.startsWith('inquiry_');
    const isActiveStatus = userProfile.copartConsultation?.status === 'active' || userProfile.copartConsultation?.status === 'in-progress';

    if (isPaid && isActiveStatus && vehicles.length > 0) {
        return (
            <div className="container py-12 pt-44 text-center">
                <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin" />
                <h2 className="mt-4 text-2xl font-semibold">Consulta activa encontrada. Actualizando...</h2>
            </div>
        );
    }

    const whatsappNumber = dict.copart_checkout_page.advisor_phone.replace(/\D/g, '');
    const adviceMessage = t.advice_message.replace('{lots}', lotNumbers.join(', '));
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(adviceMessage)}`;

    const handleWhatsAppClick = async () => {
        if (!user) return;
        setIsWhatsAppLoading(true);
        try {
            await createCopartInquiryAction({
                userId: user.uid,
                vehicles: vehicles.map(v => ({
                    lotNumber: v.lot_number || 'N/A',
                    vehicleTitle: v.title,
                    vehicleUrl: v.url,
                    imageUrl: v.imageUrl
                }))
            });
            window.open(whatsappUrl, '_blank');
        } catch (error) {
            console.error(error);
        } finally {
            setIsWhatsAppLoading(false);
        }
    };

    return (
        <div className="container py-12 pt-44">
            <PageHeader
                title={t.title}
                description={t.description}
            />
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 max-w-6xl mx-auto items-start">
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t.vehicles_title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 divide-y">
                            {vehicles.map(vehicle => (
                                <div key={vehicle.lot_number} className="flex items-center gap-4 pt-4 first:pt-0">
                                    <div className="w-32 h-24 bg-secondary rounded-md flex-shrink-0 relative overflow-hidden">
                                        <Image src={vehicle.imageUrl || `https://cs.copart.com/v1/AUTH_svc.pdoc00001/lpp/${vehicle.lot_number}.JPG`} alt={vehicle.title || 'Vehicle'} fill className="object-cover" sizes="128px" />
                                    </div>
                                    <div>
                                        <p className="font-bold">{vehicle.title}</p>
                                        <p className="text-sm text-muted-foreground">{t.lot_label}: {vehicle.lot_number}</p>
                                        <a href={vehicle.url || `https://www.copart.com/lot/${vehicle.lot_number}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">{t.view_on_portal}</a>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t.benefits_title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {t.benefits.map((benefit: any) => (
                                <InfoCard key={benefit.title} icon={CheckCircle} title={benefit.title} description={benefit.description} />
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t.faq_title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible className="w-full">
                                {t.faqs.map((faq: any, index: number) => (
                                    <AccordionItem key={index} value={`item-${index}`}>
                                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                                        <AccordionContent className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
                                            <p dangerouslySetInnerHTML={{ __html: faq.answer }} />
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>

                </div>
                <div className="order-first lg:order-last space-y-4">
                    {!showPaymentForm ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>Opciones</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <Button
                                    onClick={handleWhatsAppClick}
                                    size="lg"
                                    className="w-full justify-start text-base whitespace-normal h-auto py-4"
                                    disabled={isWhatsAppLoading}
                                >
                                    {isWhatsAppLoading ? (
                                        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                                    ) : (
                                        <MessageSquare className="mr-3 h-5 w-5 flex-shrink-0" />
                                    )}
                                    <span className="text-left">{t.want_advice_button}</span>
                                </Button>
                                <Button
                                    onClick={() => setShowPaymentForm(true)}
                                    size="lg"
                                    className="w-full justify-start text-base whitespace-normal h-auto py-4"
                                >
                                    <CreditCard className="mr-3 h-5 w-5 flex-shrink-0" />
                                    <span className="text-left">{t.want_to_pay_button}</span>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <CopartCheckoutForm
                            userProfile={userProfile}
                            vehicles={vehicles}
                            dict={dict}
                            lang={lang}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default function CopartCheckoutPage() {
    return (
        <Suspense fallback={<div className="container py-12 pt-44"><Skeleton className="h-[80vh] w-full" /></div>}>
            <CopartCheckoutContent />
        </Suspense>
    );
}
