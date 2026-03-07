import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUser, FaPhone, FaExclamationCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import COMPANY_INFO from '../../constants/company';
import * as Yup from 'yup';
import logo from "@/assets/logos/logo.png";

// ... other imports ...

const validationSchema = Yup.object().shape({
    username: Yup.string().required('Kullanıcı adı zorunludur'),
    email: Yup.string().email('Geçersiz email adresi').required('Email zorunludur'),
    phone: Yup.string()
        .required('Telefon zorunludur.')
        .matches(/^05\d{9}$/, 'Geçerli bir Türk cep telefonu giriniz (05XXXXXXXXX).'),
    password: Yup.string().min(6, 'Şifre en az 6 karakter olmalıdır').required('Şifre zorunludur'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Şifreler eşleşmiyor')
        .required('Şifre tekrarı zorunludur')
});

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            await validationSchema.validate(formData, { abortEarly: false });
        } catch (err: any) {
            if (err instanceof Yup.ValidationError) {
                setError(err.inner[0].message);
                return;
            }
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Şifreler eşleşmiyor!');
            return;
        }

        setIsSubmitting(true);
        try {
            await register(formData.email, formData.password, formData.username, formData.phone);
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Kayıt başarısız');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">

            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden shadow-pink-100 p-8 md:p-12">
                <div className="text-center">
                    <Link to="/" className="inline-flex items-center justify-center mb-6">
                        <img src={logo} alt={COMPANY_INFO.name.full} className="h-40 w-auto" />
                    </Link>
                    <h2 className="text-3xl font-bold text-gray-900">Hesap Oluştur</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Çiçek yolculuğunuza bugün başlayın.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-r mt-6">
                        <div className="flex items-center">
                            <FaExclamationCircle className="text-red-500 mr-3" />
                            <p className="text-red-700 text-sm font-medium">{error}</p>
                        </div>
                    </div>
                )}

                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaUser className="text-gray-400" />
                                </div>
                                <input
                                    name="username"
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                                    placeholder="Ahmet Yılmaz"
                                    maxLength={50}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaEnvelope className="text-gray-400" />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                                    placeholder="isim@sirket.com"
                                    maxLength={100}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaPhone className="text-gray-400" />
                                </div>
                                <input
                                    name="phone"
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        if (val.length <= 11) {
                                            setFormData({ ...formData, phone: val });
                                        }
                                    }}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                                    placeholder="05555555555"
                                    maxLength={11}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Şifre</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className="text-gray-400" />
                                </div>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                                    placeholder="••••••••"
                                    maxLength={50}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Şifre Tekrar</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className="text-gray-400" />
                                </div>
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                                    placeholder="••••••••"
                                    maxLength={50}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                        <input type="checkbox" id="terms" className="rounded border-gray-300 text-pink-600 focus:ring-pink-500" required />
                        <label htmlFor="terms" className="text-sm text-gray-500"><Link to="/terms" className="text-pink-600 hover:underline">Şartlar ve Koşulları</Link> kabul ediyorum</label>
                    </div>

                    <div>
                        <button type="submit" disabled={isSubmitting} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 shadow-md hover:shadow-lg transition-all mt-6 disabled:opacity-60 disabled:cursor-not-allowed">
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Kayıt oluşturuluyor...
                                </span>
                            ) : 'Hesap Oluştur'}
                        </button>
                    </div>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Zaten hesabınız var mı?{' '}
                    <Link to="/login" className="font-bold text-pink-600 hover:text-pink-500">
                        Giriş Yap
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
