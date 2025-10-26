import { create } from 'zustand';
import apiService from '../services/api';

const useAdminStore = create((set, get) => ({
  // State
  dashboard: null,
  content: [], // Empty array - no default movies
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

  // Dashboard
  getDashboard: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await apiService.admin.getDashboard();
      
      if (response.success) {
        set({ 
          dashboard: response.data, 
          isLoading: false 
        });
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to fetch dashboard data');
      }
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      return { success: false, error: error.message };
    }
  },

  // Content Management
  getContent: async (params = {}) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await apiService.admin.getContent(params);
      
      if (response.success) {
        set({ 
          content: response.data || [], 
          pagination: response.pagination,
          isLoading: false 
        });
        return { success: true, data: response.data || [] };
      } else {
        // If API fails, return empty array instead of throwing error
        set({ 
          content: [], 
          pagination: { page: 1, limit: 20, total: 0, pages: 0, hasNext: false, hasPrev: false },
          isLoading: false 
        });
        return { success: true, data: [] };
      }
    } catch (error) {
      // If API fails, return empty array instead of throwing error
      set({ 
        content: [], 
        pagination: { page: 1, limit: 20, total: 0, pages: 0, hasNext: false, hasPrev: false },
        isLoading: false 
      });
      return { success: true, data: [] };
    }
  },

  updateContentStatus: async (id, status, type = 'movie') => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await apiService.admin.updateContentStatus(id, status, type);
      
      if (response.success) {
        set({ isLoading: false });
        // Refresh content list
        await get().getContent();
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to update content status');
      }
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      return { success: false, error: error.message };
    }
  },

  bulkUpdateStatus: async (ids, status, type = 'movie') => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await apiService.admin.bulkUpdateStatus({ ids, status, type });
      
      if (response.success) {
        set({ isLoading: false });
        // Refresh content list
        await get().getContent();
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to bulk update status');
      }
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      return { success: false, error: error.message };
    }
  },

  // User Management
  getUsers: async (params = {}) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await apiService.admin.getUsers(params);
      
      if (response.success) {
        set({ 
          users: response.data, 
          pagination: response.pagination,
          isLoading: false 
        });
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to fetch users');
      }
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      return { success: false, error: error.message };
    }
  },

  updateUser: async (id, userData) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await apiService.users.update(id, userData);
      
      if (response.success) {
        set({ isLoading: false });
        // Refresh users list
        await get().getUsers();
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to update user');
      }
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      return { success: false, error: error.message };
    }
  },

  deleteUser: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await apiService.users.delete(id);
      
      if (response.success) {
        set({ isLoading: false });
        // Refresh users list
        await get().getUsers();
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to delete user');
      }
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      return { success: false, error: error.message };
    }
  },

  // Analytics
  getAnalytics: async (params = {}) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await apiService.admin.getAnalytics(params);
      
      if (response.success) {
        set({ 
          analytics: response.data, 
          isLoading: false 
        });
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to fetch analytics');
      }
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      return { success: false, error: error.message };
    }
  },

  // Upload Management
  getUploadStats: async () => {
    try {
      const response = await apiService.upload.getStats();
      
      if (response.success) {
        set({ uploadStats: response.data });
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to fetch upload stats');
      }
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  deleteFile: async (filename, type = 'image') => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await apiService.upload.deleteFile(filename, type);
      
      if (response.success) {
        set({ isLoading: false });
        // Refresh upload stats
        await get().getUploadStats();
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to delete file');
      }
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      return { success: false, error: error.message };
    }
  },

  // File Upload
  uploadVideo: async (file) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await apiService.upload.video(file);
      
      if (response.success) {
        set({ isLoading: false });
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to upload video');
      }
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      return { success: false, error: error.message };
    }
  },

  uploadPoster: async (file) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await apiService.upload.poster(file);
      
      if (response.success) {
        set({ isLoading: false });
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to upload poster');
      }
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      return { success: false, error: error.message };
    }
  },

  uploadImages: async (files) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await apiService.upload.images(files);
      
      if (response.success) {
        set({ isLoading: false });
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to upload images');
      }
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      return { success: false, error: error.message };
    }
  },

  // Movie Management
  createMovie: async (movieData) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await apiService.movies.create(movieData);
      
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

  updateMovie: async (id, movieData) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await apiService.movies.update(id, movieData);
      
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

  // Initialize admin data
  initialize: async () => {
    await Promise.all([
      get().getDashboard(),
      get().getContent(),
      get().getUsers(),
      get().getAnalytics(),
      get().getUploadStats()
    ]);
  }
}));

export default useAdminStore;
