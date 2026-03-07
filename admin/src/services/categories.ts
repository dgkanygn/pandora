import { apiRequest, apiFormDataRequest } from './core';
import type { PaginationOptions, PaginatedResponse } from './types';

export const categoriesAPI = {
    getAll: async (options?: PaginationOptions): Promise<PaginatedResponse<any>> => {
        const params = new URLSearchParams();
        const limit = options?.limit ?? 10;
        params.append('limit', String(limit + 1)); // Request one extra to check hasMore
        if (options?.offset) params.append('offset', String(options.offset));

        const queryString = params.toString();
        const data = await apiRequest<any[]>(`/categories/admin/all${queryString ? `?${queryString}` : ''}`);

        const hasMore = data.length > limit;
        return {
            data: hasMore ? data.slice(0, limit) : data,
            hasMore
        };
    },

    getById: (id: string) =>
        apiRequest<any>(`/categories/${id}`),

    create: (data: { name: string; description?: string; slug?: string; is_active?: boolean; image?: File }) => {
        const formData = new FormData();
        formData.append('name', data.name);
        if (data.description) formData.append('description', data.description);
        if (data.slug) formData.append('slug', data.slug);
        if (data.is_active !== undefined) formData.append('is_active', String(data.is_active));
        if (data.image) formData.append('image', data.image);
        return apiFormDataRequest<any>('/categories', formData, 'POST');
    },

    update: (id: string, data: { name?: string; description?: string; slug?: string; is_active?: boolean; image?: File; remove_image?: boolean }) => {
        const formData = new FormData();
        if (data.name) formData.append('name', data.name);
        if (data.description !== undefined) formData.append('description', data.description);
        if (data.slug) formData.append('slug', data.slug);
        if (data.is_active !== undefined) formData.append('is_active', String(data.is_active));
        if (data.image) formData.append('image', data.image);
        if (data.remove_image) formData.append('remove_image', 'true');
        return apiFormDataRequest<any>(`/categories/${id}`, formData, 'PUT');
    },

    delete: (id: string) =>
        apiRequest<{ message: string }>(`/categories/${id}`, {
            method: 'DELETE',
        }),
};
