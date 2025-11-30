'use server';

import { getSdks } from '@/firebase/admin-init';
import { v4 as uuidv4 } from 'uuid';

type VehicleData = {
    lotNumber: string;
    vehicleTitle: string;
    vehicleUrl: string;
    imageUrl?: string | null;
};

type CreateInquiryData = {
    userId: string;
    vehicles: VehicleData[];
}

export async function createCopartInquiryAction(data: CreateInquiryData): Promise<{ success: boolean; error?: string; }> {
    const { userId, vehicles } = data;

    if (!userId || !vehicles || vehicles.length === 0) {
        return { success: false, error: 'Faltan campos obligatorios para crear la solicitud.' };
    }

    try {
        const { firestore } = getSdks();
        const batch = firestore.batch();
        const inquiryId = `inquiry_${uuidv4()}`;

        // 1. Update the user's profile to set consultation status to inquiry
        // We only update if there isn't already an active paid consultation
        const userDocRef = firestore.collection('users').doc(userId);
        const userDoc = await userDocRef.get();
        const userData = userDoc.data();

        // If user already has a paid consultation, we might just want to add these vehicles to it?
        // But for now, let's assume this is a new inquiry or overwrites the previous inquiry.
        // If they have a paid active consultation, we probably shouldn't overwrite the paymentId.
        
        const isPaidActive = userData?.copartConsultation?.status === 'active' && !userData?.copartConsultation?.paymentId?.startsWith('inquiry_');

        if (!isPaidActive) {
             batch.update(userDocRef, {
                copartConsultation: {
                    paymentId: inquiryId,
                    activationDate: new Date().toISOString(),
                    status: 'whatsapp-inquiry', 
                }
            });
        } else {
            // If they have a paid consultation, we don't change the main pointer, 
            // but we still want to save this record. 
            // However, the admin panel only looks at the one pointed to by copartConsultation.paymentId.
            // This is a limitation of the current admin implementation.
            // For now, let's proceed with creating the record, but maybe not updating the pointer if paid.
            // But the user wants "something to happen".
            // If they are already active, maybe we should just update the existing record?
            // Let's stick to the simple case: Create a new inquiry record.
        }

        // 2. Create a purchase record (as an inquiry)
        // We use the same collection so it fits the existing admin structure
        const purchaseId = uuidv4();
        const purchaseDocRef = firestore.collection('users').doc(userId).collection('purchases').doc(purchaseId);
        
        const purchaseData = {
            id: purchaseId,
            userId: userId,
            purchaseDate: new Date().toISOString(),
            total: 0,
            paymentId: inquiryId,
            purchaseType: 'Copart Consultation',
            status: 'inquiry', // Custom field to distinguish
            items: vehicles.map(v => ({
                type: 'service',
                name: `Consulta WhatsApp Lote #${v.lotNumber}`,
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

        return { success: true };
    } catch (error: any) {
        console.error('Error creating Copart inquiry:', error);
        return { success: false, error: error.message || 'Ocurrió un error en el servidor al crear la solicitud.' };
    }
}
