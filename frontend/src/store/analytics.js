import { create } from 'zustand';
import apiService from '../services/api';

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

  // Track view
  trackView: async (contentId, contentType, metadata = {}) => {
    try {
      const response = await apiService.analytics.trackView({
        contentId,
        contentType,
        ...metadata
      });
      
      if (response.success) {
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to track view');
      }
    } catch (error) {
      console.error('Track view error:', error);
      return { success: false, error: error.message };
    }
  },

  // Track rating
  trackRating: async (contentId, contentType, rating) => {
    try {
      const response = await apiService.analytics.trackRating({
        contentId,
        contentType,
        rating
      });
      
      if (response.success) {
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to track rating');
      }
    } catch (error) {
      console.error('Track rating error:', error);
      return { success: false, error: error.message };
    }
  },

  // Track search
  trackSearch: async (searchQuery) => {
    try {
      const response = await apiService.analytics.trackSearch({
        searchQuery
      });
      
      if (response.success) {
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to track search');
      }
    } catch (error) {
      console.error('Track search error:', error);
      return { success: false, error: error.message };
    }
  },

  // Track share
  trackShare: async (contentId, contentType, platform) => {
    try {
      const response = await apiService.analytics.trackShare({
        contentId,
        contentType,
        platform
      });
      
      if (response.success) {
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to track share');
      }
    } catch (error) {
      console.error('Track share error:', error);
      return { success: false, error: error.message };
    }
  },

  // Get user analytics
  getUserAnalytics: async (params = {}) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await apiService.analytics.getUserAnalytics(params);
      
      if (response.success) {
        set({ 
          userAnalytics: response.data, 
          isLoading: false 
        });
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to fetch user analytics');
      }
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      return { success: false, error: error.message };
    }
  },

  // Get content analytics
  getContentAnalytics: async (contentId, params = {}) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await apiService.analytics.getContentAnalytics(contentId, params);
      
      if (response.success) {
        set({ 
          contentAnalytics: response.data, 
          isLoading: false 
        });
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to fetch content analytics');
      }
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      return { success: false, error: error.message };
    }
  }
}));

export default useAnalyticsStore;
