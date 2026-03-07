import React from 'react';

interface FilterActionsProps {
    onFilter: () => void;
    onClear: () => void;
    isLoading: boolean;
    canFilter: boolean;
    canClear: boolean;
}

const FilterActions: React.FC<FilterActionsProps> = ({
    onFilter,
    onClear,
    isLoading,
    canFilter,
    canClear
}) => {
    return (
        <div className="flex flex-col gap-3">
            <button
                onClick={onFilter}
                disabled={isLoading || !canFilter}
                className="w-full bg-pink-600 text-white py-2.5 rounded-lg font-medium hover:bg-pink-700 transition-colors shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Yükleniyor...
                    </>
                ) : (
                    'Filtrele'
                )}
            </button>
            <button
                onClick={onClear}
                disabled={isLoading || !canClear}
                className="w-full bg-white text-gray-700 border border-gray-200 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                Filtreyi Temizle
            </button>
        </div>
    );
};

export default FilterActions;
