const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token') || 'mock-admin-token-12345';
    
    // Ensure mock token is set in localStorage for development
    if (!localStorage.getItem('token')) {
      localStorage.setItem('token', 'mock-admin-token-12345');
    }
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  // Get headers with auth token
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        console.error('API Error Response:', data);
        console.error('API Error Details:', data.errors);
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url);
  }

  // POST request
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // File upload
  async uploadFile(endpoint, formData) {
    const headers = {};
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'File upload failed');
    }

    return data;
  }

  // Auth endpoints
  auth = {
    register: (userData) => this.post('/auth/register', userData),
    login: (credentials) => this.post('/auth/login', credentials),
    logout: () => this.post('/auth/logout'),
    getMe: () => this.get('/auth/me'),
    refreshToken: () => this.post('/auth/refresh'),
    updateProfile: (data) => this.put('/auth/profile', data),
    changePassword: (data) => this.put('/auth/change-password', data),
    createAdmin: (userData) => this.post('/auth/create-admin', userData),
  };

  // Movies endpoints
  movies = {
    getAll: (params) => this.get('/movies', params),
    search: (query, params) => this.get('/movies/search', { q: query, ...params }),
    getById: (id) => this.get(`/movies/${id}`),
    create: (data) => this.post('/movies', data),
    update: (id, data) => this.put(`/movies/${id}`, data),
    delete: (id) => this.delete(`/movies/${id}`),
    like: (id) => this.post(`/movies/${id}/like`),
    getVideo: (id, quality) => this.get(`/movies/${id}/video`, { quality }),
  };

  // Users endpoints
  users = {
    getById: (id) => this.get(`/users/${id}`),
    getAll: (params) => this.get('/users', params),
    update: (id, data) => this.put(`/users/${id}`, data),
    delete: (id) => this.delete(`/users/${id}`),
    getWatchHistory: (id, params) => this.get(`/users/${id}/watch-history`, params),
    getFavorites: (id, params) => this.get(`/users/${id}/favorites`, params),
    addToFavorites: (movieId) => this.post(`/users/favorites/${movieId}`),
    removeFromFavorites: (movieId) => this.delete(`/users/favorites/${movieId}`),
    addToWatchlist: (movieId) => this.post(`/users/watchlist/${movieId}`),
    removeFromWatchlist: (movieId) => this.delete(`/users/watchlist/${movieId}`),
  };

  // Admin endpoints
  admin = {
    getDashboard: () => this.get('/admin/dashboard'),
    getContent: (params) => this.get('/admin/content', params),
    updateContentStatus: (id, status, type) => this.put(`/admin/content/${id}/status?type=${type}`, { status }),
    getAnalytics: (params) => this.get('/admin/analytics', params),
    getUsers: (params) => this.get('/admin/users', params),
    bulkUpdateStatus: (data) => this.put('/admin/content/bulk-status', data),
  };

  // Upload endpoints
  upload = {
    video: (file) => {
      const formData = new FormData();
      formData.append('video', file);
      return this.uploadFile('/upload/video', formData);
    },
    poster: (file) => {
      const formData = new FormData();
      formData.append('poster', file);
      return this.uploadFile('/upload/poster', formData);
    },
    images: (files) => {
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));
      return this.uploadFile('/upload/images', formData);
    },
    deleteFile: (filename, type) => this.delete(`/upload/${filename}?type=${type}`),
    getStats: () => this.get('/upload/stats'),
  };

  // Analytics endpoints
  analytics = {
    trackView: (data) => this.post('/analytics/view', data),
    trackRating: (data) => this.post('/analytics/rating', data),
    trackSearch: (data) => this.post('/analytics/search', data),
    trackShare: (data) => this.post('/analytics/share', data),
    getUserAnalytics: (params) => this.get('/analytics/user', params),
    getContentAnalytics: (id, params) => this.get(`/analytics/content/${id}`, params),
  };

  // Settings endpoints
  settings = {
    getAll: () => this.get('/settings'),
    update: (data) => this.put('/settings', data),
    reset: () => this.post('/settings/reset'),
    getSection: (section) => this.get(`/settings/section/${section}`),
    updateSection: (section, data) => this.put(`/settings/section/${section}`, data),
  };
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;
