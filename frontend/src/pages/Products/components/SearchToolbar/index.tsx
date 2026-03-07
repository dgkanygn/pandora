import { FaFilter, FaSearch, FaSortAmountDown } from 'react-icons/fa';

interface SearchToolbarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    sortOption: string;
    setSortOption: (option: string) => void;
    onMobileFilterClick: () => void;
}

const SearchToolbar: React.FC<SearchToolbarProps> = ({
    searchQuery,
    setSearchQuery,
    sortOption,
    setSortOption,
    onMobileFilterClick
}) => {
    return (
        <div className="bg-white p-3 rounded-xl shadow-sm mb-4 flex flex-col sm:flex-row justify-between items-center gap-3">
            {/* Mobile Filter Toggle */}
            <button
                className="lg:hidden w-full sm:w-auto flex items-center justify-center gap-2 bg-pink-50 text-pink-700 px-4 py-2 rounded-lg font-bold text-sm cursor-pointer"
                onClick={onMobileFilterClick}
            >
                <FaFilter size={12} /> Filtrele
            </button>

            {/* Search */}
            <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400 text-sm" />
                </div>
                <input
                    type="text"
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Çiçek ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <FaSortAmountDown className="text-gray-400 hidden sm:block text-sm" />
                <select
                    className="w-full sm:w-auto border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white cursor-pointer"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                >
                    <option value="newest">En Yeniler</option>
                    <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
                    <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
                    <option value="name-asc">İsim: A-Z</option>
                    <option value="name-desc">İsim: Z-A</option>
                </select>
            </div>

            {/* Refresh Button */}
            {/* <button
                onClick={onRefresh}
                className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors cursor-pointer"
                title="Yenile"
            >
                <FaSync size={12} />
                <span className="hidden sm:inline">Yenile</span>
            </button> */}
        </div>
    );
};

export default SearchToolbar;
