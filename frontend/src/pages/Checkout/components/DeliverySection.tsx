import React from 'react';
import { FaUser, FaCalendarAlt, FaPhone, FaMapMarkerAlt, FaCity } from 'react-icons/fa';
import type { Neighborhood } from '../../../services/api';

interface DeliverySectionProps {
    formData: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    errors?: Partial<Record<string, string>>;
    neighborhoods: Neighborhood[];
}

const DeliverySection: React.FC<DeliverySectionProps> = ({ formData, handleChange, errors = {}, neighborhoods }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="bg-pink-100 text-pink-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                Teslimat Bilgileri
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <FaUser size={12} className="text-gray-400" /> Alıcı Ad Soyad / Firma Unvanı <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="recipientName"
                        value={formData.recipientName}
                        onChange={handleChange}
                        maxLength={100}
                        className={`w-full px-4 py-3 rounded-xl border transition outline-none ${errors.recipientName
                            ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                            : 'border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200'
                            }`}
                        placeholder="Alıcının Adı Soyadı veya Firma Adı"
                    />
                    {errors.recipientName && <p className="text-red-500 text-xs">{errors.recipientName}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <FaCalendarAlt size={12} className="text-gray-400" /> Teslim Tarihi <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        name="deliveryDate"
                        value={formData.deliveryDate}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border transition outline-none ${errors.deliveryDate
                            ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                            : 'border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200'
                            }`}
                    />
                    {errors.deliveryDate && <p className="text-red-500 text-xs">{errors.deliveryDate}</p>}
                </div>

                {/* <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <FaCalendarAlt size={12} className="text-gray-400" /> Teslim Saati <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="deliveryTime"
                        value={formData.deliveryTime}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border transition outline-none bg-white ${errors.deliveryTime
                                ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                                : 'border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200'
                            }`}
                    >
                        <option value="">Saat Seçiniz</option>
                        <option value="09:00-12:00">09:00 - 12:00</option>
                        <option value="12:00-15:00">12:00 - 15:00</option>
                        <option value="15:00-18:00">15:00 - 18:00</option>
                        <option value="18:00-21:00">18:00 - 21:00</option>
                    </select>
                    {errors.deliveryTime && <p className="text-red-500 text-xs">{errors.deliveryTime}</p>}
                </div> */}

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <FaCalendarAlt size={12} className="text-gray-400" /> Teslim Saati <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="time"
                        name="deliveryTime"
                        value={formData.deliveryTime}
                        onChange={handleChange}
                        min="09:00"
                        max="18:00"
                        step="1800"
                        className={`w-full px-4 py-3 rounded-xl border transition outline-none bg-white ${errors.deliveryTime
                            ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                            : 'border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200'
                            }`}
                    />
                    {errors.deliveryTime && <p className="text-red-500 text-xs">{errors.deliveryTime}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <FaPhone size={12} className="text-gray-400" /> Teslim Alacak Kişinin Telefonu <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel"
                        name="recipientPhone"
                        value={formData.recipientPhone}
                        onChange={handleChange}
                        maxLength={11}
                        className={`w-full px-4 py-3 rounded-xl border transition outline-none ${errors.recipientPhone
                            ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                            : 'border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200'
                            }`}
                        placeholder="05XX XXX XX XX"
                    />
                    {errors.recipientPhone && <p className="text-red-500 text-xs">{errors.recipientPhone}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <FaCity size={12} className="text-gray-400" /> İl
                    </label>
                    <select
                        disabled
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed outline-none"
                    >
                        <option>Eskişehir</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <FaMapMarkerAlt size={12} className="text-gray-400" /> Semt <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border transition outline-none bg-white ${errors.district
                            ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                            : 'border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200'
                            }`}
                    >
                        <option value="">Semt Seçiniz</option>
                        {neighborhoods.map((neighborhood) => (
                            <option key={neighborhood.id} value={neighborhood.id}>
                                {neighborhood.name} - {parseFloat(neighborhood.price.toString()) > 0 ? `${neighborhood.price} TL` : 'Ücretsiz'}
                            </option>
                        ))}
                    </select>
                    {errors.district && <p className="text-red-500 text-xs">{errors.district}</p>}
                    <p className="text-xs text-amber-600 mt-1">
                        ⓘ Teslim ücreti (varsa) semtin yanında belirtilmiştir. Sepet toplamına eklenecektir.
                    </p>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <FaMapMarkerAlt size={12} className="text-gray-400" /> Teslimat Adresi <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="deliveryAddress"
                        value={formData.deliveryAddress}
                        onChange={handleChange}
                        maxLength={500}
                        rows={3}
                        className={`w-full px-4 py-3 rounded-xl border transition outline-none resize-none ${errors.deliveryAddress
                            ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                            : 'border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200'
                            }`}
                        placeholder="Detaylı adres bilgisi..."
                    ></textarea>
                    {errors.deliveryAddress && <p className="text-red-500 text-xs">{errors.deliveryAddress}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        📝 Teslimat Notu
                    </label>
                    <textarea
                        name="deliveryNote"
                        value={formData.deliveryNote}
                        onChange={handleChange}
                        maxLength={300}
                        rows={2}
                        className={`w-full px-4 py-3 rounded-xl border transition outline-none resize-none ${errors.deliveryNote
                            ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                            : 'border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200'
                            }`}
                        placeholder="Kurye için ek not (Örn: Zili çalmayın, kapıya bırakın vb.)"
                    ></textarea>
                    {errors.deliveryNote && <p className="text-red-500 text-xs">{errors.deliveryNote}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        📝 Çiçek Notu
                    </label>
                    <textarea
                        name="flowerNote"
                        value={formData.flowerNote}
                        onChange={handleChange}
                        maxLength={300}
                        rows={2}
                        className={`w-full px-4 py-3 rounded-xl border transition outline-none resize-none ${errors.flowerNote
                            ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                            : 'border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200'
                            }`}
                        placeholder="Çiçek üzerinde görünecek not"
                    ></textarea>
                    {errors.deliveryNote && <p className="text-red-500 text-xs">{errors.deliveryNote}</p>}
                </div>
            </div>
        </div>
    );
};

export default DeliverySection;
