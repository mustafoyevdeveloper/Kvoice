import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setToken: (token) => {
        set({ token });
      },

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),

      // All API calls removed - return error
      login: async (credentials) => {
        return { success: false, error: 'Backend removed' };
      },

      register: async (userData) => {
        return { success: false, error: 'Backend removed' };
      },

      logout: async () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          error: null 
        });
      },

      getCurrentUser: async () => {
        return { success: false, error: 'Backend removed' };
      },

      updateProfile: async (data) => {
        return { success: false, error: 'Backend removed' };
      },

      changePassword: async (data) => {
        return { success: false, error: 'Backend removed' };
      },

      refreshToken: async () => {
        return { success: false, error: 'Backend removed' };
      },

      // Check if user is admin
      isAdmin: () => {
        const { user } = get();
        return user?.role === 'admin';
      },

      // Check if user is moderator
      isModerator: () => {
        const { user } = get();
        return user?.role === 'moderator' || user?.role === 'admin';
      },

      // Check if user can manage content
      canManageContent: () => {
        const { user } = get();
        return user?.role === 'admin' || user?.role === 'moderator';
      },

      // Initialize auth state
      initialize: async () => {
        // Do nothing
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

export default useAuthStore;
