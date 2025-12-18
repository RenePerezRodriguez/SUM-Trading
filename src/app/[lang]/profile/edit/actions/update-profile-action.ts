
'use server';

import { getSdks } from '@/firebase/admin-init';
import { revalidateTag } from 'next/cache';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-12-15.clover',
    typescript: true,
});

const findOrCreateStripeCustomer = async (userId: string, email: string, name: string, phone?: string, country?: string) => {
    const existingCustomers = await stripe.customers.search({
        query: `metadata['firebase_uid']:'${userId}'`,
        limit: 1,
    });

    if (existingCustomers.data.length > 0) {
        return existingCustomers.data[0];
    }

    const customersByEmail = await stripe.customers.list({ email: email, limit: 1 });
    if (customersByEmail.data.length > 0) {
        return await stripe.customers.update(customersByEmail.data[0].id, {
            metadata: { firebase_uid: userId },
            name,
            phone: phone || undefined,
            ...(country && { address: { country } }),
        });
    }

    return await stripe.customers.create({
        email,
        name,
        phone: phone || undefined,
        metadata: { firebase_uid: userId },
        ...(country && { address: { country } }),
    });
};

type UpdateProfileData = {
    userId: string;
    names: string;
    firstLastName: string;
    secondLastName?: string;
    phone?: string;
    country?: string;
}

export async function updateProfileAction(data: UpdateProfileData): Promise<{ success: boolean; error?: string; }> {
    const { userId, names, firstLastName, secondLastName, phone, country } = data;

    if (!userId || !names || !firstLastName) {
        return { success: false, error: 'Faltan campos obligatorios.' };
    }

    try {
        const { auth, firestore } = getSdks();
        const displayName = `${names} ${firstLastName}`.trim();

        const userRecord = await auth.getUser(userId);

        // 1. Update Firebase Auth display name and potentially phone number
        await auth.updateUser(userId, {
            displayName: displayName,
            ...(phone && { phoneNumber: phone }),
        });

        // 2. Update Firestore document
        const userDocRef = firestore.collection('users').doc(userId);
        const updates: any = {
            names: names,
            firstLastName: firstLastName,
            secondLastName: secondLastName || '',
            ...(phone && { phoneNumber: phone }),
            ...(country && { country: country }),
        };

        await userDocRef.update(updates);

        // 3. Update Stripe Customer
        await findOrCreateStripeCustomer(userId, userRecord.email!, displayName, phone, country);

        // Revalidate paths that might display user information
        // revalidateTag('profile-page'); // TODO: Fix revalidateTag for Next.js 16
        // revalidateTag('checkout-page');
        // revalidateTag('main-layout'); // For header display name

        return { success: true };
    } catch (error: any) {
        console.error('Error updating profile:', error);
        return { success: false, error: error.message || 'Ocurrió un error en el servidor.' };
    }
}
