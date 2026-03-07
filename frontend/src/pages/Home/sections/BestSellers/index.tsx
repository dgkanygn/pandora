import ProductCard from '@/components/ProductCard';
import { useBestSellers } from '@/hooks/useBestSellers';
import SectionLayout from '../../components/SectionLayout';

const BestSellers: React.FC = () => {
    const { products, loading, error } = useBestSellers(6);

    return (
        <SectionLayout
            sectionTitle="Çok Satanlar"
            mainTitle="En Çok Satan Ürünlerimiz"
            linkTo="/products"
            linkLabel="Tümünü İncele"
            loading={loading}
            error={error}
            emptyMessage="Henüz satış verisi bulunmuyor."
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

export default BestSellers;
