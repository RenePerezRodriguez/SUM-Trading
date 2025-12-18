
'use server';

import { getSdks } from '@/firebase/admin-init';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

export type CreateUserResult = {
    success: boolean;
    error?: string;
    userExists?: boolean;
    profileNeedsUpdate?: boolean;
    uid?: string;
};

type CreateUserInput = {
    uid?: string; // Optional: for Google Sign-In where UID is pre-generated
    email: string;
    password?: string; // Optional: for Google Sign-In
    displayName?: string | null;
    names?: string;
    firstLastName?: string;
    secondLastName?: string;
    phoneNumber?: string;
    country?: string; // Should be country code
    role: 'admin' | 'user';
}

export async function createUser(userData: CreateUserInput): Promise<CreateUserResult> {
    try {
        const { auth, firestore } = getSdks();
        let userRecord;
        let isNewUser = false;
        
        // Try to get user by email first
        const userByEmail = await auth.getUserByEmail(userData.email).catch(() => null);

        if (userByEmail) {
            userRecord = userByEmail;
        } else {
             // If user does not exist, create them
            const userPayload: any = {
                email: userData.email,
                displayName: userData.displayName || `${userData.names} ${userData.firstLastName}`.trim(),
            };
            if (userData.password) userPayload.password = userData.password;
            if (userData.uid) userPayload.uid = userData.uid;
            
            userRecord = await auth.createUser(userPayload);
            isNewUser = true;

            // Set custom claim for role upon creation
            await auth.setCustomUserClaims(userRecord.uid, { role: userData.role });
        }

        const userDocRef = firestore.collection('users').doc(userRecord.uid);
        const userDoc = await userDocRef.get();

        if (!userDoc.exists || isNewUser) {
            // If the document doesn't exist, or it's a brand new user, create it.
            const [names, ...lastNames] = (userRecord.displayName || '').split(' ');
            
            const userProfile = {
                id: userRecord.uid,
                email: userRecord.email,
                names: userData.names || names || '',
                firstLastName: userData.firstLastName || (lastNames.length > 0 ? lastNames[0] : ''),
                secondLastName: userData.secondLastName || (lastNames.length > 1 ? lastNames.slice(1).join(' ') : ''),
                registrationDate: new Date().toISOString(),
                role: userData.role,
                favoriteCarIds: [],
                phoneNumber: userData.phoneNumber || '',
                country: userData.country || '',
            };
            await userDocRef.set(userProfile);
            
            // If user logged in with a provider and had no doc, they need to complete their profile
            if (!userProfile.phoneNumber || !userProfile.country) {
                return { success: true, profileNeedsUpdate: true, uid: userRecord.uid };
            }

        } else {
            // User exists, check if profile needs update
            const existingData = userDoc.data();
            if (!existingData?.phoneNumber || !existingData?.country) {
                return { success: true, userExists: true, profileNeedsUpdate: true, uid: userRecord.uid };
            }
        }
        
        revalidateTag('admin-users-page', 'page');

        return { success: true, uid: userRecord.uid };

    } catch (error: any) {
        console.error("Error creating/updating user:", error);
        let message = 'An unknown error occurred.';
        if (error.code === 'auth/email-already-exists') {
            message = 'This email address is already in use by another account.';
        } else if (error.code === 'auth/invalid-password') {
            message = 'The password must be a string with at least six characters.';
        }
        return { success: false, error: message };
    }
}
