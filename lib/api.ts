import axios from 'axios';
import Constants from 'expo-constants';
import { getToken } from './auth';

// API base URL - use environment variable or fallback to production
const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'https://www.prynt.ro/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - could trigger logout here
      console.error('Unauthorized - token invalid');
    }
    return Promise.reject(error);
  }
);

// API methods matching your Next.js routes
export const apiClient = {
  // Auth
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (data: { email: string; password: string; name?: string }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  // Orders
  getOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  getOrder: async (id: string) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Products
  getProducts: async (category?: string) => {
    const response = await api.get('/products', { params: { category } });
    return response.data;
  },

  getProduct: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Price calculation
  calculatePrice: async (data: any) => {
    const response = await api.post('/calc-price', data);
    return response.data;
  },

  // User profile
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  updateProfile: async (data: any) => {
    const response = await api.patch('/user/profile', data);
    return response.data;
  },

  // Invoices
  getInvoices: async () => {
    const response = await api.get('/invoices');
    return response.data;
  },
};

export default api;
