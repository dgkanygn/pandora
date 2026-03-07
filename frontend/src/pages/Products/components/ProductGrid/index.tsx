import ProductCard from '@/components/ProductCard';
import type { Product } from '../../../../services/api';

interface ProductGridProps {
    products: Product[];
    hasMore: boolean;
    isLoadingMore: boolean;
    onLoadMore: () => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
    products,
    hasMore,
    isLoadingMore,
    onLoadMore
}) => {



    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={onLoadMore}
                        disabled={isLoadingMore}
                        className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-full shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                    >
                        {isLoadingMore ? (
                            <div className="w-5 h-5 border-2 border-gray-300 border-t-pink-600 rounded-full animate-spin"></div>
                        ) : (
                            'Daha Fazla Yükle'
                        )}
                    </button>
                </div>
            )}
        </>
    );
};

export default ProductGrid;
