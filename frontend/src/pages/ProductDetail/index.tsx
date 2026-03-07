import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaMinus, FaPlus, FaShoppingBag } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
// import ProductCard from '../Products/components/ProductCard';
import ProductCard from '@/components/ProductCard';
import { useCart } from '../../context/CartContext';
import { useProduct, useProducts } from '../../hooks/useProducts';
import api, { type Product } from '../../services/api';
import toast from 'react-hot-toast';
import Footer from '../../components/Footer';

import productPlaceholder from "@/assets/placeholders/product.png";

// Default placeholder image
// const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=2670&auto=format&fit=crop';

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (id) {
            api.products.incrementViewCount(id).catch(console.error);
        }
    }, [id]);

    const { product, loading, error } = useProduct(id);
    const { products: allProducts } = useProducts({ limit: 20 });
    const { addToCart } = useCart();

    // State for the main displayed image
    const [selectedImage, setSelectedImage] = useState<string>('');

    // Calculate related products
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

    useEffect(() => {
        if (product && allProducts.length > 0) {
            // Find related products (same category or random, excluding current)
            const related = allProducts
                .filter(p => p.id !== product.id && p.category_id === product.category_id)
                .slice(0, 4);

            // If not enough related products by category, just fill with others
            if (related.length < 4) {
                const others = allProducts
                    .filter(p => p.id !== product.id && p.category_id !== product.category_id)
                    .slice(0, 4 - related.length);
                setRelatedProducts([...related, ...others]);
            } else {
                setRelatedProducts(related);
            }

            // Reset quantity and scroll to top
            setQuantity(1);
            window.scrollTo(0, 0);
        }
    }, [product, allProducts]);

    useEffect(() => {
        if (product) {
            setSelectedImage(product.image_url || productPlaceholder);
        }
    }, [product]);

    const handleAddToCart = () => {
        if (!product) return;

        // Add item multiple times based on quantity
        for (let i = 0; i < quantity; i++) {
            addToCart({
                id: parseInt(product.id) || 0,
                name: product.name,
                price: product.price,
                category: product.category?.name || 'Genel',
                image: product.image_url || productPlaceholder,
            });
        }
        toast.success(`${quantity} adet ${product.name} sepete eklendi!`, {
            position: 'bottom-center'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <div className="flex-grow flex items-center justify-center pt-24">
                    <LoadingSpinner text="Ürün yükleniyor..." />
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <div className="flex-grow flex items-center justify-center pt-24">
                    {error ? (
                        <ErrorMessage message={error} />
                    ) : (
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900">Ürün Bulunamadı</h2>
                            <Link to="/products" className="text-pink-600 hover:underline mt-4 inline-block">Ürünlere Dön</Link>
                        </div>
                    )}
                </div>
                <Footer />
            </div>
        );
    }

    const imageUrl = product.image_url || productPlaceholder;
    const categoryName = product.category?.name || 'Genel';
    const isOutOfStock = product.stock <= 0;

    // Prepare all images for the gallery
    const allImages = product.images && product.images.length > 0
        ? product.images
        : (product.image_url ? [product.image_url] : []);

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            <Navbar />
            <br />
            <div className="container mx-auto px-4 md:px-12 lg:px-24 xl:px-32 py-12 md:py-16 pt-32 flex-grow">
                {/* Breadcrumb */}
                <div className="text-xs text-gray-500 mb-6">
                    <Link to="/" className="hover:text-pink-600">Anasayfa</Link> &gt;
                    <Link to="/products" className="hover:text-pink-600 mx-1">Ürünler</Link> &gt;
                    <span className="text-gray-900 font-semibold mx-1">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 ">
                    {/* Image Gallery (Adjusted size) */}
                    <div className="lg:col-span-5 flex flex-row gap-4">
                        {/* Thumbnails (Left side) */}
                        {allImages.length > 1 && (
                            <div className="flex flex-col gap-3 min-w-[60px] md:min-w-[80px] max-h-[400px] md:max-h-[500px] overflow-y-auto pr-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                {allImages.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        className={`w-14 h-14 md:w-20 md:h-20 object-cover rounded-lg cursor-pointer border-2 transition-all duration-200 shrink-0 ${selectedImage === img ? 'border-pink-600 opacity-100 scale-100 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100 hover:border-pink-300 hover:scale-105'}`}
                                        onClick={() => setSelectedImage(img)}
                                        alt={`${product.name} thumbnail ${index + 1}`}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = productPlaceholder;
                                        }}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Main Image */}
                        <div className="flex-1 relative group">
                            <div className="aspect-[3/4] lg:aspect-[4/5] mx-auto lg:mx-0 rounded-xl overflow-hidden shadow-md border border-gray-100">
                                <img
                                    src={selectedImage || imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = productPlaceholder;
                                    }}
                                />
                            </div>
                            {isOutOfStock && (
                                <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                                    Tükendi
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="lg:col-span-7 flex flex-col py-0">
                        <div className="mb-2">
                            <span className="text-pink-600 font-bold uppercase tracking-wider text-xs bg-pink-50 px-2 py-1 rounded-md">{categoryName}</span>
                        </div>

                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 leading-tight">{product.name}</h1>

                        <div className="text-3xl font-bold text-gray-900 mb-6">{product.price.toLocaleString('tr-TR')} ₺</div>

                        <p className="text-gray-600 text-sm leading-relaxed mb-6">
                            {product.description || "Bu ürün hakkında detaylı açıklama bulunmamaktadır. Ancak kalitesinden ve tazeliğinden emin olabilirsiniz."}
                        </p>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8 pb-8 border-b border-gray-100 max-w-xl">
                            <div className="flex items-center border border-gray-300 rounded-lg px-2 py-1 w-fit h-10">
                                <button
                                    className="text-gray-500 hover:text-pink-600 p-2"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={isOutOfStock}
                                >
                                    <FaMinus size={10} />
                                </button>
                                <span className="font-bold text-gray-900 w-8 text-center text-sm">{quantity}</span>
                                <button
                                    className="text-gray-500 hover:text-pink-600 p-2"
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    disabled={isOutOfStock}
                                >
                                    <FaPlus size={10} />
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={isOutOfStock}
                                className={`flex-1 px-4 py-2 rounded-lg cursor-pointer font-bold text-sm shadow-md flex items-center justify-center gap-2 h-10 transition-all ${isOutOfStock
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-pink-600 text-white hover:bg-pink-700 hover:shadow-lg transform hover:-translate-y-0.5'
                                    }`}
                            >
                                <FaShoppingBag size={14} /> {isOutOfStock ? 'Stokta Yok' : 'Sepete Ekle'}
                            </button>
                        </div>

                        {/* Similar Products (Moved here) */}
                        {relatedProducts.length > 0 && (
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 mb-4 border-l-4 border-pink-500 pl-2">Bunları da Beğenebilirsiniz</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3">
                                    {relatedProducts.map(p => (
                                        <ProductCard key={p.id} product={p} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
            <Footer />
        </div>
    );
};

export default ProductDetail;
