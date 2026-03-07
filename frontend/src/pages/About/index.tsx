import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import logo from "@/assets/logos/logo.png";
import { useAbout } from './hooks/useAbout';

const About: React.FC = () => {
    const { data, isLoading } = useAbout();

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-white">
                <Navbar />
                <main className="flex-grow pt-24 flex items-center justify-center">
                    <div className="animate-pulse flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div>
                        <p className="mt-4 text-pink-600 font-medium">Yükleniyor...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />
            <main className="flex-grow pt-24">
                <section className="py-16 overflow-hidden">
                    <div className="container mx-auto px-6 md:px-12 lg:px-24 xl:px-32">
                        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
                            <div className="lg:w-1/2 relative order-2 lg:order-1">
                                <div className="absolute -top-10 -left-10 w-32 h-32 bg-pink-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-pulse"></div>
                                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-pulse animation-delay-2000"></div>
                                <img
                                    src={data?.image_url || logo}
                                    alt="About"
                                    className="relative rounded-xl w-full h-auto object-contain z-10 transform hover:scale-[1.01] transition-transform duration-500 max-h-[400px]"
                                />
                            </div>
                            <div className="lg:w-1/2 order-1 lg:order-2">
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4 leading-tight whitespace-pre-wrap">
                                    {data?.title || "2017'den Beri\nSevgiyle Büyüyoruz"}
                                </h2>
                                <div className="text-gray-600 text-base leading-relaxed mb-4 whitespace-pre-wrap">
                                    {data?.description || "Eskişehir'in en prestijli çiçekçisi. Özel tasarım buketler, premium çiçek aranjmanları ve unutulmaz anlar için mükemmel çözümler.\n\nHer özel anınız için mükemmel çiçek çözümleri sunuyoruz. Kaliteli hizmet ve taze çiçeklerle unutulmaz deneyimler yaşatıyoruz."}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default About;
