import { create } from 'zustand';
import apiService from '../services/api';

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

  // Get all settings
  getSettings: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await apiService.settings.getAll();
      
      if (response.success) {
        set({ 
          settings: response.data, 
          isLoading: false,
          lastUpdated: new Date().toISOString()
        });
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to fetch settings');
      }
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      return { success: false, error: error.message };
    }
  },

  // Update settings
  updateSettings: async (settingsData) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await apiService.settings.update(settingsData);
      
      if (response.success) {
        set({ 
          settings: response.data, 
          isLoading: false,
          lastUpdated: new Date().toISOString()
        });
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to update settings');
      }
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      return { success: false, error: error.message };
    }
  },

  // Update specific section
  updateSection: async (section, sectionData) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await apiService.settings.updateSection(section, sectionData);
      
      if (response.success) {
        // Update the specific section in current settings
        const currentSettings = get().settings;
        if (currentSettings) {
          const updatedSettings = {
            ...currentSettings,
            ...sectionData
          };
          set({ 
            settings: updatedSettings, 
            isLoading: false,
            lastUpdated: new Date().toISOString()
          });
        }
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to update section');
      }
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      return { success: false, error: error.message };
    }
  },

  // Get specific section
  getSection: async (section) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await apiService.settings.getSection(section);
      
      if (response.success) {
        set({ isLoading: false });
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to fetch section');
      }
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      return { success: false, error: error.message };
    }
  },

  // Reset settings to default
  resetSettings: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await apiService.settings.reset();
      
      if (response.success) {
        set({ 
          settings: response.data, 
          isLoading: false,
          lastUpdated: new Date().toISOString()
        });
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to reset settings');
      }
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      return { success: false, error: error.message };
    }
  },

  // Get specific setting value
  getSetting: (key) => {
    const settings = get().settings;
    if (!settings) return null;
    
    // Handle nested keys like 'socialMedia.facebook'
    return key.split('.').reduce((obj, k) => obj?.[k], settings);
  },

  // Update specific setting value
  updateSetting: async (key, value) => {
    const settings = get().settings;
    if (!settings) return { success: false, error: 'Settings not loaded' };

    // Create update object for nested keys
    const updateData = {};
    if (key.includes('.')) {
      const keys = key.split('.');
      let obj = updateData;
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = obj[keys[i]] || {};
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
    } else {
      updateData[key] = value;
    }

    return await get().updateSettings(updateData);
  },

  // Initialize settings
  initialize: async () => {
    await get().getSettings();
  }
}));

export default useSettingsStore;
