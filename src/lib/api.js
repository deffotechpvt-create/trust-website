import axios from "axios";
import { useCallback } from "react";

// Determine the base URL
export const getBaseURL = () => {
if(import.meta.env.VITE_APP_NODE_ENV === 'production') {
    return import.meta.env.VITE_APP_API_BASE ;
  }
  else{
    return 'http://localhost:4242/api';
  }
};

// Axios instance
const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  timeout: 30000, // 30s
});

// ✅ Attach JWT token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token"); // JWT token
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

// Refresh token helper
async function refreshAppToken(userId) {
  try {
    const res = await api.post('/auth/refresh-token', { userId });
    if (res.data.appToken) {
      localStorage.setItem('auth_token', res.data.appToken); // Fixed: use auth_token
      return res.data.appToken;
    }
    return null;
  } catch (err) {
    console.error('Refresh token failed:', err.response?.data || err.message);
    return null;
  }
}

// ✅ Setup loading interceptor (call this once in App.jsx)
export const setupLoadingInterceptor = (setIsLoading) => {
  // Request interceptor - show loader
  api.interceptors.request.use(
    (config) => {
      setIsLoading(true);
      return config;
    },
    (error) => {
      setIsLoading(false);
      return Promise.reject(error);
    }
  );

  // Response interceptor - hide loader & handle errors
  api.interceptors.response.use(
    (response) => {
      setIsLoading(false);
      return response;
    },
    async (error) => {
      setIsLoading(false);
      const originalRequest = error.config;

      // Check if 401 + token expired + request not already retried
      if (
        error.response?.status === 401 &&
        error.response?.data?.error === 'Invalid or expired token' &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true; // avoid infinite loop

        // Get user from localStorage or context
        const userStr = localStorage.getItem('user_data');
        const user = userStr ? JSON.parse(userStr) : null;

        if (user?._id) {
          // Refresh token
          const newToken = await refreshAppToken(user._id);
          if (newToken) {
            // Update header & retry original request
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return api(originalRequest);
          }
        }
        
        // Clear storage and redirect
        console.warn("Refresh token failed. Please login again.");
        localStorage.removeItem("auth_token");
        window.location.href = '/login'; // Redirect to login
      }

      return Promise.reject(error);
    }
  );
};

// Custom hook
// 🔒 Stable wrapper (outside hook)
const requestWrapper = async (method, url, dataOrConfig = null) => {
  try {
    if (method === 'get') {
      return await api.get(url, dataOrConfig);
    }
    if (method === 'post') return await api.post(url, dataOrConfig);
    if (method === 'put') return await api.put(url, dataOrConfig);
    if (method === 'delete') return await api.delete(url, dataOrConfig);
  } catch (err) {
    console.error(`${method.toUpperCase()} Error:`, err.response?.data || err.message);
    throw err;
  }
};

export function useApi() {
  const get = useCallback(
    (url, config) => requestWrapper('get', url, config),
    []
  );

  const post = useCallback(
    (url, body) => requestWrapper('post', url, body),
    []
  );

  const put = useCallback(
    (url, body) => requestWrapper('put', url, body),
    []
  );

  const del = useCallback(
    (url, config) => requestWrapper('delete', url, config),
    []
  );

  return { get, post, put, del };
}
