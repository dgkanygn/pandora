import React from 'react';

interface Category {
    name: string;
    slug: string;
}

interface CategoryFilterProps {
    categories: Category[];
    selectedCategories: string[];
    onCategoryChange: (slug: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
    categories,
    selectedCategories,
    onCategoryChange,
}) => {
    return (
        <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Kategoriler</h3>
            {categories.length === 0 ? (
                <p className="text-sm text-gray-400 italic">Kategori bulunamadı</p>
            ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
                {categories.map((category) => (
                    <label
                        key={category.slug}
                        className="flex items-center gap-3 px-2 py-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                    >
                        <div className={`
                            w-5 h-5 rounded border flex items-center justify-center transition-colors
                            ${selectedCategories.includes(category.slug)
                                ? 'bg-pink-600 border-pink-600'
                                : 'border-gray-300 bg-white'
                            }
                        `}>
                            {selectedCategories.includes(category.slug) && (
                                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                        <input
                            type="checkbox"
                            className="hidden"
                            checked={selectedCategories.includes(category.slug)}
                            onChange={() => onCategoryChange(category.slug)}
                        />
                        <span className={`text-sm ${selectedCategories.includes(category.slug) ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                            {category.name}
                        </span>
                    </label>
                ))}
            </div>
            )}
        </div>
    );
};

export default CategoryFilter;
