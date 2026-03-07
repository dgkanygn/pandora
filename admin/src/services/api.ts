import { authAPI } from './auth';
import { categoriesAPI } from './categories';
import { productsAPI } from './products';
import { blogAPI } from './blogs';
import { ordersAPI } from './orders';
import { neighborhoodsAPI } from './neighborhoods';

export * from './types';

export { authAPI } from './auth';
export { categoriesAPI } from './categories';
export { productsAPI } from './products';
export { blogAPI } from './blogs';
export { ordersAPI } from './orders';
export { neighborhoodsAPI } from './neighborhoods';

export default {
    auth: authAPI,
    categories: categoriesAPI,
    products: productsAPI,
    blog: blogAPI,
    orders: ordersAPI,
    neighborhoods: neighborhoodsAPI,
};
