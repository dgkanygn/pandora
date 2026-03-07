import { apiRequest } from './client';

// ---- Response Types ----

export interface AuthUser {
    id: string;
    email: string;
    username: string;
    phone?: string;
    role?: string;
    is_active?: number;
    created_at?: string;
    user_metadata?: {
        username?: string;
        phone?: string;
        [key: string]: any;
    };
}

export interface AuthSession {
    access_token: string;
}

export interface SignInResponse {
    message: string;
    user: AuthUser;
    session: AuthSession;
}

export interface SignUpResponse {
    message: string;
    user: AuthUser;
    session: AuthSession | null;
}

export interface MeResponse {
    user: AuthUser;
}

// ---- API ----

export const authApi = {
    signIn: (email: string, password: string) =>
        apiRequest<SignInResponse>('/auth/signin', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),

    signUp: (email: string, password: string, username: string, phone: string) =>
        apiRequest<SignUpResponse>('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ email, password, username, phone }),
        }),

    signOut: (token: string) =>
        apiRequest<{ message: string }>('/auth/signout', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
        }),

    getMe: (token: string) =>
        apiRequest<MeResponse>('/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
        }),

    deleteAccount: (token: string) =>
        apiRequest<{ message: string }>('/auth/account', {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        }),
};
