
'use server';

import { getSdks } from '@/firebase/admin-init';
import { revalidateTag } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';
import type { Car } from '@/lib/placeholder-data';

type CreateLeadData = {
    userId: string;
    vehicles: Car[];
}

export async function activateSumLeadAction(data: CreateLeadData): Promise<{ success: boolean; error?: string; }> {
    const { userId, vehicles } = data;

    if (!userId || !vehicles || vehicles.length === 0) {
        return { success: false, error: 'Faltan campos obligatorios para registrar el interés.' };
    }

    try {
        const { firestore } = getSdks();
        const batch = firestore.batch();
        const leadId = uuidv4();

        // 1. Create a lead record in a new top-level collection 'sum_leads'
        const leadDocRef = firestore.collection('sum_leads').doc(leadId);
        const leadData = {
            id: leadId,
            userId: userId,
            submissionDate: new Date().toISOString(),
            status: 'active', // initial status
            vehicles: vehicles.map(v => ({
                id: v.id,
                make: v.make,
                model: v.model,
                year: v.year,
                price: v.price,
                vin: v.vin,
                imageUrl: v.images[0]?.url || null,
            })),
        };
        batch.set(leadDocRef, leadData);

        await batch.commit();

        revalidateTag('admin-leads-page', 'page');

        return { success: true };
    } catch (error: any) {
        console.error('Error creating SUM lead record:', error);
        return { success: false, error: error.message || 'Ocurrió un error en el servidor al registrar el interés.' };
    }
}
