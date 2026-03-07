import React from 'react';
import { FaCreditCard, FaUniversity } from 'react-icons/fa';

interface PaymentSectionProps {
    formData: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    // Errors might not be needed for radio buttons but keeping interface consistent
    errors?: Record<string, string | undefined>;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({ formData, handleChange, errors }) => {
    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, '');
        const isDeleting = (formData.cardExpiry?.length || 0) > e.target.value.length;

        if (val.length > 4) val = val.slice(0, 4);

        if (val.length >= 2) {
            if (isDeleting && val.length === 2 && !e.target.value.includes('/')) {
                // User deleted the slash specifically
            } else {
                val = val.slice(0, 2) + '/' + val.slice(2);
            }
        }

        e.target.value = val;
        handleChange(e);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="bg-pink-100 text-pink-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">5</span>
                Ödeme Şekli
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition ${formData.paymentMethod === 'credit_card' ? 'border-pink-500 bg-pink-50 ring-1 ring-pink-500' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input
                        type="radio"
                        name="paymentMethod"
                        value="credit_card"
                        checked={formData.paymentMethod === 'credit_card'}
                        onChange={handleChange}
                        className="text-pink-600 focus:ring-pink-500"
                    />
                    <div className="flex items-center gap-2">
                        <FaCreditCard className="text-pink-600" size={20} />
                        <span className="font-bold text-gray-800">Kredi Kartı</span>
                    </div>
                </label>

                <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition ${formData.paymentMethod === 'transfer' ? 'border-pink-500 bg-pink-50 ring-1 ring-pink-500' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input
                        type="radio"
                        name="paymentMethod"
                        value="transfer"
                        checked={formData.paymentMethod === 'transfer'}
                        onChange={handleChange}
                        className="text-pink-600 focus:ring-pink-500"
                    />
                    <div className="flex items-center gap-2">
                        <FaUniversity className="text-pink-600" size={20} />
                        <span className="font-bold text-gray-800">Havale / EFT</span>
                    </div>
                </label>
            </div>

            {formData.paymentMethod === 'credit_card' && (
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 animate-fadeIn mb-6">
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kart Üzerindeki İsim
                            </label>
                            <input
                                type="text"
                                name="cardHolderName"
                                value={formData.cardHolderName || ''}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition ${errors?.cardHolderName ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                                placeholder="Ad Soyad"
                            />
                            {errors?.cardHolderName && <p className="text-red-500 text-xs mt-1">{errors.cardHolderName}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kart Numarası
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="cardNumber"
                                    value={formData.cardNumber || ''}
                                    onChange={handleChange}
                                    maxLength={19}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition ${errors?.cardNumber ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                                    placeholder="0000 0000 0000 0000"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <FaCreditCard />
                                </div>
                            </div>
                            {errors?.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Son Kullanma
                                </label>
                                <input
                                    type="text"
                                    name="cardExpiry"
                                    value={formData.cardExpiry || ''}
                                    onChange={handleExpiryChange}
                                    maxLength={5}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition ${errors?.cardExpiry ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                                    placeholder="AA/YY"
                                />
                                {errors?.cardExpiry && <p className="text-red-500 text-xs mt-1">{errors.cardExpiry}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    CVV
                                </label>
                                <input
                                    type="text"
                                    name="cardCvv"
                                    value={formData.cardCvv || ''}
                                    onChange={handleChange}
                                    maxLength={3}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition ${errors?.cardCvv ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                                    placeholder="000"
                                />
                                {errors?.cardCvv && <p className="text-red-500 text-xs mt-1">{errors.cardCvv}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {formData.paymentMethod === 'transfer' && (
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 animate-fadeIn">
                    <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Banka Hesap Numaralarımız</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div className="space-y-1">
                            <span className="block text-gray-500">Banka Adı</span>
                            <span className="block font-bold text-gray-900">Ziraat Bankası</span>
                        </div>
                        <div className="space-y-1">
                            <span className="block text-gray-500">Hesap Adı</span>
                            <span className="block font-bold text-gray-900">Çiçekçi E-Ticaret A.Ş.</span>
                        </div>
                        <div className="space-y-1">
                            <span className="block text-gray-500">Şube Kodu</span>
                            <span className="block font-bold text-gray-900">1234</span>
                        </div>
                        <div className="space-y-1">
                            <span className="block text-gray-500">Hesap No</span>
                            <span className="block font-bold text-gray-900">12345678</span>
                        </div>
                        <div className="col-span-1 md:col-span-2 space-y-1">
                            <span className="block text-gray-500">IBAN</span>
                            <span className="block font-bold text-gray-900 tracking-wider">TR12 3456 7890 1234 5678 9012 34</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentSection;
