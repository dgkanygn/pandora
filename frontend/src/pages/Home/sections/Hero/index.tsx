import { useHeroSlider } from './hooks/useHeroSlider';
import SlideContent from './components/SlideContent';
import SliderNavigation from './components/SliderNavigation';
import './styles/hero-slider.css';

const Hero: React.FC = () => {
    const {
        slides,
        isLoading,
        currentSlide,
        direction,
        goNext,
        goPrev,
        goToIndex,
        slideCount,
        onTouchStart,
        onTouchEnd
    } = useHeroSlider();

    if (isLoading) {
        return (
            <section className="hero-section relative bg-pink-50 overflow-hidden min-h-[500px] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            </section>
        );
    }

    if (!slides || slides.length === 0) {
        return null; // Return null or a fallback banner if no slides exist
    }

    return (
        <section
            className="hero-section relative bg-pink-50 overflow-hidden"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            {/* Decorative blobs */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2 animate-blob" />
            <div className="absolute top-0 right-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-x-1/2 -translate-y-1/2 animate-blob animation-delay-2000" />
            <div className="absolute -bottom-32 left-20 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />

            {/* Slider Images Background wrapper */}
            {slides.map((slide, i) => (
                <div
                    key={`bg-${slide.id}`}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    {/* Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center mb-[40px] md:mb-0"
                        style={{ backgroundImage: `url(${slide.backgroundImage})` }}
                    />
                    {/* Overlay to make text readable */}
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] mb-[40px] md:mb-0" />
                </div>
            ))}

            {/* Main content area */}
            <div className="container mx-auto px-6 md:px-12 lg:px-24 xl:px-32 py-16 md:py-20 flex flex-col items-center text-center relative z-10 min-h-[500px] justify-center">
                {slides.map((slide, i) => (
                    <SlideContent
                        key={slide.id}
                        slide={slide}
                        isActive={i === currentSlide}
                        direction={direction}
                    />
                ))}
            </div>

            {/* Navigation arrows + dots */}
            {slideCount > 1 && (
                <SliderNavigation
                    currentSlide={currentSlide}
                    slideCount={slideCount}
                    onPrev={goPrev}
                    onNext={goNext}
                    onDotClick={goToIndex}
                    accentColor={slides[currentSlide]?.accentColor || '#db2777'}
                />
            )}
        </section>
    );
};

export default Hero;
