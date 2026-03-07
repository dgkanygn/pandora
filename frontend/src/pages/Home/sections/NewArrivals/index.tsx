import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import SectionLayout from '../../components/SectionLayout';

const NewArrivals: React.FC = () => {
    const { products, loading, error } = useProducts({ limit: 6, sortBy: 'created_at', sortOrder: 'desc' });

    return (
        <SectionLayout
            sectionTitle="Taptaze Gelenler"
            mainTitle="En Son Eklenen Ürünlerimiz"
            linkTo="/products"
            linkLabel="Tümünü İncele"
            loading={loading}
            error={error}
            emptyMessage="Henüz ürün eklenmemiş."
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

export default NewArrivals;
