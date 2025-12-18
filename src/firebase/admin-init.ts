console.log("DEBUG: Evaluating src/firebase/admin-init.ts");
import { initializeApp, getApps, App, cert, ServiceAccount } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { GoogleAuth } from 'google-auth-library';

// IMPORTANT: Do not expose this file on the client-side.
// It is intended for server-side use only.

// Holder variables for singleton instances
let appInstance: App | undefined;
let authInstance: Auth | undefined;
let firestoreInstance: Firestore | undefined;
let googleAuthInstance: GoogleAuth | undefined;

function getServiceAccount(): ServiceAccount | undefined {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!serviceAccountJson) {
        // Only warn in development. in production build, missing this is fine as long as we don't try to use it.
        if (process.env.NODE_ENV === 'development') {
            console.warn('FIREBASE_SERVICE_ACCOUNT_JSON environment variable is not set. Relying on Application Default Credentials for local development.');
        }
        return undefined;
    }
    try {
        return JSON.parse(serviceAccountJson);
    } catch (e) {
        throw new Error('Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON. Ensure it is a valid JSON string.');
    }
}

function getFirebaseApp(): App {
    if (!appInstance) {
        try {
            if (getApps().length > 0) {
                appInstance = getApps()[0];
            } else {
                const serviceAccountInfo = getServiceAccount();
                console.log('[Admin Init] Initializing Firebase Admin App');
                appInstance = initializeApp(serviceAccountInfo ? { credential: cert(serviceAccountInfo) } : undefined);
            }
        } catch (error) {
            console.error('[Admin Init] Failed to initialize Firebase App (likely build environment):', error);
            // Return a recursive proxy mock to prevent crashes on property access
            // This allows specific properties to be accessed without throwing, but methods might fail if called.
            appInstance = new Proxy({}, {
                get: (target, prop) => {
                    console.warn(`[Admin Init] Accessed '${String(prop)}' on failed App instance`);
                    return () => { };
                }
            }) as App;
        }
    }
    return appInstance;
}

function getFirebaseAuth(): Auth {
    if (!authInstance) {
        try {
            const app = getFirebaseApp();
            // check if app is a proxy/mock by looking for a known property or just try/catch
            authInstance = getAuth(app);
        } catch (error) {
            console.error('[Admin Init] Failed to initialize Auth:', error);
            authInstance = new Proxy({}, {
                get: (target, prop) => {
                    console.warn(`[Admin Init] Accessed '${String(prop)}' on failed Auth instance`);
                    return () => { };
                }
            }) as Auth;
        }
    }
    return authInstance;
}

function getFirebaseFirestore(): Firestore {
    if (!firestoreInstance) {
        try {
            const app = getFirebaseApp();
            firestoreInstance = getFirestore(app);
        } catch (error) {
            console.error('[Admin Init] Failed to initialize Firestore:', error);
            firestoreInstance = new Proxy({}, {
                get: (target, prop) => {
                    if (prop === 'collection') return () => ({ where: () => ({ get: async () => ({ docs: [] }) }) });
                    console.warn(`[Admin Init] Accessed '${String(prop)}' on failed Firestore instance`);
                    return () => { };
                }
            }) as Firestore;
        }
    }
    return firestoreInstance;
}

function getGoogleAuth(): GoogleAuth {
    if (!googleAuthInstance) {
        try {
            const serviceAccountInfo = getServiceAccount();
            if (serviceAccountInfo) {
                console.log('[Admin Init] Initializing GoogleAuth with service account credentials');
                googleAuthInstance = new GoogleAuth({
                    credentials: serviceAccountInfo as any,
                    projectId: (serviceAccountInfo as any).project_id,
                    scopes: ['https://www.googleapis.com/auth/cloud-platform']
                });
            } else {
                console.log('[Admin Init] Initializing GoogleAuth with Application Default Credentials');
                // This might throw if no ADC found
                googleAuthInstance = new GoogleAuth({
                    scopes: ['https://www.googleapis.com/auth/cloud-platform']
                });
            }
        } catch (error) {
            console.error('[Admin Init] Failed to initialize GoogleAuth:', error);
            googleAuthInstance = new Proxy({}, {
                get: (target, prop) => {
                    console.warn(`[Admin Init] Accessed '${String(prop)}' on failed GoogleAuth instance`);
                    return async () => "";
                }
            }) as unknown as GoogleAuth;
        }
    }
    return googleAuthInstance;
}

// Helper function to get ID token for Cloud Run authentication  
export async function getCloudRunIdToken(targetUrl: string): Promise<string> {
    try {
        // Use GoogleAuth to get an ID token specifically for the target URL
        const authClient = getGoogleAuth();
        const idToken = await authClient.getIdTokenClient(targetUrl);
        const client = await idToken.getAccessToken();
        console.log('[Admin Init] Cloud Run ID token obtained');
        return client as any;
    } catch (error) {
        console.error('[Admin Init] Failed to get ID token:', error);
        // Fallback or re-throw? 
        // If we are in build and this is called (unlikely), valid to return empty
        return "";
    }
}

// This function provides the initialized SDKs for server-side usage.
// Using getters ensures that initialization only happens when the specific property is accessed.
export function getSdks() {
    return {
        get app() { return getFirebaseApp(); },
        get auth() { return getFirebaseAuth(); },
        get firestore() { return getFirebaseFirestore(); },
        get googleAuth() { return getGoogleAuth(); }
    };
}
