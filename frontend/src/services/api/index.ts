import { apiRequest } from './client';
import { categoryApi } from './categoryApi';
import { productApi } from './productApi';
import { blogApi } from './blogApi';
import { orderApi } from './orderApi';
import { neighborhoodApi } from './neighborhoodApi';
import { contactApi } from './contactApi';
import { homepageApi } from './homepageApi';
import { aboutApi } from './aboutApi';

// Re-export all types
export type {
    Category,
    Product,
    Neighborhood,
    BlogPost,
    CategoryQueryOptions,
    ProductQueryOptions,
    BlogQueryOptions,
    OrderItem,
    Order,
    OrderTrackingInfo,
    CreateOrderData,
    ContactInfo,
    HomepageSlide,
    AboutInfo,
} from './types';

// API endpoints
export const api = {
    categories: categoryApi,
    products: productApi,
    blogs: blogApi,
    orders: orderApi,
    neighborhoods: neighborhoodApi,
    contactInfo: contactApi,
    homepageSlides: homepageApi,
    about: aboutApi,

    // Health check
    health: () => apiRequest<{ status: string; timestamp: string }>('/health'),
};

export default api;
