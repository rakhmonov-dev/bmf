import axios from 'axios';

/**
 * Markazlashtirilgan axios instance. Barcha so'rovlar shu orqali o'tadi,
 * shunda base URL va auth token boshqarishni bir joyda saqlaymiz.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Har bir so'rovga admin token'ni avtomatik qo'shish (agar mavjud bo'lsa)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bmg_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 401/403 kelganda avtomatik logout qilish (token muddati tugagan holat)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname.startsWith('/admin')) {
      localStorage.removeItem('bmg_admin_token');
      localStorage.removeItem('bmg_admin_info');
      if (window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
