interface ProductCountProps {
    count: number;
    isLoading: boolean;
}

const ProductCount: React.FC<ProductCountProps> = ({ count, isLoading }) => {
    if (isLoading) {
        return null;
    }

    return (
        <div className="mb-4 text-sm text-gray-500">
            Toplam {count} ürün gösteriliyor
        </div>
    );
};

export default ProductCount;
