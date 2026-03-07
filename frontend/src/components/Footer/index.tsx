import { Link } from 'react-router-dom';
import {
    // FaFacebookF,
    FaInstagram,
    // FaXTwitter,
    // FaPinterestP,
    FaEnvelope,
    FaPhone,
    FaLocationDot,
} from 'react-icons/fa6';
import COMPANY_INFO from '../../constants/company';
import { useContactInfo } from '../../hooks/useContactInfo';

const quickLinks = [
    { label: 'Ana Sayfa', to: '/' },
    { label: 'Ürünler', to: '/products' },
    { label: 'Kategoriler', to: '/categories' },
    { label: 'Blog', to: '/blog' },
    { label: 'Hakkımızda', to: '/about' },
    { label: 'İletişim', to: '/contact' },
];

const customerLinks = [
    { label: 'Sipariş Takibi', to: '/order-tracking' },
    { label: 'Mesafeli Satış Sözleşmesi', to: '/distance-sales-contract' },
    { label: 'Kullanım Koşulları', to: '/terms' },
    { label: 'Gizlilik Politikası', to: '/terms' },
    { label: 'SSS', to: '/contact' },
];


const Footer: React.FC = () => {
    const { contactInfo } = useContactInfo();

    const socialLinks = [
        { icon: FaInstagram, href: contactInfo?.instagram ? `https://instagram.com/${contactInfo.instagram}` : COMPANY_INFO.contact.instagram.url, label: 'Instagram' },
        // { icon: FaFacebookF, href: '#', label: 'Facebook' },
        // { icon: FaXTwitter, href: '#', label: 'X (Twitter)' },
        // { icon: FaPinterestP, href: '#', label: 'Pinterest' },
    ];
    return (
        <footer className="bg-gray-950 text-gray-400 mt-auto">
            {/* Main Footer Content */}
            <div className="container mx-auto px-6 md:px-12 lg:px-24 xl:px-32 py-14">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

                    {/* Column 1 — Brand & Description */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <Link to="/" className="inline-block mb-4 group">
                            <span className="text-2xl font-extrabold text-pink-500 tracking-tight transition-colors duration-300 group-hover:text-pink-400">
                                {COMPANY_INFO.name.short}
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed mb-6 max-w-xs">
                            Her anı çiçeklerle unutulmaz kılıyoruz. Özenle hazırlanan taze çiçek aranjmanlarımızla sevdiklerinize en güzel sürprizleri yapın.
                        </p>

                        {/* Social Icons */}
                        <div className="flex items-center gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    className="w-9 h-9 rounded-full bg-gray-800/70 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white transition-all duration-300 hover:scale-110 cursor-pointer"
                                >
                                    <social.icon size={15} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Column 2 — Hızlı Yönlendirmeler */}
                    <div>
                        <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
                            Hızlı Yönlendirmeler
                        </h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.to}>
                                    <Link
                                        to={link.to}
                                        className="text-sm hover:text-pink-400 transition-colors duration-200 hover:pl-1 inline-block cursor-pointer"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3 — Müşteri Hizmetleri */}
                    <div>
                        <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
                            Müşteri Hizmetleri
                        </h4>
                        <ul className="space-y-3">
                            {customerLinks.map((link, i) => (
                                <li key={`${link.to}-${i}`}>
                                    <Link
                                        to={link.to}
                                        className="text-sm hover:text-pink-400 transition-colors duration-200 hover:pl-1 inline-block cursor-pointer"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4 — İletişim Bilgileri */}
                    <div>
                        <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
                            İletişim
                        </h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <FaLocationDot className="text-pink-500 mt-0.5 shrink-0" size={15} />
                                <span className="text-sm leading-relaxed whitespace-pre-wrap">
                                    {contactInfo?.address || COMPANY_INFO.address.full}
                                </span>
                            </li>
                            <li>
                                <a
                                    href={`tel:${(contactInfo?.phone || COMPANY_INFO.contact.phone).replace(/\s/g, '')}`}
                                    className="flex items-center gap-3 text-sm hover:text-pink-400 transition-colors duration-200 cursor-pointer"
                                >
                                    <FaPhone className="text-pink-500 shrink-0" size={14} />
                                    {contactInfo?.phone || COMPANY_INFO.contact.phone}
                                </a>
                            </li>
                            <li>
                                <a
                                    href={`mailto:${contactInfo?.contact_email || COMPANY_INFO.contact.email}`}
                                    className="flex items-center gap-3 text-sm hover:text-pink-400 transition-colors duration-200 cursor-pointer"
                                >
                                    <FaEnvelope className="text-pink-500 shrink-0" size={14} />
                                    {contactInfo?.contact_email || COMPANY_INFO.contact.email}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800/80">
                <div className="container mx-auto px-6 md:px-12 lg:px-24 xl:px-32 py-5">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
                        <p>&copy; {new Date().getFullYear()} {COMPANY_INFO.name.full}. Tüm hakları saklıdır.</p>
                        <div className="flex items-center gap-4">
                            <Link to="/terms" className="hover:text-gray-300 transition-colors duration-200 cursor-pointer">
                                Kullanım Koşulları
                            </Link>
                            <span className="text-gray-700">|</span>
                            <Link to="/terms" className="hover:text-gray-300 transition-colors duration-200 cursor-pointer">
                                Gizlilik Politikası
                            </Link>
                            <span className="text-gray-700">|</span>
                            <Link to="/distance-sales-contract" className="hover:text-gray-300 transition-colors duration-200 cursor-pointer">
                                KVKK
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
