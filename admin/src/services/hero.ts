import { apiRequest, apiFormDataRequest } from './core';

export interface HeroSlide {
    id: string;
    badge: string;
    icon_key: string;
    title: string;
    title_highlight: string;
    description: string;
    primary_button_label: string;
    primary_button_to: string;
    secondary_button_label: string;
    secondary_button_to: string;
    accent_color: string;
    background_image: string | null;
    sort_order: number;
    is_active: number | boolean;
    created_at: string;
    updated_at: string;
}

export type HeroSlideFormData = {
    badge: string;
    icon_key: string;
    title: string;
    title_highlight: string;
    description: string;
    primary_button_label: string;
    primary_button_to: string;
    secondary_button_label: string;
    secondary_button_to: string;
    accent_color: string;
    sort_order: number;
    is_active: boolean;
    background_image_file?: File | null;
    background_image?: string | null;
};

export const heroAPI = {
    getAll: () =>
        apiRequest<HeroSlide[]>('/homepage-slides/admin/all'),

    create: (data: HeroSlideFormData) => {
        const formData = new FormData();
        formData.append('badge', data.badge);
        formData.append('icon_key', data.icon_key);
        formData.append('title', data.title);
        formData.append('title_highlight', data.title_highlight);
        formData.append('description', data.description);
        formData.append('primary_button_label', data.primary_button_label);
        formData.append('primary_button_to', data.primary_button_to);
        formData.append('secondary_button_label', data.secondary_button_label);
        formData.append('secondary_button_to', data.secondary_button_to);
        formData.append('accent_color', data.accent_color);
        formData.append('sort_order', String(data.sort_order));
        formData.append('is_active', data.is_active ? '1' : '0');
        if (data.background_image_file) {
            formData.append('background_image', data.background_image_file);
        }
        return apiFormDataRequest<HeroSlide>('/homepage-slides', formData, 'POST');
    },

    update: (id: string, data: HeroSlideFormData) => {
        const formData = new FormData();
        formData.append('badge', data.badge);
        formData.append('icon_key', data.icon_key);
        formData.append('title', data.title);
        formData.append('title_highlight', data.title_highlight);
        formData.append('description', data.description);
        formData.append('primary_button_label', data.primary_button_label);
        formData.append('primary_button_to', data.primary_button_to);
        formData.append('secondary_button_label', data.secondary_button_label);
        formData.append('secondary_button_to', data.secondary_button_to);
        formData.append('accent_color', data.accent_color);
        formData.append('sort_order', String(data.sort_order));
        formData.append('is_active', data.is_active ? '1' : '0');
        if (data.background_image_file) {
            formData.append('background_image', data.background_image_file);
        } else if (data.background_image) {
            formData.append('background_image', data.background_image);
        }
        return apiFormDataRequest<HeroSlide>(`/homepage-slides/${id}`, formData, 'PUT');
    },

    delete: (id: string) =>
        apiRequest<{ success: boolean }>(`/homepage-slides/${id}`, { method: 'DELETE' }),
};
