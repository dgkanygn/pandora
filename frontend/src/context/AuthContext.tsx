import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import toast from 'react-hot-toast';
import { authApi } from '../services/api/authApi';

interface User {
    id: string;
    username: string;
    email: string;
    phone?: string;
    user_metadata?: {
        username?: string;
        phone?: string;
        [key: string]: any;
    };
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, username: string, phone: string) => Promise<void>;
    logout: () => Promise<void>;
    deleteAccount: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const mapUser = (userData: any, fallbackUsername?: string, fallbackPhone?: string): User => ({
        id: userData.id,
        email: userData.email,
        username: userData.username || userData.user_metadata?.username || fallbackUsername || userData.email.split('@')[0],
        phone: userData.phone || userData.user_metadata?.phone || fallbackPhone,
        user_metadata: userData.user_metadata,
    });

    const clearSession = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    const checkAuth = async () => {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
            setLoading(false);
            return;
        }

        try {
            const data = await authApi.getMe(storedToken);
            setUser(mapUser(data.user));
            setToken(storedToken);
        } catch (error) {
            console.error('Auth check error:', error);
            clearSession();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const data = await authApi.signIn(email, password);
            const { user: userData, session } = data;

            setToken(session.access_token);
            setUser(mapUser(userData));
            localStorage.setItem('token', session.access_token);
            toast.success('Başarıyla giriş yapıldı!');
        } catch (error: any) {
            console.log(error.message);
            console.error('Login error:', error);
            toast.error(error.message || 'Giriş yapılırken bir hata oluştu');
            throw error;
        }
    };

    const register = async (email: string, password: string, username: string, phone: string) => {
        try {
            const data = await authApi.signUp(email, password, username, phone);
            const { user: userData, session } = data;

            if (session) {
                setToken(session.access_token);
                setUser(mapUser(userData, username, phone));
                localStorage.setItem('token', session.access_token);
                toast.success('Hesap oluşturuldu ve giriş yapıldı!');
            } else {
                toast.success('Hesap oluşturuldu! Lütfen e-postanızı kontrol edin.');
            }
        } catch (error: any) {
            console.error('Register error:', error);
            toast.error(error.message || 'Kayıt olurken bir hata oluştu');
            throw error;
        }
    };

    const logout = async () => {
        try {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                await authApi.signOut(storedToken);
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            clearSession();
            toast.success('Çıkış yapıldı');
        }
    };

    const deleteAccount = async () => {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) return;

        try {
            await authApi.deleteAccount(storedToken);
            clearSession();
            toast.success('Hesabınız başarıyla silindi.');
        } catch (error: any) {
            console.error('Delete account error:', error);
            toast.error(error.message || 'Hesap silinirken bir hata oluştu');
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, deleteAccount, checkAuth }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
