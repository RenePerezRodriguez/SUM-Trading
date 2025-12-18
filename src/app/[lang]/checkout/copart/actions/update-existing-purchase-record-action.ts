
'use server';

import { getSdks } from '@/firebase/admin-init';
import { FieldValue } from 'firebase-admin/firestore';
import { revalidateTag } from 'next/cache';

type VehicleData = {
    lotNumber: string;
    vehicleTitle: string;
    vehicleUrl: string;
    imageUrl?: string | null;
};

type UpdatePurchaseData = {
    idToken: string;
    userId: string;
    paymentId: string;
    newVehicles: VehicleData[];
}

async function verifyUser(idToken: string, userId: string): Promise<boolean> {
    if (!idToken) return false;
    try {
        const { auth } = getSdks();
        const decodedToken = await auth.verifyIdToken(idToken, true);
        return decodedToken.uid === userId;
    } catch (error) {
        return false;
    }
}

export async function updateExistingPurchaseRecordAction(data: UpdatePurchaseData): Promise<{ success: boolean; error?: string; }> {
    const { idToken, userId, paymentId, newVehicles } = data;
    
    if (!idToken || !userId || !paymentId || !newVehicles || newVehicles.length === 0) {
        return { success: false, error: 'Faltan datos para actualizar la compra.' };
    }

    const isOwner = await verifyUser(idToken, userId);
    if (!isOwner) {
        return { success: false, error: 'Permission denied.' };
    }

    try {
        const { firestore } = getSdks();
        const purchaseQuery = firestore.collection('users').doc(userId).collection('purchases')
            .where('paymentId', '==', paymentId)
            .limit(1);
            
        const purchaseSnapshot = await purchaseQuery.get();

        if (purchaseSnapshot.empty) {
            // The purchase record was not found. This indicates an inconsistent state.
            // Clear the consultation info from the user's profile to force re-payment.
            const userDocRef = firestore.collection('users').doc(userId);
            await userDocRef.update({
                copartConsultation: FieldValue.delete(),
            });
            revalidateTag('profile-layout', 'page'); // Revalidate to update userProfile hook
            return { success: false, error: 'No se encontró el registro de compra original.' };
        }
        
        const purchaseDoc = purchaseSnapshot.docs[0];
        const existingItems = purchaseDoc.data().items || [];
        const existingItemLotNumbers = new Set(existingItems.map((i: any) => (i.image?.id || i.id)));

        const itemsToAdd = newVehicles
            .filter(v => !existingItemLotNumbers.has(v.lotNumber))
            .map(v => ({
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
            }));

        if (itemsToAdd.length > 0) {
            const updatedItems = [...existingItems, ...itemsToAdd];
            await purchaseDoc.ref.update({ items: updatedItems });
        }
        
        revalidateTag('purchases-page', 'page');
        revalidateTag('copart-checkout-page', 'page');
        revalidateTag('update-success-page', 'page');


        return { success: true };
    } catch (error: any) {
        console.error('Error updating purchase record:', error);
        return { success: false, error: error.message || 'Ocurrió un error en el servidor al actualizar la compra.' };
    }
}
