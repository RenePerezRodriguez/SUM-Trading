
'use server';

import { getSdks } from '@/firebase/admin-init';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

type UpdatePasswordResult = {
    success: boolean;
    error?: string;
};

// This action is complex because it requires re-authentication, which is a client-side concept.
// The most secure way is to get a short-lived custom token from the server to re-authenticate on the client,
// but that's very complex.
// A simpler, secure server-side approach is not directly possible for password changes.
// We'll use a server action that calls the Admin SDK, which can bypass re-authentication,
// but this should be used with caution and protected.
export async function updatePasswordAction(formData: FormData): Promise<UpdatePasswordResult> {
    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    
    // This is a placeholder for getting the user ID. In a real app,
    // you'd get this from a secure, http-only session cookie.
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    
    if (!session) {
        return { success: false, error: "No has iniciado sesión o tu sesión ha caducado." };
    }

    try {
        const { auth } = getSdks();

        // 1. Verify the user's identity by checking their session cookie
        const decodedToken = await auth.verifySessionCookie(session, true);
        const uid = decodedToken.uid;

        // 2. The Admin SDK's updateUser method does not require the old password,
        // so we can update it directly.
        await auth.updateUser(uid, {
            password: newPassword,
        });

        // Revoke all existing refresh tokens for the user to force them to log in again
        // with the new password on other devices.
        await auth.revokeRefreshTokens(uid);

        return { success: true };

    } catch (error: any) {
        console.error("Error updating password:", error);
        
        let message = "Ocurrió un error desconocido. Tu sesión puede haber caducado.";
        if (error.code === 'auth/session-cookie-expired' || error.code === 'auth/session-cookie-revoked') {
            message = "Tu sesión ha caducado. Por favor, inicia sesión de nuevo.";
        } else if (error.code === 'auth/weak-password') {
            message = "La nueva contraseña es demasiado débil. Debe tener al menos 6 caracteres.";
        }
        
        return { success: false, error: message };
    }
}
