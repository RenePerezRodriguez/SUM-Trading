'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore, doc, onSnapshot } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { FirebaseStorage } from 'firebase/storage';
import { Analytics } from 'firebase/analytics';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { initializeFirebase } from '@/firebase';
import type { UserProfile } from '@/lib/user-profile';

// Internal state for user authentication
interface UserAuthState {
  user: User | null;
  userProfile: UserProfile | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// Combined state for the Firebase context
export interface FirebaseContextState extends UserAuthState {
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
  storage: FirebaseStorage | null;
  analytics: Analytics | null;
}

// Return type for useFirebase()
export interface FirebaseServicesAndUser extends FirebaseContextState {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  storage: FirebaseStorage;
}

// Return type for useUser()
export interface UserHookResult extends UserAuthState {}

// React Context
export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

/**
 * FirebaseProvider manages and provides Firebase services and user authentication state.
 * It initializes Firebase services on the client-side.
 */
export const FirebaseProvider: React.FC<{
  children: ReactNode;
}> = ({
  children,
}) => {
  const [userAuthState, setUserAuthState] = useState<UserAuthState>({
    user: null,
    userProfile: null,
    isUserLoading: true,
    userError: null,
  });

  const firebaseServices = useMemo(() => {
    return initializeFirebase();
  }, []);

  const { auth, firestore } = firebaseServices;

  useEffect(() => {
    if (!auth) { 
      setUserAuthState({ user: null, userProfile: null, isUserLoading: false, userError: new Error("Auth service not available.") });
      return;
    }

    const unsubscribeAuth = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        if (firebaseUser) {
            setUserAuthState(prevState => ({ ...prevState, user: firebaseUser, isUserLoading: true }));
        } else {
            setUserAuthState({ user: null, userProfile: null, isUserLoading: false, userError: null });
        }
      },
      (error) => { 
        console.error("FirebaseProvider: onAuthStateChanged error:", error);
        setUserAuthState({ user: null, userProfile: null, isUserLoading: false, userError: error });
      }
    );
    return () => unsubscribeAuth(); 
  }, [auth]);

  useEffect(() => {
    if (!firestore || !userAuthState.user) {
        if (userAuthState.user === null) {
            // If user is explicitly null (logged out), ensure loading is false.
             setUserAuthState(prevState => ({ ...prevState, userProfile: null, isUserLoading: false }));
        }
        return;
    }

    const userDocRef = doc(firestore, 'users', userAuthState.user.uid);
    const unsubscribeProfile = onSnapshot(
        userDocRef,
        (doc) => {
            setUserAuthState(prevState => ({
                ...prevState,
                userProfile: doc.exists() ? doc.data() as UserProfile : null,
                isUserLoading: false // Stop loading once we have profile data or know it doesn't exist
            }));
        },
        (error) => {
            console.error("Error fetching user profile:", error);
            setUserAuthState(prevState => ({ ...prevState, userProfile: null, isUserLoading: false, userError: error }));
        }
    );
    
    return () => unsubscribeProfile();

  }, [userAuthState.user, firestore]);


  const contextValue = useMemo((): FirebaseContextState => {
    return {
      firebaseApp: firebaseServices.firebaseApp,
      firestore: firebaseServices.firestore,
      auth: firebaseServices.auth,
      storage: firebaseServices.storage,
      analytics: firebaseServices.analytics,
      ...userAuthState
    };
  }, [firebaseServices, userAuthState]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};

/**
 * Hook to access core Firebase services and user authentication state.
 * Throws error if core services are not available or used outside provider.
 */
export const useFirebase = (): FirebaseServicesAndUser => {
  const context = useContext(FirebaseContext);

  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }

  if (!context.firebaseApp || !context.firestore || !context.auth || !context.storage) {
    throw new Error('Firebase core services not available. Check FirebaseProvider setup.');
  }

  return context as FirebaseServicesAndUser;
};

/** Hook to access Firebase Auth instance. */
export const useAuth = (): Auth => {
  const { auth } = useFirebase();
  return auth;
};

/** Hook to access Firestore instance. */
export const useFirestore = (): Firestore => {
  const { firestore } = useFirebase();
  return firestore;
};

/** Hook to access Firebase Storage instance. */
export const useStorage = (): FirebaseStorage => {
    const { storage } = useFirebase();
    return storage;
}

/** Hook to access Firebase Analytics instance. */
export const useAnalytics = (): Analytics | null => {
    const { analytics } = useFirebase();
    return analytics;
}

/** Hook to access Firebase App instance. */
export const useFirebaseApp = (): FirebaseApp => {
  const { firebaseApp } = useFirebase();
  return firebaseApp;
};

type MemoFirebase <T> = T & {__memo?: boolean};

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T | (MemoFirebase<T>) {
  const memoized = useMemo(factory, deps);
  
  if(typeof memoized !== 'object' || memoized === null) return memoized;
  (memoized as MemoFirebase<T>).__memo = true;
  
  return memoized;
}

/**
 * Hook specifically for accessing the authenticated user's state.
 * This provides the User object, loading status, and any auth errors.
 * @returns {UserHookResult} Object with user, userProfile, isUserLoading, userError.
 */
export const useUser = (): UserHookResult => {
  const { user, userProfile, isUserLoading, userError } = useFirebase();
  return { user, userProfile, isUserLoading, userError };
};
