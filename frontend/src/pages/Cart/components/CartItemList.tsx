import React from 'react';
import { FaTrash } from 'react-icons/fa';
import type { CartItem } from '../../../context/CartContext';
import toast from 'react-hot-toast';

interface CartItemListProps {
    items: CartItem[];
    updateQuantity: (id: string, newQuantity: number) => void;
    removeFromCart: (id: string) => void;
}

const CartItemList: React.FC<CartItemListProps> = ({ items, updateQuantity, removeFromCart }) => {

    const handleRemoveItem = (id: string) => {
        removeFromCart(id);
        toast.success("Ürün sepetten çıkarıldı.");
    };

    const handleUpdateQuantity = (id: string, newQuantity: number) => {
        updateQuantity(id, newQuantity);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 space-y-6">
                {items.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                            <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                            <p className="text-pink-600 font-medium">{item.price.toFixed(2)} ₺</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center border border-gray-200 rounded-lg">
                                <button
                                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-pink-600 transition cursor-pointer"
                                    disabled={item.quantity <= 1}
                                >
                                    -
                                </button>
                                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                <button
                                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-pink-600 transition cursor-pointer"
                                >
                                    +
                                </button>
                            </div>
                            <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 transition ml-2 cursor-pointer"
                            >
                                <FaTrash size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CartItemList;
