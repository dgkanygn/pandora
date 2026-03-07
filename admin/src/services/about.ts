import { apiRequest, apiFormDataRequest } from './core';

export interface AboutInfo {
    id: number | null;
    title: string;
    description: string;
    image_url: string | null;
    created_at?: string;
    updated_at?: string;
}

export const aboutAPI = {
    get: () =>
        apiRequest<AboutInfo>('/about'),

    update: (formData: FormData) =>
        apiFormDataRequest<AboutInfo>('/about', formData, 'POST'), // uses POST since Backend router routes POST /about to update
};
