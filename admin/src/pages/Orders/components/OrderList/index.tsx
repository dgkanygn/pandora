import { HiEye } from 'react-icons/hi';
import type { Order, OrderStatus } from '../../../../services/api';

interface OrderListProps {
    orders: Order[];
    selectedStatus: OrderStatus | '';
    onStatusFilterChange: (status: OrderStatus | '') => void;
    onViewOrder: (order: Order) => void;
    onUpdateStatus: (orderId: string, status: OrderStatus) => void;
    isUpdatingStatus: boolean;
}

const STATUS_OPTIONS: { value: OrderStatus | ''; label: string }[] = [
    { value: '', label: 'Tüm Durumlar' },
    { value: 'pending', label: 'Bekleyen' },
    { value: 'paid', label: 'Ödendi' },
    { value: 'shipped', label: 'Kargoda' },
    { value: 'delivered', label: 'Teslim Edildi' },
    { value: 'cancelled', label: 'İptal Edildi' },
];

const STATUS_STYLES: Record<OrderStatus, { bg: string; text: string; ring: string }> = {
    pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', ring: 'ring-yellow-600/20' },
    paid: { bg: 'bg-blue-50', text: 'text-blue-700', ring: 'ring-blue-600/20' },
    shipped: { bg: 'bg-purple-50', text: 'text-purple-700', ring: 'ring-purple-600/20' },
    delivered: { bg: 'bg-green-50', text: 'text-green-700', ring: 'ring-green-600/20' },
    cancelled: { bg: 'bg-red-50', text: 'text-red-700', ring: 'ring-red-600/20' },
};

export default function OrderList({
    orders,
    selectedStatus,
    onStatusFilterChange,
    onViewOrder,
    onUpdateStatus,
    isUpdatingStatus,
}: OrderListProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="space-y-4">
            {/* Filter */}
            <div className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4">
                <label className="text-sm font-medium text-gray-700">Durum:</label>
                <select
                    value={selectedStatus}
                    onChange={(e) => onStatusFilterChange(e.target.value as OrderStatus | '')}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                    {STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <span className="ml-auto text-sm text-gray-500">
                    Toplam: <span className="font-semibold text-gray-700">{orders.length}</span> sipariş
                </span>
            </div>

            {/* Table */}
            {orders.length > 0 && (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-500">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Sipariş Kodu</th>
                                    <th scope="col" className="px-6 py-3">Müşteri</th>
                                    <th scope="col" className="px-6 py-3">Tutar</th>
                                    <th scope="col" className="px-6 py-3">Durum</th>
                                    <th scope="col" className="px-6 py-3">Tarih</th>
                                    <th scope="col" className="px-6 py-3 text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 border-t border-gray-200">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        {/* Order Code */}
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-800">
                                                {order.order_code}
                                            </span>
                                        </td>
                                        {/* Customer */}
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900">
                                                    {order.customer_name || order.profile?.username || 'Misafir'}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {order.customer_phone || order.profile?.phone || '-'}
                                                </span>
                                            </div>
                                        </td>
                                        {/* Total */}
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-gray-700">
                                                ₺{Number(order.total_price).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                            </span>
                                        </td>
                                        {/* Status */}
                                        <td className="px-6 py-4">
                                            <select
                                                value={order.status}
                                                onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
                                                disabled={isUpdatingStatus || order.status === 'cancelled'}
                                                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 ${STATUS_STYLES[order.status].bg} ${STATUS_STYLES[order.status].text} ${STATUS_STYLES[order.status].ring}`}
                                            >
                                                {STATUS_OPTIONS.filter(o => o.value !== '').map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        {/* Date */}
                                        <td className="px-6 py-4">
                                            <span className="text-gray-600">{formatDate(order.created_at)}</span>
                                        </td>
                                        {/* Actions */}
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => onViewOrder(order)}
                                                className="text-indigo-600 hover:text-indigo-900 cursor-pointer p-1 rounded-lg hover:bg-indigo-50 transition-colors"
                                                title="Detayları Gör"
                                            >
                                                <HiEye size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
