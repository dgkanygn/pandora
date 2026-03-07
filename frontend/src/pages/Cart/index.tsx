import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaArrowLeft } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ConfirmModal from '../../components/ConfirmModal';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';
import CartItemList from './components/CartItemList';
import CartSummary from './components/CartSummary';

const Cart: React.FC = () => {
    const { items: cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
    const navigate = useNavigate();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const handleClearCart = () => {
        setIsConfirmOpen(true);
    };

    const confirmClearCart = () => {
        clearCart();
        toast.success("Sepetiniz temizlendi.");
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 1000 ? 0 : 50;
    const total = subtotal + shipping;

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <div className="flex-grow flex flex-col items-center justify-center px-6 py-20 pt-32">
                    <div className="text-center max-w-md mx-auto">
                        <div className="text-8xl mb-6">🛒</div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">Sepetiniz Boş</h2>
                        <p className="text-gray-500 text-lg mb-10 leading-relaxed">Henüz sepetinize çiçek eklemediniz. Hemen alışverişe başlayarak en güzel çiçekleri keşfedin!</p>
                        <Link to="/products" className="inline-block bg-pink-600 text-white px-10 py-3.5 rounded-full font-bold hover:bg-pink-700 transition shadow-lg text-lg cursor-pointer">
                            Alışverişe Başla
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="container mx-auto px-6 md:px-12 lg:px-24 xl:px-32 py-12 pt-32 flex-grow">
                <div className="flex items-center gap-2 mb-8 text-sm text-gray-500">
                    <Link to="/" className="hover:text-pink-600">Anasayfa</Link>
                    <span>/</span>
                    <span className="text-gray-900 font-medium">Sepetim</span>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Sepetim ({cartItems.length} Ürün)</h1>

                    <div className="flex flex-wrap gap-3">
                        <Link
                            to="/products"
                            className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-5 py-2.5 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-400 transition shadow-sm text-sm"
                        >
                            <FaArrowLeft size={12} /> Alışverişe Devam Et
                        </Link>

                        <button
                            onClick={handleClearCart}
                            className="flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-100 px-5 py-2.5 rounded-xl font-bold hover:bg-red-100 hover:border-red-200 transition text-sm cursor-pointer"
                        >
                            <FaTrash size={12} /> Sepeti Temizle
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items List */}
                    <div className="lg:w-2/3">
                        <CartItemList
                            items={cartItems}
                            updateQuantity={updateQuantity}
                            removeFromCart={removeFromCart}
                        />
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-1/3">
                        <CartSummary
                            subtotal={subtotal}
                            shipping={shipping}
                            total={total}
                            onCheckout={handleCheckout}
                        />
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmClearCart}
                title="Sepeti Temizle"
                message="Sepetinizdeki tüm ürünler kaldırılacaktır. Bu işlemi onaylıyor musunuz?"
                confirmText="Evet, Temizle"
                cancelText="Vazgeç"
            />

            <Footer />
        </div>
    );
};

export default Cart;
