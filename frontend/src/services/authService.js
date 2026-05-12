import api from './api';

export const authService = {
  register: async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      return response.data;
    } catch (err) {
      // Normalize error shape for callers
      const message = err?.response?.data?.message || err.message || 'Registration failed';
      return { success: false, message };
    }
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.data.token) {
      localStorage.setItem('traveloop-token', response.data.data.token);
      localStorage.setItem('traveloop-user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  verifyEmail: async (email, code) => {
    const response = await api.post('/auth/verify-email', { email, code });
    return response.data;
  },

  resendVerificationEmail: async (email) => {
    const response = await api.post('/auth/resend-verification-email', { email });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('traveloop-token');
    localStorage.removeItem('traveloop-user');
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};
