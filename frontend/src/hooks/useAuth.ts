import { useState, useCallback } from 'react';
import { api } from '../services/api';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
}

export const useAuth = () => {
  const [auth, setAuth] = useState<AuthState>(() => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (!token || !userStr) {
        return { user: null, token: null };
      }

      const user = JSON.parse(userStr);
      
      if (!user || typeof user !== 'object') {
        return { user: null, token: null };
      }

      return { user, token };
    } catch (error) {
      // If there's any error parsing, clear invalid data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { user: null, token: null };
    }
  });

  const login = useCallback(async (username: string, password: string) => {
    try {
      const response = await api.login(username, password);
      setAuth({ user: response.user, token: response.token });
      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    api.logout();
    setAuth({ user: null, token: null });
  }, []);

  return {
    user: auth.user,
    token: auth.token,
    isAuthenticated: !!auth.token,
    isRoot: auth.user?.isRoot ?? false,
    login,
    logout
  };
};