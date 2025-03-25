// src/axios-interceptor.js
import axios from 'axios';
import router from './router';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post('http://localhost:3000/api/refresh-token', {
          token: refreshToken
        });

        localStorage.setItem('authToken', response.data.token);
        originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
        return api(originalRequest);
      } catch (err) {
        // If refresh fails, log out the user
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        router.push('/');
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;