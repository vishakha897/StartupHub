import React, { createContext, useContext, useEffect, useState } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem('startuphub_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const current = await authService.getCurrentUser();
        setUser(current);
      } catch {
        localStorage.removeItem('startuphub_token');
        localStorage.removeItem('startuphub_user');
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    localStorage.setItem('startuphub_token', data.token);
    localStorage.setItem('startuphub_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (name, email, password) => {
    const data = await authService.register(name, email, password);
    localStorage.setItem('startuphub_token', data.token);
    localStorage.setItem('startuphub_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('startuphub_token');
    localStorage.removeItem('startuphub_user');
    setUser(null);
  };

  const updateUser = (updates) => setUser((u) => ({ ...u, ...updates }));

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
