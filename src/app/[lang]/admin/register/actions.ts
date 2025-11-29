
'use server';

import { getSdks } from '@/firebase/admin-init';
import { revalidateTag } from 'next/cache';

export type CreateUserResult = {
    success: boolean;
    error?: string;
};

export async function createUser(formData: FormData): Promise<CreateUserResult> {
    try {
        const { auth, firestore } = getSdks();

        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const names = formData.get('names') as string;
        const firstLastName = formData.get('firstLastName') as string;
        const secondLastName = formData.get('secondLastName') as string;
        
        const displayName = `${names} ${firstLastName}`.trim();

        if (!email || !password || !displayName) {
            return { success: false, error: 'Missing required fields.' };
        }

        // 1. Create the user in Firebase Auth
        const userRecord = await auth.createUser({
            email,
            password,
            displayName,
        });

        // 2. Set the custom claim to make the user an admin
        await auth.setCustomUserClaims(userRecord.uid, { role: 'admin' });

        // 3. Create the user profile document in Firestore
        const userProfile = {
            id: userRecord.uid,
            email: userRecord.email,
            names: names,
            firstLastName: firstLastName,
            secondLastName: secondLastName || '',
            registrationDate: new Date().toISOString(),
            role: 'admin',
            favoriteCarIds: [],
        };

        await firestore.collection('users').doc(userRecord.uid).set(userProfile);
        
        revalidateTag('admin-users-page', 'page');

        return { success: true };
    } catch (error: any) {
        console.error("Error creating admin user:", error);
        let message = 'An unknown error occurred.';
        if (error.code === 'auth/email-already-exists') {
            message = 'This email address is already in use by another account.';
        } else if (error.code === 'auth/invalid-password') {
            message = 'The password must be a string with at least six characters.';
        }
        return { success: false, error: message };
    }
}
