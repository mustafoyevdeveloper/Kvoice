import { create } from 'zustand';

const useSettingsStore = create((set, get) => ({
  // State
  settings: null,
  isLoading: false,
  error: null,
  lastUpdated: null,

  // Actions
  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  // Get all settings - removed API call
  getSettings: async () => {
    return { success: false, error: 'Backend removed' };
  },

  // Update settings - removed API call
  updateSettings: async (settingsData) => {
    return { success: false, error: 'Backend removed' };
  },

  // Update specific section - removed API call
  updateSection: async (section, sectionData) => {
    return { success: false, error: 'Backend removed' };
  },

  // Get specific section - removed API call
  getSection: async (section) => {
    return { success: false, error: 'Backend removed' };
  },

  // Reset settings to default - removed API call
  resetSettings: async () => {
    return { success: false, error: 'Backend removed' };
  },

  // Get specific setting value
  getSetting: (key) => {
    const settings = get().settings;
    if (!settings) return null;
    
    // Handle nested keys like 'socialMedia.facebook'
    return key.split('.').reduce((obj, k) => obj?.[k], settings);
  },

  // Update specific setting value - removed API call
  updateSetting: async (key, value) => {
    return { success: false, error: 'Backend removed' };
  },

  // Initialize settings - removed API call
  initialize: async () => {
    // Do nothing
  }
}));

export default useSettingsStore;
