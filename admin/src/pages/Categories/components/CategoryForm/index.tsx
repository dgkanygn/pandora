import { useState, useEffect, useRef } from 'react';
import { HiPhotograph, HiX } from 'react-icons/hi';
import * as yup from 'yup';

interface Category {
    id?: string;
    name: string;
    slug?: string;
    description: string;
    image_url?: string;
    is_active?: boolean;
}

interface CategoryFormData extends Omit<Category, 'image_url'> {
    image?: File;
    remove_image?: boolean;
}

interface CategoryFormProps {
    initialData?: Category | null;
    onSubmit: (data: CategoryFormData) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

const validationSchema = yup.object().shape({
    name: yup.string()
        .required('Kategori adı zorunludur')
        .max(255, 'Kategori adı en fazla 255 karakter olabilir'),
    slug: yup.string()
        .required('Slug zorunludur')
        .max(255, 'Slug en fazla 255 karakter olabilir'),
    description: yup.string()
        .required('Açıklama zorunludur')
        .max(1000, 'Açıklama en fazla 1000 karakter olabilir'),
    is_active: yup.boolean(),
});

export default function CategoryForm({ initialData, onSubmit, onCancel, isSubmitting }: CategoryFormProps) {
    const [formData, setFormData] = useState<CategoryFormData>({
        name: '',
        slug: '',
        description: '',
        is_active: true,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                slug: initialData.slug || '',
                description: initialData.description || '',
                is_active: initialData.is_active ?? true,
            });
            setImagePreview(initialData.image_url || null);
        } else {
            setFormData({ name: '', slug: '', description: '', is_active: true });
            setImagePreview(null);
        }
        setErrors({});
    }, [initialData]);

    // Auto-generate slug from name
    const handleNameChange = (name: string) => {
        const slug = name
            .toLowerCase()
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ı/g, 'i')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();

        setFormData({ ...formData, name, slug });
        // Clear errors for name and slug as they are being typed
        const newErrors = { ...errors };
        delete newErrors.name;
        delete newErrors.slug;
        setErrors(newErrors);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, image: file, remove_image: false });
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setFormData({ ...formData, image: undefined, remove_image: true });
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await validationSchema.validate(formData, { abortEarly: false });
            setErrors({});
            onSubmit(formData);
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
                {/* Image Upload */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Kategori Görseli</label>
                    <div className="flex items-start gap-4">
                        <div className="relative">
                            {imagePreview ? (
                                <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors cursor-pointer shadow-md"
                                    >
                                        <HiX size={14} />
                                    </button>
                                </div>
                            ) : (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                                >
                                    <HiPhotograph className="text-gray-400 mb-1" size={24} />
                                    <span className="text-xs text-gray-500">Yükle</span>
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer"
                            >
                                {imagePreview ? 'Değiştir' : 'Görsel Seç'}
                            </button>
                            <p className="text-xs text-gray-500 mt-1">
                                JPG, PNG, WebP veya GIF. Maks. 5MB.
                            </p>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Kategori Adı <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        className={`w-full rounded-lg border px-4 py-2 text-gray-900 bg-white focus:outline-none focus:ring-1 ${errors.name
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                            }`}
                        value={formData.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        maxLength={255}
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Slug (URL) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        className={`w-full rounded-lg border px-4 py-2 text-gray-900 bg-white focus:outline-none focus:ring-1 ${errors.slug
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                            }`}
                        value={formData.slug || ''}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="otomatik-olusturulur"
                        maxLength={255}
                    />
                    {errors.slug && <p className="mt-1 text-xs text-red-500">{errors.slug}</p>}
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Açıklama <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        rows={3}
                        className={`w-full rounded-lg border px-4 py-2 text-gray-900 bg-white focus:outline-none focus:ring-1 ${errors.description
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                            }`}
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                        }
                        maxLength={1000}
                    />
                    {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
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
                        Aktif
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
