import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaBoxOpen, FaTrash, FaSignOutAlt, FaEye, FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Modal from '../../components/Modal';
import ConfirmModal from '../../components/ConfirmModal';
import { api } from '../../services/api';
import type { Order } from '../../services/api';

const ORDERS_PER_PAGE = 10;

const Profile: React.FC = () => {
    const { user, token, logout, deleteAccount } = useAuth();
    const navigate = useNavigate();

    const [orders, setOrders] = useState<Order[]>([]);
    const [totalOrders, setTotalOrders] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);

    const hasMore = orders.length < totalOrders;

    // Fetch user orders
    useEffect(() => {
        const fetchOrders = async () => {
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const data = await api.orders.getMyOrders(token, { limit: ORDERS_PER_PAGE, offset: 0 });
                setOrders(data.orders);
                setTotalOrders(data.total);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [token]);

    const loadMoreOrders = async () => {
        if (!token || isLoadingMore) return;
        setIsLoadingMore(true);
        try {
            const data = await api.orders.getMyOrders(token, { limit: ORDERS_PER_PAGE, offset: orders.length });
            setOrders(prev => [...prev, ...data.orders]);
            setTotalOrders(data.total);
        } catch (error) {
            console.error('Error loading more orders:', error);
        } finally {
            setIsLoadingMore(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleDelete = () => {
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeletingAccount(true);
        try {
            await deleteAccount();
            navigate('/');
        } catch {
            // error already shown via toast in AuthContext
        } finally {
            setIsDeletingAccount(false);
        }
    };

    const handleShowDetails = (order: Order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price: number | string) => {
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return numPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { bg: string; text: string; label: string }> = {
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Beklemede' },
            paid: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Ödendi' },
            shipped: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Kargoda' },
            delivered: { bg: 'bg-green-100', text: 'text-green-700', label: 'Teslim Edildi' },
            cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'İptal Edildi' },
        };
        const s = statusMap[status] || { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
        return <span className={`px-3 py-1 ${s.bg} ${s.text} rounded-full text-xs font-bold`}>{s.label}</span>;
    };

    if (!user) {
        return <div className="p-10 text-center">Lütfen giriş yapın.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-6 md:px-12 lg:px-24 xl:px-32 py-12 pt-32">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Hesabım</h1>

                    {/* Profile Info - Full Width at Top */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 mb-8">
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center text-pink-600">
                                <FaUser size={32} />
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <h2 className="text-xl font-bold text-gray-900">{user.username}</h2>
                                <p className="text-gray-500 text-sm">{user.email}</p>
                                {user.phone && <p className="text-gray-400 text-sm">{user.phone}</p>}
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition text-sm font-medium cursor-pointer"
                                >
                                    <FaSignOutAlt /> Çıkış Yap
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeletingAccount}
                                    className="flex items-center gap-2 border border-red-100 text-red-600 bg-red-50 px-4 py-2.5 rounded-xl hover:bg-red-100 transition text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isDeletingAccount ? <FaSpinner className="animate-spin" size={12} /> : <FaTrash size={12} />} Hesabı Sil
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Order History */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                            <FaBoxOpen className="text-pink-600" />
                            <h2 className="text-lg font-bold text-gray-900">Geçmiş Siparişlerim</h2>
                        </div>

                        {isLoading ? (
                            <div className="p-12 text-center">
                                <FaSpinner className="animate-spin text-pink-600 text-2xl mx-auto mb-3" />
                                <p className="text-gray-500">Siparişler yükleniyor...</p>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="p-12 text-center text-gray-500">
                                <FaBoxOpen className="text-4xl mx-auto mb-3 text-gray-300" />
                                <p>Henüz siparişiniz bulunmuyor.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {orders.map(order => (
                                    <div key={order.id} className="p-6 hover:bg-gray-50 transition">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="font-bold text-gray-900 font-mono">
                                                        #{order.order_code || order.id}
                                                    </span>
                                                    {getStatusBadge(order.status)}
                                                </div>
                                                <p className="text-gray-400 text-sm">
                                                    {formatDate(order.created_at)}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-pink-600 font-bold text-lg">
                                                    {formatPrice(order.total_price)} ₺
                                                </span>
                                                <button
                                                    onClick={() => handleShowDetails(order)}
                                                    className="flex items-center gap-2 bg-pink-50 text-pink-600 px-4 py-2 rounded-xl hover:bg-pink-100 transition text-sm font-medium cursor-pointer"
                                                >
                                                    <FaEye /> Detaylar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {hasMore && (
                                    <div className="p-6 flex justify-center">
                                        <button
                                            onClick={loadMoreOrders}
                                            disabled={isLoadingMore}
                                            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-6 py-2.5 rounded-xl hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                        >
                                            {isLoadingMore ? (
                                                <>
                                                    <FaSpinner className="animate-spin" /> Yükleniyor...
                                                </>
                                            ) : (
                                                'Daha Fazla Yükle'
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Order Detail Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`Sipariş Detayı - #${selectedOrder?.order_code || selectedOrder?.id || ''}`}
            >
                {selectedOrder && (
                    <div className="space-y-6">
                        {/* Status & Date */}
                        <div className="flex items-center justify-between">
                            {getStatusBadge(selectedOrder.status)}
                            <span className="text-gray-500 text-sm">
                                {formatDate(selectedOrder.created_at)}
                            </span>
                        </div>

                        {/* Delivery Info */}
                        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                            <h4 className="font-bold text-gray-900 text-sm mb-3">Teslimat Bilgileri</h4>
                            {selectedOrder.receiver_name && (
                                <p className="text-sm"><span className="text-gray-500">Alıcı:</span> <span className="text-gray-800">{selectedOrder.receiver_name}</span></p>
                            )}
                            <p className="text-sm"><span className="text-gray-500">Adres:</span> <span className="text-gray-800">{selectedOrder.address}</span></p>
                            {selectedOrder.city && selectedOrder.district && (
                                <p className="text-sm"><span className="text-gray-500">İl/İlçe:</span> <span className="text-gray-800">{selectedOrder.district}, {selectedOrder.city}</span></p>
                            )}
                            {selectedOrder.delivery_date && (
                                <p className="text-sm"><span className="text-gray-500">Teslimat Tarihi:</span> <span className="text-gray-800">{selectedOrder.delivery_date} {selectedOrder.delivery_time_slot && `(${selectedOrder.delivery_time_slot})`}</span></p>
                            )}
                            {selectedOrder.delivery_note && (
                                <p className="text-sm"><span className="text-gray-500">Not:</span> <span className="text-gray-800">{selectedOrder.delivery_note}</span></p>
                            )}
                        </div>

                        {/* Order Items */}
                        {selectedOrder.order_items && selectedOrder.order_items.length > 0 && (
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm mb-3">Sipariş Kalemleri</h4>
                                <div className="space-y-2">
                                    {selectedOrder.order_items.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                                            <div>
                                                <p className="font-medium text-gray-800">{item.product_name}</p>
                                                <p className="text-sm text-gray-500">{item.quantity} adet × {formatPrice(item.price)} ₺</p>
                                            </div>
                                            <span className="font-bold text-gray-900">
                                                {formatPrice(Number(item.price) * item.quantity)} ₺
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Total */}
                        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                            <span className="font-bold text-gray-900">Toplam</span>
                            <span className="text-2xl font-bold text-pink-600">
                                {formatPrice(selectedOrder.total_price)} ₺
                            </span>
                        </div>

                        {/* User Message */}
                        {selectedOrder.user_message && (
                            <div className="bg-pink-50 rounded-xl p-4">
                                <h4 className="font-bold text-pink-800 text-sm mb-2">Kart Mesajı</h4>
                                <p className="text-pink-700 text-sm italic">"{selectedOrder.user_message}"</p>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* Delete Account Confirm Modal */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => !isDeletingAccount && setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Hesabı Sil"
                message="Hesabınızı kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz. Hesabınıza bağlı tüm verileriniz silinecektir."
                confirmText={isDeletingAccount ? 'Siliniyor...' : 'Evet, Hesabımı Sil'}
                cancelText="Vazgeç"
            />
        </div>
    );
};

export default Profile;
