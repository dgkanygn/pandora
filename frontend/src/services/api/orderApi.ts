import { apiRequest } from './client';
import type { Order, OrderTrackingInfo, CreateOrderData } from './types';

export const orderApi = {
    getMyOrders: (token: string, options?: { limit?: number; offset?: number }) => {
        const params = new URLSearchParams();
        if (options?.limit) params.append('limit', options.limit.toString());
        if (options?.offset) params.append('offset', options.offset.toString());
        const queryString = params.toString();
        return apiRequest<{ orders: Order[]; total: number }>(`/orders/my-orders${queryString ? `?${queryString}` : ''}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    },
    getById: (id: string, token: string) =>
        apiRequest<Order>(`/orders/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        }),
    // Create order - supports guest checkout (token is optional)
    create: (orderData: CreateOrderData, token?: string) =>
        apiRequest<Order>('/orders', {
            method: 'POST',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            body: JSON.stringify(orderData)
        }),
    cancel: (id: string, token: string) =>
        apiRequest<Order>(`/orders/${id}/cancel`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        }),
    // Public order tracking by order code
    trackByCode: (orderCode: string) =>
        apiRequest<OrderTrackingInfo>(`/orders/track/${orderCode}`),
};
