import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiService from '../services/api';

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
        apiService.setToken(token);
      },

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),

      // Login
      login: async (credentials) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await apiService.auth.login(credentials);
          
          if (response.success) {
            const { user, token } = response.data;
            set({ 
              user, 
              token, 
              isAuthenticated: true, 
              isLoading: false 
            });
            apiService.setToken(token);
            return { success: true, user };
          } else {
            throw new Error(response.message || 'Login failed');
          }
        } catch (error) {
          set({ 
            error: error.message, 
            isLoading: false 
          });
          return { success: false, error: error.message };
        }
      },

      // Register
      register: async (userData) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await apiService.auth.register(userData);
          
          if (response.success) {
            const { user, token } = response.data;
            set({ 
              user, 
              token, 
              isAuthenticated: true, 
              isLoading: false 
            });
            apiService.setToken(token);
            return { success: true, user };
          } else {
            throw new Error(response.message || 'Registration failed');
          }
        } catch (error) {
          set({ 
            error: error.message, 
            isLoading: false 
          });
          return { success: false, error: error.message };
        }
      },

      // Logout
      logout: async () => {
        try {
          await apiService.auth.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({ 
            user: null, 
            token: null, 
            isAuthenticated: false,
            error: null 
          });
          apiService.setToken(null);
        }
      },

      // Get current user
      getCurrentUser: async () => {
        try {
          set({ isLoading: true });
          
          const response = await apiService.auth.getMe();
          
          if (response.success) {
            const { user } = response.data;
            set({ 
              user, 
              isAuthenticated: true, 
              isLoading: false 
            });
            return { success: true, user };
          } else {
            throw new Error(response.message || 'Failed to get user');
          }
        } catch (error) {
          set({ 
            error: error.message, 
            isLoading: false,
            isAuthenticated: false,
            user: null,
            token: null
          });
          apiService.setToken(null);
          return { success: false, error: error.message };
        }
      },

      // Update profile
      updateProfile: async (data) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await apiService.auth.updateProfile(data);
          
          if (response.success) {
            const { user } = response.data;
            set({ 
              user, 
              isLoading: false 
            });
            return { success: true, user };
          } else {
            throw new Error(response.message || 'Profile update failed');
          }
        } catch (error) {
          set({ 
            error: error.message, 
            isLoading: false 
          });
          return { success: false, error: error.message };
        }
      },

      // Change password
      changePassword: async (data) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await apiService.auth.changePassword(data);
          
          if (response.success) {
            set({ isLoading: false });
            return { success: true };
          } else {
            throw new Error(response.message || 'Password change failed');
          }
        } catch (error) {
          set({ 
            error: error.message, 
            isLoading: false 
          });
          return { success: false, error: error.message };
        }
      },

      // Refresh token
      refreshToken: async () => {
        try {
          const response = await apiService.auth.refreshToken();
          
          if (response.success) {
            const { user, token } = response.data;
            set({ 
              user, 
              token, 
              isAuthenticated: true 
            });
            apiService.setToken(token);
            return { success: true };
          } else {
            throw new Error(response.message || 'Token refresh failed');
          }
        } catch (error) {
          set({ 
            isAuthenticated: false,
            user: null,
            token: null
          });
          apiService.setToken(null);
          return { success: false, error: error.message };
        }
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
        const { token } = get();
        if (token) {
          apiService.setToken(token);
          await get().getCurrentUser();
        }
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
