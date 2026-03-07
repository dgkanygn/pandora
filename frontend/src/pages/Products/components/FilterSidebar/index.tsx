import { FaFilter, FaTimes } from 'react-icons/fa';
import CategoryFilter from './components/CategoryFilter';
import PriceFilter from './components/PriceFilter';
import FilterActions from './components/FilterActions';
import useScrollLock from './hooks/useScrollLock';

interface Category {
    name: string;
    slug: string;
}

interface FilterSidebarProps {
    categories: Category[];
    selectedCategories: string[];
    setSelectedCategories: (categories: string[]) => void;
    maxPrice: string;
    setMaxPrice: (price: string) => void;
    onFilter: () => void;
    onClear: () => void;
    isOpen: boolean;
    onClose: () => void;
    isLoading?: boolean;
    isFiltered: boolean;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
    categories,
    selectedCategories,
    setSelectedCategories,
    maxPrice,
    setMaxPrice,
    onFilter,
    onClear,
    isOpen,
    onClose,
    isLoading = false,
    isFiltered
}) => {
    // Disable scroll when sidebar is open on mobile
    useScrollLock(isOpen);

    const handleCategoryChange = (category: string) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter(c => c !== category));
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    const canFilter = selectedCategories.length > 0 || maxPrice !== '';

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                ></div>
            )}

            {/* Sticky wrapper for desktop */}
            <div className="hidden lg:block sticky top-24">
                <aside className="bg-white rounded-xl shadow-sm p-6">
                    <CategoryFilter
                        categories={categories}
                        selectedCategories={selectedCategories}
                        onCategoryChange={handleCategoryChange}
                    />

                    <PriceFilter
                        maxPrice={maxPrice}
                        setMaxPrice={setMaxPrice}
                    />

                    <FilterActions
                        onFilter={onFilter}
                        onClear={onClear}
                        isLoading={isLoading}
                        canFilter={canFilter}
                        canClear={isFiltered}
                    />
                </aside>
            </div>

            {/* Mobile Sidebar */}
            <aside className={`
                lg:hidden fixed top-0 left-0 z-50 h-full w-80 bg-white p-6 
                shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <FaFilter className="text-pink-600" /> Filtreler
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-red-500 cursor-pointer">
                        <FaTimes size={24} />
                    </button>
                </div>

                <CategoryFilter
                    categories={categories}
                    selectedCategories={selectedCategories}
                    onCategoryChange={handleCategoryChange}
                />

                <PriceFilter
                    maxPrice={maxPrice}
                    setMaxPrice={setMaxPrice}
                />

                <FilterActions
                    onFilter={() => {
                        onFilter();
                        onClose();
                    }}
                    onClear={() => {
                        onClear();
                        onClose();
                    }}
                    isLoading={isLoading}
                    canFilter={canFilter}
                    canClear={isFiltered}
                />
            </aside>
        </>
    );
};

export default FilterSidebar;
