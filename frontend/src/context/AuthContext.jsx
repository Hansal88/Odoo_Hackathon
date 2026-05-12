import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('traveloop-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        localStorage.removeItem('traveloop-user');
        localStorage.removeItem('traveloop-token');
      }
    }
    setLoading(false);
  }, []);

  const register = async (name, email, password) => {
    try {
      setError(null);
      const response = await authService.register(name, email, password);
      return response;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      throw new Error(message);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authService.login(email, password);
      setUser(response.data);
      return response;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      throw new Error(message);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setError(null);
  };

  const verifyEmail = async (email, code) => {
    try {
      setError(null);
      const response = await authService.verifyEmail(email, code);
      return response;
    } catch (err) {
      const message = err.response?.data?.message || 'Verification failed';
      setError(message);
      throw new Error(message);
    }
  };

  const resendVerificationEmail = async (email) => {
    try {
      setError(null);
      const response = await authService.resendVerificationEmail(email);
      return response;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to resend email';
      setError(message);
      throw new Error(message);
    }
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    verifyEmail,
    resendVerificationEmail,
    isAuthenticated: !!user && !!localStorage.getItem('traveloop-token'),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
