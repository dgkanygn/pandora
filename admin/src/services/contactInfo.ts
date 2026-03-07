import { apiRequest } from './core';

export interface ContactInfo {
    id: number | null;
    phone: string;
    instagram: string;
    address: string;
    contact_email: string;
    created_at?: string;
    updated_at?: string;
}

export type ContactInfoUpdateData = {
    phone: string;
    instagram: string;
    address: string;
    contact_email: string;
};

export const contactInfoAPI = {
    get: () =>
        apiRequest<ContactInfo>('/contact-info'),

    update: (data: ContactInfoUpdateData) =>
        apiRequest<ContactInfo>('/contact-info', {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
};
