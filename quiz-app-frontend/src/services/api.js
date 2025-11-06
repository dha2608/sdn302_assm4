import axios from 'axios';
import store from '../store/store';

// Backend API của bạn đang chạy trên port 3000
const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Interceptor: Tự động thêm token vào header của MỌI request
api.interceptors.request.use(
  (config) => {
    // Lấy token từ Redux state
    const token = store.getState().auth.token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;