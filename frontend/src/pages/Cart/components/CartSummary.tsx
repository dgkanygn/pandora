import React from 'react';
import { FaCreditCard } from 'react-icons/fa';

import { formatPrice } from '@/utils/formatPrice';

interface CartSummaryProps {
    subtotal: number;
    shipping: number;
    total: number;
    onCheckout: () => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({ subtotal, onCheckout }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Sipariş Özeti</h2>

            <div className="space-y-3 mb-6">
                <div className="pt-3 flex justify-between text-lg font-bold text-gray-900">
                    <span>Toplam</span>
                    <span>{formatPrice(subtotal)} ₺</span>
                </div>
            </div>

            <button
                onClick={onCheckout}
                className="w-full bg-pink-600 text-white py-4 rounded-xl font-bold hover:bg-pink-700 hover:shadow-lg transition transform hover:-translate-y-1 flex items-center justify-center gap-2 mb-4 cursor-pointer"
            >
                <FaCreditCard /> Ödemeye Geç
            </button>

            {/* <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <FaLock />
                <span>Güvenli Ödeme SSL ile korunmaktadır</span>
            </div> */}
        </div>
    );
};

export default CartSummary;
