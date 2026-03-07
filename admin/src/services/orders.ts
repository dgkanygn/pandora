import { apiRequest } from './core';
import type { PaginationOptions, PaginatedResponse, Order, OrderStatus, OrderStats, StatsPeriod } from './types';

export const ordersAPI = {
    getAll: async (options?: PaginationOptions): Promise<PaginatedResponse<Order>> => {
        const params = new URLSearchParams();
        const limit = options?.limit ?? 10;
        params.append('limit', String(limit + 1)); // Request one extra to check hasMore
        if (options?.offset) params.append('offset', String(options.offset));
        if (options?.status) params.append('status', options.status);
        if (options?.dateFrom) params.append('date_from', options.dateFrom);
        if (options?.dateTo) params.append('date_to', options.dateTo);

        const queryString = params.toString();
        const data = await apiRequest<Order[]>(`/orders${queryString ? `?${queryString}` : ''}`);

        const hasMore = data.length > limit;
        return {
            data: hasMore ? data.slice(0, limit) : data,
            hasMore
        };
    },

    getById: (id: string) =>
        apiRequest<Order>(`/orders/${id}`),

    updateStatus: (id: string, status: OrderStatus) =>
        apiRequest<Order>(`/orders/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        }),

    cancel: (id: string) =>
        apiRequest<Order>(`/orders/${id}/cancel`, {
            method: 'POST',
        }),

    getStats: (period: StatsPeriod = 'month') =>
        apiRequest<OrderStats>(`/orders/admin/stats?period=${period}`),
};
