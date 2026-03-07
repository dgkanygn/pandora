import { useState, useEffect } from 'react';
import { HiPencil, HiCheck, HiX } from 'react-icons/hi';

interface ContactCardProps {
    title: string;
    icon: React.ReactNode;
    value: string;
    onSave: (value: string) => Promise<void> | void;
    isTextArea?: boolean;
}

export default function ContactCard({
    title,
    icon,
    value,
    onSave,
    isTextArea = false,
}: ContactCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value);
    const [isSaving, setIsSaving] = useState(false);

    // Dışarıdan value güncellendiğinde edit buffer'ı senkronize et
    useEffect(() => {
        if (!isEditing) {
            setEditValue(value);
        }
    }, [value, isEditing]);

    const handleSave = async () => {
        const trimmed = editValue.trim();
        if (!trimmed) return;
        setIsSaving(true);
        try {
            await onSave(trimmed);
            setIsEditing(false);
        } catch {
            // hata toast'u parent tarafından gösterilir
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setEditValue(value);
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') handleCancel();
        if (e.key === 'Enter' && !isTextArea) handleSave();
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-50 p-2 rounded-lg">
                        {icon}
                    </div>
                    <h3 className="font-medium text-gray-900">{title}</h3>
                </div>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                        title="Düzenle"
                    >
                        <HiPencil className="w-5 h-5" />
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="space-y-3">
                    {isTextArea ? (
                        <textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            rows={3}
                            autoFocus
                            className="w-full text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 p-2 text-gray-900 outline-none resize-none"
                            placeholder={`${title} giriniz...`}
                        />
                    ) : (
                        <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            className="w-full text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 p-2 text-gray-900 outline-none"
                            placeholder={`${title} giriniz...`}
                        />
                    )}
                    <div className="flex items-center justify-end gap-2">
                        <button
                            onClick={handleCancel}
                            disabled={isSaving}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors cursor-pointer disabled:opacity-50"
                        >
                            <HiX className="w-4 h-4" />
                            İptal
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving || !editValue.trim() || editValue.trim() === value.trim()}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <HiCheck className="w-4 h-4" />
                            {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-gray-600 text-sm py-2">
                    {value ? (
                        <p className={isTextArea ? 'whitespace-pre-wrap' : 'break-words'}>{value}</p>
                    ) : (
                        <span className="text-gray-400 italic">Henüz bilgi eklenmemiş</span>
                    )}
                </div>
            )}
        </div>
    );
}
