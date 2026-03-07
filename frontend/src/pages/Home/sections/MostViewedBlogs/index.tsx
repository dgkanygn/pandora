import { useMostViewedBlogs } from '@/hooks/useBlogs';
import type { BlogPost } from '@/services/api';
import SectionLayout from '../../components/SectionLayout';
import BlogCard from '@/components/BlogCard';

const MostViewedBlogs: React.FC = () => {
    const { blogs, loading, error } = useMostViewedBlogs(4);

    return (
        <SectionLayout
            sectionTitle="Çok Okunanlar"
            mainTitle="En Çok Okunan Blog Yazıları"
            linkTo="/blog"
            linkLabel="Tümünü İncele"
            loading={loading}
            error={error}
            emptyMessage="Henüz blog yazısı eklenmemiş."
            errorMessage="Blog yazıları yüklenirken bir hata oluştu."
            totalItems={blogs.length}
            slidesPerView={{ base: 1, md: 2, lg: 3 }}
            renderItems={(_currentIndex, visibleCount) =>
                blogs.map((post: BlogPost) => (
                    <div
                        key={post.id}
                        className="flex-shrink-0 px-3"
                        style={{ width: `${100 / visibleCount}%` }}
                    >
                        <BlogCard post={post} />
                    </div>
                ))
            }
        />
    );
};

export default MostViewedBlogs;
