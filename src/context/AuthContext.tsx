// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

const PRODUCTION_API_URL = 'https://movie-eckw.onrender.com';
const LOCAL_LOGIN_API_URL = 'http://localhost:3000';

export interface User {
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
    const location = useLocation();

    const checkAuthStatus = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                setUser(null);
                setIsLoading(false);
                return;
            }

            const response = await fetch(`${LOCAL_LOGIN_API_URL}/auth/status`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data);
            } else {
                setUser(null);
                localStorage.removeItem('jwtToken');
            }
        } catch (error) {
            console.error('Erro ao verificar o status de autenticação:', error);
            setUser(null);
            localStorage.removeItem('jwtToken');
        } finally {
            setIsLoading(false);
        }
    };

   useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlToken = params.get('token');
    if (urlToken) {
        localStorage.setItem('jwtToken', urlToken);
        navigate('/home', { replace: true });
    }
    checkAuthStatus();
}, [location.search, navigate]);

    const login = () => {
        window.location.href = `${PRODUCTION_API_URL}/auth/discord`;
    };

    const logout = async () => {
        localStorage.removeItem('jwtToken');
        setUser(null);
        navigate('/');
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