import { apiRequest } from './client';
import type { BlogPost, BlogQueryOptions } from './types';

export const blogApi = {
    getPublished: (options?: BlogQueryOptions) => {
        const params = new URLSearchParams();
        if (options?.search) params.append('search', options.search);
        if (options?.limit) params.append('limit', options.limit.toString());
        if (options?.offset) params.append('offset', options.offset.toString());

        const queryString = params.toString();
        return apiRequest<BlogPost[]>(`/blogs${queryString ? `?${queryString}` : ''}`);
    },
    getById: (id: string) => apiRequest<BlogPost>(`/blogs/${id}`),
    getBySlug: (slug: string) => apiRequest<BlogPost>(`/blogs/slug/${slug}`),
    getMostViewed: (limit?: number) => {
        const params = limit ? `?limit=${limit}` : '';
        return apiRequest<BlogPost[]>(`/blogs/most-viewed${params}`);
    },
    incrementViewCount: (id: string) => apiRequest<{ success: boolean }>(`/blogs/${id}/view`, {
        method: 'POST',
    }),
};
