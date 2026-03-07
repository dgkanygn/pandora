import { Link } from 'react-router-dom';
import { FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../../../../context/CartContext';
import type { Product } from '../../../../services/api';
import toast from 'react-hot-toast';

// Default placeholder image
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=2670&auto=format&fit=crop';

import { formatPrice } from '@/utils/formatPrice';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { addToCart } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // Convert API product to cart item format
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image_url || PLACEHOLDER_IMAGE,
        });
        toast.success(`${product.name} sepete eklendi!`, {
            position: 'bottom-center'
        });
    };

    const imageUrl = product.image_url || PLACEHOLDER_IMAGE;
    const categoryName = product.category?.name || 'Genel';

    return (
        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
            {/* Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden">
                <Link to={`/product/${product.id}`}>
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                        }}
                    />
                </Link>

                {/* Stock Badge */}
                {product.stock <= 0 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        Tükendi
                    </div>
                )}

                {/* Action Buttons Overlay */}
                <div className="absolute inset-x-0 bottom-4 flex justify-center gap-3 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 px-4">
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock <= 0}
                        className={`bg-white text-gray-800 p-3 rounded-full cursor-pointer shadow-lg transition-colors ${product.stock > 0
                            ? 'hover:bg-pink-600 hover:text-white'
                            : 'opacity-50 cursor-not-allowed'
                            }`}
                        title="Sepete Ekle"
                    >
                        <FaShoppingBag size={18} />
                    </button>
                    {/* <Link
                        to={`/product/${product.id}`}
                        className="bg-white text-gray-800 p-3 rounded-full shadow-lg hover:bg-pink-600 hover:text-white transition-colors"
                        title="İncele"
                    >
                        <FaEye size={18} />
                    </Link>
                    <button
                        className="bg-white text-gray-800 p-3 rounded-full shadow-lg hover:bg-pink-600 hover:text-white transition-colors"
                        title="Favorilere Ekle"
                    >
                        <FaHeart size={18} />
                    </button> */}
                </div>
            </div>

            {/* Product Info */}
            <div className="p-5 flex flex-col flex-grow">
                <div className="text-xs text-pink-600 font-semibold mb-1 uppercase tracking-wider">
                    {categoryName}
                </div>
                <h3 className="text-gray-900 font-bold text-lg mb-2 leading-tight group-hover:text-pink-600 transition-colors">
                    <Link to={`/product/${product.id}`}>{product.name}</Link>
                </h3>

                <div className="mt-auto flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">
                        {formatPrice(product.price)} ₺
                    </span>
                    {/* <div className="flex text-yellow-400 text-xs">
                        {'★'.repeat(5)}
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
