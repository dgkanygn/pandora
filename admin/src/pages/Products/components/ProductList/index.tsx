import { useState } from 'react';
import { HiPencil, HiTrash, HiPhotograph } from 'react-icons/hi';
import DetailModal from '../../../../components/DetailModal';

interface Category {
    id: string;
    name: string;
    slug: string;
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
}

interface ProductListProps {
    products: Product[];
    categories: Category[];
    onDelete: (id: string) => void;
    onEdit: (product: Product) => void;
    selectedCategory: string;
    onCategoryChange: (categoryId: string) => void;
    hasMore: boolean;
    isLoadingMore: boolean;
    onLoadMore: () => void;
}

export default function ProductList({
    products,
    categories,
    onDelete,
    onEdit,
    selectedCategory,
    onCategoryChange,
    hasMore,
    isLoadingMore,
    onLoadMore,
}: ProductListProps) {
    const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);

    // Products are already filtered by API, no client-side filtering needed

    // Category filter options
    const filterOptions: { value: string; label: string }[] = [
        { value: '', label: 'Tüm Kategoriler' },
        ...categories.map((cat) => ({ value: String(cat.id), label: cat.name })),
    ];

    // Empty state
    if (products.length === 0) {
        return (
            <div className="space-y-4">
                {/* Filter - still show when empty */}
                <div className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4">
                    <label className="text-sm font-medium text-gray-700">Kategori:</label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => onCategoryChange(e.target.value)}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                        {filterOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <span className="ml-auto text-sm text-gray-500">
                        Toplam: <span className="font-semibold text-gray-700">0</span> kayıt
                    </span>
                </div>
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                    <p className="text-gray-500">Henüz ürün bulunmuyor.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Filter */}
            <div className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4">
                <label className="text-sm font-medium text-gray-700">Kategori:</label>
                <select
                    value={selectedCategory}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                    {filterOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <span className="ml-auto text-sm text-gray-500">
                    Toplam: <span className="font-semibold text-gray-700">{products.length}</span> kayıt
                </span>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3 w-20">Görsel</th>
                                <th scope="col" className="px-6 py-3">Ürün Adı</th>
                                <th scope="col" className="px-6 py-3">Kategori</th>
                                <th scope="col" className="px-6 py-3">Fiyat</th>
                                <th scope="col" className="px-6 py-3">Stok</th>
                                <th scope="col" className="px-6 py-3">Durum</th>
                                <th scope="col" className="px-6 py-3 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 border-t border-gray-200">
                            {products.map((product: Product) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    {/* Image */}
                                    <td className="px-6 py-4 w-20">
                                        {product.image_url ? (
                                            <button
                                                onClick={() => setPreviewImage({ url: product.image_url!, title: product.name })}
                                                className="group relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 hover:ring-2 hover:ring-indigo-500 transition-all cursor-pointer"
                                            >
                                                <img
                                                    src={product.image_url}
                                                    alt={product.name}
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
                                        <span className="font-medium text-gray-900">{product.name}</span>
                                    </td>
                                    {/* Category */}
                                    <td className="px-6 py-4">
                                        {product.category ? (
                                            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                {product.category.name}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    {/* Price */}
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-gray-700">
                                            ₺{product.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                        </span>
                                    </td>
                                    {/* Stock */}
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${product.stock > 10
                                                ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20'
                                                : product.stock > 0
                                                    ? 'bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20'
                                                    : 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'
                                                }`}
                                        >
                                            {product.stock} adet
                                        </span>
                                    </td>
                                    {/* Status */}
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${product.is_active
                                                ? 'bg-green-50 text-green-700 ring-green-600/20'
                                                : 'bg-red-50 text-red-700 ring-red-600/20'
                                                }`}
                                        >
                                            {product.is_active ? 'Aktif' : 'Pasif'}
                                        </span>
                                    </td>
                                    {/* Actions */}
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-3">
                                            <button
                                                onClick={() => onEdit(product)}
                                                className="text-indigo-600 hover:text-indigo-900 cursor-pointer p-1 rounded-lg hover:bg-indigo-50 transition-colors"
                                                title="Düzenle"
                                            >
                                                <HiPencil size={20} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(product.id)}
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
                        <span className="text-xs text-gray-400">({products.length} kayıt)</span>
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
