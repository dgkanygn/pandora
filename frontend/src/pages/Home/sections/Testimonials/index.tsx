import { FaQuoteLeft, FaStar } from 'react-icons/fa';

const testimonials = [
    {
        id: 1,
        name: "Selin Yılmaz",
        role: "Müşteri",
        comment: "Sipariş verdiğim çiçekler fotoğraftakinden bile güzeldi! Teslimat hızı ve paketleme özenine hayran kaldım. Kesinlikle tavsiye ederim.",
        image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
        id: 2,
        name: "Ahmet Demir",
        role: "Müşteri",
        comment: "Eşimin doğum günü için aldığım orkide harikaydı. 1 haftadır hala ilk günkü tazeliğini koruyor. Teşekkürler Çiçeçim!",
        image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
        id: 3,
        name: "Zeynep Kaya",
        role: "Kurumsal Müşteri",
        comment: "Ofisimiz için düzenli çiçek aboneliği başlattık. Her hafta gelen taze çiçekler çalışma ortamımızın havasını değiştirdi.",
        image: "https://randomuser.me/api/portraits/women/68.jpg"
    }
];

const Testimonials: React.FC = () => {
    return (
        <section className="py-20 bg-gradient-to-br from-pink-50 to-white overflow-hidden relative">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-x-1/2 translate-y-1/2"></div>

            <div className="container mx-auto px-6 md:px-12 lg:px-24 xl:px-32 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-pink-600 font-bold uppercase text-xs tracking-wider mb-2 block">Mutlu Müşteriler</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Sizden Gelenler</h2>
                    <p className="text-gray-500 mt-4 max-w-2xl mx-auto">Müşterilerimizin deneyimleri bizim için en değerli referanstır.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial) => (
                        <div key={testimonial.id} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 relative group hover:-translate-y-1 transition-transform duration-300">
                            <FaQuoteLeft className="text-pink-100 text-5xl absolute top-6 left-6 -z-0 group-hover:text-pink-200 transition-colors" />
                            <div className="relative z-10">
                                <div className="flex gap-1 text-yellow-400 mb-4 text-sm">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} />
                                    ))}
                                </div>
                                <p className="text-gray-600 italic mb-6 leading-relaxed">"{testimonial.comment}"</p>
                                <div className="flex items-center gap-4">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-pink-100"
                                    />
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm">{testimonial.name}</h4>
                                        <span className="text-gray-400 text-xs">{testimonial.role}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
