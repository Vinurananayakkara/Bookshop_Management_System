import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
  withCredentials: true, // Enable cookies for session-based auth
});

// Request interceptor for session-based auth
api.interceptors.request.use(
  (config) => {
    // No need to add Authorization header for session-based auth
    // Cookies are automatically included with withCredentials: true
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      // Session expired or invalid
      localStorage.removeItem('user');
      window.location.href = '/login';
    } else if (error.response?.status === 404) {
      console.error('Resource not found');
    } else if (error.response?.status >= 500) {
      console.error('Server error occurred');
    } else if (error.code === 'ECONNREFUSED' || error.code === 'NETWORK_ERROR') {
      console.error('Unable to connect to server. Please check if the backend is running.');
    }
    
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

// Items API calls
export const itemsAPI = {
  getAll: (params = {}) => api.get('/items', { params }),
  getById: (id) => api.get(`/items/${id}`),
  create: (itemData) => api.post('/items', itemData),
  update: (id, itemData) => api.put(`/items/${id}`, itemData),
  delete: (id) => api.delete(`/items/${id}`),
  // Additional filtering methods
  getByCategory: (category) => api.get(`/items?category=${category}`),
  search: (query, category) => api.get(`/items?q=${query}&category=${category || ''}`),
  getCategories: () => api.get('/items/categories'),
};

// Bills API calls (using different base URL)
const billsApi = axios.create({
  baseURL: 'http://localhost:8080/api/bills',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true,
});

export const billsAPI = {
  getAll: () => billsApi.get(''),
  getById: (id) => billsApi.get(`/${id}`),
  create: (billData) => billsApi.post('', billData),
  delete: (id) => billsApi.delete(`/${id}`),
  print: (id) => billsApi.get(`/print/${id}`),
  downloadPdf: (id) => billsApi.get(`/download-pdf/${id}`, { responseType: 'blob' }),
};

// User Profile API calls
export const userAPI = {
  getProfile: () => api.get('/profile'),
  updateProfile: (profileData) => api.put('/profile', profileData),
  changePassword: (passwordData) => api.post('/profile/change-password', passwordData),
};

// Customers API calls - using users endpoint since customers are users
export const customersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (customerData) => api.post('/users', customerData),
  update: (id, customerData) => api.put(`/users/${id}`, customerData),
  delete: (id) => api.delete(`/users/${id}`),
};

// Cart API calls
export const cartAPI = {
  getByUserId: (userId) => api.get(`/cart/user/${userId}`),
  addItem: (cartData) => api.post('/cart', cartData),
  updateItem: (id, cartData) => api.put(`/cart/${id}`, cartData),
  removeItem: (id) => api.delete(`/cart/${id}`),
  clearCart: (userId) => api.delete(`/cart/user/${userId}`),
};

// Staff API calls (placeholder - backend endpoints may not exist yet)
export const staffAPI = {
  getAll: () => Promise.resolve({ data: [] }), // Mock response for now
  getById: (id) => Promise.resolve({ data: null }),
  create: (staffData) => Promise.resolve({ data: staffData }),
  update: (id, staffData) => Promise.resolve({ data: staffData }),
  delete: (id) => Promise.resolve(),
};

export default api;
