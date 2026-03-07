import { useState, useEffect, useCallback } from 'react';
import { HiPlus } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import ConfirmModal from '../../components/ConfirmModal';
import CategoryList from './components/CategoryList';
import CategoryForm from './components/CategoryForm';
import Modal from '../../components/Modal';
import { categoriesAPI } from '../../services/api';

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    is_active: boolean;
    image_url?: string;
}

const ITEMS_PER_PAGE = 5;

export default function Categories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Category | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch categories from API
    const fetchCategories = useCallback(async (offset: number = 0, append: boolean = false) => {
        try {
            if (append) {
                setIsLoadingMore(true);
            } else {
                setIsLoading(true);
            }

            const response = await categoriesAPI.getAll({ limit: ITEMS_PER_PAGE, offset });

            if (append) {
                setCategories((prev) => [...prev, ...response.data]);
            } else {
                setCategories(response.data);
            }
            setHasMore(response.hasMore);
        } catch (error: any) {
            toast.error(error.message || 'Kategoriler yüklenemedi');
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleLoadMore = () => {
        if (!isLoadingMore && hasMore) {
            fetchCategories(categories.length, true);
        }
    };

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
    };

    const handleConfirmDelete = async () => {
        if (deleteId) {
            try {
                await categoriesAPI.delete(deleteId);
                setCategories((prev) => prev.filter((c) => c.id !== deleteId));
                toast.success('Kategori silindi');
            } catch (error: any) {
                toast.error(error.message || 'Kategori silinemedi');
            } finally {
                setDeleteId(null);
            }
        }
    };

    const handleEdit = (category: Category) => {
        setEditingItem(category);
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
                // Create new category
                const newCategory = await categoriesAPI.create({
                    name: data.name!,
                    description: data.description,
                    slug: data.slug || data.name!.toLowerCase().replace(/\s+/g, '-'),
                    is_active: data.is_active,
                    image: data.image,
                });
                setCategories((prev) => [newCategory, ...prev]);
                toast.success('Kategori eklendi');
            } else {
                // Update existing category
                const updatedCategory = await categoriesAPI.update(editingItem.id, {
                    name: data.name,
                    description: data.description,
                    slug: data.slug,
                    is_active: data.is_active,
                    image: data.image,
                    remove_image: data.remove_image,
                });
                setCategories((prev) =>
                    prev.map((c) => (c.id === editingItem.id ? updatedCategory : c))
                );
                toast.success('Kategori güncellendi');
            }
            handleCloseModal();
        } catch (error: any) {
            toast.error(error.message || 'İşlem başarısız');
        } finally {
            setIsSubmitting(false);
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Kategori Yönetimi</h1>
                    <p className="text-sm text-gray-500 mt-1">Kategorileri listeleyin ve düzenleyin.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition cursor-pointer shadow-sm hover:shadow-md"
                >
                    <HiPlus /> Yeni Ekle
                </button>
            </div>

            <CategoryList
                categories={categories}
                onDelete={handleDeleteClick}
                onEdit={handleEdit}
                hasMore={hasMore}
                isLoadingMore={isLoadingMore}
                onLoadMore={handleLoadMore}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingItem ? 'Kategori Düzenle' : 'Yeni Kategori'}
            >
                <CategoryForm
                    initialData={editingItem}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCloseModal}
                    isSubmitting={isSubmitting}
                />
            </Modal>

            <ConfirmModal
                isOpen={!!deleteId}
                title="Kategoriyi Sil"
                message="Bu kategoriyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
                confirmText="Sil"
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteId(null)}
            />
        </div>
    );
}

