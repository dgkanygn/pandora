import { useState, useEffect } from 'react';
import * as yup from 'yup';

interface NeighborhoodFormData {
    name: string;
    price: number;
}

interface NeighborhoodFormProps {
    initialData?: { id: string; name: string; price: number } | null;
    onSubmit: (data: NeighborhoodFormData) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

const validationSchema = yup.object().shape({
    name: yup.string()
        .required('Semt adı zorunludur')
        .max(100, 'Semt adı en fazla 100 karakter olabilir'),
    price: yup.number()
        .typeError('Fiyat sayı olmalıdır')
        .min(0, 'Fiyat 0 dan küçük olamaz')
        .required('Fiyat zorunludur'),
});

export default function NeighborhoodForm({ initialData, onSubmit, onCancel, isSubmitting }: NeighborhoodFormProps) {
    const [formData, setFormData] = useState<NeighborhoodFormData>({
        name: '',
        price: 0,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                price: initialData.price,
            });
        } else {
            setFormData({ name: '', price: 0 });
        }
        setErrors({});
    }, [initialData]);

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
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Semt Adı <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        className={`w-full rounded-lg border px-4 py-2 text-gray-900 bg-white focus:outline-none focus:ring-1 ${errors.name
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                            }`}
                        value={formData.name}
                        onChange={(e) => {
                            setFormData({ ...formData, name: e.target.value });
                            if (errors.name) setErrors({ ...errors, name: '' });
                        }}
                        maxLength={100}
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Ekstra Fiyat (TL) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        className={`w-full rounded-lg border px-4 py-2 text-gray-900 bg-white focus:outline-none focus:ring-1 ${errors.price
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                            }`}
                        value={formData.price}
                        onChange={(e) => {
                            setFormData({ ...formData, price: parseFloat(e.target.value) || 0 });
                            if (errors.price) setErrors({ ...errors, price: '' });
                        }}
                    />
                    <p className="mt-1 text-xs text-gray-500">Bu semte sipariş verilirken eklenecek ekstra ücret.</p>
                    {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
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
