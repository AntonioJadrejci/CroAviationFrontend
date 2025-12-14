
import axios from 'axios';
import router from './router';

const api = axios.create({
  baseURL: `${process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'}/api`,
});


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


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'}/api/refresh-token`, {
          token: refreshToken
        });

        localStorage.setItem('authToken', response.data.token);
        originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
        return api(originalRequest);
      } catch (err) {

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