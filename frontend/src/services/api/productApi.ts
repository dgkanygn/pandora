import { apiRequest } from './client';
import type { Product, ProductQueryOptions } from './types';

export const productApi = {
    getActive: (options?: ProductQueryOptions) => {
        const params = new URLSearchParams();
        if (options?.categories && options.categories.length > 0) {
            params.append('category', options.categories.join(','));
        } else if (options?.categoryId) {
            params.append('category', options.categoryId);
        }
        if (options?.search) params.append('search', options.search);
        if (options?.minPrice) params.append('minPrice', options.minPrice.toString());
        if (options?.maxPrice) params.append('maxPrice', options.maxPrice.toString());
        if (options?.sortBy) params.append('sortBy', options.sortBy);
        if (options?.sortOrder) params.append('sortOrder', options.sortOrder);
        if (options?.limit) params.append('limit', options.limit.toString());
        if (options?.offset) params.append('offset', options.offset.toString());

        const queryString = params.toString();

        return apiRequest<Product[]>(`/products${queryString ? `?${queryString}` : ''}`);
    },
    getById: (id: string) => apiRequest<Product>(`/products/${id}`),
    getByCategorySlug: (slug: string) => apiRequest<Product[]>(`/products/category/${slug}`),
    getBestSellers: (limit?: number) => {
        const params = limit ? `?limit=${limit}` : '';
        return apiRequest<Product[]>(`/products/best-sellers${params}`);
    },
    getMostViewed: (limit?: number) => {
        const params = limit ? `?limit=${limit}` : '';
        return apiRequest<Product[]>(`/products/most-viewed${params}`);
    },
    incrementViewCount: (id: string) => apiRequest<{ success: boolean }>(`/products/${id}/view`, {
        method: 'POST',
    }),
};
