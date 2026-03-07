import { apiRequest, apiFormDataRequest } from './core';
import type { PaginationOptions, PaginatedResponse } from './types';

export const productsAPI = {
    getAll: async (options?: PaginationOptions): Promise<PaginatedResponse<any>> => {
        const params = new URLSearchParams();
        const limit = options?.limit ?? 10;
        params.append('limit', String(limit + 1)); // Request one extra to check hasMore
        if (options?.offset) params.append('offset', String(options.offset));
        if (options?.category) params.append('category', options.category);

        const queryString = params.toString();
        const data = await apiRequest<any[]>(`/products/admin/all${queryString ? `?${queryString}` : ''}`);

        const hasMore = data.length > limit;
        return {
            data: hasMore ? data.slice(0, limit) : data,
            hasMore
        };
    },

    getById: (id: string) =>
        apiRequest<any>(`/products/${id}`),

    create: (data: {
        name: string;
        description?: string;
        price: number;
        stock?: number;
        category_id?: string;
        is_active?: boolean;
        image?: File;
    }) => {
        const formData = new FormData();
        formData.append('name', data.name);
        if (data.description) formData.append('description', data.description);
        formData.append('price', String(data.price));
        if (data.stock !== undefined) formData.append('stock', String(data.stock));
        if (data.category_id) formData.append('category_id', data.category_id);
        if (data.is_active !== undefined) formData.append('is_active', String(data.is_active));
        if (data.image) formData.append('image', data.image);
        return apiFormDataRequest<any>('/products', formData, 'POST');
    },

    update: (id: string, data: {
        name?: string;
        description?: string;
        price?: number;
        stock?: number;
        category_id?: string;
        is_active?: boolean;
        image?: File;
        remove_image?: boolean;
    }) => {
        const formData = new FormData();
        if (data.name) formData.append('name', data.name);
        if (data.description !== undefined) formData.append('description', data.description);
        if (data.price !== undefined) formData.append('price', String(data.price));
        if (data.stock !== undefined) formData.append('stock', String(data.stock));
        if (data.category_id) formData.append('category_id', data.category_id);
        if (data.is_active !== undefined) formData.append('is_active', String(data.is_active));
        if (data.image) formData.append('image', data.image);
        if (data.remove_image) formData.append('remove_image', 'true');
        return apiFormDataRequest<any>(`/products/${id}`, formData, 'PUT');
    },

    delete: (id: string) =>
        apiRequest<{ message: string }>(`/products/${id}`, {
            method: 'DELETE',
        }),

    toggleActive: (id: string) =>
        apiRequest<any>(`/products/${id}/toggle-active`, {
            method: 'PATCH',
        }),

    addImage: (productId: string, file: File) => {
        const formData = new FormData();
        formData.append('image', file);
        return apiFormDataRequest<any>(`/products/${productId}/images`, formData, 'POST');
    },

    setPrimaryImage: (productId: string, imageId: string | number) =>
        apiRequest<any>(`/products/${productId}/images/${imageId}/primary`, {
            method: 'PATCH',
        }),

    deleteImage: (productId: string, imageId: string | number) =>
        apiRequest<any>(`/products/${productId}/images/${imageId}`, {
            method: 'DELETE',
        }),
};
