import { useState, useEffect, useCallback } from 'react';
import { HiPlus, HiSearch } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import ConfirmModal from '../../components/ConfirmModal';
import NeighborhoodList from './components/NeighborhoodList';
import NeighborhoodForm from './components/NeighborhoodForm';
import Modal from '../../components/Modal';
import { neighborhoodsAPI } from '../../services/api';

interface Neighborhood {
    id: string;
    name: string;
    price: number;
}

const ITEMS_PER_PAGE = 20;

export default function Neighborhoods() {
    const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Neighborhood | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch neighborhoods from API
    const fetchNeighborhoods = useCallback(async (offset: number = 0, append: boolean = false, query: string = '') => {
        try {
            if (append) {
                setIsLoadingMore(true);
            } else {
                setIsLoading(true);
            }

            const response = await neighborhoodsAPI.getAll({
                limit: ITEMS_PER_PAGE,
                offset,
                name: query
            });

            if (append) {
                setNeighborhoods((prev) => [...prev, ...response.data]);
            } else {
                setNeighborhoods(response.data);
            }
            setHasMore(response.hasMore);
        } catch (error: any) {
            toast.error(error.message || 'Semtler yüklenemedi');
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    }, []);

    useEffect(() => {
        // Debounce search
        const timeoutId = setTimeout(() => {
            fetchNeighborhoods(0, false, searchQuery);
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [fetchNeighborhoods, searchQuery]);

    const handleLoadMore = () => {
        if (!isLoadingMore && hasMore) {
            fetchNeighborhoods(neighborhoods.length, true, searchQuery);
        }
    };

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
    };

    const handleConfirmDelete = async () => {
        if (deleteId) {
            try {
                await neighborhoodsAPI.delete(deleteId);
                setNeighborhoods((prev) => prev.filter((n) => n.id !== deleteId));
                toast.success('Semt silindi');
            } catch (error: any) {
                toast.error(error.message || 'Semt silinemedi');
            } finally {
                setDeleteId(null);
            }
        }
    };

    const handleEdit = (neighborhood: Neighborhood) => {
        setEditingItem(neighborhood);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleFormSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            if (!editingItem) {
                // Create new neighborhood
                const newNeighborhood = await neighborhoodsAPI.create({
                    name: data.name,
                    price: data.price,
                });
                setNeighborhoods((prev) => [newNeighborhood, ...prev]);
                toast.success('Semt eklendi');
            } else {
                // Update existing neighborhood
                const updatedNeighborhood = await neighborhoodsAPI.update(editingItem.id, {
                    name: data.name,
                    price: data.price,
                });
                setNeighborhoods((prev) =>
                    prev.map((n) => (n.id === editingItem.id ? updatedNeighborhood : n))
                );
                toast.success('Semt güncellendi');
            }
            handleCloseModal();
        } catch (error: any) {
            toast.error(error.message || 'İşlem başarısız');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Semt Yönetimi</h1>
                    <p className="text-sm text-gray-500 mt-1">Semtleri listeleyin ve fiyatlandırın.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition cursor-pointer shadow-sm hover:shadow-md"
                >
                    <HiPlus /> Yeni Ekle
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiSearch className="text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Semt ara..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-black block w-full sm:w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {isLoading && neighborhoods.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                    <div className="h-10 w-10 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
                </div>
            ) : (
                <NeighborhoodList
                    neighborhoods={neighborhoods}
                    onDelete={handleDeleteClick}
                    onEdit={handleEdit}
                    hasMore={hasMore}
                    isLoadingMore={isLoadingMore}
                    onLoadMore={handleLoadMore}
                />
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingItem ? 'Semt Düzenle' : 'Yeni Semt'}
            >
                <NeighborhoodForm
                    initialData={editingItem}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCloseModal}
                    isSubmitting={isSubmitting}
                />
            </Modal>

            <ConfirmModal
                isOpen={!!deleteId}
                title="Semti Sil"
                message="Bu semti silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
                confirmText="Sil"
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteId(null)}
            />
        </div>
    );
}
