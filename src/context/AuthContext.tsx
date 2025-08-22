import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface User {
    id: string;
    discordId: string;
    name: string;
    avatarUrl?: string; 
}

interface AuthContextType {
    user: User | null;
    login: () => void;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const apiUrl = 'http://localhost:3000';

    const checkAuthStatus = async () => {
        try {
            const response = await fetch(`${apiUrl}/auth/status`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const data: User = await response.json();
                setUser(data);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Erro ao verificar o status de autenticação:', error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const login = () => {
        window.location.href = `${apiUrl}/auth/discord`;
    };
    const logout = async () => {
        try {
            await fetch(`${apiUrl}/auth/logout`, {
                method: 'GET',
                credentials: 'include',
            });
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        } finally {
            setUser(null);
            window.location.href = '/';
        }
    };

    const isAuthenticated = user !== null;

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isLoading }}>
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