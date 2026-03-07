import { useState } from 'react';
import { HiPencil, HiTrash, HiPhotograph } from 'react-icons/hi';
import DetailModal from '../../../../components/DetailModal';

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    is_active: boolean;
    image_url?: string;
}

interface CategoryListProps {
    categories: Category[];
    onDelete: (id: string) => void;
    onEdit: (category: Category) => void;
    hasMore: boolean;
    isLoadingMore: boolean;
    onLoadMore: () => void;
}

export default function CategoryList({ categories, onDelete, onEdit, hasMore, isLoadingMore, onLoadMore }: CategoryListProps) {
    const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);

    // Empty state
    if (categories.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <p className="text-gray-500">Henüz kategori bulunmuyor.</p>
            </div>
        );
    }

    return (
        <>
            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3 w-20">Görsel</th>
                                <th scope="col" className="px-6 py-3">Kategori Adı</th>
                                <th scope="col" className="px-6 py-3">Slug</th>
                                <th scope="col" className="px-6 py-3 max-w-xs">Açıklama</th>
                                <th scope="col" className="px-6 py-3">Durum</th>
                                <th scope="col" className="px-6 py-3 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 border-t border-gray-200">
                            {categories.map((category) => (
                                <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                                    {/* Image */}
                                    <td className="px-6 py-4 w-20">
                                        {category.image_url ? (
                                            <button
                                                onClick={() => setPreviewImage({ url: category.image_url!, title: category.name })}
                                                className="group relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 hover:ring-2 hover:ring-indigo-500 transition-all cursor-pointer"
                                            >
                                                <img
                                                    src={category.image_url}
                                                    alt={category.name}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                    <HiPhotograph className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
                                                </div>
                                            </button>
                                        ) : (
                                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                                                <HiPhotograph className="text-gray-400" size={20} />
                                            </div>
                                        )}
                                    </td>
                                    {/* Name */}
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-gray-900">{category.name}</span>
                                    </td>
                                    {/* Slug */}
                                    <td className="px-6 py-4">
                                        <code className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-600">
                                            {category.slug}
                                        </code>
                                    </td>
                                    {/* Description */}
                                    <td className="px-6 py-4 max-w-xs">
                                        <span className="text-gray-500 line-clamp-2">
                                            {category.description || '-'}
                                        </span>
                                    </td>
                                    {/* Status */}
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${category.is_active
                                                ? 'bg-green-50 text-green-700 ring-green-600/20'
                                                : 'bg-red-50 text-red-700 ring-red-600/20'
                                                }`}
                                        >
                                            {category.is_active ? 'Aktif' : 'Pasif'}
                                        </span>
                                    </td>
                                    {/* Actions */}
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-3">
                                            <button
                                                onClick={() => onEdit(category)}
                                                className="text-indigo-600 hover:text-indigo-900 cursor-pointer p-1 rounded-lg hover:bg-indigo-50 transition-colors"
                                                title="Düzenle"
                                            >
                                                <HiPencil size={20} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(category.id)}
                                                className="text-red-600 hover:text-red-900 cursor-pointer p-1 rounded-lg hover:bg-red-50 transition-colors"
                                                title="Sil"
                                            >
                                                <HiTrash size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Load More / End Message */}
            <div className="flex justify-center py-4">
                {hasMore ? (
                    <button
                        onClick={onLoadMore}
                        disabled={isLoadingMore}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md cursor-pointer"
                    >
                        {isLoadingMore ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Yükleniyor...
                            </>
                        ) : (
                            'Daha Fazla Yükle'
                        )}
                    </button>
                ) : (
                    <div className="flex items-center gap-2 text-gray-500 bg-gray-100 px-4 py-2 rounded-lg">
                        <span className="text-sm">Tüm veriler yüklendi</span>
                        <span className="text-xs text-gray-400">({categories.length} kayıt)</span>
                    </div>
                )}
            </div>

            {/* Image Preview Modal */}
            <DetailModal
                isOpen={!!previewImage}
                onClose={() => setPreviewImage(null)}
                title={previewImage?.title || ''}
                type="image"
                content={previewImage?.url || ''}
            />
        </>
    );
}
