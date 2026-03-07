import { useState, useEffect, useCallback } from 'react';
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi';
import DataTable from '../../components/DataTable';
import type { Column } from '../../components/DataTable';
import ConfirmModal from '../../components/ConfirmModal';
import HeroForm from './components/HeroForm';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import toast from 'react-hot-toast';
import { heroAPI } from '../../services/hero';
import type { HeroSlide, HeroSlideFormData } from '../../services/hero';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8080';

function resolveImageUrl(url: string | null | undefined): string {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('blob:')) return url;
    return `${API_BASE}${url}`;
}

export default function Hero() {
    const [slides, setSlides] = useState<HeroSlide[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<HeroSlide | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchSlides = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await heroAPI.getAll();
            setSlides(data);
        } catch {
            toast.error('Slide\'lar yüklenirken bir hata oluştu.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSlides();
    }, [fetchSlides]);

    const columns: Column<HeroSlide>[] = [
        {
            key: 'background_image',
            header: 'Görsel',
            render: (item) => (
                <div className="h-14 w-24 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center flex-shrink-0">
                    {item.background_image ? (
                        <img
                            src={resolveImageUrl(item.background_image)}
                            alt={item.title}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <span className="text-xs text-gray-400 text-center px-1">Görsel Yok</span>
                    )}
                </div>
            ),
        },
        {
            key: 'title',
            header: 'Başlık / İçerik',
            sortable: true,
            render: (item) => (
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="text-lg leading-none">{item.icon_key}</span>
                        {item.badge && (
                            <span
                                className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                                style={{ backgroundColor: item.accent_color || '#db2777' }}
                            >
                                {item.badge}
                            </span>
                        )}
                    </div>
                    <div className="mt-1 font-medium text-gray-900 text-sm line-clamp-1">
                        {item.title}{' '}
                        <span style={{ color: item.accent_color || '#db2777' }}>
                            {item.title_highlight}
                        </span>
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">{item.description}</div>
                </div>
            ),
        },
        {
            key: 'accent_color',
            header: 'Renk',
            render: (item) => (
                <div className="flex items-center gap-2">
                    <div
                        className="h-5 w-5 rounded-md border border-gray-200 shadow-sm flex-shrink-0"
                        style={{ backgroundColor: item.accent_color }}
                        title={item.accent_color}
                    />
                    <span className="text-xs text-gray-500 font-mono">{item.accent_color}</span>
                </div>
            ),
        },
        {
            key: 'sort_order',
            header: 'Sıra',
            sortable: true,
            className: 'text-center',
        },
        {
            key: 'is_active',
            header: 'Durum',
            sortable: true,
            render: (item) => (
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${item.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    {item.is_active ? 'Aktif' : 'Pasif'}
                </span>
            ),
        },
    ];

    const handleAdd = () => {
        setSelectedItem(null);
        setIsFormModalOpen(true);
    };

    const handleEdit = (item: HeroSlide) => {
        setSelectedItem(item);
        setIsFormModalOpen(true);
    };

    const handleDeleteClick = (item: HeroSlide) => {
        setSelectedItem(item);
        setIsDeleteModalOpen(true);
    };

    const handleFormSubmit = async (data: HeroSlideFormData) => {
        setIsSubmitting(true);
        try {
            if (selectedItem) {
                await heroAPI.update(selectedItem.id, data);
                toast.success('Hero slide başarıyla güncellendi.');
            } else {
                await heroAPI.create(data);
                toast.success('Hero slide başarıyla eklendi.');
            }
            setIsFormModalOpen(false);
            fetchSlides();
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Bir hata oluştu';
            toast.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!selectedItem) return;
        try {
            await heroAPI.delete(selectedItem.id);
            toast.success('Hero slide başarıyla silindi.');
            setIsDeleteModalOpen(false);
            setSelectedItem(null);
            fetchSlides();
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Silme işlemi başarısız';
            toast.error(msg);
        }
    };

    return (
        <div className="p-4 sm:p-6 pb-20 sm:pb-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Hero Section Yönetimi</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Anasayfadaki kayan afiş alanını buradan yönetebilirsiniz.
                    </p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 shadow-sm"
                >
                    <HiPlus className="h-5 w-5" />
                    Yeni Slide Ekle
                </button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-24">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
                </div>
            ) : (
                <DataTable
                    data={slides}
                    columns={columns}
                    getRowId={(item) => String(item.id)}
                    emptyMessage="Henüz bir hero slide eklenmemiş."
                    renderActions={(item) => (
                        <div className="flex items-center justify-end gap-2">
                            <button
                                onClick={() => handleEdit(item)}
                                className="p-1.5 rounded text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                                title="Düzenle"
                            >
                                <HiPencil size={17} />
                            </button>
                            <button
                                onClick={() => handleDeleteClick(item)}
                                className="p-1.5 rounded text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                title="Sil"
                            >
                                <HiTrash size={17} />
                            </button>
                        </div>
                    )}
                />
            )}

            {/* Form Modal */}
            <Transition appear show={isFormModalOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-[60]"
                    onClose={() => !isSubmitting && setIsFormModalOpen(false)}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
                        leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 sm:scale-95" enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-4 sm:scale-95"
                            >
                                <Dialog.Panel className="relative w-full max-w-2xl transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-xl transition-all">
                                    <div className="border-b border-gray-100 px-6 py-4">
                                        <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900">
                                            {selectedItem ? 'Hero Slide Düzenle' : 'Yeni Hero Slide Ekle'}
                                        </Dialog.Title>
                                    </div>
                                    <div className="px-6 py-5 bg-gray-50/50 max-h-[80vh] overflow-y-auto">
                                        <HeroForm
                                            initialData={selectedItem}
                                            onSubmit={handleFormSubmit}
                                            onCancel={() => setIsFormModalOpen(false)}
                                            isSubmitting={isSubmitting}
                                        />
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* Delete Modal */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                title="Slide'ı Sil"
                message={`"${selectedItem?.title}${selectedItem?.title_highlight ? ' ' + selectedItem.title_highlight : ''}" slide'ını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setIsDeleteModalOpen(false)}
                confirmText="Evet, Sil"
                cancelText="İptal"
            />
        </div>
    );
}
