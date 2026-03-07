import { HiX } from 'react-icons/hi';

interface DetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    type: 'image' | 'content';
    content: string;
}

export default function DetailModal({ isOpen, onClose, title, type, content }: DetailModalProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className={`relative bg-white rounded-2xl shadow-2xl overflow-hidden ${type === 'image' ? 'max-w-3xl' : 'max-w-2xl w-full max-h-[80vh]'
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-900 truncate pr-4">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                        <HiX size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className={type === 'image' ? 'p-2' : 'p-6 overflow-y-auto max-h-[60vh]'}>
                    {type === 'image' ? (
                        <img
                            src={content}
                            alt={title}
                            className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                        />
                    ) : (
                        <div className="prose prose-sm max-w-none">
                            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{content}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
