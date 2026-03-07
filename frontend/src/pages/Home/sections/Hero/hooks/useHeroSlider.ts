import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../../../../../services/api';
import type { HomepageSlide } from '../../../../../services/api';

const AUTO_PLAY_INTERVAL = 5000;
const SWIPE_THRESHOLD = 50; // px

export const useHeroSlider = () => {
    const [slides, setSlides] = useState<HomepageSlide[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [direction, setDirection] = useState<'left' | 'right'>('left');

    const fetchSlides = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await api.homepageSlides.getSlides();
            if (data.slides && data.slides.length > 0) {
                setSlides(data.slides);
            } else {
                setSlides([]);
            }
        } catch (err: any) {
            setError(err.message || 'Slaytlar yüklenirken bir hata oluştu');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSlides();
    }, [fetchSlides]);

    const slideCount = slides.length;

    const goToSlide = useCallback((index: number, dir: 'left' | 'right') => {
        if (isAnimating || slideCount <= 1) return;
        setIsAnimating(true);
        setDirection(dir);
        setCurrentSlide(index);
        setTimeout(() => setIsAnimating(false), 500);
    }, [isAnimating, slideCount]);

    const goNext = useCallback(() => {
        if (slideCount <= 1) return;
        const nextIndex = (currentSlide + 1) % slideCount;
        goToSlide(nextIndex, 'left');
    }, [currentSlide, goToSlide, slideCount]);

    const goPrev = useCallback(() => {
        if (slideCount <= 1) return;
        const prevIndex = (currentSlide - 1 + slideCount) % slideCount;
        goToSlide(prevIndex, 'right');
    }, [currentSlide, goToSlide, slideCount]);

    useEffect(() => {
        if (slideCount <= 1) return;
        const timer = setInterval(() => {
            goNext();
        }, AUTO_PLAY_INTERVAL);
        return () => clearInterval(timer);
    }, [goNext, slideCount]);

    const goToIndex = useCallback((index: number) => {
        if (index === currentSlide || isAnimating || slideCount <= 1) return;
        const dir = index > currentSlide ? 'left' : 'right';
        goToSlide(index, dir);
    }, [currentSlide, isAnimating, goToSlide, slideCount]);

    // Touch / swipe support
    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);

    const onTouchStart = useCallback((e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
    }, []);

    const onTouchEnd = useCallback((e: React.TouchEvent) => {
        if (touchStartX.current === null || touchStartY.current === null || slideCount <= 1) return;

        const deltaX = touchStartX.current - e.changedTouches[0].clientX;
        const deltaY = Math.abs(touchStartY.current - e.changedTouches[0].clientY);

        // Ignore mostly-vertical swipes so page scroll still works
        if (Math.abs(deltaX) < SWIPE_THRESHOLD || deltaY > Math.abs(deltaX)) {
            touchStartX.current = null;
            touchStartY.current = null;
            return;
        }

        if (deltaX > 0) {
            goNext(); // swipe left → next
        } else {
            goPrev(); // swipe right → prev
        }

        touchStartX.current = null;
        touchStartY.current = null;
    }, [goNext, goPrev, slideCount]);

    return {
        slides,
        isLoading,
        error,
        currentSlide,
        direction,
        isAnimating,
        goNext,
        goPrev,
        goToIndex,
        slideCount,
        onTouchStart,
        onTouchEnd,
    };
};

