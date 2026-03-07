interface SliderNavigationProps {
    currentSlide: number;
    slideCount: number;
    onPrev: () => void;
    onNext: () => void;
    onDotClick: (index: number) => void;
    accentColor: string;
}

const SliderNavigation: React.FC<SliderNavigationProps> = ({
    currentSlide,
    slideCount,
    onPrev,
    onNext,
    onDotClick,
    accentColor,
}) => {
    return (
        <>
            {/* Left Arrow */}
            <button
                onClick={onPrev}
                aria-label="Önceki slayt"
                className="hero-arrow-btn hero-arrow-btn--left"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                >
                    <polyline points="15 18 9 12 15 6" />
                </svg>
            </button>

            {/* Right Arrow */}
            <button
                onClick={onNext}
                aria-label="Sonraki slayt"
                className="hero-arrow-btn hero-arrow-btn--right"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                >
                    <polyline points="9 18 15 12 9 6" />
                </svg>
            </button>

            {/* Dots */}
            <div className="hero-dots">
                {Array.from({ length: slideCount }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => onDotClick(i)}
                        aria-label={`Slayt ${i + 1}`}
                        className={`hero-dot ${i === currentSlide ? 'hero-dot--active' : ''}`}
                        style={i === currentSlide ? { background: accentColor, width: '28px' } : {}}
                    />
                ))}
            </div>
        </>
    );
};

export default SliderNavigation;
