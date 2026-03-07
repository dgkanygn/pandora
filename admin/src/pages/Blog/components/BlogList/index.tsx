import { useState } from 'react';
import { HiPencil, HiTrash, HiPhotograph, HiDocumentText } from 'react-icons/hi';
import DetailModal from '../../../../components/DetailModal';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    cover_image?: string;
    is_published: boolean;
    created_at: string;
}

interface BlogListProps {
    posts: BlogPost[];
    onDelete: (id: string) => void;
    onEdit: (post: BlogPost) => void;
    hasMore: boolean;
    isLoadingMore: boolean;
    onLoadMore: () => void;
}

export default function BlogList({ posts, onDelete, onEdit, hasMore, isLoadingMore, onLoadMore }: BlogListProps) {
    const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);
    const [previewContent, setPreviewContent] = useState<{ content: string; title: string } | null>(null);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    // Truncate content
    const truncateContent = (content: string, maxLength: number = 80) => {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength).trim() + '...';
    };

    // Empty state
    if (posts.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <p className="text-gray-500">Henüz blog yazısı bulunmuyor.</p>
            </div>
        );
    }

    return (
        <>
            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3 w-20">Kapak</th>
                                <th scope="col" className="px-6 py-3">Başlık</th>
                                <th scope="col" className="px-6 py-3 max-w-xs">İçerik</th>
                                <th scope="col" className="px-6 py-3">Tarih</th>
                                <th scope="col" className="px-6 py-3">Durum</th>
                                <th scope="col" className="px-6 py-3 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 border-t border-gray-200">
                            {posts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                                    {/* Cover Image */}
                                    <td className="px-6 py-4 w-20">
                                        {post.cover_image ? (
                                            <button
                                                onClick={() => setPreviewImage({ url: post.cover_image!, title: post.title })}
                                                className="group relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 hover:ring-2 hover:ring-indigo-500 transition-all cursor-pointer"
                                            >
                                                <img
                                                    src={post.cover_image}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                    <HiPhotograph className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
                                                </div>
                                            </button>
                                        ) : (
                                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                                                <HiPhotograph className="text-gray-400" size={20} />
                                            </div>
                                        )}
                                    </td>
                                    {/* Title */}
                                    <td className="px-6 py-4">
                                        <div>
                                            <span className="font-medium text-gray-900">{post.title}</span>
                                            <p className="text-xs text-gray-400 mt-0.5">/{post.slug}</p>
                                        </div>
                                    </td>
                                    {/* Content */}
                                    <td className="px-6 py-4 max-w-xs">
                                        <button
                                            onClick={() => setPreviewContent({ content: post.content, title: post.title })}
                                            className="text-left group hover:text-indigo-600 transition-colors cursor-pointer"
                                        >
                                            <span className="text-gray-500 group-hover:text-indigo-600 line-clamp-2">
                                                {truncateContent(post.content)}
                                            </span>
                                            <span className="text-xs text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 mt-1">
                                                <HiDocumentText size={12} /> Tamamını gör
                                            </span>
                                        </button>
                                    </td>
                                    {/* Date */}
                                    <td className="px-6 py-4">
                                        <span className="text-gray-500 text-sm">{formatDate(post.created_at)}</span>
                                    </td>
                                    {/* Status */}
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${post.is_published
                                                ? 'bg-green-50 text-green-700 ring-green-600/20'
                                                : 'bg-yellow-50 text-yellow-700 ring-yellow-600/20'
                                                }`}
                                        >
                                            {post.is_published ? 'Yayında' : 'Taslak'}
                                        </span>
                                    </td>
                                    {/* Actions */}
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-3">
                                            <button
                                                onClick={() => onEdit(post)}
                                                className="text-indigo-600 hover:text-indigo-900 cursor-pointer p-1 rounded-lg hover:bg-indigo-50 transition-colors"
                                                title="Düzenle"
                                            >
                                                <HiPencil size={20} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(post.id)}
                                                className="text-red-600 hover:text-red-900 cursor-pointer p-1 rounded-lg hover:bg-red-50 transition-colors"
                                                title="Sil"
                                            >
                                                <HiTrash size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Load More / End Message */}
            <div className="flex justify-center py-4">
                {hasMore ? (
                    <button
                        onClick={onLoadMore}
                        disabled={isLoadingMore}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md cursor-pointer"
                    >
                        {isLoadingMore ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Yükleniyor...
                            </>
                        ) : (
                            'Daha Fazla Yükle'
                        )}
                    </button>
                ) : (
                    <div className="flex items-center gap-2 text-gray-500 bg-gray-100 px-4 py-2 rounded-lg">
                        <span className="text-sm">Tüm veriler yüklendi</span>
                        <span className="text-xs text-gray-400">({posts.length} kayıt)</span>
                    </div>
                )}
            </div>

            {/* Image Preview Modal */}
            <DetailModal
                isOpen={!!previewImage}
                onClose={() => setPreviewImage(null)}
                title={previewImage?.title || ''}
                type="image"
                content={previewImage?.url || ''}
            />

            {/* Content Preview Modal */}
            <DetailModal
                isOpen={!!previewContent}
                onClose={() => setPreviewContent(null)}
                title={previewContent?.title || ''}
                type="content"
                content={previewContent?.content || ''}
            />
        </>
    );
}
