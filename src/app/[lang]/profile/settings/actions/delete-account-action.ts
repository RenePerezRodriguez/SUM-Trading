
'use server';

import { getSdks } from '@/firebase/admin-init';
import { cookies } from 'next/headers';

type DeleteAccountResult = {
    success: boolean;
    error?: string;
};

export async function deleteAccountAction(): Promise<DeleteAccountResult> {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;

    if (!session) {
        return { success: false, error: "No has iniciado sesión o tu sesión ha caducado." };
    }

    try {
        const { auth, firestore } = getSdks();

        // 1. Verify the session cookie to get the user's UID securely
        const decodedToken = await auth.verifySessionCookie(session, true);
        const uid = decodedToken.uid;
        
        // 2. Delete the user from Firebase Authentication
        await auth.deleteUser(uid);

        // 3. Delete the user's document from Firestore
        const userDocRef = firestore.collection('users').doc(uid);
        await userDocRef.delete();

        // 4. Invalidate the session cookie on the client side by clearing it
        cookieStore.delete('session');

        return { success: true };

    } catch (error: any) {
        console.error("Error deleting account:", error);
        let message = "Ocurrió un error desconocido al intentar eliminar la cuenta.";
        if (error.code === 'auth/requires-recent-login') {
            message = "Esta es una operación sensible y requiere una autenticación reciente. Por favor, inicia sesión de nuevo e inténtalo otra vez.";
        }
        return { success: false, error: message };
    }
}
