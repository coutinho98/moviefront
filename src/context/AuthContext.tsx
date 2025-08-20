import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';

interface UserType {
  name: string;
}

interface AuthContextType {
  user: UserType | null;
  login: (userData: UserType) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('http://localhost:3000/auth/status', {
        credentials: 'include', // Essencial para enviar o cookie JWT
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (err: unknown) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = (userData: UserType) => {
    setUser(userData);
  };

  const logout = async () => {
    setUser(null);
  };

  const value: AuthContextType = { user, login, logout, isAuthenticated: !!user };

  if (loading) {
    return <div className="text-white text-center p-8">Carregando...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};