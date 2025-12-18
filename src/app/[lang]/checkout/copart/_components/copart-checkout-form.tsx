
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase';
import type { UserProfile } from '@/lib/user-profile';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions, PaymentIntent } from '@stripe/stripe-js';
import { Loader2 } from 'lucide-react';
import type { NormalizedVehicle } from '@/lib/vehicle-normalizer';
import useCopartConsultationStore from '@/hooks/use-copart-consultation-store';
import { activateCopartConsultationAction } from '../actions/activate-copart-consultation-action';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function CheckoutForm({ 
    clientSecret, 
    userProfile, 
    vehicles, 
    dict, 
    lang,
    totalAmount
}: { 
    clientSecret: string, 
    userProfile: UserProfile, 
    vehicles: NormalizedVehicle[], 
    dict: any, 
    lang: string,
    totalAmount: number
}) {
    const stripe = useStripe();
    const elements = useElements();
    const { toast } = useToast();
    const router = useRouter();
    const { clearItems } = useCopartConsultationStore();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const t_checkout_success = dict.checkout_success_page;
    const t_copart_checkout = dict.copart_checkout_page;

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);
        setErrorMessage(null);

        const { error: submitError } = await elements.submit();
        if (submitError) {
            setErrorMessage(submitError.message || t_copart_checkout.payment_error_default);
            setIsLoading(false);
            return;
        }

        const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                return_url: `${window.location.origin}/${lang}/checkout/success`,
            },
            redirect: 'if_required', 
        });

        if (confirmError) {
            setErrorMessage(confirmError.message || t_copart_checkout.payment_error_confirmation);
            setIsLoading(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
             const leadResult = await activateCopartConsultationAction({
                userId: userProfile.id,
                paymentId: paymentIntent.id,
                vehicles: vehicles.map(v => ({
                    lotNumber: v.lot_number || 'N/A',
                    vehicleTitle: v.title,
                    vehicleUrl: v.url,
                    imageUrl: v.imageUrl,
                })),
                paymentAmount: paymentIntent.amount,
            });

            if (leadResult.success) {
                clearItems();
                toast({
                    title: t_checkout_success.title,
                    description: t_copart_checkout.consultation_success_desc,
                });
                const itemNames = vehicles.map(v => v.title).join(', ');
                router.push(`/${lang}/checkout/success?payment_id=${paymentIntent.id}&items=${encodeURIComponent(itemNames)}`);
            } else {
                 setErrorMessage(leadResult.error || t_copart_checkout.lead_error);
                 setIsLoading(false);
            }
        } else {
             setErrorMessage(t_copart_checkout.payment_not_completed);
             setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            {errorMessage && <div className="text-destructive mt-4 text-sm font-medium">{errorMessage}</div>}
            <Button disabled={isLoading || !stripe || !elements} className="w-full mt-6 text-lg py-7 font-bold" size="lg">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {`${t_copart_checkout.pay_button} $${totalAmount.toFixed(2)} USD`}
            </Button>
        </form>
    );
}

export default function CopartCheckoutForm({ 
    userProfile, 
    vehicles, 
    dict, 
    lang 
}: { 
    userProfile: UserProfile, 
    vehicles: NormalizedVehicle[],
    dict: any, 
    lang: string 
}) {
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const totalAmount = 20; // Fixed amount
    const t_copart_checkout = dict.copart_checkout_page;

    useEffect(() => {
        const createPaymentIntent = async () => {
            if (vehicles.length === 0) return;
            setError(null);
            try {
                const response = await fetch('/api/create-payment-intent', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: totalAmount, // Use fixed amount
                        currency: 'usd',
                        user: {
                            id: userProfile.id,
                            email: userProfile.email,
                            name: `${userProfile.names} ${userProfile.firstLastName}`,
                            phone: userProfile.phoneNumber,
                            country: userProfile.country,
                        },
                        metadata: {
                            type: 'copart_consultation',
                            itemCount: vehicles.length,
                            lotNumbers: vehicles.map(v => v.lot_number).join(','),
                            userId: userProfile.id,
                        },
                        description: `Asesoría para ${vehicles.length} vehículo(s) de Copart.`,
                        invoice_creation: {
                            enabled: true,
                        }
                    }),
                });
                const data = await response.json();
                if (data.clientSecret) {
                    setClientSecret(data.clientSecret);
                } else {
                    console.error('Failed to get client secret', data.error);
                    setError(data.error?.message || 'Failed to initialize payment.');
                }
            } catch (error: any) {
                console.error("Error creating Payment Intent:", error);
                setError(error.message || 'Failed to connect to payment service.');
            }
        };

        createPaymentIntent();
    }, [vehicles, userProfile]);

    if (error) {
        return (
             <Card>
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                    <p className="font-semibold text-destructive mb-2">Error de Pago</p>
                    <p className="text-sm text-muted-foreground">{error}</p>
                </CardContent>
            </Card>
        );
    }

    if (!clientSecret) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="ml-4 font-semibold">{t_copart_checkout.loading_payment}</p>
                </CardContent>
            </Card>
        );
    }
    
    const options: StripeElementsOptions = {
        clientSecret,
        appearance: { 
            theme: 'stripe',
            variables: {
                colorPrimary: '#ED231D',
            }
        },
    };

    return (
        <Card className="sticky top-28">
            <CardHeader>
                <CardTitle>{t_copart_checkout.payment_card_title}</CardTitle>
                <CardDescription>
                    {t_copart_checkout.payment_card_desc}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm 
                        clientSecret={clientSecret} 
                        userProfile={userProfile}
                        vehicles={vehicles}
                        dict={dict}
                        lang={lang}
                        totalAmount={totalAmount}
                    />
                </Elements>
            </CardContent>
        </Card>
    );
}
