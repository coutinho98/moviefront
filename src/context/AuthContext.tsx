import { useEffect, useState, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const checkAuthStatus = async (token?: string) => {
            try {
                const headers: Record<string, string> = {};
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
                const response = await fetch('https://movie-eckw.onrender.com/auth/status', {
                    headers,
                    credentials: 'include'
                });

                if (response.ok) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Failed to check auth status', error);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        const params = new URLSearchParams(location.search);
        const urlToken = params.get('token');
        if (urlToken) {
            localStorage.setItem('jwtToken', urlToken);
            checkAuthStatus(urlToken);
        } else {
            const storedToken = localStorage.getItem('jwtToken');
            checkAuthStatus(storedToken || undefined);
        }
    }, [location]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading }}>
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