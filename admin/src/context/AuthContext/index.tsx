import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authAPI } from '../../services/api';

interface User {
    id: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(() =>
        localStorage.getItem('admin_token')
    );
    const [isLoading, setIsLoading] = useState(true);

    // Check auth status on mount
    useEffect(() => {
        const checkAuth = async () => {
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const { user } = await authAPI.getMe();
                setUser(user);
            } catch {
                // Token invalid, clear it
                localStorage.removeItem('admin_token');
                setToken(null);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [token]);

    const login = async (email: string, password: string) => {
        const response = await authAPI.signIn(email, password);

        if (response.session?.access_token) {
            localStorage.setItem('admin_token', response.session.access_token);
            setToken(response.session.access_token);
            setUser(response.user);
        } else {
            throw new Error('Giriş başarısız');
        }
    };

    const logout = async () => {
        try {
            await authAPI.signOut();
        } catch {
            // Ignore signout errors
        } finally {
            localStorage.removeItem('admin_token');
            setToken(null);
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                isAuthenticated: !!user,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
