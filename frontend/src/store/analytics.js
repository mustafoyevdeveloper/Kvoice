import { create } from 'zustand';

const useAnalyticsStore = create((set, get) => ({
  // State
  userAnalytics: null,
  contentAnalytics: null,
  isLoading: false,
  error: null,

  // Actions
  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  // All API calls removed - return success silently
  trackView: async (contentId, contentType, metadata = {}) => {
    return { success: true };
  },

  trackRating: async (contentId, contentType, rating) => {
    return { success: true };
  },

  trackSearch: async (searchQuery) => {
    return { success: true };
  },

  trackShare: async (contentId, contentType, platform) => {
    return { success: true };
  },

  getUserAnalytics: async (params = {}) => {
    return { success: false, error: 'Backend removed' };
  },

  getContentAnalytics: async (contentId, params = {}) => {
    return { success: false, error: 'Backend removed' };
  }
}));

export default useAnalyticsStore;
