import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaCopy, FaClipboardCheck, FaHome, FaSearch } from 'react-icons/fa';
import type { Order } from '../../../../services/api';
import toast from 'react-hot-toast';

interface OrderSuccessViewProps {
    order: Order;
}

const OrderSuccessView: React.FC<OrderSuccessViewProps> = ({ order }) => {
    const [copied, setCopied] = useState(false);

    const handleCopyOrderCode = async () => {
        if (!order.order_code) return;
        try {
            await navigator.clipboard.writeText(order.order_code);
            setCopied(true);
            toast.success('Sipariş numarası kopyalandı!');
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error('Kopyalama başarısız');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY'
        }).format(amount);
    };

    const getStatusText = (status: string) => {
        const statusMap: Record<string, string> = {
            'pending': 'Beklemede',
            'paid': 'Ödendi',
            'shipped': 'Kargoya Verildi',
            'delivered': 'Teslim Edildi',
            'cancelled': 'İptal Edildi'
        };
        return statusMap[status] || status;
    };

    return (
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 pt-32">
            <div className="max-w-2xl mx-auto">
                {/* Success Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full shadow-lg shadow-green-200 mb-6 animate-bounce">
                        <FaCheckCircle className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        Siparişiniz Alındı!
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Siparişiniz başarıyla oluşturuldu. Teşekkür ederiz!
                    </p>
                </div>

                {/* Order Code Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-100 to-pink-100 rounded-full translate-y-1/2 -translate-x-1/2 opacity-50" />

                    <div className="relative">
                        <div className="text-center mb-6">
                            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                Sipariş Numaranız
                            </h2>
                            <div className="flex items-center justify-center gap-3">
                                <code className="text-2xl md:text-3xl font-mono font-bold text-pink-600 bg-pink-50 px-6 py-3 rounded-xl border-2 border-dashed border-pink-200">
                                    {order.order_code}
                                </code>
                                <button
                                    onClick={handleCopyOrderCode}
                                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
                                    title="Kopyala"
                                >
                                    {copied ? (
                                        <FaClipboardCheck className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <FaCopy className="w-5 h-5 text-gray-600" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Warning Message */}
                        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">!</span>
                                </div>
                                <div>
                                    <p className="font-semibold text-amber-800 mb-1">
                                        Önemli: Bu numarayı kaydedin!
                                    </p>
                                    <p className="text-sm text-amber-700">
                                        Bu sipariş numarası ile siparişinizi takip edebilirsiniz.
                                        Lütfen bu numarayı not alın veya ekran görüntüsü kaydedin.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Details */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Sipariş Detayları</h3>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span className="text-gray-600">Durum</span>
                            <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                                {getStatusText(order.status)}
                            </span>
                        </div>

                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span className="text-gray-600">Toplam Tutar</span>
                            <span className="font-bold text-gray-900">{formatCurrency(order.total_price)}</span>
                        </div>

                        {order.delivery_date && (
                            <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                <span className="text-gray-600">Teslimat Tarihi</span>
                                <span className="text-gray-900">{formatDate(order.delivery_date)}</span>
                            </div>
                        )}

                        {order.delivery_time_slot && (
                            <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                <span className="text-gray-600">Teslimat Saati</span>
                                <span className="text-gray-900">{order.delivery_time_slot}</span>
                            </div>
                        )}

                        {order.receiver_name && (
                            <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                <span className="text-gray-600">Alıcı</span>
                                <span className="text-gray-900">{order.receiver_name}</span>
                            </div>
                        )}

                        {(order.city || order.district) && (
                            <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                <span className="text-gray-600">Teslimat Adresi</span>
                                <span className="text-gray-900 text-right max-w-xs">
                                    {order.district}, {order.city}
                                </span>
                            </div>
                        )}

                        {/* Order Items */}
                        {order.order_items && order.order_items.length > 0 && (
                            <div className="pt-4">
                                <h4 className="text-sm font-semibold text-gray-700 mb-3">Ürünler</h4>
                                <div className="space-y-2">
                                    {order.order_items.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center py-2 bg-gray-50 rounded-lg px-3">
                                            <span className="text-gray-700">
                                                {item.product_name} x{item.quantity}
                                            </span>
                                            <span className="font-medium text-gray-900">
                                                {formatCurrency(item.price * item.quantity)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link
                        to="/"
                        className="flex items-center justify-center gap-3 py-4 px-6 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer"
                    >
                        <FaHome className="w-5 h-5" />
                        Ana Sayfaya Dön
                    </Link>
                    <Link
                        to="/order-tracking"
                        className="flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-rose-600 shadow-lg shadow-pink-200 transition-all cursor-pointer"
                    >
                        <FaSearch className="w-5 h-5" />
                        Sipariş Takip
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessView;
