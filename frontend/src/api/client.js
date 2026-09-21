import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
});

// Request Interceptor: Attach Bearer Token if present
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Format error messages & handle 401 Unauthorized
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      // Handle Token Expiration or Invalid Token
      if (status === 401) {
        console.warn('Unauthorized access - Clearing token');
        localStorage.removeItem('token');
        localStorage.removeItem('user_role');
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login?expired=true';
        }
      }
    } else if (error.request) {
      console.error('Network Error: Backend appears unreachable', error.request);
    }
    return Promise.reject(error);
  }
);

export default client;
