
'use client';

import { create } from 'zustand';

type View = 'login' | 'register' | 'forgotPassword';

type AuthModalState = {
  isOpen: boolean;
  view: View;
  openModal: (view: View, redirectUrl?: string) => void;
  closeModal: () => void;
  redirectUrl: string | null;
};

const useAuthModalStore = create<AuthModalState>((set) => ({
  isOpen: false,
  view: 'login',
  redirectUrl: null,
  openModal: (view, redirectUrl) => set({ isOpen: true, view, redirectUrl: redirectUrl || null }),
  closeModal: () => set({ isOpen: false, redirectUrl: null }),
}));

export default useAuthModalStore;
