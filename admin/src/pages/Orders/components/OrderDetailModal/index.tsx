import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { HiX, HiPhone, HiMail, HiLocationMarker, HiCalendar, HiClock, HiUser, HiTruck, HiChatAlt } from 'react-icons/hi';
import type { Order, OrderStatus } from '../../../../services/api';

interface OrderDetailModalProps {
    order: Order | null;
    onClose: () => void;
    onUpdateStatus: (orderId: string, status: OrderStatus) => void;
    onCancelOrder: (orderId: string) => void;
    isUpdating: boolean;
}

const STATUS_OPTIONS: { value: OrderStatus; label: string; color: string }[] = [
    { value: 'pending', label: 'Bekleyen', color: 'bg-yellow-500' },
    { value: 'paid', label: 'Ödendi', color: 'bg-blue-500' },
    { value: 'shipped', label: 'Kargoda', color: 'bg-purple-500' },
    { value: 'delivered', label: 'Teslim Edildi', color: 'bg-green-500' },
    { value: 'cancelled', label: 'İptal Edildi', color: 'bg-red-500' },
];

const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const formatSimpleDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
};

const formatPaymentMethod = (method?: string) => {
    switch (method) {
        case 'credit_card': return 'Kredi Kartı';
        case 'transfer': return 'Havale/EFT';
        default: return method || 'Belirtilmemiş';
    }
};

const formatInvoiceType = (type?: string) => {
    switch (type) {
        case 'individual': return 'Bireysel Fatura';
        case 'corporate': return 'Kurumsal Fatura';
        default: return type || 'Belirtilmemiş';
    }
};

