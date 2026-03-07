import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCookieBite, FaTimes } from 'react-icons/fa';
import { getCookie, setCookie } from '../../utils/cookieUtils';

const ConsentPopup = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        const consent = getCookie('consent_accepted');
        if (!consent) {
            setShouldRender(true);
            setTimeout(() => setIsVisible(true), 100);
        }
    }, []);

    const handleAccept = () => {
        setIsVisible(false);
        setTimeout(() => {
            setCookie('consent_accepted', 'true', 365);
            setShouldRender(false);
        }, 300);
    };

    if (!shouldRender) return null;

    return (
        <div
            className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-500 ease-in-out ${isVisible ? 'translate-y-0' : 'translate-y-full'
                }`}
        >
            <div className="bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <div className="container mx-auto max-w-7xl px-4 py-6 md:py-4">
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                        {/* Icon */}
                        <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-[#fdf2f8] text-[#e60076] shrink-0">
                            <FaCookieBite size={24} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center justify-center md:justify-start gap-2">
                                <span className="md:hidden text-[#e60076]"><FaCookieBite /></span>
                                Çerez ve Gizlilik Politikası
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Sizlere daha iyi bir alışveriş deneyimi sunabilmek için sitemizde çerezler ve kişisel verileriniz kullanılmaktadır.
                                Sitemizi kullanarak <Link to="/terms" className="text-[#e60076] hover:text-[#cc0069] font-medium underline decoration-[#e60076]/30 hover:decoration-[#cc0069] transition-all">KVKK Aydınlatma Metni</Link>'ni
                                ve <Link to="/privacy" className="text-[#e60076] hover:text-[#cc0069] font-medium underline decoration-[#e60076]/30 hover:decoration-[#cc0069] transition-all">Gizlilik Politikamızı</Link> kabul etmiş sayılırsınız.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
                            <button
                                onClick={handleAccept}
                                className="flex-1 md:flex-none px-8 py-3 bg-[#e60076] hover:bg-[#cc0069] active:bg-[#b3005c] text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-[#e60076]/20 hover:-translate-y-0.5 cursor-pointer"
                            >
                                Kabul Ediyorum
                            </button>
                            <button
                                onClick={handleAccept}
                                className="md:hidden p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                                aria-label="Kapat"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConsentPopup;
