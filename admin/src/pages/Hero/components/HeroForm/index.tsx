import { useState, useEffect } from 'react';
import * as yup from 'yup';
import SimpleImageUploader from '../../../../components/SimpleImageUploader';
import type { HeroSlide, HeroSlideFormData } from '../../../../services/hero';

const ICON_OPTIONS = [
    { value: '🌸', label: '🌸  Kiraz Çiçeği' },
    { value: '💝', label: '💝  Kalp' },
    { value: '🌹', label: '🌹  Gül' },
    { value: '🌺', label: '🌺  Çiçek' },
    { value: '🌷', label: '🌷  Lale' },
    { value: '🌻', label: '🌻  Ayçiçeği' },
    { value: '💐', label: '💐  Buket' },
    { value: '🍃', label: '🍃  Yaprak' },
    { value: '✨', label: '✨  Parıltı' },
    { value: '🎁', label: '🎁  Hediye' },
];

const ACCENT_COLORS = [
    { value: '#db2777', label: 'Pembe (Pink)' },
    { value: '#7c3aed', label: 'Mor (Purple)' },
    { value: '#059669', label: 'Yeşil (Emerald)' },
    { value: '#dc2626', label: 'Kırmızı (Red)' },
    { value: '#d97706', label: 'Amber (Amber)' },
    { value: '#2563eb', label: 'Mavi (Blue)' },
    { value: '#0891b2', label: 'Cyan (Cyan)' },
    { value: '#be185d', label: 'Fuşya (Fuchsia)' },
];

interface HeroFormProps {
    initialData?: HeroSlide | null;
    onSubmit: (data: HeroSlideFormData) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

const validationSchema = yup.object().shape({
    title: yup.string()
        .required('Başlık zorunludur')
        .max(255, 'En fazla 255 karakter'),
    title_highlight: yup.string()
        .required('Vurgu metni zorunludur')
        .max(255, 'En fazla 255 karakter'),
    description: yup.string()
        .required('Açıklama zorunludur')
        .max(500, 'En fazla 500 karakter'),
    badge: yup.string().max(100, 'En fazla 100 karakter'),
    sort_order: yup.number()
        .typeError('Geçerli bir sayı giriniz')
        .integer('Tam sayı olmalıdır')
        .min(0, '0 veya daha büyük olmalıdır'),
});

export default function HeroForm({ initialData, onSubmit, onCancel, isSubmitting }: HeroFormProps) {
    const [formData, setFormData] = useState({
        badge: '',
        icon_key: '🌸',
        title: '',
        title_highlight: '',
        description: '',
        primary_button_label: '',
        primary_button_to: '',
        secondary_button_label: '',
        secondary_button_to: '',
        accent_color: '#db2777',
        sort_order: 0,
        is_active: true,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                badge: initialData.badge || '',
                icon_key: initialData.icon_key || '🌸',
                title: initialData.title || '',
                title_highlight: initialData.title_highlight || '',
                description: initialData.description || '',
                primary_button_label: initialData.primary_button_label || '',
                primary_button_to: initialData.primary_button_to || '',
                secondary_button_label: initialData.secondary_button_label || '',
                secondary_button_to: initialData.secondary_button_to || '',
                accent_color: initialData.accent_color || '#db2777',
                sort_order: initialData.sort_order || 0,
                is_active: Boolean(initialData.is_active),
            });
            if (initialData.background_image) {
                setImagePreview(initialData.background_image);
                setImageFile(null);
            } else {
                setImagePreview(null);
                setImageFile(null);
            }
        } else {
            setFormData({
                badge: '',
                icon_key: '🌸',
                title: '',
                title_highlight: '',
                description: '',
                primary_button_label: '',
                primary_button_to: '',
                secondary_button_label: '',
                secondary_button_to: '',
                accent_color: '#db2777',
                sort_order: 0,
                is_active: true,
            });
            setImagePreview(null);
            setImageFile(null);
        }
        setErrors({});
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await validationSchema.validate(formData, { abortEarly: false });
            setErrors({});

