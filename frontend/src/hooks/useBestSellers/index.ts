import { useState, useEffect, useCallback } from 'react';
import { api, type Product } from '../../services/api';

interface UseBestSellersResult {
    products: Product[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useBestSellers(limit?: number): UseBestSellersResult {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.products.getBestSellers(limit);
            setProducts(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch best sellers');
        } finally {
            setLoading(false);
        }
    }, [limit]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return { products, loading, error, refetch: fetchProducts };
}
