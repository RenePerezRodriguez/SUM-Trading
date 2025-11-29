import { initializeApp, getApps, App, cert, ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Use environment variables for Firebase Admin initialization
const serviceAccountInfo: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID!,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')!,
};

let app: App;

if (getApps().length === 0) {
  app = initializeApp({
    credential: cert(serviceAccountInfo),
  });
} else {
  app = getApps()[0];
}

const auth = getAuth(app);
const firestore = getFirestore(app);

// This function provides the initialized SDKs for server-side usage.
export function getSdks() {
    return { auth, firestore, app };
}
