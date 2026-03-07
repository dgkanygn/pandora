import { FaExclamationTriangle } from 'react-icons/fa';

interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="bg-red-50 p-4 rounded-full mb-4">
                <FaExclamationTriangle className="text-3xl text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Bir hata oluştu</h3>
            <p className="text-gray-500 text-sm mb-6 max-w-md">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="bg-pink-600 text-white px-6 py-2 rounded-full font-medium hover:bg-pink-700 transition"
                >
                    Tekrar Dene
                </button>
            )}
        </div>
    );
};

export default ErrorMessage;
