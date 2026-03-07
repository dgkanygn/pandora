import { useEffect, useRef } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import FilterSidebar from './components/FilterSidebar';
import SearchToolbar from './components/SearchToolbar';
import ProductsHeader from './components/ProductsHeader';
import ProductGrid from './components/ProductGrid';
import ProductCount from './components/ProductCount';
import EmptyState from './components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { useCategories } from '../../hooks/useCategories';
import useProductFilters from './hooks/useProductFilters';
import useProducts from './hooks/useProducts';

const Products: React.FC = () => {
    // Custom hooks
    const { categories } = useCategories();
    const filters = useProductFilters();
    const {
        products,
        isLoading,
        isLoadingMore,
        error,
        hasMore,
        fetchProducts,
        loadMore
    } = useProducts();

    // Unified fetch effect for search and sort changes
    const isInitialMount = useRef(true);

    useEffect(() => {
        // Debounce only search changes, but we consolidate everything here to prevent multiple calls on mount
        const delay = isInitialMount.current ? 0 : 500;

        const timeoutId = setTimeout(() => {
            fetchProducts(filters.getFiltersSnapshot());
        }, delay);

        // Mark as mounted after the first trigger session
        isInitialMount.current = false;

        return () => clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.sortOption, filters.searchQuery]);

    // Handlers
    const handleFilter = () => {
        // Reset search and sort when filtering by category/price
        filters.setSearchQuery('');
        filters.setSortOption('newest');

        // Use explicit values to ensure the fetch uses cleared search/sort
        fetchProducts({
            selectedCategories: filters.selectedCategories,
            maxPrice: filters.maxPrice,
            searchQuery: '',
            sortOption: 'newest'
        });

        filters.setIsSidebarOpen(false);
    };

    const handleClearFilter = () => {
        filters.clearAllFilters();

        // Pass cleared values explicitly
        fetchProducts({
            selectedCategories: [],
            maxPrice: '',
            searchQuery: '',
            sortOption: 'newest'
        });
    };

    const handleLoadMore = () => {
        loadMore(filters.getFiltersSnapshot());
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            {/* Header / Breadcrumb area */}
            <ProductsHeader />

            <div className="container mx-auto px-4 md:px-12 lg:px-24 xl:px-32 py-8 flex-grow">
                {/* Error State */}
                {error ? (
                    <ErrorMessage message={error} onRetry={() => fetchProducts(filters.getFiltersSnapshot())} />
                ) : (
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Sidebar */}
                        <div className="lg:w-64 flex-shrink-0">
                            <FilterSidebar
                                categories={categories}
                                selectedCategories={filters.selectedCategories}
                                setSelectedCategories={filters.setSelectedCategories}
                                maxPrice={filters.maxPrice}
                                setMaxPrice={filters.setMaxPrice}
                                onFilter={handleFilter}
                                onClear={handleClearFilter}
                                isOpen={filters.isSidebarOpen}
                                onClose={() => filters.setIsSidebarOpen(false)}
                                isLoading={isLoading}
                                isFiltered={filters.isFiltered}
                            />
                        </div>

                        {/* Main Content */}
                        <div className="flex-1">
                            {/* Toolbar */}
                            <SearchToolbar
                                searchQuery={filters.searchQuery}
                                setSearchQuery={filters.setSearchQuery}
                                sortOption={filters.sortOption}
                                setSortOption={filters.setSortOption}
                                onMobileFilterClick={() => filters.setIsSidebarOpen(true)}
                            />

                            {/* Product Legend/Count */}
                            <ProductCount count={products.length} isLoading={isLoading} />

                            {/* Product Grid */}
                            {isLoading && products.length === 0 ? (
                                <LoadingSpinner text="Ürünler yükleniyor..." />
                            ) : products.length > 0 ? (
                                <ProductGrid
                                    products={products}
                                    hasMore={hasMore}
                                    isLoadingMore={isLoadingMore}
                                    onLoadMore={handleLoadMore}
                                />
                            ) : (
                                <EmptyState onClearFilters={handleClearFilter} />
                            )}
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Products;
