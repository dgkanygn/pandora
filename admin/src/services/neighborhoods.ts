import { apiRequest, apiFormDataRequest } from './core';
import type { PaginationOptions, PaginatedResponse } from './types';

export const neighborhoodsAPI = {
    getAll: async (options?: PaginationOptions & { name?: string }): Promise<PaginatedResponse<any>> => {
        const params = new URLSearchParams();
        const limit = options?.limit ?? 10;
        params.append('limit', String(limit + 1));
        if (options?.offset) params.append('offset', String(options.offset));
        if (options?.name) params.append('name', options.name);

        const queryString = params.toString();
        const data = await apiRequest<any[]>(`/neighborhoods${queryString ? `?${queryString}` : ''}`);

        const hasMore = data.length > limit;
        return {
            data: hasMore ? data.slice(0, limit) : data,
            hasMore
        };
    },

    getById: (id: string) =>
        apiRequest<any>(`/neighborhoods/${id}`),

    create: (data: { name: string; price: number }) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('price', String(data.price));
        return apiFormDataRequest<any>('/neighborhoods', formData, 'POST');
    },

    update: (id: string, data: { name?: string; price?: number }) => {
        const formData = new FormData();
        if (data.name) formData.append('name', data.name);
        if (data.price !== undefined) formData.append('price', String(data.price));
        return apiFormDataRequest<any>(`/neighborhoods/${id}`, formData, 'PUT');
    },

    delete: (id: string) =>
        apiRequest<{ message: string }>(`/neighborhoods/${id}`, {
            method: 'DELETE',
        }),
};
