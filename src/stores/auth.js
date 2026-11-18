import { reactive, computed } from 'vue';
import { apiRequest } from '../utils/api.js';

const state = reactive({
  user: null,
  isAuthenticated: false,
  isInitialized: false,
  loading: false,
});

export const useAuth = () => {
  const isSuperadmin = computed(() => state.user?.role === 'superadmin');

  async function checkAuth() {
    state.loading = true;
    try {
      const data = await apiRequest('/api/auth/me');
      if (data && data.user) {
        state.user = data.user;
        state.isAuthenticated = true;
      } else {
        state.user = null;
        state.isAuthenticated = false;
      }
    } catch (_) {
      state.user = null;
      state.isAuthenticated = false;
    } finally {
      state.loading = false;
      state.isInitialized = true;
    }
    return state.isAuthenticated;
  }

  async function login(username, password, turnstileToken) {
    state.loading = true;
    try {
      const data = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: { username, password, turnstile_token: turnstileToken },
      });
      state.user = data.user;
      state.isAuthenticated = true;
      return data;
    } finally {
      state.loading = false;
    }
  }

  async function logout() {
    state.loading = true;
    try {
      await apiRequest('/api/auth/logout', { method: 'POST' });
    } catch (_) {
    } finally {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    }
  }

  return {
    state,
    isSuperadmin,
    checkAuth,
    login,
    logout,
  };
};
