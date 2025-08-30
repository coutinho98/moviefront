import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

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

            const response = await fetch('https://movie-eckw.onrender.com/auth/status', {
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
            navigate(location.pathname, { replace: true });
        }
        checkAuthStatus();
    }, [location.search, navigate]);

    const login = () => {
        window.location.href = `https://movie-eckw.onrender.com/auth/discord`;
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