import { Link } from 'react-router-dom';
import { FaShoppingBag, FaEye } from 'react-icons/fa';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/services/api';
import toast from 'react-hot-toast';

import productPlaceholder from '@/assets/placeholders/product.png';

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
            image: product.image_url || productPlaceholder,
        });
        toast.success(`${product.name} sepete eklendi!`, {
            position: 'bottom-center'
        });
    };

    const imageUrl = product.image_url || productPlaceholder;
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
                            (e.target as HTMLImageElement).src = productPlaceholder;
                        }}
                    />
                </Link>

                {/* Stock Badge */}
                {product.stock <= 0 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        Tükendi
                    </div>
                )}

            </div>

            {/* Product Info */}
            <div className="p-5 flex flex-col flex-grow">
                <div className="text-xs text-pink-600 font-semibold mb-1 uppercase tracking-wider">
                    {categoryName}
                </div>
                <h3 className="text-gray-900 font-bold text-lg mb-2 leading-tight group-hover:text-pink-600 transition-colors">
                    <Link to={`/product/${product.id}`}>{product.name}</Link>
                </h3>

                <div className="mt-auto flex justify-between items-center mb-4">
                    <span className="text-xl font-bold text-gray-900">
                        {formatPrice(product.price)} ₺
                    </span>
                    {/* <div className="flex text-yellow-400 text-xs">
                        {'★'.repeat(5)}
                    </div> */}
                </div>

                <div className="flex gap-2 w-full mt-auto">
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock <= 0}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl font-medium text-sm transition-colors cursor-pointer shadow-sm ${product.stock > 0
                            ? 'bg-pink-600 text-white hover:bg-pink-700 hover:shadow'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        <FaShoppingBag size={15} />
                    </button>
                    <Link
                        to={`/product/${product.id}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl font-medium text-sm border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors"
                    >
                        <FaEye size={15} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
