export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

export interface PaginationOptions {
    limit?: number;
    offset?: number;
    category?: string; // Category ID for filtering
    status?: OrderStatus; // Status for filtering orders
    dateFrom?: string; // Date range start (YYYY-MM-DD)
    dateTo?: string; // Date range end (YYYY-MM-DD)
}

export interface PaginatedResponse<T> {
    data: T[];
    hasMore: boolean;
}

export interface OrderItem {
    id: string;
    product_id: string;
    product_name: string;
    price: number;
    quantity: number;
}

export interface OrderProfile {
    id: string;
    username: string;
    phone: string;
}

export interface Order {
    id: string;
    order_code: string;
    user_id?: string;
    total_price: number;
    status: OrderStatus;
    address: string;
    customer_name?: string;
    customer_email?: string;
    customer_phone?: string;
    receiver_name?: string;
    receiver_phone?: string;
    delivery_date?: string;
    delivery_time_slot?: string;
    city?: string;
    district?: string;
    delivery_note?: string;
    show_name_on_card?: boolean;
    delivery_confirmation?: boolean;
    user_message?: string;
    invoice_type?: string;
    payment_method?: string;
    contract_accepted?: boolean;
    created_at: string;
    updated_at?: string;
    profile?: OrderProfile | null;
    order_items: OrderItem[];
}

export type StatsPeriod = 'today' | 'week' | 'month' | 'all_time';

export interface OrderStats {
    total: number;
    totalRevenue: number;
    byStatus: {
        [key: string]: {
            count: number;
            revenue: number;
        };
    };
    period: StatsPeriod;
}
