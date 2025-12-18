
'use client';

import { create } from 'zustand';
import { useUser, useFirestore, updateDocumentNonBlocking } from '@/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import type { UserProfile } from '@/lib/user-profile';
import { useEffect, useMemo } from 'react';
import useAuthModalStore from './use-auth-modal-store';

type FavoriteState = {
  favoriteIds: string[];
  isLoading: boolean;
  isSynced: boolean; // True after the first successful sync from Firestore
  setFavorites: (ids: string[]) => void;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (carId: string, userId: string | null, firestore: any) => void;
};

// This function will now be the single point of truth for updating Firestore.
const updateFavoritesInFirestore = (userId: string, firestore: any, newFavoriteIds: string[]) => {
  if (!userId || !firestore) {
    console.error("User or Firestore not available for updating favorites.");
    return;
  }
  const userDocRef = doc(firestore, 'users', userId);
  // This is a non-blocking call.
  updateDocumentNonBlocking(userDocRef, { favoriteCarIds: newFavoriteIds });
};

const useFavoriteStore = create<FavoriteState>((set, get) => ({
  favoriteIds: [],
  isLoading: true,
  isSynced: false, // Initially not synced
  setFavorites: (ids) => set({ favoriteIds: ids, isLoading: false, isSynced: true }),
  isFavorite: (id: string) => get().favoriteIds.includes(id),
  toggleFavorite: (carId: string, userId: string | null, firestore: any) => {
    if (!userId || !firestore) {
      const { openModal } = useAuthModalStore.getState();
      openModal('login');
      return;
    }

    const { favoriteIds } = get();
    const isCurrentlyFavorite = favoriteIds.includes(carId);
    const newFavoriteIds = isCurrentlyFavorite
      ? favoriteIds.filter((favId) => favId !== carId)
      : [...favoriteIds, carId];
    
    set({ favoriteIds: newFavoriteIds });
    
    updateFavoritesInFirestore(userId, firestore, newFavoriteIds);
  },
}));

/**
 * Hook to synchronize the Zustand store with Firestore for the authenticated user.
 */
export const useFavoriteSync = () => {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const { setFavorites } = useFavoriteStore();

    const userDocRef = useMemo(() => {
        if (!user || !firestore) return null;
        return doc(firestore, 'users', user.uid);
    }, [user, firestore]);

    useEffect(() => {
        if (isUserLoading) {
            useFavoriteStore.setState({ isLoading: true, isSynced: false });
            return;
        }

        if (!user || !userDocRef) {
            useFavoriteStore.setState({ favoriteIds: [], isLoading: false, isSynced: true });
            return;
        }

        useFavoriteStore.setState({ isLoading: true });
        const unsubscribe = onSnapshot(
            userDocRef,
            (snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.data() as UserProfile;
                    setFavorites(userData.favoriteCarIds || []);
                } else {
                    // Document doesn't exist, which is a valid state (e.g., new user)
                    setFavorites([]);
                }
            },
            (error) => {
                console.error("Error listening to user favorites:", error);
                setFavorites([]); // Clear favorites on error
            }
        );

        return () => unsubscribe();
    }, [user, isUserLoading, userDocRef, setFavorites]);
};

export default useFavoriteStore;
