import { create } from 'zustand';
import * as authService from '../services/authService';

const TOKEN_KEY = 'bmg_admin_token';
const ADMIN_KEY = 'bmg_admin_info';

function loadStoredAdmin() {
  try {
    const raw = localStorage.getItem(ADMIN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const useAuthStore = create((set, get) => ({
  token: localStorage.getItem(TOKEN_KEY) || null,
  admin: loadStoredAdmin(),
  isLoading: false,
  error: null,

  isAuthenticated: () => Boolean(get().token),

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { token, admin } = await authService.login(email, password);
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
      set({ token, admin, isLoading: false });
      return true;
    } catch (error) {
      const message = error.response?.data?.message || "Kirishda xatolik yuz berdi.";
      set({ isLoading: false, error: message });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_KEY);
    set({ token: null, admin: null });
  },

  clearError: () => set({ error: null }),
}));
