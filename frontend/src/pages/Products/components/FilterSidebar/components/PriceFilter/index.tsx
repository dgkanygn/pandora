interface PriceFilterProps {
    maxPrice: string;
    setMaxPrice: (price: string) => void;
}

const PriceFilter: React.FC<PriceFilterProps> = ({ maxPrice, setMaxPrice }) => {
    return (
        <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Fiyat Aralığı</h3>
            <div>
                <label className="text-sm text-gray-600 block mb-2">Maksimum Fiyat</label>
                <div className="relative">
                    <input
                        type="number"
                        min="0"
                        placeholder="1000"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₺</span>
                </div>
            </div>
        </div>
    );
};

export default PriceFilter;
