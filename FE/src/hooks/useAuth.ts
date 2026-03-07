import { useState, useEffect } from 'react';
import api from '../lib/api';
import type { User } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (provider: 'google' | 'github') => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/${provider}`;
  };

  const logout = async () => {
    await api.get('/auth/logout');
    setUser(null);
    window.location.reload();
  };

  return { user, loading, login, logout, checkAuth };
}
