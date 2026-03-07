import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { FaCalendarAlt } from 'react-icons/fa';
import { useBlogBySlug } from '../../hooks/useBlogs';
import api from '../../services/api';

// Default placeholder image
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1460039230329-eb070fc6c77c?q=80&w=2535&auto=format&fit=crop';

// Helper to format date
const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    } catch {
        return dateString;
    }
};

const BlogDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { blog: post, loading, error } = useBlogBySlug(slug);

    useEffect(() => {
        if (post?.id) {
            api.blogs.incrementViewCount(post.id).catch(console.error);
        }
    }, [post?.id]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-white">
                <Navbar />
                <div className="flex-grow flex items-center justify-center pt-24">
                    <LoadingSpinner text="Yazı yükleniyor..." />
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen flex flex-col bg-white">
                <Navbar />
                <div className="flex-grow flex items-center justify-center pt-24">
                    {error ? (
                        <ErrorMessage message={error} />
                    ) : (
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Yazı Bulunamadı</h2>
                            <Link to="/blog" className="text-pink-600 hover:underline">Blog anasayfasına dön</Link>
                        </div>
                    )}
                </div>
                <Footer />
            </div>
        );
    }

    const imageUrl = post.cover_image || PLACEHOLDER_IMAGE;
    const displayDate = formatDate(post.published_at || post.created_at);

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <main className="flex-grow pt-24 pb-16">
                {/* Hero / Header Image */}
                <div className="w-full h-[400px] md:h-[500px] relative">
                    <img
                        src={imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                        }}
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="absolute inset-x-0 bottom-0 p-8 md:p-16 lg:p-24 container mx-auto">
                        <div className="max-w-4xl mx-auto text-white">
                            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-pink-100 mb-4">
                                <span className="bg-pink-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white">Blog</span>
                                <span className="flex items-center gap-2"><FaCalendarAlt /> {displayDate}</span>
                                {/* <span className="flex items-center gap-2"><FaClock /> 5 dk okuma</span> */}
                            </div>
                            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-6">{post.title}</h1>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="container mx-auto px-6 md:px-12 lg:px-24 xl:px-32 py-12">
                    <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-12">

                        {/* Main Article */}
                        <div className="lg:w-3/4">
                            <div className="prose prose-lg prose-pink max-w-none text-gray-700 leading-relaxed">
                                <div className="whitespace-pre-line">
                                    {post.content}
                                </div>
                            </div>

                            {/* Tags & Share */}
                            {/* DAHA SONRA */}
                            {/* <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-900 font-bold text-sm">Etiketler:</span>
                                    <div className="flex gap-2">
                                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs hover:bg-pink-50 hover:text-pink-600 transition cursor-pointer">Çiçek Bakımı</span>
                                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs hover:bg-pink-50 hover:text-pink-600 transition cursor-pointer">Dekorasyon</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-gray-900 font-bold text-sm">Paylaş:</span>
                                    <div className="flex gap-3 text-gray-400">
                                        <a href="#" className="hover:text-[#1877F2] transition"><FaFacebook size={18} /></a>
                                        <a href="#" className="hover:text-[#1DA1F2] transition"><FaTwitter size={18} /></a>
                                        <a href="#" className="hover:text-[#0A66C2] transition"><FaLinkedin size={18} /></a>
                                        <a href="#" className="hover:text-[#25D366] transition"><FaWhatsapp size={18} /></a>
                                    </div>
                                </div>
                            </div> */}
                        </div>

                        {/* Sidebar */}
                        <div className="lg:w-1/4">
                            <div className="sticky top-32 space-y-8">
                                {/* <div className="bg-gray-50 p-6 rounded-2xl">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Kategoriler</h3>
                                    <ul className="space-y-3">
                                        <li><a href="#" className="text-gray-600 hover:text-pink-600 transition flex justify-between text-sm"><span>Bakım İpuçları</span> <span className="bg-white px-2 rounded-full text-xs text-gray-400">12</span></a></li>
                                        <li><a href="#" className="text-gray-600 hover:text-pink-600 transition flex justify-between text-sm"><span>Düğün & Etkinlik</span> <span className="bg-white px-2 rounded-full text-xs text-gray-400">8</span></a></li>
                                        <li><a href="#" className="text-gray-600 hover:text-pink-600 transition flex justify-between text-sm"><span>Dekorasyon</span> <span className="bg-white px-2 rounded-full text-xs text-gray-400">5</span></a></li>
                                        <li><a href="#" className="text-gray-600 hover:text-pink-600 transition flex justify-between text-sm"><span>Hediye Rehberi</span> <span className="bg-white px-2 rounded-full text-xs text-gray-400">15</span></a></li>
                                    </ul>
                                </div> */}

                                <div className="bg-pink-600 p-6 rounded-2xl text-white text-center">
                                    <h3 className="text-xl font-bold mb-3">Çiçek Gönder</h3>
                                    <p className="text-pink-100 text-sm mb-6">Sevdiklerinizi mutlu etmenin en kolay yolu.</p>
                                    <Link to="/products" className="inline-block w-full bg-white text-pink-600 font-bold py-3 rounded-xl hover:bg-pink-50 transition shadow-lg">
                                        Alışverişe Başla
                                    </Link>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default BlogDetail;
