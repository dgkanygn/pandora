interface ProductsHeaderProps {
    title?: string;
    subtitle?: string;
}

const ProductsHeader: React.FC<ProductsHeaderProps> = ({
    title = 'Tüm Çiçekler',
    subtitle = 'En taze çiçeklerimiz arasından dilediğinizi seçin.'
}) => {
    return (
        <div className="bg-white shadow-sm pt-24 pb-6">
            <div className="container mx-auto px-6 md:px-12 lg:px-24 xl:px-32">
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                <p className="text-gray-500 mt-1 text-sm">{subtitle}</p>
            </div>
        </div>
    );
};

export default ProductsHeader;
