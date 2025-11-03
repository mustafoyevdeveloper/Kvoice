// Determine API base URL
// Priority: VITE_API_URL > VITE_BACKEND_URL/api > VITE_API_BASE_URL/api > localhost
const getApiBaseUrl = () => {
  // If VITE_API_URL is set and is a full URL, use it
  if (import.meta.env.VITE_API_URL) {
    const url = import.meta.env.VITE_API_URL.trim();
    // If it already ends with /api, use as is, otherwise add /api
    return url.endsWith('/api') ? url : `${url}/api`;
  }
  
  // If VITE_BACKEND_URL is set
  if (import.meta.env.VITE_BACKEND_URL) {
    const url = import.meta.env.VITE_BACKEND_URL.trim();
    return url.endsWith('/api') ? url : `${url}/api`;
  }
  
  // If VITE_API_BASE_URL is set
  if (import.meta.env.VITE_API_BASE_URL) {
    const url = import.meta.env.VITE_API_BASE_URL.trim();
    return url.endsWith('/api') ? url : `${url}/api`;
  }
  
  // Fallback to localhost for development
  return 'http://localhost:3000/api' || "https://kvoice-studio-back-nows.onrender.com/api";
};

const API_BASE_URL = getApiBaseUrl();

// Log API URL for debugging (both dev and production)
console.log('🔗 API Base URL:', API_BASE_URL);
console.log('🔍 Environment Variables:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  MODE: import.meta.env.MODE,
  PROD: import.meta.env.PROD,
  DEV: import.meta.env.DEV
});

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
      console.log('🌐 Fetching URL:', url);
      const response = await fetch(url, config);
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('❌ Non-JSON response:', text.substring(0, 200));
        throw new Error(`API returned non-JSON response: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors with detailed messages
        if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          const errorMessages = data.errors.map(err => 
            `${err.field || err.param}: ${err.message || err.msg}`
          ).join(', ');
          throw new Error(data.message + ': ' + errorMessages);
        }
        throw new Error(data.message || data.error || `API request failed: ${response.status} ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error('❌ API Error:', {
        message: error.message,
        url: url,
        type: error.name,
        stack: error.stack
      });
      
      // More specific error messages
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        const errorMessage = `Backend'ga ulanib bo'lmadi. API URL: ${API_BASE_URL}. Tekshiring: 1) Backend ishlayaptimi? 2) CORS sozlanganmi? 3) Environment variable'lar to'g'rimi?`;
        console.error('❌', errorMessage);
        throw new Error(errorMessage);
      }
      
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

