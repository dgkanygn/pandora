import { useState, useEffect, useCallback } from 'react';
import { api, type Product, type ProductQueryOptions } from '../../services/api';

interface UseProductsResult {
    products: Product[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

interface UseProductResult {
    product: Product | null;
    loading: boolean;
    error: string | null;
}

export function useProducts(options?: ProductQueryOptions): UseProductsResult {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.products.getActive(options);
            setProducts(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch products');
        } finally {
            setLoading(false);
        }
    }, [JSON.stringify(options)]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return { products, loading, error, refetch: fetchProducts };
}

export function useProduct(id: string | undefined): UseProductResult {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await api.products.getById(id);
                setProduct(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch product');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    return { product, loading, error };
}

export function useProductsByCategory(categorySlug: string | undefined): UseProductsResult {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(async () => {
        if (!categorySlug) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await api.products.getByCategorySlug(categorySlug);
            setProducts(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch products');
        } finally {
            setLoading(false);
        }
    }, [categorySlug]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return { products, loading, error, refetch: fetchProducts };
}

export function useMostViewedProducts(limit?: number): UseProductsResult {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.products.getMostViewed(limit);
            setProducts(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch most viewed products');
        } finally {
            setLoading(false);
        }
    }, [limit]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return { products, loading, error, refetch: fetchProducts };
}
