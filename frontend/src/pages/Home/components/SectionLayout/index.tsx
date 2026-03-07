import React from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useSlider } from './hooks/useSlider';

interface SectionLayoutProps {
    /** Optional ID for navigation anchor */
    id?: string;
    /** Small uppercase label above the main title (e.g. "Taptaze Gelenler") */
    sectionTitle: string;
    /** Large heading (e.g. "En Son Eklenen Ürünler") */
    mainTitle: string;
    /** "Tümünü İncele" link destination */
    linkTo: string;
    /** Link label text — defaults to "Tümünü İncele" */
    linkLabel?: string;
    /** Loading state */
    loading: boolean;
    /** Error state */
    error: string | null;
    /** Empty state message */
    emptyMessage: string;
    /** Error state message */
    errorMessage: string;
    /** Total number of items (for slider logic) */
    totalItems: number;
    /** Slides visible per breakpoint */
    slidesPerView?: { base: number; md: number; lg: number; xl?: number };
    /** Render function for items — receives currentIndex and visibleCount */
    renderItems: (currentIndex: number, visibleCount: number) => React.ReactNode;
}

const SectionLayout: React.FC<SectionLayoutProps> = ({
    sectionTitle,
    id,
    mainTitle,
    linkTo,
    linkLabel = 'Tümünü İncele',
    loading,
    error,
    emptyMessage,
    errorMessage,
    totalItems,
    slidesPerView = { base: 1, md: 2, lg: 4 },
    renderItems,
}) => {
    const { currentIndex, canGoPrev, canGoNext, goNext, goPrev, visibleCount } = useSlider({
        totalItems,
        slidesPerView,
    });

    return (
        <section id={id} className="py-16 bg-white overflow-hidden">
            <div className="container mx-auto px-6 md:px-12 lg:px-24 xl:px-32">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10">
                    <div>
                        <span className="text-pink-600 font-bold uppercase text-xs tracking-wider mb-2 block">
                            {sectionTitle}
                        </span>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                            {mainTitle}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                        {/* Navigation Arrows — only show when there are items */}
                        {!loading && !error && totalItems > 0 && (
                            <div className="hidden md:flex items-center gap-2">
                                <button
                                    onClick={goPrev}
                                    disabled={!canGoPrev}
                                    className={`p-2.5 rounded-full border transition-all cursor-pointer ${canGoPrev
                                        ? 'border-gray-300 text-gray-600 hover:bg-pink-600 hover:text-white hover:border-pink-600'
                                        : 'border-gray-200 text-gray-300 cursor-not-allowed'
                                        }`}
                                    aria-label="Önceki"
                                >
                                    <FaChevronLeft size={14} />
                                </button>
                                <button
                                    onClick={goNext}
                                    disabled={!canGoNext}
                                    className={`p-2.5 rounded-full border transition-all cursor-pointer ${canGoNext
                                        ? 'border-gray-300 text-gray-600 hover:bg-pink-600 hover:text-white hover:border-pink-600'
                                        : 'border-gray-200 text-gray-300 cursor-not-allowed'
                                        }`}
                                    aria-label="Sonraki"
                                >
                                    <FaChevronRight size={14} />
                                </button>
                            </div>
                        )}

                        <Link
                            to={linkTo}
                            className="hidden md:inline-block text-gray-500 hover:text-pink-600 transition text-sm font-medium cursor-pointer"
                        >
                            {linkLabel} &rarr;
                        </Link>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <LoadingSpinner size="sm" text="Yükleniyor..." />
                ) : error ? (
                    <p className="text-center text-gray-500 py-8">{errorMessage}</p>
                ) : totalItems === 0 ? (
                    <p className="text-center text-gray-500 py-8">{emptyMessage}</p>
                ) : (
                    <div className="relative">
                        {/* Mobile prev button */}
                        {canGoPrev && (
                            <button
                                onClick={goPrev}
                                className="md:hidden absolute -left-3 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm shadow-lg p-2 rounded-full border border-gray-200 text-gray-600 hover:bg-pink-600 hover:text-white hover:border-pink-600 transition-all cursor-pointer"
                                aria-label="Önceki"
                            >
                                <FaChevronLeft size={12} />
                            </button>
                        )}

                        {/* Slider Track */}
                        <div className="overflow-hidden">
                            <div
                                className="flex transition-transform duration-500 ease-in-out"
                                style={{
                                    transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
                                }}
                            >
                                {renderItems(currentIndex, visibleCount)}
                            </div>
                        </div>

                        {/* Mobile next button */}
                        {canGoNext && (
                            <button
                                onClick={goNext}
                                className="md:hidden absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm shadow-lg p-2 rounded-full border border-gray-200 text-gray-600 hover:bg-pink-600 hover:text-white hover:border-pink-600 transition-all cursor-pointer"
                                aria-label="Sonraki"
                            >
                                <FaChevronRight size={12} />
                            </button>
                        )}
                    </div>
                )}

                {/* Mobile "Tümünü İncele" link */}
                <div className="mt-8 text-center md:hidden">
                    <Link
                        to={linkTo}
                        className="text-pink-600 font-semibold hover:text-pink-700 transition text-sm cursor-pointer"
                    >
                        {linkLabel} &rarr;
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default SectionLayout;
