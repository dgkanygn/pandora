import { FaSpinner } from 'react-icons/fa';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
    fullScreen?: boolean;
}

const sizeClasses = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl',
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    text = 'Yükleniyor...',
    fullScreen = false,
}) => {
    const content = (
        <div className="flex flex-col items-center justify-center gap-4">
            <FaSpinner className={`${sizeClasses[size]} text-pink-500 animate-spin`} />
            {text && <p className="text-gray-500 text-sm font-medium">{text}</p>}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
                {content}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center py-20">
            {content}
        </div>
    );
};

export default LoadingSpinner;
