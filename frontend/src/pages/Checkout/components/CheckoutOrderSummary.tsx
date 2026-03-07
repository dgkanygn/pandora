import React from 'react';
import { useCart } from '../../../context/CartContext';
import { formatPrice } from '@/utils/formatPrice';

interface CheckoutOrderSummaryProps {
    shippingCost: number;
}

const CheckoutOrderSummary: React.FC<CheckoutOrderSummaryProps> = ({ shippingCost }) => {
    const { items, cartCount } = useCart();

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalShipping = subtotal > 1000 ? 0 : shippingCost;
    const total = subtotal + totalShipping;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>🛍️</span> Sipariş Özeti ({cartCount} Ürün)
            </h2>

            <div className="space-y-4 mb-6">
                {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                            <p className="text-gray-500 text-xs">Adet: {item.quantity}</p>
                        </div>
                        <div className="font-bold text-pink-600 text-sm">
                            {formatPrice(item.price * item.quantity)} ₺
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-gray-600 text-sm">
                    <span>Ara Toplam</span>
                    <span>{formatPrice(subtotal)} ₺</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                    <span>Teslimat Ücreti</span>
                    {totalShipping === 0 ? (
                        <span className="text-green-600 font-medium">Bedava</span>
                    ) : (
                        <span>{formatPrice(totalShipping)} ₺</span>
                    )}
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-gray-900">
                    <span>Toplam</span>
                    <span>{formatPrice(total)} ₺</span>
                </div>
            </div>
        </div>
    );
};

export default CheckoutOrderSummary;
