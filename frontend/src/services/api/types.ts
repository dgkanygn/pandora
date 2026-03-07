// Types matching backend database schema

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image_url?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: string;
    category_id?: string;
    name: string;
    description?: string;
    price: number;
    image_url?: string;
    stock: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    // Joined fields
    category?: Category;
    images?: string[];
    image_rows?: { id: string | number; image_url: string; sort_order: string | number }[];
}

export interface Neighborhood {
    id: string;
    name: string;
    price: number;
}

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    cover_image?: string;
    is_published: boolean;
    published_at?: string;
    created_at: string;
    updated_at: string;
}

export interface CategoryQueryOptions {
    limit?: number;
    offset?: number;
}

export interface ProductQueryOptions {
    categoryId?: string;
    categories?: string[];
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'price' | 'name' | 'created_at';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
}

export interface BlogQueryOptions {
    search?: string;
    limit?: number;
    offset?: number;
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    product_name: string;
    price: number;
    quantity: number;
}

export interface Order {
    id: string;
    user_id: string;
    order_code?: string;
    total_price: number;
    status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
    address: string;
    customer_name?: string;
    customer_email?: string;
    customer_phone?: string;
    receiver_name?: string;
    delivery_date?: string;
    delivery_time_slot?: string;
    receiver_phone?: string;
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
    order_items?: OrderItem[];
}

export interface OrderTrackingInfo {
    id: string;
    order_code: string;
    total_price: number;
    status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
    customer_name?: string;
    receiver_name?: string;
    delivery_date?: string;
    delivery_time_slot?: string;
    city?: string;
    district?: string;
    address: string;
    created_at: string;
    order_items?: OrderItem[];
}

export interface ContactInfo {
    id: string | number;
    phone: string;
    instagram: string;
    address: string;
    contact_email?: string;
    created_at?: string;
    updated_at?: string;
}

export interface CreateOrderData {
    address: string;
    items: {
        product_id: string;
        product_name: string;
        price: number;
        quantity: number;
    }[];
    customer_name?: string;
    customer_email?: string;
    customer_phone?: string;
    receiver_name?: string;
    delivery_date?: string;
    delivery_time_slot?: string;
    receiver_phone?: string;
    city?: string;
    district?: string;
    delivery_note?: string;
    flower_note?: string,
    show_name_on_card?: boolean;
    delivery_confirmation?: boolean;
    user_message?: string;
    invoice_type?: string;
    payment_method?: string;
    customer_city?: string;
    customer_address?: string;
    tckn?: string;
    tax_office?: string;
    tax_number?: string;
    contract_accepted?: boolean;
}

export interface HomepageSlide {
    id: number;
    badge: string;
    iconKey: string;
    title: string;
    titleHighlight: string;
    description: string;
    primaryButton: { label: string; to: string };
    secondaryButton: { label: string; to: string };
    accentColor: string;
    backgroundImage: string;
}

export interface AboutInfo {
    id: number | null;
    title: string;
    description: string;
    image_url: string | null;
    created_at?: string;
    updated_at?: string;
}
