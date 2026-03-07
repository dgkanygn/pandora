import { useState, useEffect, useRef } from 'react';
import { HiPhotograph, HiX } from 'react-icons/hi';
import * as yup from 'yup';

interface BlogPost {
    id?: string;
    title: string;
    slug: string;
    content: string;
    cover_image?: string;
    is_published: boolean;
}

interface BlogFormData extends Omit<BlogPost, 'cover_image'> {
    image?: File;
    remove_image?: boolean;
}

interface BlogFormProps {
    initialData?: BlogPost | null;
    onSubmit: (data: BlogFormData) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

const validationSchema = yup.object().shape({
    title: yup.string()
        .required('Başlık zorunludur')
        .max(255, 'Başlık en fazla 255 karakter olabilir'),
    slug: yup.string()
        .required('Slug zorunludur')
        .max(255, 'Slug en fazla 255 karakter olabilir'),
    content: yup.string()
        .required('İçerik zorunludur'),
    is_published: yup.boolean(),
});

export default function BlogForm({ initialData, onSubmit, onCancel, isSubmitting }: BlogFormProps) {
    const [formData, setFormData] = useState<BlogFormData>({
        title: '',
        slug: '',
        content: '',
        is_published: false,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                slug: initialData.slug || '',
                content: initialData.content || '',
                is_published: initialData.is_published ?? false,
            });
            setImagePreview(initialData.cover_image || null);
        } else {
            setFormData({
                title: '',
                slug: '',
                content: '',
                is_published: false,
            });
            setImagePreview(null);
        }
        setErrors({});
    }, [initialData]);

    // Auto-generate slug from title
    const handleTitleChange = (title: string) => {
        const slug = title
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

        setFormData({ ...formData, title, slug });
        // Clear errors
        const newErrors = { ...errors };
        delete newErrors.title;
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
                {/* Cover Image Upload */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Kapak Görseli</label>
                    <div className="flex items-start gap-4">
                        <div className="relative">
                            {imagePreview ? (
                                <div className="relative w-32 h-20 rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50">
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
                                    className="w-32 h-20 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                                >
                                    <HiPhotograph className="text-gray-400 mb-1" size={24} />
                                    <span className="text-xs text-gray-500">Kapak Yükle</span>
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
                    <label className="mb-1 block text-sm font-medium text-gray-700">Başlık <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        className={`w-full rounded-lg border px-4 py-2 text-gray-900 bg-white focus:outline-none focus:ring-1 ${errors.title
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                            }`}
                        value={formData.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        maxLength={255}
                    />
                    {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Slug (URL) <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        className={`w-full rounded-lg border px-4 py-2 text-gray-900 bg-white focus:outline-none focus:ring-1 ${errors.slug
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                            }`}
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="url-uyumlu-baslik"
                        maxLength={255}
                    />
                    {errors.slug && <p className="mt-1 text-xs text-red-500">{errors.slug}</p>}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">İçerik <span className="text-red-500">*</span></label>
                    <textarea
                        rows={10}
                        className={`w-full rounded-lg border px-4 py-2 text-gray-900 bg-white focus:outline-none focus:ring-1 ${errors.content
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                            }`}
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        placeholder="Blog yazısının içeriğini buraya yazın..."
                    />
                    {errors.content && <p className="mt-1 text-xs text-red-500">{errors.content}</p>}
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="is_published"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={formData.is_published}
                        onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    />
                    <label htmlFor="is_published" className="text-sm font-medium text-gray-700">
                        Yayınla
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
