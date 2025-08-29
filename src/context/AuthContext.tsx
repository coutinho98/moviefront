import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';

interface User {
    id: string;
    discordId: string;
    name: string;
    avatarUrl?: string | null;
}

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
    logout: () => void;
    login: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const checkAuthStatus = async () => {
        try {
            const response = await fetch('https://movie-eckw.onrender.com/auth/status', {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
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
        window.location.href = `https://movie-eckw.onrender.com/auth/discord`;
    };

    const logout = async () => {
        try {
            await fetch('https://movie-eckw.onrender.com/auth/logout', {
                method: 'GET',
                credentials: 'include',
            });
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        } finally {
            setUser(null);
            navigate('/');
        }
    };

    const isAuthenticated = user !== null;

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, user, logout, login }}>
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