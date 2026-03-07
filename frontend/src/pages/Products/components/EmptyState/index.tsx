interface EmptyStateProps {
    onClearFilters: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onClearFilters }) => {
    return (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <div className="text-6xl mb-4">🌺</div>
            <h3 className="text-xl font-bold text-gray-900">Üzgünüz, sonuç bulunamadı.</h3>
            <p className="text-gray-500 mt-2">Lütfen filtrelerinizi değiştirip tekrar deneyin.</p>
            <button
                onClick={onClearFilters}
                className="mt-6 text-pink-600 font-bold hover:underline cursor-pointer"
            >
                Tüm filtreleri temizle
            </button>
        </div>
    );
};

export default EmptyState;
