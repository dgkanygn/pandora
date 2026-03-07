import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface ProductFilters {
    selectedCategories: string[];
    maxPrice: string;
    sortOption: string;
    searchQuery: string;
}

export interface UseProductFiltersReturn {
    // Filter states
    selectedCategories: string[];
    setSelectedCategories: (categories: string[]) => void;
    maxPrice: string;
    setMaxPrice: (price: string) => void;
    sortOption: string;
    setSortOption: (option: string) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    // UI state
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
    // Computed
    isFiltered: boolean;
    // Actions
    clearAllFilters: () => void;
    getFiltersSnapshot: () => ProductFilters;
}

const useProductFilters = (): UseProductFiltersReturn => {
    const [searchParams] = useSearchParams();
    const categoryParam = searchParams.get('category');

    // Filter States
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        categoryParam ? [categoryParam] : []
    );
    const [maxPrice, setMaxPrice] = useState('');
    const [sortOption, setSortOption] = useState('newest');
    const [searchQuery, setSearchQuery] = useState('');

    // UI States
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Initialize categories from URL param
    useEffect(() => {
        if (categoryParam) {
            setSelectedCategories([categoryParam]);
        }
    }, [categoryParam]);

    // Calculate if any filter is active
    const isFiltered = useMemo(() => {
        return selectedCategories.length > 0 || maxPrice !== '' || searchQuery !== '' || sortOption !== 'newest';
    }, [selectedCategories, maxPrice, searchQuery, sortOption]);

    // Clear all filters
    const clearAllFilters = () => {
        setSelectedCategories([]);
        setMaxPrice('');
        setSearchQuery('');
        setSortOption('newest');
    };

    // Get current filters as object (useful for API calls)
    const getFiltersSnapshot = (): ProductFilters => ({
        selectedCategories,
        maxPrice,
        sortOption,
        searchQuery
    });

    return {
        // Filter states
        selectedCategories,
        setSelectedCategories,
        maxPrice,
        setMaxPrice,
        sortOption,
        setSortOption,
        searchQuery,
        setSearchQuery,
        // UI state
        isSidebarOpen,
        setIsSidebarOpen,
        // Computed
        isFiltered,
        // Actions
        clearAllFilters,
        getFiltersSnapshot
    };
};

export default useProductFilters;
