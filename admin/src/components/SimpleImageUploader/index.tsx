import React, { useRef, useState } from 'react';

interface SimpleImageUploaderProps {
    imagePreview: string | null;
    onChange: (file: File | null, preview: string | null) => void;
    label?: string;
    recommendedText?: string;
    description?: string;
    accept?: string;
}

export default function SimpleImageUploader({
    imagePreview,
    onChange,
    label = "Görsel",
    recommendedText = "",
    description = "PNG, JPG, WEBP veya GIF yükleyebilirsiniz. Max: 5MB.",
    accept = "image/jpeg,image/png,image/webp,image/gif"
}: SimpleImageUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const processFile = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            onChange(file, reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processFile(file);
        }
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
        const file = e.dataTransfer.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const handleRemoveImage = () => {
        onChange(null, null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
                {label}
                {recommendedText && (
                    <span className="ml-2 px-2 py-0.5 rounded text-xs font-normal bg-gray-100 text-gray-500">
                        {recommendedText}
                    </span>
                )}
            </label>

            <input
                type="file"
                accept={accept}
                onChange={handleImageChange}
                ref={fileInputRef}
                className="hidden"
            />

            <div
                className={`w-full flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors min-h-[160px] ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-indigo-300'
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                {imagePreview ? (
                    <div className="relative w-40 h-40 rounded-xl overflow-hidden border border-gray-200 shadow-sm" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm cursor-pointer"
                                title="Görseli Kaldır"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center pointer-events-none">
                        <svg className="w-10 h-10 mb-3 text-gray-400 group-hover:text-indigo-500 transition-colors" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                        </svg>
                        <p className="mb-2 text-sm text-gray-600 font-medium">
                            <span className="text-indigo-600 font-semibold">Tıklayın</span> veya sürükleyip bırakın
                        </p>
                        {description && (
                            <p className="text-xs text-gray-500">
                                {description}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
