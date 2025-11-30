'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import useCopartConsultationStore from '@/hooks/use-copart-consultation-store';
import { Button } from '@/components/ui/button';
import { Trash2, MessageSquarePlus, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useUser } from '@/firebase';
import useAuthModalStore from '@/hooks/use-auth-modal-store';
import { useToast } from '@/hooks/use-toast';
import { updateExistingPurchaseRecordAction } from '@/app/[lang]/checkout/copart/actions/update-existing-purchase-record-action';

export default function CopartConsultationBar({ lang, dict }: { lang: string, dict: any }) {
    const { items, clearItems, removeItem, _hasHydrated } = useCopartConsultationStore();
    const { user, isUserLoading, userProfile } = useUser();
    const { openModal } = useAuthModalStore();
    const { toast } = useToast();
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(false);
    const t = dict.copart_consultation_bar;

    const handleConsultationRequest = async () => {
        if (!user) {
            openModal('login');
            return;
        }

        setIsLoading(true);
        try {
            // Check if user has an active consultation. The userProfile from the hook is real-time.
            // Only consider it active if status is explicitly 'active' (paid) or 'in-progress' (paid & working).
            // We filter out unpaid inquiries by checking paymentId prefix.
            const isPaid = userProfile?.copartConsultation?.paymentId && !userProfile.copartConsultation.paymentId.startsWith('inquiry_');
            const isActiveStatus = userProfile?.copartConsultation?.status === 'active' || userProfile?.copartConsultation?.status === 'in-progress';

            if (isPaid && isActiveStatus) {
                // Active lead exists, update it
                const idToken = await user.getIdToken(true);
                const result = await updateExistingPurchaseRecordAction({
                    idToken: idToken,
                    userId: user.uid,
                    paymentId: userProfile.copartConsultation!.paymentId, // We know it exists
                    newVehicles: items.map(item => ({
                        lotNumber: item.lot_number || 'N/A',
                        vehicleTitle: item.title || 'N/A',
                        vehicleUrl: item.url || '#',
                        imageUrl: item.imageUrl || null
                    }))
                });

                if (result.success) {
                    toast({
                        title: "Vehículos Añadidos",
                        description: "Los nuevos vehículos se han añadido a tu consulta activa."
                    });
                    clearItems();
                    router.push(`/${lang}/checkout/update-success`);
                } else {
                     if (result.error?.includes('No se encontró el registro de compra original')) {
                        toast({
                            title: "Consulta Expirada",
                            description: "Tu sesión de asesoría ha expirado o es inválida. Por favor, realiza el pago de nuevo."
                        });
                        router.push(`/${lang}/checkout/copart?lots=${items.map(i => i.lot_number).join(',')}`);
                    } else {
                        throw new Error(result.error || "No se pudieron añadir los vehículos.");
                    }
                }
            } else {
                // No active lead, redirect to checkout
                router.push(`/${lang}/checkout/copart?lots=${items.map(i => i.lot_number).join(',')}`);
            }
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: "Error",
                description: error.message || "Ocurrió un error al procesar tu solicitud."
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (
        !_hasHydrated || 
        items.length === 0 || 
        pathname.startsWith(`/${lang}/buy/`) || 
        pathname.startsWith(`/${lang}/checkout/`)
    ) {
        return null;
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 150 }}
                animate={{ y: 0 }}
                exit={{ y: 150 }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4"
            >
                <div className="bg-secondary/95 backdrop-blur-sm p-4 rounded-lg shadow-2xl border border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 w-full max-w-4xl">
                    <div className="flex w-full items-center gap-4">
                        <p className="font-bold text-lg hidden sm:block whitespace-nowrap">{t.title}</p>
                        <div className="flex-1 flex items-center gap-2 overflow-x-auto min-w-0 pb-2 -mb-2">
                           {items.map(item => (
                                <div key={item.lot_number} className="relative flex-shrink-0">
                                    <Image
                                        src={item.imageUrl || `https://cs.copart.com/v1/AUTH_svc.pdoc00001/lpp/${item.lot_number}.JPG`}
                                        alt={item.title || 'Vehicle'}
                                        width={64}
                                        height={48}
                                        className="rounded-md object-cover h-12 w-16"
                                    />
                                    <Button
                                        size="icon"
                                        variant="destructive"
                                        className="absolute -top-2 -right-2 h-5 w-5 rounded-full"
                                        onClick={() => removeItem(item.lot_number)}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                           ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto flex-shrink-0 mt-4 sm:mt-0">
                        <Button onClick={handleConsultationRequest} className="w-full sm:w-auto" disabled={items.length === 0 || isLoading || isUserLoading}>
                            {isLoading || isUserLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <MessageSquarePlus className="mr-2 h-4 w-4" />
                            )}
                            {t.cta_button} ({items.length})
                        </Button>
                        {items.length > 0 && (
                            <Button variant="ghost" size="icon" onClick={clearItems} aria-label={t.clear_all_aria}>
                                <Trash2 className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        )}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
