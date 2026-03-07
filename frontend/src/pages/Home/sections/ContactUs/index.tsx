import { Link } from 'react-router-dom';
import { HiPhone } from 'react-icons/hi';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
import COMPANY_INFO from '../../../../constants/company';
import { useContactInfo } from '../../../../hooks/useContactInfo';

const ContactUs: React.FC = () => {
    const { contactInfo } = useContactInfo();
    const phoneNumber = (contactInfo?.phone || COMPANY_INFO.contact.phone).replace(/\s/g, '');
    const whatsappLink = `https://wa.me/90${phoneNumber.startsWith('0') ? phoneNumber.substring(1) : phoneNumber}`;
    const telLink = `tel:+90${phoneNumber.startsWith('0') ? phoneNumber.substring(1) : phoneNumber}`;
    const instagramLink = contactInfo?.instagram ? `https://instagram.com/${contactInfo.instagram}` : COMPANY_INFO.contact.instagram.url;

    return (
        <section className="bg-pink-50 py-16 md:py-24 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-x-1/2 -translate-y-1/2 animate-blob" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-x-1/2 translate-y-1/2 animate-blob animation-delay-2000" />

            <div className="container mx-auto px-6 lg:px-24">
                <div className="max-w-3xl mx-auto text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 font-playfair tracking-tight">
                        Bize ulaşın, size yardımcı olalım.
                    </h2>
                    <p className="text-gray-600 mb-10 text-lg">
                        Eşsiz buketler ve özel tasarımlar için hemen keşfedin.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            to="/products"
                            className="flex items-center gap-2 bg-pink-600 text-white px-6 py-3 rounded-full font-medium hover:bg-pink-700 transition shadow-md shadow-pink-200"
                        >
                            Tüm Ürünleri Gör
                        </Link>

                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-full font-medium hover:bg-[#128C7E] transition shadow-md shadow-green-200"
                        >
                            <FaWhatsapp size={20} />
                            WhatsApp
                        </a>

                        <a
                            href={instagramLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition shadow-md shadow-pink-200"
                        >
                            <FaInstagram size={20} />
                            Instagram
                        </a>

                        <a
                            href={telLink}
                            className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition shadow-md shadow-gray-300"
                        >
                            <HiPhone size={20} />
                            Bizi Arayın
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactUs;
