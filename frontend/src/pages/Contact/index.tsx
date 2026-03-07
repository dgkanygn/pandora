import Navbar from '../../components/Navbar';
import COMPANY_INFO from '../../constants/company';
import Footer from '../../components/Footer';
import { FaMapMarkerAlt, FaPhone, FaInstagram, FaEnvelope } from 'react-icons/fa';
import { useContactInfo } from '../../hooks/useContactInfo';

import logo from "@/assets/logos/logo.png"

const Contact: React.FC = () => {
    const { contactInfo } = useContactInfo();

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />
            <main className="flex-grow pt-24 pb-12 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="bg-pink-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[600px]">

                        {/* Sol Taraf - Bilgiler & Harita */}
                        <div className="lg:w-3/5 bg-black/10 p-8 md:p-12 flex flex-col gap-8">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-4">İletişim</h2>
                                <p className="text-pink-100/80 leading-relaxed text-sm">
                                    Size yardımcı olmaktan mutluluk duyarız. Her türlü soru ve öneriniz için bize ulaşabilirsiniz.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-pink-300">
                                        <FaMapMarkerAlt size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white mb-1">Adres</h3>
                                        <p className="text-pink-100 text-sm leading-relaxed whitespace-pre-wrap">
                                            {contactInfo?.address || (
                                                <>
                                                    {COMPANY_INFO.address.district}, {COMPANY_INFO.address.street}<br />
                                                    {COMPANY_INFO.address.postalCode} {COMPANY_INFO.address.town}/{COMPANY_INFO.address.city}
                                                </>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-pink-300">
                                        <FaPhone size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white mb-1">Telefon</h3>
                                        <p className="text-pink-100 text-sm">{contactInfo?.phone || COMPANY_INFO.contact.phone}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-pink-300">
                                        <FaEnvelope size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white mb-1">E-posta</h3>
                                        <a
                                            href={`mailto:${contactInfo?.contact_email || COMPANY_INFO.contact.email}`}
                                            className="text-pink-100 text-sm hover:text-white transition-colors cursor-pointer"
                                        >
                                            {contactInfo?.contact_email || COMPANY_INFO.contact.email}
                                        </a>
                                    </div>
                                </div>

                                {/* <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-pink-300">
                                        <FaClock size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white mb-1">Çalışma Saatleri</h3>
                                        <p className="text-pink-100 text-sm flex items-center gap-2">
                                            <span className="text-green-400 font-medium">Açık</span>
                                            <span>⋅</span>
                                            <span>Kapanış saati: 23:00</span>
                                        </p>
                                    </div>
                                </div> */}

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-pink-300">
                                        <FaInstagram size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white mb-1">Instagram</h3>
                                        <a
                                            href={contactInfo?.instagram ? `https://instagram.com/${contactInfo.instagram}` : COMPANY_INFO.contact.instagram.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-pink-100 text-sm hover:text-white transition-colors cursor-pointer"
                                        >
                                            @{contactInfo?.instagram || COMPANY_INFO.contact.instagram.username}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto pt-8">
                                <div className="w-full h-48 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d644.697168091865!2d30.517614016527318!3d39.76853297085525!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cc161b26864d87%3A0x2905e524469ca5d2!2zUGFuZG9yYSDDh2nDp2VrIEV2aQ!5e0!3m2!1str!2str!4v1771068483543!5m2!1str!2str"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        className="filter grayscale-[20%] hover:grayscale-0 transition-all duration-500"
                                        title="Google Map"
                                    ></iframe>
                                </div>
                            </div>
                        </div>

                        {/* Sağ Taraf - Logo */}
                        <div className="lg:w-2/5 bg-pink-900 flex items-center justify-center p-8 md:p-12 relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                            <div className="relative cursor-pointer z-10 bg-white/10 backdrop-blur-sm p-10 rounded-full shadow-2xl border border-white/20 animate-pulse-slow">
                                <img
                                    src={logo}
                                    alt="Pandora Çiçek Evi Logo"
                                    className="w-48 h-auto object-contain drop-shadow-xl transform hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Contact;
