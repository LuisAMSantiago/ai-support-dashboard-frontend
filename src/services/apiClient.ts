import axios, { AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to handle XSRF token
apiClient.interceptors.request.use((config) => {
  // Get XSRF token from cookie if available
  const xsrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];
  
  if (xsrfToken) {
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken);
  }
  
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear auth state and redirect to login
      // This handles session expiration or invalid token
      const isLoginPage = window.location.pathname === '/login';
      
      if (!isLoginPage) {
        // Clear any stored auth state
        localStorage.removeItem('auth_token');
        sessionStorage.clear();
        
        // Redirect to login
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const getCsrfCookie = async () => {
  await apiClient.get('/sanctum/csrf-cookie');
};

export default apiClient;
