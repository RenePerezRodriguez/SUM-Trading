
'use server';

import { getSdks } from '@/firebase/admin-init';
import type { UserProfile } from '@/lib/user-profile';
import { revalidateTag } from 'next/cache';

/**
 * Verifies the user's ID token and checks if they are an admin.
 * This is the central gatekeeper for all admin server actions.
 * @param {string} idToken The user's Firebase ID token.
 * @returns {Promise<{isAdmin: boolean, error?: string, uid?: string}>}
 */
export async function verifyAdminFromToken(idToken: string): Promise<{isAdmin: boolean, error?: string, uid?: string}> {
    if (!idToken) {
        return { isAdmin: false, error: "Authentication required. No ID token provided." };
    }

    try {
        const { auth } = getSdks();
        const decodedToken = await auth.verifyIdToken(idToken, true);
        
        if (decodedToken.role !== 'admin') {
            return { isAdmin: false, error: "Permission denied. User is not an admin." };
        }
        
        return { isAdmin: true, uid: decodedToken.uid };
    } catch (error) {
        console.error("Error verifying ID token:", error);
        return { isAdmin: false, error: "Invalid or expired session. Please log in again." };
    }
}

export async function getUsers(idToken: string): Promise<{ success: boolean; data?: UserProfile[]; error?: string; }> {
    const { isAdmin, error: authError } = await verifyAdminFromToken(idToken);
    if (!isAdmin) {
        return { success: false, error: authError };
    }

    try {
        const { firestore } = getSdks();
        
        const usersCollection = firestore.collection('users');
        const usersSnapshot = await usersCollection.get();
        
        if (usersSnapshot.empty) {
            return { success: true, data: [] };
        }

        const usersList: UserProfile[] = usersSnapshot.docs.map(doc => {
            const data = doc.data();
            // Basic serialization for data sent to the client
            return JSON.parse(JSON.stringify({
                id: doc.id,
                email: data.email || '',
                names: data.names || '',
                firstLastName: data.firstLastName || '',
                secondLastName: data.secondLastName || '',
                registrationDate: data.registrationDate || new Date().toISOString(),
                role: data.role || 'user',
                favoriteCarIds: data.favoriteCarIds || [],
                phoneNumber: data.phoneNumber || '',
                country: data.country || '',
            }));
        });

        return { success: true, data: usersList };
    } catch (error) {
        console.error("Error fetching users with Admin SDK:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown server error occurred.";
        return { success: false, error: errorMessage };
    }
}

export async function setRole(idToken: string, uid: string, role: 'admin' | 'user'): Promise<{ success: boolean; error?: string }> {
    const { isAdmin, uid: adminUid, error: authError } = await verifyAdminFromToken(idToken);
    if (!isAdmin) {
        return { success: false, error: authError };
    }
    
    if (adminUid === uid) {
        return { success: false, error: "Admins cannot change their own role." };
    }

    try {
        const { auth, firestore } = getSdks();
        
        await auth.setCustomUserClaims(uid, { role });

        const userDocRef = firestore.collection('users').doc(uid);
        await userDocRef.update({ role: role });
        
        revalidateTag('admin-users-page', 'page');

        return { success: true };
    } catch (error: any) {
        console.error("Error setting custom claim and updating Firestore:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteUser(idToken: string, uid: string): Promise<{ success: boolean; error?: string }> {
    const { isAdmin, uid: adminUid, error: authError } = await verifyAdminFromToken(idToken);
    if (!isAdmin) {
        return { success: false, error: authError };
    }

    if (adminUid === uid) {
        return { success: false, error: "Admins cannot delete their own account." };
    }

    try {
        const { auth, firestore } = getSdks();
        
        // This single call will delete the Auth user.
        // We'll also manually delete the firestore doc to be explicit.
        await auth.deleteUser(uid);
        await firestore.collection('users').doc(uid).delete();
        
        revalidateTag('admin-users-page', 'page');

        return { success: true };
    } catch (error: any) {
        console.error("Error deleting user:", error);
        return { success: false, error: error.message };
    }
}
