import { useState, useCallback, useEffect, useRef } from 'react';
import { api, type Product } from '../../../../services/api';
import type { ProductFilters } from '../useProductFilters';

const ITEMS_PER_PAGE = 5;

export interface UseProductsReturn {
    // Data
    products: Product[];
    // Loading states
    isLoading: boolean;
    isLoadingMore: boolean;
    // Error
    error: string | null;
    // Pagination
    hasMore: boolean;
    // Actions
    fetchProducts: (filters: ProductFilters, isLoadMore?: boolean) => Promise<void>;
    loadMore: (filters: ProductFilters) => void;
}

// Parse sort option to API params
const getSortParams = (option: string) => {
    switch (option) {
        case 'price-asc': return { sortBy: 'price' as const, sortOrder: 'asc' as const };
        case 'price-desc': return { sortBy: 'price' as const, sortOrder: 'desc' as const };
        case 'name-asc': return { sortBy: 'name' as const, sortOrder: 'asc' as const };
        case 'name-desc': return { sortBy: 'name' as const, sortOrder: 'desc' as const };
        case 'newest': default: return { sortBy: 'created_at' as const, sortOrder: 'desc' as const };
    }
};

const useProducts = (): UseProductsReturn => {
    // Data States
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);

    // Keep track of current products length for load more
    const productsLengthRef = useRef(0);

    useEffect(() => {
        productsLengthRef.current = products.length;
    }, [products]);

    // Main fetch function
    const fetchProducts = useCallback(async (
        filters: ProductFilters,
        isLoadMore: boolean = false
    ) => {
        try {
            if (isLoadMore) {
                setIsLoadingMore(true);
            } else {
                setIsLoading(true);
            }
            setError(null);

            const { sortBy, sortOrder } = getSortParams(filters.sortOption);

            // Request one extra item to check if there are more
            const limit = ITEMS_PER_PAGE;
            const offset = isLoadMore ? productsLengthRef.current : 0;

            const response = await api.products.getActive({
                categories: filters.selectedCategories,
                search: filters.searchQuery,
                maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
                sortBy,
                sortOrder,
                limit: limit + 1, // +1 for hasMore check
                offset
            });


            const hasNextPage = response.length > limit;
            const data = hasNextPage ? response.slice(0, limit) : response;

            if (isLoadMore) {
                setProducts(prev => [...prev, ...data]);
            } else {
                setProducts(data);
            }

            setHasMore(hasNextPage);

        } catch (err: any) {
            setError(err.message || 'Ürünler yüklenirken bir hata oluştu');
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    }, []);

    // Load more handler
    const loadMore = useCallback((filters: ProductFilters) => {
        if (!isLoadingMore && hasMore) {
            fetchProducts(filters, true);
        }
    }, [fetchProducts, isLoadingMore, hasMore]);

    return {
        products,
        isLoading,
        isLoadingMore,
        error,
        hasMore,
        fetchProducts,
        loadMore
    };
};

export default useProducts;
export { ITEMS_PER_PAGE };
