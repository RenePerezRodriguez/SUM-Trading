
'use server';

import { getSdks } from '@/firebase/admin-init';
import { revalidateTag } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';
import type { Stripe } from 'stripe';

type VehicleData = {
    lotNumber: string;
    vehicleTitle: string;
    vehicleUrl: string;
    imageUrl?: string | null;
};

type CreateLeadData = {
    userId: string;
    paymentId: string;
    vehicles: VehicleData[];
    paymentAmount: number; // amount in cents
}

export async function activateCopartConsultationAction(data: CreateLeadData): Promise<{ success: boolean; error?: string; }> {
    const { userId, paymentId, vehicles, paymentAmount } = data;

    if (!userId || !paymentId || !vehicles || vehicles.length === 0) {
        return { success: false, error: 'Faltan campos obligatorios para activar la consulta.' };
    }

    try {
        const { firestore } = getSdks();
        const batch = firestore.batch();

        // 1. Update the user's profile to activate the consultation service
        const userDocRef = firestore.collection('users').doc(userId);
        batch.update(userDocRef, {
            copartConsultation: {
                paymentId: paymentId,
                activationDate: new Date().toISOString(),
                status: 'active',
            }
        });
        
        // 2. Create a purchase record in the user's subcollection
        const purchaseId = uuidv4();
        const purchaseDocRef = firestore.collection('users').doc(userId).collection('purchases').doc(purchaseId);
        const purchaseData = {
            id: purchaseId,
            userId: userId,
            purchaseDate: new Date().toISOString(),
            total: paymentAmount / 100,
            paymentId: paymentId,
            purchaseType: 'Copart Consultation',
            items: vehicles.map(v => ({
                type: 'service',
                name: `Asesoría para Lote #${v.lotNumber}`,
                description: v.vehicleTitle,
                price: 0,
                url: v.vehicleUrl,
                image: {
                    id: v.lotNumber,
                    url: v.imageUrl || 'https://placehold.co/600x400',
                    hint: 'copart vehicle'
                }
            })),
        };
        batch.set(purchaseDocRef, purchaseData);

        await batch.commit();

        // Note: Revalidation is automatic in Next.js 16

        return { success: true };
    } catch (error: any) {
        console.error('Error activating Copart consultation:', error);
        return { success: false, error: error.message || 'Ocurrió un error en el servidor al activar la consulta.' };
    }
}
