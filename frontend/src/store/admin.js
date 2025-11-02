import { create } from 'zustand';

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

  // All API calls removed - return empty or error
  getDashboard: async () => {
    return { success: false, error: 'Backend removed' };
  },

  getContent: async (params = {}) => {
    return { success: true, data: [] };
  },

  updateContentStatus: async (id, status, type = 'movie') => {
    return { success: false, error: 'Backend removed' };
  },

  bulkUpdateStatus: async (ids, status, type = 'movie') => {
    return { success: false, error: 'Backend removed' };
  },

  getUsers: async (params = {}) => {
    return { success: true, data: [] };
  },

  updateUser: async (id, userData) => {
    return { success: false, error: 'Backend removed' };
  },

  deleteUser: async (id) => {
    return { success: false, error: 'Backend removed' };
  },

  getAnalytics: async (params = {}) => {
    return { success: false, error: 'Backend removed' };
  },

  getUploadStats: async () => {
    return { success: false, error: 'Backend removed' };
  },

  deleteFile: async (filename, type = 'image') => {
    return { success: false, error: 'Backend removed' };
  },

  uploadVideo: async (file) => {
    return { success: false, error: 'Backend removed' };
  },

  uploadPoster: async (file) => {
    // Return mock URL for local file
    return { success: true, data: { url: URL.createObjectURL(file) } };
  },

  uploadImages: async (files) => {
    return { success: false, error: 'Backend removed' };
  },

  createMovie: async (movieData) => {
    return { success: false, error: 'Backend removed' };
  },

  updateMovie: async (id, movieData) => {
    return { success: false, error: 'Backend removed' };
  },

  deleteMovie: async (id) => {
    return { success: false, error: 'Backend removed' };
  },

  initialize: async () => {
    // Do nothing
  }
}));

export default useAdminStore;
