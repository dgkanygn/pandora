import { Link } from 'react-router-dom';
import { type BlogPost } from '@/services/api';
import { FaCalendarAlt } from 'react-icons/fa';

import blogPlaceholder from '@/assets/placeholders/blog_post.png';

interface BlogCardProps {
    post: BlogPost;
}

// Helper to format date
const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    } catch {
        return dateString;
    }
};

// Helper to create excerpt from content
const createExcerpt = (content: string, maxLength: number = 120): string => {
    if (!content) return '';
    // Strip HTML tags if any
    const plainText = content.replace(/<[^>]*>/g, '');
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength).trim() + '...';
};

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
    const imageUrl = post.cover_image || blogPlaceholder;
    const displayDate = formatDate(post.published_at || post.created_at);
    const excerpt = createExcerpt(post.content);

    return (
        <article className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100">
            <Link to={`/blog/${post.slug}`} className="block relative aspect-[4/3] overflow-hidden">
                <img
                    src={imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = blogPlaceholder;
                    }}
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
            </Link>
            <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1"><FaCalendarAlt /> {displayDate}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 leading-snug group-hover:text-pink-600 transition-colors">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-grow">
                    {excerpt}
                </p>
                <Link to={`/blog/${post.slug}`} className="text-pink-600 font-bold text-sm hover:underline inline-flex items-center gap-1 self-start mt-auto">
                    Devamını Oku &rarr;
                </Link>
            </div>
        </article>
    );
};

export default BlogCard;
