import { useState, useEffect, useCallback } from 'react';
import { api, type BlogPost, type BlogQueryOptions } from '../../services/api';

const BLOGS_PER_PAGE = 5;

interface UseBlogsResult {
    blogs: BlogPost[];
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

interface UseBlogResult {
    blog: BlogPost | null;
    loading: boolean;
    error: string | null;
}

export function useBlogs(options?: BlogQueryOptions): UseBlogsResult {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchBlogs = useCallback(async (page: number = 1, append: boolean = false) => {
        try {
            setLoading(true);
            setError(null);

            const offset = (page - 1) * BLOGS_PER_PAGE;
            const data = await api.blogs.getPublished({
                ...options,
                limit: BLOGS_PER_PAGE,
                offset
            });

            if (append) {
                setBlogs(prev => [...prev, ...data]);
            } else {
                setBlogs(data);
            }

            // Eğer dönen veri sayısı limit'ten az ise daha fazla yok demektir
            setHasMore(data.length === BLOGS_PER_PAGE);
            setCurrentPage(page);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch blogs');
        } finally {
            setLoading(false);
        }
    }, [JSON.stringify(options)]);

    useEffect(() => {
        fetchBlogs(1, false);
    }, [fetchBlogs]);

    const loadMore = useCallback(() => {
        if (!loading && hasMore) {
            fetchBlogs(currentPage + 1, true);
        }
    }, [loading, hasMore, currentPage, fetchBlogs]);

    const goToPage = useCallback((page: number) => {
        fetchBlogs(page, false);
    }, [fetchBlogs]);

    const refetch = useCallback(() => {
        fetchBlogs(1, false);
    }, [fetchBlogs]);

    return {
        blogs,
        loading,
        error,
        refetch,
        currentPage,
        hasMore,
        loadMore,
        goToPage,
        totalLoaded: blogs.length
    };
}

export function useBlog(id: string | undefined): UseBlogResult {
    const [blog, setBlog] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        const fetchBlog = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await api.blogs.getById(id);
                setBlog(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch blog');
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    return { blog, loading, error };
}

export function useBlogBySlug(slug: string | undefined): UseBlogResult {
    const [blog, setBlog] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!slug) {
            setLoading(false);
            return;
        }

        const fetchBlog = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await api.blogs.getBySlug(slug);
                setBlog(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch blog');
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [slug]);

    return { blog, loading, error };
}

export function useMostViewedBlogs(limit?: number): UseBlogsResult {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBlogs = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.blogs.getMostViewed(limit);
            setBlogs(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch most viewed blogs');
        } finally {
            setLoading(false);
        }
    }, [limit]);

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    return {
        blogs,
        loading,
        error,
        refetch: fetchBlogs,
        currentPage: 1,
        hasMore: false,
        loadMore: () => { },
        goToPage: () => { },
        totalLoaded: blogs.length
    };
}

export function useLatestBlogs(limit: number = 4): UseBlogsResult {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBlogs = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.blogs.getPublished({ limit });
            setBlogs(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch latest blogs');
        } finally {
            setLoading(false);
        }
    }, [limit]);

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    return {
        blogs,
        loading,
        error,
        refetch: fetchBlogs,
        currentPage: 1,
        hasMore: false,
        loadMore: () => { },
        goToPage: () => { },
        totalLoaded: blogs.length
    };
}
