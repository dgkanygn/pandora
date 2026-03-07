import { apiRequest } from './core';

export const authAPI = {
    signIn: (email: string, password: string) =>
        apiRequest<{ user: any; session: any }>('/auth/signin', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),

    signOut: () =>
        apiRequest<{ message: string }>('/auth/signout', {
            method: 'POST',
        }),

    getMe: () =>
        apiRequest<{ user: any }>('/auth/me'),
};
