import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { Link } from 'react-router-dom';
import { useCategories } from '../../hooks/useCategories';

import categoryPlaceholder from "@/assets/placeholders/category.png"

// Default placeholder image for categories
// const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1538998073820-4dfa76300194?q=80&w=687&auto=format&fit=crop';

const Categories: React.FC = () => {
    const { categories, loading, error, refetch, hasMore, loadMore } = useCategories();

    // İlk yükleme loading durumu (sayfa ilk açıldığında veya refetch edildiğinde)
    const isInitialLoading = loading && categories.length === 0;
    // Daha fazla yükleme loading durumu (loadMore tıklandığında)
    const isLoadingMore = loading && categories.length > 0;

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />
            <main className="flex-grow pt-24">
                <section className="py-16">
                    <div className="container mx-auto px-6 md:px-12 lg:px-24 xl:px-32">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Kategoriler</h2>
                            <p className="text-gray-500 max-w-xl mx-auto text-base">Her anınız için özel olarak hazırlanmış geniş çiçek seçeneklerimize göz atın.</p>
                        </div>

                        {isInitialLoading ? (
                            <LoadingSpinner text="Kategoriler yükleniyor..." />
                        ) : error ? (
                            <ErrorMessage message={error} onRetry={refetch} />
                        ) : categories.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="text-6xl mb-4">🌸</div>
                                <h3 className="text-xl font-bold text-gray-900">Henüz kategori bulunmuyor.</h3>
                                <p className="text-gray-500 mt-2">Yakında yeni kategoriler eklenecek!</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {categories.map((category) => (
                                        <Link
                                            to={`/products?category=${category.slug}`}
                                            key={category.id}
                                            className="group relative overflow-hidden rounded-2xl shadow-lg aspect-[3/4] cursor-pointer block"
                                        >
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                                            <img
                                                src={category.image_url || categoryPlaceholder}
                                                alt={category.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = categoryPlaceholder;
                                                }}
                                            />
                                            <div className="absolute inset-x-0 bottom-0 py-8 px-4 text-center bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col items-center z-20">
                                                <h3 className="text-white text-2xl font-bold translate-y-2 group-hover:translate-y-0 transition-transform duration-300 drop-shadow-lg">
                                                    {category.name}
                                                </h3>
                                                <span className="text-pink-300 text-sm font-medium mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 bg-white/10 px-4 py-1 rounded-full backdrop-blur-sm border border-white/20">
                                                    Koleksiyonu Keşfet
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {/* Load More Button */}
                                {hasMore && (
                                    <div className="flex justify-center mt-12">
                                        <button
                                            onClick={loadMore}
                                            disabled={isLoadingMore}
                                            className="px-8 py-3 bg-pink-600 text-white font-semibold rounded-full hover:bg-pink-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2 shadow-md hover:shadow-lg transform active:scale-95"
                                        >
                                            {isLoadingMore ? (
                                                <>
                                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                    </svg>
                                                    Yükleniyor...
                                                </>
                                            ) : (
                                                'Daha Fazla Göster'
                                            )}
                                        </button>
                                    </div>
                                )}

                                {/* Loaded Count Info */}
                                <div className="text-center mt-6 text-gray-400 text-sm">
                                    {categories.length} kategori listeleniyor
                                </div>
                            </>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Categories;
