import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('lifevault_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('lifevault_token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Validate session on mount
  useEffect(() => {
    async function checkAuth() {
      if (token) {
        try {
          const res = await api.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('lifevault_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('Session verification failed:', err.message);
          // Don't immediately wipe if backend is temporarily offline during dev
        }
      }
      setLoading(false);
    }
    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await api.login({ email, password });
      if (res.success) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('lifevault_token', res.token);
        localStorage.setItem('lifevault_user', JSON.stringify(res.user));
        return { success: true, user: res.user };
      }
      throw new Error(res.message || 'Login failed');
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      const res = await api.register(userData);
      if (res.success) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('lifevault_token', res.token);
        localStorage.setItem('lifevault_user', JSON.stringify(res.user));
        return { success: true, user: res.user };
      }
      throw new Error(res.message || 'Registration failed');
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  const demoLogin = async (role = 'owner') => {
    setError(null);
    try {
      const res = await api.demoLogin(role);
      if (res.success) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('lifevault_token', res.token);
        localStorage.setItem('lifevault_user', JSON.stringify(res.user));
        return { success: true, user: res.user };
      }
      throw new Error(res.message || 'Demo login failed');
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('lifevault_token');
    localStorage.removeItem('lifevault_user');
  };

  const refreshUser = async () => {
    try {
      const res = await api.getMe();
      if (res.success) {
        setUser(res.user);
        localStorage.setItem('lifevault_user', JSON.stringify(res.user));
      }
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      error,
      login,
      register,
      demoLogin,
      logout,
      refreshUser,
      isAuthenticated: !!token && !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
