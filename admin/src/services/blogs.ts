import { apiRequest, apiFormDataRequest } from './core';
import type { PaginationOptions, PaginatedResponse } from './types';

export const blogAPI = {
    getAll: async (options?: PaginationOptions): Promise<PaginatedResponse<any>> => {
        const params = new URLSearchParams();
        const limit = options?.limit ?? 10;
        params.append('limit', String(limit + 1)); // Request one extra to check hasMore
        if (options?.offset) params.append('offset', String(options.offset));

        const queryString = params.toString();
        const data = await apiRequest<any[]>(`/blogs/admin/all${queryString ? `?${queryString}` : ''}`);

        const hasMore = data.length > limit;
        return {
            data: hasMore ? data.slice(0, limit) : data,
            hasMore
        };
    },

    getById: (id: string) =>
        apiRequest<any>(`/blogs/${id}`),

    create: (data: {
        title: string;
        slug: string;
        content: string;
        is_published?: boolean;
        image?: File;
    }) => {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('slug', data.slug);
        formData.append('content', data.content);
        if (data.is_published !== undefined) formData.append('is_published', String(data.is_published ? 1 : 0));
        if (data.image) formData.append('image', data.image);
        return apiFormDataRequest<any>('/blogs', formData, 'POST');
    },

    update: (id: string, data: {
        title?: string;
        slug?: string;
        content?: string;
        is_published?: boolean;
        image?: File;
        remove_image?: boolean;
    }) => {
        const formData = new FormData();
        if (data.title) formData.append('title', data.title);
        if (data.slug) formData.append('slug', data.slug);
        if (data.content) formData.append('content', data.content);
        if (data.is_published !== undefined) formData.append('is_published', String(data.is_published ? 1 : 0));
        if (data.image) formData.append('image', data.image);
        if (data.remove_image) formData.append('remove_image', 'true');
        return apiFormDataRequest<any>(`/blogs/${id}`, formData, 'PUT');
    },

    delete: (id: string) =>
        apiRequest<{ message: string }>(`/blogs/${id}`, {
            method: 'DELETE',
        }),

    togglePublished: (id: string) =>
        apiRequest<any>(`/blogs/${id}/toggle-published`, {
            method: 'PATCH',
        }),
};
