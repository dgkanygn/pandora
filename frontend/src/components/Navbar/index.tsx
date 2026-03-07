import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaShoppingCart, FaBars, FaTimes, FaSignOutAlt, FaStore } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import logoHorizontal from '../../assets/logos/logo-horizontal.png';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();

    // Context hooks
    const { user, logout } = useAuth();
    const { cartCount } = useCart();

    // Disable scroll when mobile menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsOpen(false);
    };

    return (
        <>
            <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
                {/* Added a subtle gradient border at bottom when scrolled for premium feel */}
                <div className={`absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-pink-200 to-transparent opacity-0 transition-opacity duration-300 ${scrolled ? 'opacity-100' : ''}`}></div>

                <div className={`container mx-auto px-6 lg:px-12 flex justify-between items-center`}>

                    {/* Logo and Left Navigation */}
                    <div className="flex items-center gap-8 md:gap-12">
                        {/* Logo */}
                        <Link to="/" className="flex items-center group relative z-50">
                            <img
                                src={logoHorizontal}
                                alt="Logo"
                                className="h-10 w-auto object-contain transition-opacity duration-200 group-hover:opacity-80"
                            />
                        </Link>

                        {/* Desktop Menu - Moved Next to Logo */}
                        <div className="hidden lg:flex items-center gap-6">
                            <Link to="/" className="text-gray-700 hover:text-pink-600 font-medium transition relative group text-sm">
                                Anasayfa
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-600 transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                            <Link to="/categories" className="text-gray-700 hover:text-pink-600 font-medium transition relative group text-sm">
                                Kategoriler
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-600 transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                            <Link to="/about" className="text-gray-700 hover:text-pink-600 font-medium transition relative group text-sm">
                                Hakkımızda
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-600 transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                            <Link to="/contact" className="text-gray-700 hover:text-pink-600 font-medium transition relative group text-sm">
                                İletişim
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-600 transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                            <Link to="/order-tracking" className="text-gray-700 hover:text-pink-600 font-medium transition relative group text-sm">
                                Sipariş Takip
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-600 transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        </div>
                    </div>

                    {/* Right Side: Blog, Market, Icons */}
                    <div className="hidden lg:flex items-center gap-4">
                        {/* <Link to="/blog" className="flex items-center gap-2 text-gray-600 hover:text-pink-600 font-medium transition-colors text-sm px-3 py-2 rounded-full hover:bg-pink-50">
                            <FaBookOpen size={14} />
                            <span>Blog</span>
                        </Link> */}

                        <Link to="/products" className="flex items-center gap-2 text-pink-600 border border-pink-200 bg-pink-50 px-4 py-2 rounded-full font-medium hover:bg-pink-600 hover:text-white hover:border-pink-600 transition-all duration-300 shadow-sm hover:shadow-md text-sm">
                            <FaStore />
                            <span>Market</span>
                        </Link>

                        <div className="w-px h-6 bg-gray-200 mx-1"></div>

                        <Link to="/cart" className="relative text-gray-700 hover:text-pink-600 transition p-2">
                            <FaShoppingCart size={20} />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 bg-pink-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-bounce">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-3 pl-2">
                                <Link to={`/profile/${user.id}`} className="flex items-center gap-2 text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors text-sm">
                                    <FaUser size={14} className="text-pink-600" />
                                    <span>{user.username}</span>
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="text-gray-400 hover:text-red-500 transition p-2 hover:bg-red-50 rounded-full"
                                    title="Çıkış Yap"
                                >
                                    <FaSignOutAlt size={18} />
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-full hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 transition-all font-medium text-sm ml-2">
                                <FaUser size={14} />
                                Giriş Yap
                            </Link>
                        )}
                    </div>

                    {/* Mobile Actions: Cart + Menu Button */}
                    <div className="lg:hidden flex items-center gap-3">
                        <Link to="/cart" className="relative text-gray-700 hover:text-pink-600 transition p-2">
                            <FaShoppingCart size={20} />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 bg-pink-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-bounce">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        <button
                            className="text-gray-700 p-2 relative z-50 text-2xl hover:text-pink-600 transition-colors"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <FaTimes /> : <FaBars />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[998] transition-opacity duration-300 lg:hidden"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

            {/* Mobile Menu Sidebar */}
            <div className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-[999] shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full overflow-y-auto px-6 pb-6 pt-6">
                    {/* Sidebar Header */}
                    <div className="flex items-center justify-between mb-8">
                        <Link to="/" onClick={() => setIsOpen(false)}>
                            <img
                                src={logoHorizontal}
                                alt="Logo"
                                className="h-9 w-auto object-contain"
                            />
                        </Link>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-500 hover:text-pink-600 transition-colors p-2 -mr-2"
                        >
                            <FaTimes size={24} />
                        </button>
                    </div>

                    <div className="flex flex-col gap-1">
                        <Link to="/" onClick={() => setIsOpen(false)} className="text-gray-800 hover:text-pink-600 font-medium text-lg py-3 border-b border-gray-50">Anasayfa</Link>
                        <div className="flex gap-2 mt-2 mb-2">
                            <Link to="/products" onClick={() => setIsOpen(false)} className="flex-1 text-pink-600 font-bold text-center py-3 border border-pink-100 rounded-xl bg-pink-50 flex items-center justify-center gap-2">
                                <FaStore /> Market
                            </Link>
                            {/* <Link to="/blog" onClick={() => setIsOpen(false)} className="flex-1 text-gray-700 font-bold text-center py-3 border border-gray-100 rounded-xl bg-gray-50 flex items-center justify-center gap-2">
                                <FaBookOpen className="text-pink-500" /> Blog
                            </Link> */}
                        </div>
                        <Link to="/categories" onClick={() => setIsOpen(false)} className="text-gray-800 hover:text-pink-600 font-medium text-lg py-3 border-b border-gray-50">Kategoriler</Link>
                        <Link to="/about" onClick={() => setIsOpen(false)} className="text-gray-800 hover:text-pink-600 font-medium text-lg py-3 border-b border-gray-50">Hakkımızda</Link>
                        <Link to="/contact" onClick={() => setIsOpen(false)} className="text-gray-800 hover:text-pink-600 font-medium text-lg py-3 border-b border-gray-50">İletişim</Link>

                        <div className="mt-4"></div>

                        <Link to="/cart" className="flex items-center justify-between text-gray-800 hover:text-pink-600 font-medium text-lg py-3" onClick={() => setIsOpen(false)}>
                            <span className="flex items-center gap-3"><FaShoppingCart /> Sepetim</span>
                            <span className="bg-pink-100 text-pink-600 text-xs font-bold px-2.5 py-1 rounded-full">{cartCount}</span>
                        </Link>

                        {user ? (
                            <div className="flex flex-col gap-4 mt-6 bg-gray-50 p-4 rounded-xl">
                                <Link to={`/profile/${user.id}`} className="flex items-center gap-3 text-gray-800 hover:text-pink-600 font-medium text-lg" onClick={() => setIsOpen(false)}>
                                    <div className="bg-white p-2 rounded-full shadow-sm">
                                        <FaUser className="text-pink-500" />
                                    </div>
                                    <span>{user.username}</span>
                                </Link>
                                <button onClick={handleLogout} className="flex items-center gap-3 text-red-500 hover:text-red-700 font-medium text-lg mt-2 pl-1">
                                    <FaSignOutAlt /> Çıkış Yap
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-3.5 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all mt-6" onClick={() => setIsOpen(false)}>
                                <FaUser /> Giriş Yap
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
