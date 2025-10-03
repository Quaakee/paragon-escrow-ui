/**
 * User Store - Zustand state management for user role
 * Persisted to localStorage for user role selection
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserRole } from '@/types/blockchain.types';

interface UserState {
  role: UserRole | null;

  // Actions
  setRole: (role: UserRole) => void;
  clearRole: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      role: null,

      /**
       * Set the user's role (seeker, furnisher, or platform)
       */
      setRole: (role: UserRole) => {
        set({ role });
      },

      /**
       * Clear the user's role
       */
      clearRole: () => {
        set({ role: null });
      },
    }),
    {
      name: 'paragon-user-storage', // localStorage key
      partialize: (state) => ({ role: state.role }), // Only persist role
    }
  )
);
