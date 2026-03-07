import { useState, useEffect, useCallback } from 'react';
import { api, type Category, type CategoryQueryOptions } from '../../services/api';

const CATEGORIES_PER_PAGE = 5; // Kategori sayfasında gösterilecek öğe sayısı

interface UseCategoriesResult {
    categories: Category[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
    // Pagination
    currentPage: number;
    hasMore: boolean;
    loadMore: () => void;
    goToPage: (page: number) => void;
    totalLoaded: number;
}

interface UseCategoryResult {
    category: Category | null;
    loading: boolean;
    error: string | null;
}

export function useCategories(options?: CategoryQueryOptions): UseCategoriesResult {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchCategories = useCallback(async (page: number = 1, append: boolean = false) => {
        try {
            setLoading(true);
            setError(null);

            const offset = (page - 1) * CATEGORIES_PER_PAGE;
            const data = await api.categories.getActive({
                ...options,
                limit: CATEGORIES_PER_PAGE,
                offset
            });

            if (append) {
                setCategories(prev => [...prev, ...data]);
            } else {
                setCategories(data);
            }

            // Eğer dönen veri sayısı limit'ten az ise daha fazla yok demektir
            setHasMore(data.length === CATEGORIES_PER_PAGE);
            setCurrentPage(page);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    }, [JSON.stringify(options)]);

    useEffect(() => {
        fetchCategories(1, false);
    }, [fetchCategories]);

    const loadMore = useCallback(() => {
        if (!loading && hasMore) {
            fetchCategories(currentPage + 1, true);
        }
    }, [loading, hasMore, currentPage, fetchCategories]);

    const goToPage = useCallback((page: number) => {
        fetchCategories(page, false);
    }, [fetchCategories]);

    const refetch = useCallback(() => {
        fetchCategories(1, false);
    }, [fetchCategories]);

    return {
        categories,
        loading,
        error,
        refetch,
        currentPage,
        hasMore,
        loadMore,
        goToPage,
        totalLoaded: categories.length
    };
}

export function useCategoryBySlug(slug: string | undefined): UseCategoryResult {
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!slug) {
            setLoading(false);
            return;
        }

        const fetchCategory = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await api.categories.getBySlug(slug);
                setCategory(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch category');
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
    }, [slug]);

    return { category, loading, error };
}

export function useMostProductCategories(limit?: number): UseCategoriesResult {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.categories.getMostProducts(limit);
            setCategories(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    }, [limit]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return {
        categories,
        loading,
        error,
        refetch: fetchCategories,
        currentPage: 1,
        hasMore: false,
        loadMore: () => { },
        goToPage: () => { },
        totalLoaded: categories.length
    };
}
