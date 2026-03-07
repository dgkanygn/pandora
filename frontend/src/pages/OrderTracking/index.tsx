import React, { useState } from 'react';
import { FaSearch, FaBox, FaTruck, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import { api } from '../../services/api';
import type { OrderTrackingInfo } from '../../services/api';
import toast from 'react-hot-toast';
import Footer from '../../components/Footer';

const OrderTracking: React.FC = () => {
    const [orderCode, setOrderCode] = useState('');
    const [order, setOrder] = useState<OrderTrackingInfo | null>(null);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        const cleanCode = orderCode.trim().toUpperCase();
        if (!cleanCode) {
            toast.error('Lütfen sipariş numarası giriniz.');
            return;
        }

        setLoading(true);
        setSearched(true);
        setOrder(null);

        try {
            const data = await api.orders.trackByCode(cleanCode);
            setOrder(data);
        } catch (error: any) {
            toast.error(error.message || 'Sipariş bulunamadı.');
        } finally {
            setLoading(false);
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

    const getStatusInfo = (status: string) => {
        const statusMap: Record<string, { text: string; color: string; bgColor: string; icon: React.ReactNode }> = {
            'pending': {
                text: 'Beklemede',
                color: 'text-amber-700',
                bgColor: 'bg-amber-100',
                icon: <FaClock className="w-5 h-5" />
            },
            'paid': {
                text: 'Ödendi',
                color: 'text-blue-700',
                bgColor: 'bg-blue-100',
                icon: <FaCheckCircle className="w-5 h-5" />
            },
            'shipped': {
                text: 'Kargoya Verildi',
                color: 'text-indigo-700',
                bgColor: 'bg-indigo-100',
                icon: <FaTruck className="w-5 h-5" />
            },
            'delivered': {
                text: 'Teslim Edildi',
                color: 'text-green-700',
                bgColor: 'bg-green-100',
                icon: <FaCheckCircle className="w-5 h-5" />
            },
            'cancelled': {
                text: 'İptal Edildi',
                color: 'text-red-700',
                bgColor: 'bg-red-100',
                icon: <FaTimesCircle className="w-5 h-5" />
            }
        };
        return statusMap[status] || { text: status, color: 'text-gray-700', bgColor: 'bg-gray-100', icon: <FaBox /> };
    };

    const getStatusSteps = () => {
        const steps = [
            { key: 'pending', label: 'Sipariş Alındı', icon: <FaBox /> },
            { key: 'paid', label: 'Ödeme Alındı', icon: <FaCheckCircle /> },
            { key: 'shipped', label: 'Kargoya Verildi', icon: <FaTruck /> },
            { key: 'delivered', label: 'Teslim Edildi', icon: <FaCheckCircle /> }
        ];

        const currentIndex = steps.findIndex(s => s.key === order?.status);
        const isCancelled = order?.status === 'cancelled';

        return { steps, currentIndex, isCancelled };
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50 flex flex-col">
            <Navbar />

            <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 pt-32 flex-grow">
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl shadow-lg shadow-pink-200 mb-4">
                            <FaSearch className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                            Sipariş Takip
                        </h1>
                        <p className="text-gray-600">
                            Sipariş numaranızı girerek siparişinizin durumunu sorgulayabilirsiniz.
                        </p>
                    </div>

                    {/* Search Form */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 mb-8">
                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={orderCode}
                                    onChange={(e) => setOrderCode(e.target.value.toUpperCase())}
                                    placeholder="Sipariş numaranızı giriniz (ör: ABCD1234EFGH5678)"
                                    className="w-full px-5 py-4 text-lg font-mono border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all placeholder:text-gray-400 placeholder:font-sans uppercase"
                                    maxLength={16}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-8 py-4 rounded-xl font-semibold text-white shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${loading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-pink-200'
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Aranıyor...
                                    </>
                                ) : (
                                    <>
                                        <FaSearch className="w-5 h-5" />
                                        Sorgula
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Order Result */}
                    {searched && !loading && (
                        <>
                            {order ? (
                                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                                    {/* Status Header */}
                                    <div className={`p-6 ${getStatusInfo(order.status).bgColor}`}>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500 mb-1">Sipariş</p>
                                                <p className="text-xl font-mono font-bold text-gray-900">{order.order_code}</p>
                                            </div>
                                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${getStatusInfo(order.status).bgColor} ${getStatusInfo(order.status).color}`}>
                                                {getStatusInfo(order.status).icon}
                                                <span className="font-semibold">{getStatusInfo(order.status).text}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status Progress */}
                                    {order.status !== 'cancelled' && (
                                        <div className="px-6 py-8 border-b border-gray-100">
                                            <div className="flex items-center justify-between relative">
                                                {/* Progress Line */}
                                                <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-500"
                                                        style={{ width: `${(getStatusSteps().currentIndex / (getStatusSteps().steps.length - 1)) * 100}%` }}
                                                    />
                                                </div>

                                                {getStatusSteps().steps.map((step, index) => {
                                                    const isCompleted = index <= getStatusSteps().currentIndex;
                                                    const isCurrent = index === getStatusSteps().currentIndex;

                                                    return (
                                                        <div key={step.key} className="relative flex flex-col items-center z-10">
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isCompleted
                                                                ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-200'
                                                                : 'bg-gray-200 text-gray-400'
                                                                } ${isCurrent ? 'ring-4 ring-pink-100' : ''}`}>
                                                                {step.icon}
                                                            </div>
                                                            <span className={`mt-2 text-xs font-medium text-center max-w-[80px] ${isCompleted ? 'text-gray-900' : 'text-gray-400'
                                                                }`}>
                                                                {step.label}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Order Details */}
                                    <div className="p-6 space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sipariş Detayları</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-xl">
                                                <span className="text-gray-600">Toplam Tutar</span>
                                                <span className="font-bold text-gray-900">{formatCurrency(order.total_price)}</span>
                                            </div>

                                            <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-xl">
                                                <span className="text-gray-600">Sipariş Tarihi</span>
                                                <span className="text-gray-900">{formatDate(order.created_at)}</span>
                                            </div>

                                            {order.delivery_date && (
                                                <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-xl">
                                                    <span className="text-gray-600">Teslimat Tarihi</span>
                                                    <span className="text-gray-900">{formatDate(order.delivery_date)}</span>
                                                </div>
                                            )}

                                            {order.delivery_time_slot && (
                                                <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-xl">
                                                    <span className="text-gray-600">Teslimat Saati</span>
                                                    <span className="text-gray-900">{order.delivery_time_slot}</span>
                                                </div>
                                            )}

                                            {order.receiver_name && (
                                                <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-xl">
                                                    <span className="text-gray-600">Alıcı</span>
                                                    <span className="text-gray-900">{order.receiver_name}</span>
                                                </div>
                                            )}

                                            {(order.city || order.district) && (
                                                <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-xl">
                                                    <span className="text-gray-600">Teslimat Bölgesi</span>
                                                    <span className="text-gray-900">{order.district}, {order.city}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Order Items */}
                                        {order.order_items && order.order_items.length > 0 && (
                                            <div className="mt-6 pt-6 border-t border-gray-100">
                                                <h4 className="text-md font-semibold text-gray-900 mb-4">Sipariş Ürünleri</h4>
                                                <div className="space-y-3">
                                                    {order.order_items.map((item) => (
                                                        <div key={item.id} className="flex justify-between items-center py-3 px-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl">
                                                            <div>
                                                                <span className="font-medium text-gray-900">{item.product_name}</span>
                                                                <span className="text-gray-500 ml-2">x{item.quantity}</span>
                                                            </div>
                                                            <span className="font-bold text-gray-900">
                                                                {formatCurrency(item.price * item.quantity)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                                        <FaBox className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        Sipariş Bulunamadı
                                    </h3>
                                    <p className="text-gray-600">
                                        Girdiğiniz sipariş numarasına ait bir sipariş bulunamadı.
                                        Lütfen numaranızı kontrol ederek tekrar deneyiniz.
                                    </p>
                                </div>
                            )}
                        </>
                    )}

                    {/* Info Card */}
                    {!searched && (
                        <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl border border-pink-100 p-6">
                            <h3 className="font-semibold text-gray-900 mb-3">Sipariş Numaranız Nedir?</h3>
                            <p className="text-gray-600 text-sm mb-4">
                                Sipariş numaranız, siparişinizi tamamladıktan sonra size verilen 16 karakterlik koddur.
                                Bu numara ile siparişinizin durumunu her an takip edebilirsiniz.
                            </p>
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                                <span className="font-mono bg-white px-3 py-1 rounded-lg border border-gray-200">
                                    Örnek: ABCD1234EFGH5678
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default OrderTracking;