export default function OrderDetailModal({
    order,
    onClose,
    onUpdateStatus,
    onCancelOrder,
    isUpdating,
}: OrderDetailModalProps) {
    if (!order) return null;

    if (!order) return null;

    const currentStatusIndex = STATUS_OPTIONS.findIndex(s => s.value === order.status);

    return (
        <Transition.Root show={!!order} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="relative w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                                {/* Header */}
                                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Dialog.Title className="text-lg font-semibold text-white">
                                                Sipariş Detayları
                                            </Dialog.Title>
                                            <p className="text-sm text-indigo-200 font-mono mt-1">
                                                #{order.order_code}
                                            </p>
                                        </div>
                                        <button
                                            onClick={onClose}
                                            className="rounded-lg p-2 text-white/80 hover:bg-white/10 hover:text-white transition cursor-pointer"
                                        >
                                            <HiX size={24} />
                                        </button>
                                    </div>
                                </div>

                                {/* Status Timeline */}
                                <div className="px-6 py-4 bg-gray-50 border-b">
                                    <div className="flex items-center justify-between">
                                        {STATUS_OPTIONS.filter(s => s.value !== 'cancelled').map((status, index) => (
                                            <div key={status.value} className="flex-1 flex items-center">
                                                <div className="flex flex-col items-center">
                                                    <div
                                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${index <= currentStatusIndex && order.status !== 'cancelled'
                                                            ? status.color
                                                            : 'bg-gray-300'
                                                            }`}
                                                    >
                                                        {index + 1}
                                                    </div>
                                                    <span className={`text-xs mt-1 ${index <= currentStatusIndex && order.status !== 'cancelled'
                                                        ? 'text-gray-700 font-medium'
                                                        : 'text-gray-400'
                                                        }`}>
                                                        {status.label}
                                                    </span>
                                                </div>
                                                {index < STATUS_OPTIONS.filter(s => s.value !== 'cancelled').length - 1 && (
                                                    <div className={`flex-1 h-1 mx-2 rounded ${index < currentStatusIndex && order.status !== 'cancelled'
                                                        ? 'bg-indigo-500'
                                                        : 'bg-gray-300'
                                                        }`} />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    {order.status === 'cancelled' && (
                                        <div className="mt-3 text-center">
                                            <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                                                Bu sipariş iptal edilmiştir
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6 max-h-[60vh] overflow-y-auto">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Customer Info */}
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                                                <HiUser className="text-indigo-500" />
                                                Müşteri Bilgileri
                                            </h3>
                                            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-gray-600">İsim:</span>
                                                    <span className="font-medium text-gray-900">
                                                        {order.customer_name || order.profile?.username || 'Belirtilmemiş'}
                                                    </span>
                                                </div>
                                                {(order.customer_email) && (
                                                    <div className="flex items-center gap-3">
                                                        <HiMail className="text-gray-400" />
                                                        <span className="text-gray-700">{order.customer_email}</span>
                                                    </div>
                                                )}
                                                {(order.customer_phone || order.profile?.phone) && (
                                                    <div className="flex items-center gap-3">
                                                        <HiPhone className="text-gray-400" />
                                                        <span className="text-gray-700">
                                                            {order.customer_phone || order.profile?.phone}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Delivery Info */}
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                                                <HiTruck className="text-indigo-500" />
                                                Teslimat Bilgileri
                                            </h3>
                                            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                                {order.receiver_name && (
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-gray-600">Alıcı:</span>
                                                        <span className="font-medium text-gray-900">{order.receiver_name}</span>
                                                    </div>
                                                )}
                                                {order.receiver_phone && (
                                                    <div className="flex items-center gap-3">
                                                        <HiPhone className="text-gray-400" />
                                                        <span className="text-gray-700">{order.receiver_phone}</span>
                                                    </div>
                                                )}
                                                {order.delivery_date && (
                                                    <div className="flex items-center gap-3">
                                                        <HiCalendar className="text-gray-400" />
                                                        <span className="text-gray-700">{formatSimpleDate(order.delivery_date)}</span>
                                                    </div>
                                                )}
                                                {order.delivery_time_slot && (
                                                    <div className="flex items-center gap-3">
                                                        <HiClock className="text-gray-400" />
                                                        <span className="text-gray-700">{order.delivery_time_slot}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-start gap-3">
                                                    <HiLocationMarker className="text-gray-400 mt-0.5" />
                                                    <div className="text-gray-700">
                                                        {order.city && order.district && (
                                                            <span className="block font-medium">{order.city}, {order.district}</span>
                                                        )}
                                                        <span className="block">{order.address}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    {(order.delivery_note || order.user_message) && (
                                        <div className="mt-6 space-y-4">
                                            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                                                <HiChatAlt className="text-indigo-500" />
                                                Notlar
                                            </h3>
                                            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                                {order.delivery_note && (
                                                    <div>
                                                        <span className="text-xs text-gray-500 uppercase">Teslimat Notu:</span>
                                                        <p className="text-gray-700 mt-1">{order.delivery_note}</p>
                                                    </div>
                                                )}
                                                {order.user_message && (
                                                    <div>
                                                        <span className="text-xs text-gray-500 uppercase">Kart Mesajı:</span>
                                                        <p className="text-gray-700 mt-1">{order.user_message}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Order Items */}
                                    <div className="mt-6 space-y-4">
                                        <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">
                                            Sipariş Ürünleri
                                        </h3>
                                        <div className="bg-gray-50 rounded-xl overflow-hidden">
                                            <table className="w-full text-sm">
                                                <thead className="bg-gray-100 text-gray-600">
                                                    <tr>
                                                        <th className="px-4 py-2 text-left">Ürün</th>
                                                        <th className="px-4 py-2 text-center">Adet</th>
                                                        <th className="px-4 py-2 text-right">Fiyat</th>
                                                        <th className="px-4 py-2 text-right">Toplam</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {order.order_items.map((item) => (
                                                        <tr key={item.id}>
                                                            <td className="px-4 py-3 text-gray-900">{item.product_name}</td>
                                                            <td className="px-4 py-3 text-center text-gray-600">{item.quantity}</td>
                                                            <td className="px-4 py-3 text-right text-gray-600">
                                                                ₺{Number(item.price).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                                            </td>
                                                            <td className="px-4 py-3 text-right font-medium text-gray-900">
                                                                ₺{(Number(item.price) * item.quantity).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot className="bg-gray-100">
                                                    <tr>
                                                        <td colSpan={3} className="px-4 py-3 text-right font-semibold text-gray-700">
                                                            Genel Toplam:
                                                        </td>
                                                        <td className="px-4 py-3 text-right font-bold text-lg text-indigo-600">
                                                            ₺{Number(order.total_price).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Order Meta */}
                                    <div className="mt-6 flex flex-wrap gap-4 text-xs text-gray-500">
                                        <span>Oluşturulma: {formatDate(order.created_at)}</span>
                                        {order.updated_at && <span>Son Güncelleme: {formatDate(order.updated_at)}</span>}
                                        {order.payment_method && <span>Ödeme: {formatPaymentMethod(order.payment_method)}</span>}
                                        {order.invoice_type && <span>Fatura: {formatInvoiceType(order.invoice_type)}</span>}
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="bg-gray-50 px-6 py-4 border-t flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-gray-600">Durumu Güncelle:</span>
                                        <select
                                            value={order.status}
                                            onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
                                            disabled={isUpdating || order.status === 'cancelled'}
                                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {STATUS_OPTIONS.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex gap-3">
                                        {order.status !== 'cancelled' && order.status !== 'delivered' && (
                                            <button
                                                onClick={() => onCancelOrder(order.id)}
                                                disabled={isUpdating}
                                                className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 transition cursor-pointer disabled:opacity-50"
                                            >
                                                Siparişi İptal Et
                                            </button>
                                        )}
                                        <button
                                            onClick={onClose}
                                            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 transition cursor-pointer"
                                        >
                                            Kapat
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
