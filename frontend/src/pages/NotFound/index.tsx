import { Link } from 'react-router-dom';
import { FaGhost } from 'react-icons/fa';

const NotFound: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="text-center">
                <div className="flex justify-center mb-6">
                    <FaGhost className="text-pink-600 text-9xl opcaity-80" />
                </div>
                <div className="mt-5">
                    <h3 className="text-2xl font-semibold md:text-3xl text-gray-900 mb-4">Üzgünüz, aradığınız sayfayı bulamadık.</h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">Aradığınız sayfa silinmiş, adı değiştirilmiş veya geçici olarak kullanılamıyor olabilir.</p>
                    <Link to="/" className="inline-block bg-pink-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-pink-700 hover:text-white transition transform hover:-translate-y-1">
                        Anasayfaya Dön
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
