import { apiRequest } from './client';
import type { Category, CategoryQueryOptions } from './types';

export const categoryApi = {
    getActive: (options?: CategoryQueryOptions) => {
        const params = new URLSearchParams();
        if (options?.limit) params.append('limit', options.limit.toString());
        if (options?.offset) params.append('offset', options.offset.toString());
        const queryString = params.toString();
        return apiRequest<Category[]>(`/categories${queryString ? `?${queryString}` : ''}`);
    },
    getBySlug: (slug: string) => apiRequest<Category>(`/categories/slug/${slug}`),
    getMostProducts: (limit?: number) => {
        const params = limit ? `?limit=${limit}` : '';
        return apiRequest<Category[]>(`/categories/most-products${params}`);
    },
};
