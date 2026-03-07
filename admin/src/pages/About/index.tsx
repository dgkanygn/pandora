import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { aboutAPI } from '../../services/about';
import type { AboutInfo } from '../../services/about';
import { HiOutlineInformationCircle } from 'react-icons/hi';
import SimpleImageUploader from '../../components/SimpleImageUploader';
import * as yup from 'yup';

const aboutSchema = yup.object().shape({
    title: yup.string()
        .required('Başlık alanı zorunludur.')
        .max(100, 'Başlık en fazla 100 karakter olabilir.'),
    description: yup.string()
        .required('Açıklama alanı zorunludur.')
        .max(2000, 'Açıklama en fazla 2000 karakter olabilir.'),
});

export default function About() {
    const [about, setAbout] = useState<AboutInfo>({
        id: null,
        title: '',
        description: '',
        image_url: null,
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        aboutAPI.get()
            .then((data) => {
                setAbout(data);
                if (data.image_url) {
                    setPreviewUrl(data.image_url);
                }
            })
            .catch(() => toast.error('Hakkımızda bilgileri yüklenemedi.'))
            .finally(() => setIsLoading(false));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await aboutSchema.validate({ title: about.title, description: about.description });
        } catch (err) {
            if (err instanceof yup.ValidationError) {
                toast.error(err.message);
                return;
            }
        }

        setIsSaving(true);

        try {
            const formData = new FormData();
            formData.append('title', about.title);
            formData.append('description', about.description);

            if (selectedFile) {
                formData.append('image', selectedFile);
            }

            const result = await aboutAPI.update(formData);
            setAbout(result);

            if (result.image_url) {
                setPreviewUrl(result.image_url);
            }

            // Reset file selection after successful upload
            setSelectedFile(null);

            toast.success('Hakkımızda sayfası güncellendi.');
        } catch (error) {
            toast.error('Hakkımızda bilgisi güncellenirken hata oluştu.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageChange = (file: File | null, preview: string | null) => {
        setSelectedFile(file);
        setPreviewUrl(preview);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 pb-20 sm:pb-6 max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Hakkımızda Sayfası</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Sitenizin "Hakkımızda" bölümünde yer alan başlık, açıklama ve görseli buradan düzenleyebilirsiniz.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Başlık
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={about.title}
                            onChange={(e) => setAbout({ ...about, title: e.target.value })}
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                            placeholder="Zarafet Çiçekçilik Kimdir?"
                            maxLength={100}
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Açıklama / Metin
                        </label>
                        <textarea
                            id="description"
                            rows={8}
                            value={about.description}
                            onChange={(e) => setAbout({ ...about, description: e.target.value })}
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                            placeholder="Hikayenizi buraya yazın..."
                            maxLength={2000}
                        />
                    </div>

                    {/* Görsel */}
                    <SimpleImageUploader
                        imagePreview={previewUrl}
                        onChange={handleImageChange}
                        label="Görsel"
                        recommendedText=""
                        description="SVG, PNG, JPG veya GIF (Max. 5MB)"
                        accept="image/*"
                    />
                </div>

                <div className="bg-gray-50 p-6 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="cursor-pointer inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSaving ? (
                            <>
                                <span className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white rounded-full border-t-transparent"></span>
                                Kaydediliyor...
                            </>
                        ) : (
                            'Değişiklikleri Kaydet'
                        )}
                    </button>
                </div>
            </form>

            <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100 flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-lg mt-0.5">
                    <HiOutlineInformationCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                    <h3 className="font-medium text-blue-900">Neden düzenli bir Hakkımızda sayfası önemli?</h3>
                    <p className="text-sm text-blue-700 mt-1">
                        Arama motorları (SEO) ve müşterileriniz için işletmenizin güvenilirliğini artıran en önemli sayfalardan biridir. Anlaşılır bir metin ve ilgi çekici bir fotoğraf kullanarak dönüşüm oranınızı artırabilirsiniz.
                    </p>
                </div>
            </div>
        </div>
    );
}
