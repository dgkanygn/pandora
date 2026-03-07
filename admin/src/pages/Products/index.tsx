import { useState, useEffect, useCallback } from 'react';
import { HiPlus } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import Modal from '../../components/Modal';
import ConfirmModal from '../../components/ConfirmModal';
import { productsAPI, categoriesAPI } from '../../services/api';

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface ProductImageRow {
    id: number;
    image_url: string;
    sort_order: number;
}

interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    stock: number;
    category_id?: string;
    category?: Category;
    is_active: boolean;
    image_url?: string;
    image_rows?: ProductImageRow[];
}

const ITEMS_PER_PAGE = 5;

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Product | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    // Fetch products from API (with pagination and category filter)
    const fetchProducts = useCallback(async (offset: number = 0, append: boolean = false, category?: string) => {
        try {
            if (append) {
                setIsLoadingMore(true);
            } else {
                setIsLoading(true);
            }

            const response = await productsAPI.getAll({
                limit: ITEMS_PER_PAGE,
                offset,
                category: category || undefined
            });

            if (append) {
                setProducts((prev) => [...prev, ...response.data]);
            } else {
                setProducts(response.data);
            }
            setHasMore(response.hasMore);
        } catch (error: any) {
            toast.error(error.message || 'Ürünler yüklenemedi');
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    }, []);

    // Fetch categories (all for filter dropdown)
    const fetchCategories = useCallback(async () => {
        try {
            // Fetch all categories for the filter (without pagination limit)
            const response = await categoriesAPI.getAll({ limit: 100, offset: 0 });
            setCategories(response.data);
        } catch (error: any) {
            toast.error(error.message || 'Kategoriler yüklenemedi');
        }
    }, []);

    // Initial data fetch
    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([fetchProducts(0, false, selectedCategory), fetchCategories()]);
        };
        fetchData();
    }, [fetchCategories]); // Only run on mount

    // Refetch when category changes
    const handleCategoryChange = useCallback((categoryId: string) => {
        setSelectedCategory(categoryId);
        setProducts([]); // Clear current products
        fetchProducts(0, false, categoryId);
    }, [fetchProducts]);

    const handleLoadMore = () => {
        if (!isLoadingMore && hasMore) {
            fetchProducts(products.length, true, selectedCategory);
        }
    };

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
    };

    const handleConfirmDelete = async () => {
        if (deleteId) {
            try {
                await productsAPI.delete(deleteId);
                setProducts((prev) => prev.filter((p) => p.id !== deleteId));
                toast.success('Ürün silindi');
            } catch (error: any) {
                toast.error(error.message || 'Ürün silinemedi');
            } finally {
                setDeleteId(null);
            }
        }
    };

    const handleEdit = (product: Product) => {
        setEditingItem(product);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            const { mediaList, ...baseData } = data;

            let currentProductId = editingItem?.id;

            if (!editingItem) {
                // 1. Create new product (without image field to separate concerns)
                const newProduct = await productsAPI.create({
                    name: baseData.name!,
                    description: baseData.description,
                    price: baseData.price!,
                    stock: baseData.stock,
                    category_id: baseData.category_id,
                    is_active: baseData.is_active ?? true,
                });


                currentProductId = newProduct.id;
                console.log(currentProductId);
                // Add an optimistic row before background image operations finish
                setProducts((prev) => [newProduct, ...prev]);
                // Ensure ID is ready
            } else {
                // 1. Update existing product basic details
                const updatedProduct = await productsAPI.update(editingItem.id, {
                    name: baseData.name,
                    description: baseData.description,
                    price: baseData.price,
                    stock: baseData.stock,
                    category_id: baseData.category_id,
                    is_active: baseData.is_active,
                });


                console.log(currentProductId);

                setProducts((prev) =>
                    prev.map((p) => (p.id === editingItem.id ? updatedProduct : p))
                );
            }

            console.log(!currentProductId);
            if (!currentProductId) throw new Error("Ürün oluşturulamadı.");

            // 2. Process Media Queue (Delete -> Add -> Primary)
            const itemsToDelete = mediaList.filter((m: any) => m.status === 'deleted' && m.id);
            const itemsToAdd = mediaList.filter((m: any) => m.status === 'new' && m.file);
            const primaryItemCandidate = mediaList.find((m: any) => m.isPrimary && m.status !== 'deleted');

            // Deletions
            for (const item of itemsToDelete) {
                await productsAPI.deleteImage(currentProductId, item.id);
            }

            // Additions (need to track new ID if it's meant to be primary)
            let newlyAddedPrimaryId = null;
            for (const item of itemsToAdd) {
                const addRes = await productsAPI.addImage(currentProductId, item.file);
                // Extract the new image ID from the response (it usually appends to the end)
                if (item.isPrimary) {
                    const latestRow = addRes.image_rows?.[addRes.image_rows.length - 1];
                    if (latestRow) newlyAddedPrimaryId = latestRow.id;
                }
            }

            // Set Primary Image
            if (newlyAddedPrimaryId) {
                await productsAPI.setPrimaryImage(currentProductId, newlyAddedPrimaryId);
            } else if (primaryItemCandidate?.status === 'existing' && primaryItemCandidate.id) {
                // Check if it's different from the original primary
                if (!editingItem || editingItem.image_url !== primaryItemCandidate.url) {
                    await productsAPI.setPrimaryImage(currentProductId, primaryItemCandidate.id);
                }
            }

            // Refresh to ensure full sync with latest DB state
            await fetchProducts(0, false, selectedCategory);

            toast.success(editingItem ? 'Ürün ve görseller güncellendi' : 'Ürün ve görseller eklendi');
            handleCloseModal();
        } catch (error: any) {
            toast.error(error.message || 'Ürün kaydedilirken/görseller eklenirken hata oluştu');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
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
                    <h1 className="text-2xl font-bold text-gray-800">Ürün Yönetimi</h1>
                    <p className="text-sm text-gray-500 mt-1">Ürünleri listeleyin, ekleyin veya düzenleyin.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition cursor-pointer shadow-sm hover:shadow-md"
                >
                    <HiPlus /> Yeni Ürün
                </button>
            </div>

            <ProductList
                products={products}
                categories={categories}
                onDelete={handleDeleteClick}
                onEdit={handleEdit}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                hasMore={hasMore}
                isLoadingMore={isLoadingMore}
                onLoadMore={handleLoadMore}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingItem ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
            >
                <ProductForm
                    initialData={editingItem}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCloseModal}
                    categories={categories}
                    isSubmitting={isSubmitting}
                />
            </Modal>

            <ConfirmModal
                isOpen={!!deleteId}
                title="Ürünü Sil"
                message="Bu ürünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
                confirmText="Sil"
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteId(null)}
            />
        </div>
    );
}

