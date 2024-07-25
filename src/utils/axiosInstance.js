import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: `https://presensi-siswa-backend-express-js.vercel.app`
});

// Tambahkan interceptor untuk menambahkan Bearer token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
