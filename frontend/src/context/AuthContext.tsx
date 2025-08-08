import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { login as authLogin, register as authRegister } from '../services/auth';

interface AuthContextType {
  user: { id: string; username: string; email: string } | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<{
    id: string;
    username: string;
    email: string;
  } | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const token = await authLogin(email, password);
    setToken(token);
    localStorage.setItem('token', token);

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const user = {
        id: payload.id,
        email: payload.email,
        username: payload.email,
      };
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    } catch (e) {
      console.error('Error decoding token', e);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    const response = await authRegister(username, email, password);
    return response;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
