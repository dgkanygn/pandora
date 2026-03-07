import { useRef, useState } from 'react';
import { HiX, HiStar } from 'react-icons/hi';

export interface MediaItem {
    uid: string;
    file?: File;
    url: string;
    id?: number;
    isPrimary: boolean;
    status: 'existing' | 'new' | 'deleted';
}

interface ImageUploaderProps {
    mediaList: MediaItem[];
    onChange: (newList: MediaItem[]) => void;
    title?: string;
    subtitle?: string;
    maxSizeMB?: number;
    maxItems?: number; // e.g. maxItems=1 for single image mode
}

export default function ImageUploader({
    mediaList,
    onChange,
    title = 'Görseller',
    subtitle = 'Birden fazla görsel seçilebilir. Desteklenen formatlar: JPG, PNG, WebP, GIF.',
    maxSizeMB = 5,
    maxItems,
}: ImageUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isDragging, setIsDragging] = useState(false);

    const processFiles = (files: File[]) => {
        if (files.length === 0) return;

        // In single-image mode, only take the first file
        const selectedFiles = maxItems === 1 ? [files[0]] : files;

        // Optional file size check
        const validFiles = selectedFiles.filter(file => file.size <= maxSizeMB * 1024 * 1024);

        if (validFiles.length < selectedFiles.length) {
            alert(`Bazı dosyalar ${maxSizeMB}MB sınırını aştığı için eklenmedi.`);
        }

        if (validFiles.length === 0) return;

        const newItems: MediaItem[] = validFiles.map(file => {
            const url = URL.createObjectURL(file);
            return {
                uid: Math.random().toString(36).substring(7),
                file,
                url,
                isPrimary: false,
                status: 'new'
            };
        });

        // In single-image mode, replace existing items
        const base = maxItems === 1
            ? mediaList.map(m => m.status === 'existing' ? { ...m, status: 'deleted' as const } : null).filter(Boolean) as MediaItem[]
            : mediaList;

        const combined = [...base, ...newItems];
        // Make the very first undeleted item primary if there's no primary
        if (!combined.some(m => m.isPrimary && m.status !== 'deleted')) {
            const firstValid = combined.find(m => m.status !== 'deleted');
            if (firstValid) firstValid.isPrimary = true;
        }

        onChange(combined);

        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        processFiles(files);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const files = Array.from(e.dataTransfer.files);
            processFiles(files);
        }
    };

    const handleDeleteMedia = (uid: string) => {
        let newList = mediaList.map(m => {
            if (m.uid === uid) {
                if (m.status === 'existing') return { ...m, status: 'deleted' as const };
                return null; // new item, completely remove
            }
            return m;
        }).filter(Boolean) as MediaItem[];

        // Re-assign primary if deleted was primary
        const deletedWasPrimary = mediaList.find(m => m.uid === uid)?.isPrimary;
        if (deletedWasPrimary) {
            newList = newList.map(m => ({ ...m, isPrimary: false }));
            const firstValid = newList.find(m => m.status !== 'deleted');
            if (firstValid) firstValid.isPrimary = true;
        }

        onChange(newList);
    };

    const handleSetPrimary = (uid: string) => {
        const newList = mediaList.map(m => ({
            ...m,
            isPrimary: m.uid === uid
        }));
        onChange(newList);
    };

    const visibleList = mediaList.filter(m => m.status !== 'deleted');

    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">{title}</label>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                multiple={!maxItems || maxItems > 1}
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
                className="hidden"
            />

            <div
                className={`border-2 border-dashed rounded-xl p-6 transition-colors cursor-pointer text-center flex flex-col items-center justify-center min-h-[160px] ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-indigo-300'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                {visibleList.length === 0 ? (
                    <div className="flex flex-col items-center pointer-events-none">
                        <svg className="w-10 h-10 mb-3 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                        </svg>
                        <p className="mb-2 text-sm text-gray-600 font-medium">
                            <span className="text-indigo-600 font-semibold">Tıklayın</span> veya sürükleyip bırakın
                        </p>
                        <p className="text-xs text-gray-500">
                            SVG, PNG, JPG veya GIF (Max. {maxSizeMB}MB)
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-4 w-full justify-center sm:justify-start" onClick={(e) => e.stopPropagation()}>
                        {visibleList.map((media) => (
                            <div key={media.uid} className="relative flex flex-col items-center gap-2 group">
                                <div className={`relative w-28 h-28 rounded-xl overflow-hidden border-2 bg-white ${media.isPrimary ? 'border-yellow-400 shadow-md ring-2 ring-yellow-400/20' : 'border-gray-200'}`}>
                                    <img src={media.url} alt="Media" className="w-full h-full object-cover" />
                                    {media.isPrimary && (
                                        <div className="absolute top-1.5 left-1.5 bg-yellow-400 text-white rounded-full p-1 shadow">
                                            <HiStar size={14} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg shadow-sm p-1">
                                    {!media.isPrimary && (
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); handleSetPrimary(media.uid); }}
                                            className="p-1.5 text-gray-400 hover:bg-yellow-50 hover:text-yellow-500 rounded-md transition-colors cursor-pointer"
                                            title="Ana Görsel Yap"
                                        >
                                            <HiStar size={16} />
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); handleDeleteMedia(media.uid); }}
                                        className="p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-md transition-colors cursor-pointer border-l border-gray-100"
                                        title="Görseli Sil"
                                    >
                                        <HiX size={16} />
                                    </button>
                                </div>
                                {media.status === 'new' && (
                                    <span className="text-[10px] font-medium px-1.5 py-0.5 bg-green-100 text-green-700 rounded absolute -top-2 -right-2 z-10 shadow-sm border border-green-200 pointer-events-none">YENİ</span>
                                )}
                            </div>
                        ))}
                        {(!maxItems || visibleList.length < maxItems) && (
                            <div
                                className="flex flex-col items-center justify-center w-28 h-28 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400 hover:text-indigo-500 hover:border-indigo-400 hover:bg-gray-100 transition-colors cursor-pointer"
                                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                            >
                                <svg className="w-8 h-8 mb-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                </svg>
                                <span className="text-xs font-medium">Ekle</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {subtitle && (
                <p className="text-xs text-gray-500 mt-2">
                    {subtitle} Lütfen değişikliklerin sunucuya aktarılması için KAYDET butonuna basmayı unutmayın.
                </p>
            )}
        </div>
    );
}
