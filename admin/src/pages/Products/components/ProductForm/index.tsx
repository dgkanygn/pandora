import { useState, useEffect } from 'react';
import * as yup from 'yup';
import ImageUploader from '../../../../components/ImageUploader';
import type { MediaItem } from '../../../../components/ImageUploader';

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
    id?: string;
    name: string;
    description?: string;
    price: number;
    stock: number;
    category_id?: string;
    is_active?: boolean;
    image_url?: string;
    image_rows?: ProductImageRow[];
}

export interface ProductSubmitData extends Omit<Product, 'image_url' | 'image_rows'> {
    mediaList: MediaItem[];
}

interface ProductFormProps {
    initialData?: Product | null;
    onSubmit: (data: ProductSubmitData) => void; // Changed from ProductFormData
    onCancel: () => void;
    categories: Category[];
    isSubmitting?: boolean;
}

const validationSchema = yup.object().shape({
    name: yup.string()
        .required('Ürün adı zorunludur')
        .max(255, 'Ürün adı en fazla 255 karakter olabilir'),
    description: yup.string()
        .required('Açıklama zorunludur')
        .max(1000, 'Açıklama en fazla 1000 karakter olabilir'),
    price: yup.number()
        .typeError('Geçerli bir fiyat giriniz')
        .required('Fiyat zorunludur')
        .min(0, 'Fiyat 0 veya daha büyük olmalıdır'),
    stock: yup.number()
        .typeError('Geçerli bir stok giriniz')
        .required('Stok zorunludur')
        .integer('Stok tam sayı olmalıdır')
        .min(0, 'Stok 0 veya daha büyük olmalıdır'),
    category_id: yup.string()
        .required('Kategori seçimi zorunludur'),
    is_active: yup.boolean(),
});

export default function ProductForm({
    initialData,
    onSubmit,
    onCancel,
    categories,
    isSubmitting,
}: ProductFormProps) {
    const [formData, setFormData] = useState<Omit<ProductSubmitData, 'mediaList'>>({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        category_id: '',
        is_active: true,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [mediaList, setMediaList] = useState<MediaItem[]>([]);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                description: initialData.description || '',
                price: initialData.price || 0,
                stock: initialData.stock || 0,
                category_id: initialData.category_id || '',
                is_active: initialData.is_active ?? true,
            });

            // Map existing image_rows into mediaList
            const existingMedia: MediaItem[] = (initialData.image_rows || []).map(row => ({
                uid: `existing-${row.id}`,
                url: row.image_url,
                id: row.id,
                isPrimary: initialData.image_url === row.image_url,
                status: 'existing'
            }));

            // Handle edge case: if image_url exists but no row exists
            if (initialData.image_url && existingMedia.length === 0) {
                existingMedia.push({
                    uid: `existing-fallback`,
                    url: initialData.image_url,
                    isPrimary: true,
                    status: 'existing'
                });
            }

            setMediaList(existingMedia);
        } else {
            setFormData({
                name: '',
                description: '',
                price: 0,
                stock: 0,
                category_id: '',
                is_active: true,
            });
            setMediaList([]);
        }
        setErrors({});
    }, [initialData]);



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await validationSchema.validate(formData, { abortEarly: false });
            setErrors({});
            onSubmit({ ...formData, mediaList });
        } catch (err) {
            if (err instanceof yup.ValidationError) {
                const newErrors: Record<string, string> = {};
                err.inner.forEach((error) => {
                    if (error.path) newErrors[error.path] = error.message;
                });
                setErrors(newErrors);
            }
        }
    };

    return (
        <div className="">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Image Upload Gallery */}
                <ImageUploader
                    mediaList={mediaList}
                    onChange={setMediaList}
                    title="Ürün Görselleri"
                />

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Ürün Adı <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        className={`w-full rounded-lg border px-4 py-2 text-gray-900 bg-white focus:outline-none focus:ring-1 ${errors.name
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                            }`}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        maxLength={255}
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Açıklama <span className="text-red-500">*</span></label>
                    <textarea
                        rows={3}
                        className={`w-full rounded-lg border px-4 py-2 text-gray-900 bg-white focus:outline-none focus:ring-1 ${errors.description
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                            }`}
                        value={formData.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        maxLength={1000}
                    />
                    {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Fiyat (₺) <span className="text-red-500">*</span></label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            className={`w-full rounded-lg border px-4 py-2 text-gray-900 bg-white focus:outline-none focus:ring-1 ${errors.price
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                                }`}
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        />
                        {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Stok <span className="text-red-500">*</span></label>
                        <input
                            type="number"
                            min="0"
                            className={`w-full rounded-lg border px-4 py-2 text-gray-900 bg-white focus:outline-none focus:ring-1 ${errors.stock
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                                }`}
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                        />
                        {errors.stock && <p className="mt-1 text-xs text-red-500">{errors.stock}</p>}
                    </div>
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Kategori <span className="text-red-500">*</span></label>
                    <select
                        className={`w-full rounded-lg border px-4 py-2 text-gray-900 bg-white focus:outline-none focus:ring-1 ${errors.category_id
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                            }`}
                        value={formData.category_id || ''}
                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value || undefined })}
                    >
                        <option value="">Kategori Seçin</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    {errors.category_id && <p className="mt-1 text-xs text-red-500">{errors.category_id}</p>}
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="is_active"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    />
                    <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                        Aktif (Satışta)
                    </label>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer disabled:opacity-50"
                    >
                        İptal
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                </div>
            </form>
        </div>
    );
}
