import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import BlogCard from '../../components/BlogCard';
import { useBlogs } from '../../hooks/useBlogs';

const Blog: React.FC = () => {
    const { blogs, loading, error, refetch, hasMore, loadMore } = useBlogs();

    // İlk yükleme loading durumu
    const isInitialLoading = loading && blogs.length === 0;
    // Daha fazla yükleme loading durumu
    const isLoadingMore = loading && blogs.length > 0;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            {/* Header */}
            <div className="bg-white pt-28 pb-16 shadow-sm border-b border-gray-100">
                <div className="container mx-auto px-6 md:px-12 lg:px-24 xl:px-32 text-center">
                    <span className="text-pink-600 font-bold uppercase text-xs tracking-wider mb-3 block">İpuçları & Haberler</span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">Çiçek Dünyası Bloğu</h1>
                    <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        Çiçek bakımından dekorasyon önerilerine, bitkilerin gizemli dünyasına dair aradığınız her şey burada.
                    </p>
                </div>
            </div>

            <main className="flex-grow py-16 bg-gray-50">
                <div className="container mx-auto px-6 md:px-12 lg:px-24 xl:px-32">
                    {isInitialLoading ? (
                        <LoadingSpinner text="Blog yazıları yükleniyor..." />
                    ) : error ? (
                        <ErrorMessage message={error} onRetry={refetch} />
                    ) : blogs.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">📝</div>
                            <h3 className="text-xl font-bold text-gray-900">Henüz blog yazısı bulunmuyor.</h3>
                            <p className="text-gray-500 mt-2">Yakında yeni yazılar eklenecek!</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {blogs.map((post) => (
                                    <BlogCard key={post.id} post={post} />
                                ))}
                            </div>

                            {/* Load More Button */}
                            {hasMore && (
                                <div className="flex justify-center mt-12">
                                    <button
                                        onClick={loadMore}
                                        disabled={isLoadingMore}
                                        className="px-8 py-3 bg-pink-600 text-white font-semibold rounded-full hover:bg-pink-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
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
                                            'Daha Fazla Yükle'
                                        )}
                                    </button>
                                </div>
                            )}

                            {/* Loaded Count Info */}
                            <div className="text-center mt-6 text-gray-500 text-sm">
                                {blogs.length} blog yazısı gösteriliyor
                            </div>
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Blog;
