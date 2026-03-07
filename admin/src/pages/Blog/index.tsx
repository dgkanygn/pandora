import { useState, useEffect, useCallback } from 'react';
import { HiPlus } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import BlogList from './components/BlogList';
import BlogForm from './components/BlogForm';
import Modal from '../../components/Modal';
import ConfirmModal from '../../components/ConfirmModal';
import { blogAPI } from '../../services/api';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    cover_image?: string;
    is_published: boolean;
    created_at: string;
}

const ITEMS_PER_PAGE = 5;

export default function Blog() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<BlogPost | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch blog posts from API
    const fetchPosts = useCallback(async (offset: number = 0, append: boolean = false) => {
        try {
            if (append) {
                setIsLoadingMore(true);
            } else {
                setIsLoading(true);
            }

            const response = await blogAPI.getAll({ limit: ITEMS_PER_PAGE, offset });

            if (append) {
                setPosts((prev) => [...prev, ...response.data]);
            } else {
                setPosts(response.data);
            }
            setHasMore(response.hasMore);
        } catch (error: any) {
            toast.error(error.message || 'Blog yazıları yüklenemedi');
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleLoadMore = () => {
        if (!isLoadingMore && hasMore) {
            fetchPosts(posts.length, true);
        }
    };

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
    };

    const handleConfirmDelete = async () => {
        if (deleteId) {
            try {
                await blogAPI.delete(deleteId);
                setPosts((prev) => prev.filter((p) => p.id !== deleteId));
                toast.success('Yazı silindi');
            } catch (error: any) {
                toast.error(error.message || 'Yazı silinemedi');
            } finally {
                setDeleteId(null);
            }
        }
    };

    const handleEdit = (post: BlogPost) => {
        setEditingItem(post);
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
                // Create new post
                const newPost = await blogAPI.create({
                    title: data.title!,
                    slug: data.slug!,
                    content: data.content!,
                    image: data.image,
                    is_published: data.is_published ?? false,
                });
                setPosts((prev) => [newPost, ...prev]);
                toast.success('Yazı eklendi');
            } else {
                // Update existing post
                const updatedPost = await blogAPI.update(editingItem.id, {
                    title: data.title,
                    slug: data.slug,
                    content: data.content,
                    image: data.image,
                    remove_image: data.remove_image,
                    is_published: data.is_published,
                });
                setPosts((prev) =>
                    prev.map((p) => (p.id === editingItem.id ? updatedPost : p))
                );
                toast.success('Yazı güncellendi');
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
                    <h1 className="text-2xl font-bold text-gray-800">Blog Yönetimi</h1>
                    <p className="text-sm text-gray-500 mt-1">Blog yazılarını listeleyin ve düzenleyin.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition cursor-pointer shadow-sm hover:shadow-md"
                >
                    <HiPlus /> Yeni Yazı
                </button>
            </div>

            <BlogList
                posts={posts}
                onDelete={handleDeleteClick}
                onEdit={handleEdit}
                hasMore={hasMore}
                isLoadingMore={isLoadingMore}
                onLoadMore={handleLoadMore}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingItem ? 'Yazı Düzenle' : 'Yeni Yazı Ekle'}
                size="lg"
            >
                <BlogForm
                    initialData={editingItem}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCloseModal}
                    isSubmitting={isSubmitting}
                />
            </Modal>

            <ConfirmModal
                isOpen={!!deleteId}
                title="Yazıyı Sil"
                message="Bu yazıyı silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
                confirmText="Sil"
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteId(null)}
            />
        </div>
    );
}

