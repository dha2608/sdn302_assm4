import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Tạo một hàm để "tiêm" store vào sau
export const setupAxiosInterceptor = (store) => {
  api.interceptors.request.use(
    (config) => {
      // Lấy token từ store được truyền vào
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
};

export default api;