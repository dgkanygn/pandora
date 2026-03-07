import { useState, useCallback, useEffect } from 'react';

interface UseSliderOptions {
    totalItems: number;
    /** Items visible at each breakpoint */
    slidesPerView?: {
        base: number;
        md: number;
        lg: number;
        xl?: number;
    };
}

interface UseSliderResult {
    currentIndex: number;
    canGoPrev: boolean;
    canGoNext: boolean;
    goNext: () => void;
    goPrev: () => void;
    visibleCount: number;
}

const getVisibleCount = (breakpoints: { base: number; md: number; lg: number; xl?: number }): number => {
    if (typeof window === 'undefined') return breakpoints.base;
    const width = window.innerWidth;
    if (width >= 1280 && breakpoints.xl) return breakpoints.xl;
    if (width >= 1024) return breakpoints.lg;
    if (width >= 768) return breakpoints.md;
    return breakpoints.base;
};

export function useSlider({
    totalItems,
    slidesPerView = { base: 1, md: 2, lg: 4 },
}: UseSliderOptions): UseSliderResult {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleCount, setVisibleCount] = useState(() => getVisibleCount(slidesPerView));

    // Listen for window resize to update visible count
    useEffect(() => {
        const handleResize = () => {
            setVisibleCount(getVisibleCount(slidesPerView));
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [slidesPerView.base, slidesPerView.md, slidesPerView.lg, slidesPerView.xl]);

    // Clamp currentIndex when visibleCount or totalItems changes
    useEffect(() => {
        const maxIndex = Math.max(0, totalItems - visibleCount);
        if (currentIndex > maxIndex) {
            setCurrentIndex(maxIndex);
        }
    }, [visibleCount, totalItems, currentIndex]);

    const maxIndex = Math.max(0, totalItems - visibleCount);
    const canGoPrev = currentIndex > 0;
    const canGoNext = currentIndex < maxIndex;

    const goNext = useCallback(() => {
        setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
    }, [maxIndex]);

    const goPrev = useCallback(() => {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }, []);

    return {
        currentIndex,
        canGoPrev,
        canGoNext,
        goNext,
        goPrev,
        visibleCount,
    };
}
