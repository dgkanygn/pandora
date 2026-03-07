import React from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaHome } from 'react-icons/fa';
import { CITIES } from '../../../constants/cities';

interface SenderSectionProps {
    formData: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    errors?: Partial<Record<string, string>>;
}

const SenderSection: React.FC<SenderSectionProps> = ({ formData, handleChange, errors = {} }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="bg-pink-100 text-pink-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                Gönderen Bilgileri
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <FaUser size={12} className="text-gray-400" /> Ad Soyad/Firma Unvanı<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="senderName"
                        value={formData.senderName}
                        onChange={handleChange}
                        maxLength={100}
                        className={`w-full px-4 py-3 rounded-xl border transition outline-none ${errors.senderName
                            ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                            : 'border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200'
                            }`}
                        placeholder="Adınız Soyadınız"
                    />
                    {errors.senderName && <p className="text-red-500 text-xs">{errors.senderName}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <FaEnvelope size={12} className="text-gray-400" /> E-posta <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        name="senderEmail"
                        value={formData.senderEmail}
                        onChange={handleChange}
                        maxLength={150}
                        className={`w-full px-4 py-3 rounded-xl border transition outline-none ${errors.senderEmail
                            ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                            : 'border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200'
                            }`}
                        placeholder="ornek@email.com"
                    />
                    {errors.senderEmail && <p className="text-red-500 text-xs">{errors.senderEmail}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <FaPhone size={12} className="text-gray-400" /> Telefon <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel"
                        name="senderPhone"
                        value={formData.senderPhone}
                        onChange={handleChange}
                        maxLength={11}
                        className={`w-full px-4 py-3 rounded-xl border transition outline-none ${errors.senderPhone
                            ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                            : 'border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200'
                            }`}
                        placeholder="05XX XXX XX XX"
                    />
                    {errors.senderPhone && <p className="text-red-500 text-xs">{errors.senderPhone}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <FaMapMarkerAlt size={12} className="text-gray-400" /> Şehir <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="senderCity"
                        value={formData.senderCity}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border transition outline-none appearance-none bg-white ${errors.senderCity
                            ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                            : 'border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200'
                            }`}
                    >
                        <option value="">İl Seçiniz</option>
                        {CITIES.map(city => (
                            <option key={city.value} value={city.label}>
                                {city.label}
                            </option>
                        ))}
                    </select>
                    {errors.senderCity && <p className="text-red-500 text-xs">{errors.senderCity}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <FaHome size={12} className="text-gray-400" /> Müşteri Adresi
                    </label>
                    <textarea
                        name="senderAddress"
                        value={formData.senderAddress}
                        onChange={handleChange}
                        rows={3}
                        maxLength={500}
                        className={`w-full px-4 py-3 rounded-xl border transition outline-none resize-none ${errors.senderAddress
                            ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                            : 'border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200'
                            }`}
                        placeholder="Adres detaylarını buraya girebilirsiniz..."
                    />
                    {errors.senderAddress && <p className="text-red-500 text-xs">{errors.senderAddress}</p>}
                </div>
            </div>
        </div>
    );
};

export default SenderSection;
