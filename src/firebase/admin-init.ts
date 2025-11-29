import { initializeApp, getApps, App, cert, ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { GoogleAuth } from 'google-auth-library';

// IMPORTANT: Do not expose this file on the client-side.
// It is intended for server-side use only.

function getServiceAccount(): ServiceAccount | undefined {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!serviceAccountJson) {
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

const serviceAccountInfo = getServiceAccount();

let app: App;

// This pattern ensures that we initialize the app only once.
if (getApps().length === 0) {
  app = initializeApp(serviceAccountInfo ? { credential: cert(serviceAccountInfo) } : undefined);
} else {
  // If the app is already initialized, use the existing one.
  app = getApps()[0];
}

const auth = getAuth(app);
const firestore = getFirestore(app);

// This is the GoogleAuth instance for authenticating with other Google Cloud services.
// If we have service account credentials, use those. Otherwise use Application Default Credentials.
let googleAuth: GoogleAuth;

if (serviceAccountInfo) {
    console.log('[Admin Init] Initializing GoogleAuth with service account credentials');
    googleAuth = new GoogleAuth({
        credentials: serviceAccountInfo as any,
        projectId: (serviceAccountInfo as any).project_id,
        scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });
} else {
    console.log('[Admin Init] Initializing GoogleAuth with Application Default Credentials');
    googleAuth = new GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });
}

// Helper function to get ID token for Cloud Run authentication  
export async function getCloudRunIdToken(targetUrl: string): Promise<string> {
    try {
        // Use GoogleAuth to get an ID token specifically for the target URL
        const idToken = await googleAuth.getIdTokenClient(targetUrl);
        const client = await idToken.getAccessToken();
        console.log('[Admin Init] Cloud Run ID token obtained');
        return client as any;
    } catch (error) {
        console.error('[Admin Init] Failed to get ID token:', error);
        // Fallback to regular access token
        try {
            const token = await googleAuth.getAccessToken();
            console.log('[Admin Init] Using fallback access token');
            return token as string;
        } catch (fallbackError) {
            console.error('[Admin Init] Fallback also failed:', fallbackError);
            throw fallbackError;
        }
    }
}

// This function provides the initialized SDKs for server-side usage.
export function getSdks() {
    return { auth, firestore, app, googleAuth };
}
