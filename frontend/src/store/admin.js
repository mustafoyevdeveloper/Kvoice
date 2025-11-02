import { create } from 'zustand';
import apiService from '../services/api';

const useAdminStore = create((set, get) => ({
  // State
  dashboard: null,
  content: [],
  users: [],
  analytics: null,
  uploadStats: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
    hasNext: false,
    hasPrev: false
  },

  // Actions
  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  setPagination: (pagination) => set({ pagination }),

  // Get all content
  getContent: async (params = {}) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await apiService.movies.getAll(params);
      
      if (response.success) {
        set({ 
          content: response.data || [], 
          pagination: response.pagination || {
            page: 1,
            limit: 20,
            total: response.data?.length || 0,
            pages: 1,
            hasNext: false,
            hasPrev: false
          },
          isLoading: false 
        });
        return { success: true, data: response.data || [] };
      } else {
        throw new Error(response.message || 'Failed to fetch content');
      }
    } catch (error) {
      set({ 
        content: [], 
        pagination: { page: 1, limit: 20, total: 0, pages: 0, hasNext: false, hasPrev: false },
        isLoading: false,
        error: error.message
      });
      return { success: false, error: error.message, data: [] };
    }
  },

  // Upload poster - now handled directly in create/update with FormData
  uploadPoster: async (file) => {
    // File will be uploaded with the movie, so just return success
    return { success: true, data: { url: URL.createObjectURL(file) } };
  },

  // Create movie
  createMovie: async (movieData) => {
    try {
      set({ isLoading: true, error: null });
      
      // Extract poster file if it's a File object
      const posterFile = movieData.posterFile;
      delete movieData.posterFile;
      
      const response = await apiService.movies.create(movieData, posterFile);
      
      if (response.success) {
        set({ isLoading: false });
        // Refresh content list
        await get().getContent();
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to create movie');
      }
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      return { success: false, error: error.message };
    }
  },

  // Update movie
  updateMovie: async (id, movieData) => {
    try {
      set({ isLoading: true, error: null });
      
      // Extract poster file if it's a File object
      const posterFile = movieData.posterFile;
      delete movieData.posterFile;
      
      const response = await apiService.movies.update(id, movieData, posterFile);
      
      if (response.success) {
        set({ isLoading: false });
        // Refresh content list
        await get().getContent();
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to update movie');
      }
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      return { success: false, error: error.message };
    }
  },

  // Delete movie
  deleteMovie: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await apiService.movies.delete(id);
      
      if (response.success) {
        set({ isLoading: false });
        // Refresh content list
        await get().getContent();
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to delete movie');
      }
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      return { success: false, error: error.message };
    }
  },

  // Other methods kept for compatibility but return empty/error
  getDashboard: async () => {
    return { success: false, error: 'Not implemented' };
  },

  updateContentStatus: async (id, status, type = 'movie') => {
    return { success: false, error: 'Not implemented' };
  },

  bulkUpdateStatus: async (ids, status, type = 'movie') => {
    return { success: false, error: 'Not implemented' };
  },

  getUsers: async (params = {}) => {
    return { success: true, data: [] };
  },

  updateUser: async (id, userData) => {
    return { success: false, error: 'Not implemented' };
  },

  deleteUser: async (id) => {
    return { success: false, error: 'Not implemented' };
  },

  getAnalytics: async (params = {}) => {
    return { success: false, error: 'Not implemented' };
  },

  getUploadStats: async () => {
    return { success: false, error: 'Not implemented' };
  },

  deleteFile: async (filename, type = 'image') => {
    return { success: false, error: 'Not implemented' };
  },

  uploadVideo: async (file) => {
    return { success: false, error: 'Not implemented' };
  },

  uploadImages: async (files) => {
    return { success: false, error: 'Not implemented' };
  },

  initialize: async () => {
    await get().getContent();
  }
}));

export default useAdminStore;
