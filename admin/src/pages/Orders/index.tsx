import { useState, useEffect, useCallback } from 'react';
import { HiRefresh, HiExclamationCircle } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import OrderList from './components/OrderList';
import OrderDetailModal from './components/OrderDetailModal';
import ConfirmModal from '../../components/ConfirmModal';
import DateFilter from './components/DateFilter';
import { ordersAPI } from '../../services/api';
import type { Order, OrderStatus } from '../../services/api';

const ITEMS_PER_PAGE = 5;

export default function Orders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus | ''>('');
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [orderToCancel, setOrderToCancel] = useState<string | null>(null);

    // Pagination state
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // Fetch orders from API
    const fetchOrders = useCallback(async (
        status?: OrderStatus,
        offset: number = 0,
        append: boolean = false,
        fromDate?: string,
        toDate?: string
    ) => {
        try {
            if (append) {
                setIsLoadingMore(true);
            } else {
                setIsLoading(true);
            }

            const response = await ordersAPI.getAll({
                status: status || undefined,
                limit: ITEMS_PER_PAGE,
                offset,
                dateFrom: fromDate || undefined,
                dateTo: toDate || undefined
            });

            if (append) {
                setOrders(prev => [...prev, ...response.data]);
            } else {
                setOrders(response.data);
            }

            setHasMore(response.hasMore);
        } catch (error: any) {
            toast.error(error.message || 'Siparişler yüklenemedi');
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    }, []);

    // Initial data fetch
    useEffect(() => {
        fetchOrders();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Handle status filter change
    const handleStatusFilterChange = (status: OrderStatus | '') => {
        setSelectedStatus(status);
        setOrders([]); // Clear current orders
        fetchOrders(status || undefined, 0, false, dateFrom, dateTo);
    };

    // Handle refresh
    const handleRefresh = () => {
        fetchOrders(selectedStatus || undefined, 0, false, dateFrom, dateTo);
    };

    // Handle load more
    const handleLoadMore = () => {
        if (!isLoadingMore && hasMore) {
            fetchOrders(selectedStatus || undefined, orders.length, true, dateFrom, dateTo);
        }
    };

    // ... (rest of the component)

    // Handle view order details
    const handleViewOrder = (order: Order) => {
        setSelectedOrder(order);
    };

    // Handle update order status
    const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
        setIsUpdatingStatus(true);
        try {
            const updatedOrder = await ordersAPI.updateStatus(orderId, newStatus);
            setOrders((prev) =>
                prev.map((o) => (o.id === orderId ? updatedOrder : o))
            );
            if (selectedOrder?.id === orderId) {
                setSelectedOrder(updatedOrder);
            }
            toast.success('Sipariş durumu güncellendi');
        } catch (error: any) {
            toast.error(error.message || 'Durum güncellenemedi');
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    // Handle cancel order request (shows confirmation)
    const handleCancelOrder = (orderId: string) => {
        setOrderToCancel(orderId);
    };

    // Handle confirmed cancel order
    const handleConfirmCancel = async () => {
        if (!orderToCancel) return;

        setIsUpdatingStatus(true);
        try {
            const updatedOrder = await ordersAPI.cancel(orderToCancel);
            setOrders((prev) =>
                prev.map((o) => (o.id === orderToCancel ? updatedOrder : o))
            );
            if (selectedOrder?.id === orderToCancel) {
                setSelectedOrder(updatedOrder);
            }
            toast.success('Sipariş iptal edildi');
            setOrderToCancel(null);
        } catch (error: any) {
            toast.error(error.message || 'Sipariş iptal edilemedi');
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="h-10 w-10 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Sipariş Yönetimi</h1>
                    <p className="text-sm text-gray-500 mt-1">Siparişleri görüntüleyin ve yönetin.</p>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition cursor-pointer shadow-sm hover:shadow-md disabled:opacity-50"
                >
                    <HiRefresh className={isLoading ? 'animate-spin' : ''} />
                    Yenile
                </button>
            </div>

            {/* Stats Widget */}
            {/* <OrderStatsWidget key={statsKey} /> */}

            {/* Date Filter */}
            <DateFilter
                dateFrom={dateFrom}
                dateTo={dateTo}
                onDateChange={(from, to) => {
                    setDateFrom(from);
                    setDateTo(to);
                    setOrders([]);
                    fetchOrders(selectedStatus || undefined, 0, false, from, to);
                }}
            />

            {/* Orders List */}
            <OrderList
                orders={orders}
                selectedStatus={selectedStatus}
                onStatusFilterChange={handleStatusFilterChange}
                onViewOrder={handleViewOrder}
                onUpdateStatus={handleUpdateStatus}
                isUpdatingStatus={isUpdatingStatus}
            />

            {/* Load More Button */}
            {hasMore && orders.length > 0 && (
                <div className="flex justify-center mt-6">
                    <button
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isLoadingMore ? (
                            <>
                                <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                Yükleniyor...
                            </>
                        ) : (
                            'Daha Fazla Yükle'
                        )}
                    </button>
                </div>
            )}

            {/* Order Count Info */}
            <div className="text-center mt-4 text-gray-500 text-sm">
                {orders.length} sipariş gösteriliyor
            </div>

            {/* Empty State */}
            {orders.length === 0 && !isLoading && (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                    <HiExclamationCircle className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-4 text-gray-500">
                        {selectedStatus ? 'Bu durumda sipariş bulunamadı.' : 'Henüz sipariş bulunmuyor.'}
                    </p>
                </div>
            )}

            {/* Order Detail Modal */}
            <OrderDetailModal
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
                onUpdateStatus={handleUpdateStatus}
                onCancelOrder={handleCancelOrder}
                isUpdating={isUpdatingStatus}
            />

            <ConfirmModal
                isOpen={!!orderToCancel}
                title="Siparişi İptal Et"
                message="Bu siparişi iptal etmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
                confirmText="Siparişi İptal Et"
                cancelText="Vazgeç"
                onConfirm={handleConfirmCancel}
                onCancel={() => setOrderToCancel(null)}
            />
        </div>
    );
}
