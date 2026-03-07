import { FaShippingFast, FaAward, FaBox, FaLeaf } from 'react-icons/fa';


const features = [
    {
        icon: <FaShippingFast size={32} />,
        title: "Hızlı Teslimat",
        description: "Eskişehir içi aynı gün teslimat ile sevdiklerinizi bekletmeyin."
    },
    {
        icon: <FaAward size={32} />,
        title: "Kalite Garantisi",
        description: "Her zaman en taze ve en kaliteli çiçekleri özenle seçiyoruz."
    },
    {
        icon: <FaBox size={32} />,
        title: "Güvenli Paketleme",
        description: "Çiçekleriniz zarar görmeden, özel korumalı ve şık kutularda güvenle teslim edilir."
    },
    {
        icon: <FaLeaf size={32} />,
        title: "%100 Doğal",
        description: "Sürdürülebilir kaynaklardan elde edilen doğal çiçekler."
    }
];

const Features: React.FC = () => {
    return (
        <section className="py-20 bg-pink-50/50">
            <div className="container mx-auto px-6 md:px-12 lg:px-24 xl:px-32">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Neden Pandora?</h2>
                    <p className="text-gray-600">
                        Size ve sevdiklerinize en iyi deneyimi sunmak için tutkuyla çalışıyoruz. İşte bizi tercih etmeniz için birkaç neden.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 text-center group border border-gray-100">
                            <div className="inline-flex p-4 rounded-full bg-pink-50 text-pink-600 mb-6 group-hover:scale-110 group-hover:bg-pink-600 group-hover:text-white transition-all duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
