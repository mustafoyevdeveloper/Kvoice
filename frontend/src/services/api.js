const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL}/api` : null) ||
  (import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/api` : null) ||
  'http://localhost:3000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Remove Content-Type for FormData
    if (options.body instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors with detailed messages
        if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          const errorMessages = data.errors.map(err => 
            `${err.field || err.param}: ${err.message || err.msg}`
          ).join(', ');
          throw new Error(data.message + ': ' + errorMessages);
        }
        throw new Error(data.message || data.error || 'API request failed');
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
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    // DELETE requests typically don't have a body
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      method: 'DELETE',
      headers: {
        // Don't set Content-Type for DELETE without body
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Delete request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Movies endpoints
  movies = {
    getAll: (params) => this.get('/movies', params),
    getById: (id) => this.get(`/movies/${id}`),
    create: (data, posterFile) => {
      const formData = new FormData();
      
      // Add all fields to FormData
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          if (Array.isArray(data[key])) {
            // Arrays should be sent as JSON string or multiple fields
            formData.append(key, JSON.stringify(data[key]));
          } else {
            formData.append(key, data[key]);
          }
        }
      });

      // Add poster file if provided
      if (posterFile) {
        formData.append('poster', posterFile);
      }

      return this.post('/movies', formData);
    },
    update: (id, data, posterFile) => {
      const formData = new FormData();
      
      // Add all fields to FormData
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          if (Array.isArray(data[key])) {
            formData.append(key, JSON.stringify(data[key]));
          } else {
            formData.append(key, data[key]);
          }
        }
      });

      // Add poster file if provided
      if (posterFile) {
        formData.append('poster', posterFile);
      }

      return this.put(`/movies/${id}`, formData);
    },
    delete: (id) => this.delete(`/movies/${id}`),
  };
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;

