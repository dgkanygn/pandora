import { useMostProductCategories } from '@/hooks/useCategories';
import type { Category } from '@/services/api';
import SectionLayout from '../../components/SectionLayout';
import { Link } from 'react-router-dom';

import categoryPlaceholder from "@/assets/placeholders/category.png"

const MostProductCategories: React.FC = () => {
    const { categories, loading, error } = useMostProductCategories(10);

    return (
        <SectionLayout
            sectionTitle="Kategoriler"
            mainTitle="En Zengin Kategorilerimiz"
            linkTo="/categories"
            linkLabel="Tüm Kategoriler"
            loading={loading}
            error={error}
            emptyMessage="Henüz kategori bulunmuyor."
            errorMessage="Kategoriler yüklenirken bir hata oluştu."
            totalItems={categories.length}
            slidesPerView={{ base: 2, md: 3, lg: 4, xl: 5 }}
            renderItems={(_currentIndex, visibleCount) =>
                categories.map((category: Category) => (
                    <div
                        key={category.id}
                        className="flex-shrink-0 px-2"
                        style={{ width: `${100 / visibleCount}%` }}
                    >
                        <Link to={`/products?category=${category.slug}`} className="block group">
                            <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-3">
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors z-10" />
                                <img
                                    src={category.image_url || categoryPlaceholder}
                                    alt={category.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 flex flex-col justify-end p-4 z-20">
                                    <h3 className="text-white font-bold text-lg md:text-xl drop-shadow-md">{category.name}</h3>
                                    {/* @ts-ignore - product_count is returned by custom query */}
                                    {category.product_count !== undefined && (
                                        <span className="text-white/90 text-sm font-medium drop-shadow-md">
                                            {/* @ts-ignore */}
                                            {category.product_count} Ürün
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    </div>
                ))
            }
        />
    );
};

export default MostProductCategories;
