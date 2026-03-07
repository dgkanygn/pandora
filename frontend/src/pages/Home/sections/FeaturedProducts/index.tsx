import { useMostViewedProducts } from '@/hooks/useProducts';
import SectionLayout from '../../components/SectionLayout';
import ProductCard from '@/components/ProductCard';

interface FeaturedProductsProps {
    id?: string;
    title?: string;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ id, title = "En Çok Görüntülenen Ürünlerimiz" }) => {
    // Fetch 10 most viewed products
    const { products, loading, error } = useMostViewedProducts(10);

    return (
        <SectionLayout
            id={id}
            sectionTitle="Keşfedin"
            mainTitle={title}
            linkTo="/products"
            linkLabel="Tümünü İncele"
            loading={loading}
            error={error}
            emptyMessage="Henüz ürün bulunmuyor."
            errorMessage="Ürünler yüklenirken bir hata oluştu."
            totalItems={products.length}
            slidesPerView={{ base: 2, md: 3, lg: 4 }}
            renderItems={(_currentIndex, visibleCount) =>
                products.map((product) => (
                    <div
                        key={product.id}
                        className="flex-shrink-0 px-2"
                        style={{ width: `${100 / visibleCount}%` }}
                    >
                        <ProductCard product={product} />
                    </div>
                ))
            }
        />
    );
};

export default FeaturedProducts;