            // Resolve image
            let background_image = initialData?.background_image || null;
            if (imagePreview === null && imageFile === null) {
                background_image = null;
            }

            onSubmit({
                ...formData,
                background_image_file: imageFile ?? null,
                background_image: imageFile ? null : background_image,
            });
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

    const handleImageChange = (file: File | null, preview: string | null) => {
        setImageFile(file);
        setImagePreview(preview);
    };

    const field = (key: string) => ({
        value: String(formData[key as keyof typeof formData] ?? ''),
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
            setFormData({ ...formData, [key]: e.target.value }),
    });

    const inputClass = (errorKey: string) =>
        `w-full rounded-lg border px-4 py-2 text-gray-900 bg-white focus:outline-none focus:ring-1 text-sm ${errors[errorKey]
            ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}`;

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Background Image */}
            <SimpleImageUploader
                imagePreview={imagePreview}
                onChange={handleImageChange}
                label="Arka Plan Görseli"
                recommendedText="Önerilen: 1920×1080px"
            />

            {/* Badge & Icon */}
            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Rozet (Badge)</label>
                    <input
                        type="text"
                        placeholder="Örn: Yeni Sezon"
                        className={inputClass('badge')}
                        {...field('badge')}
                        maxLength={100}
                    />
                    {errors.badge && <p className="mt-1 text-xs text-red-500">{errors.badge}</p>}
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">İkon</label>
                    <select className={inputClass('icon_key')} {...field('icon_key')}>
                        {ICON_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Title */}
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Başlık <span className="text-red-500">*</span>
                </label>
                <input type="text" className={inputClass('title')} {...field('title')} maxLength={255} />
                {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
            </div>

            {/* Title Highlight */}
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Vurgu Metni (Renkli Kısım) <span className="text-red-500">*</span>
                </label>
                <input type="text" className={inputClass('title_highlight')} {...field('title_highlight')} maxLength={255} placeholder="Başlıkta renkli gösterilecek kısım" />
                {errors.title_highlight && <p className="mt-1 text-xs text-red-500">{errors.title_highlight}</p>}
            </div>

            {/* Description */}
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Açıklama <span className="text-red-500">*</span>
                </label>
                <textarea
                    rows={3}
                    className={inputClass('description')}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    maxLength={500}
                />
                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
            </div>

            {/* Buttons */}
            <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Butonlar</p>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Birincil Buton Metni</label>
                        <input type="text" className={inputClass('primary_button_label')} {...field('primary_button_label')} placeholder="Örn: Hemen Keşfet" />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Birincil Buton URL</label>
                        <input type="text" className={inputClass('primary_button_to')} {...field('primary_button_to')} placeholder="/products" />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">İkincil Buton Metni</label>
                        <input type="text" className={inputClass('secondary_button_label')} {...field('secondary_button_label')} placeholder="Örn: İletişim" />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">İkincil Buton URL</label>
                        <input type="text" className={inputClass('secondary_button_to')} {...field('secondary_button_to')} placeholder="/contact" />
                    </div>
                </div>
            </div>

            {/* Accent Color & Sort Order */}
            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Vurgu Rengi</label>
                    <div className="flex items-center gap-2">
                        <div
                            className="h-9 w-9 min-w-[36px] rounded-lg border border-gray-300 shadow-sm"
                            style={{ backgroundColor: formData.accent_color }}
                        />
                        <select className={inputClass('accent_color')} {...field('accent_color')}>
                            {ACCENT_COLORS.map(c => (
                                <option key={c.value} value={c.value}>{c.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Sıralama Numarası</label>
                    <input
                        type="number"
                        min="0"
                        className={inputClass('sort_order')}
                        value={formData.sort_order}
                        onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                    />
                    {errors.sort_order && <p className="mt-1 text-xs text-red-500">{errors.sort_order}</p>}
                </div>
            </div>

            {/* Active toggle */}
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="is_active"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Aktif (Ana sayfada göster)
                </label>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
                >
                    İptal
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
            </div>
        </form>
    );
}
