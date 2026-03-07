import { Link } from 'react-router-dom';
import type { HomepageSlide } from '../../../../../../services/api';

interface SlideContentProps {
    slide: HomepageSlide;
    isActive: boolean;
    direction: 'left' | 'right';
}

const SlideContent: React.FC<SlideContentProps> = ({ slide, isActive, direction }) => {
    const enterClass = isActive
        ? direction === 'left'
            ? 'hero-slide-enter-left'
            : 'hero-slide-enter-right'
        : '';

    return (
        <div
            className={`hero-slide-content ${enterClass}`}
            style={{ display: isActive ? 'flex' : 'none', flexDirection: 'column', alignItems: 'center' }}
        >
            {/* Badge */}
            <span
                className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-5 tracking-wide"
                style={{ background: slide.accentColor + '20', color: slide.accentColor }}
            >
                {slide.badge}
            </span>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight text-center">
                {slide.title} <br />
                <span style={{ color: slide.accentColor }}>{slide.titleHighlight}</span>
            </h1>

            {/* Description */}
            <p className="text-base md:text-lg text-gray-600 mb-8 max-w-xl text-center">
                {slide.description}
            </p>

            {/* Buttons */}
            <div className="flex gap-4 flex-wrap justify-center">
                <Link
                    to={slide.primaryButton.to}
                    className="text-white px-6 py-3 rounded-full font-semibold text-base transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    style={{ background: slide.accentColor }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                    {slide.primaryButton.label}
                </Link>
                <Link
                    to={slide.secondaryButton.to}
                    className="bg-white px-6 py-3 rounded-full font-semibold text-base border-2 hover:bg-pink-50 transition shadow-md hover:shadow-lg"
                    style={{ color: slide.accentColor, borderColor: slide.accentColor + '40' }}
                >
                    {slide.secondaryButton.label}
                </Link>
            </div>
        </div>
    );
};

export default SlideContent;
