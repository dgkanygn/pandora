import React from 'react';

interface BillingSectionProps {
    formData: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    // Errors might not be needed for radio buttons but keeping interface consistent
    errors?: Partial<Record<string, string>>;
}

const BillingSection: React.FC<BillingSectionProps> = ({ formData, handleChange, errors }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="bg-pink-100 text-pink-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
                Fatura Bilgileri
            </h2>

            <div className="flex flex-col sm:flex-row gap-6 mb-6">
                <label className={`flex items-center gap-2 cursor-pointer p-4 border rounded-xl hover:bg-gray-50 transition flex-1 ${formData.billingType === 'individual' ? 'border-pink-500 bg-pink-50' : 'border-gray-200'}`}>
                    <input
                        type="radio"
                        name="billingType"
                        value="individual"
                        checked={formData.billingType === 'individual'}
                        onChange={handleChange}
                        className="text-pink-600 focus:ring-pink-500"
                    />
                    <span className={`font-medium ${formData.billingType === 'individual' ? 'text-pink-700' : 'text-gray-700'}`}>Bireysel Fatura</span>
                </label>
                <label className={`flex items-center gap-2 cursor-pointer p-4 border rounded-xl hover:bg-gray-50 transition flex-1 ${formData.billingType === 'corporate' ? 'border-pink-500 bg-pink-50' : 'border-gray-200'}`}>
                    <input
                        type="radio"
                        name="billingType"
                        value="corporate"
                        checked={formData.billingType === 'corporate'}
                        onChange={handleChange}
                        className="text-pink-600 focus:ring-pink-500"
                    />
                    <span className={`font-medium ${formData.billingType === 'corporate' ? 'text-pink-700' : 'text-gray-700'}`}>Kurumsal Fatura</span>
                </label>
            </div>

            {formData.billingType === 'individual' && (
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">TC Kimlik Numarası <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="tckn"
                        value={formData.tckn || ''}
                        onChange={handleChange}
                        maxLength={11}
                        placeholder="11 haneli TC Kimlik No"
                        className={`w-full px-4 py-3 rounded-xl border transition outline-none ${errors?.tckn
                            ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                            : 'border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200'
                            }`}
                    />
                    {errors?.tckn && <p className="text-red-500 text-xs">{errors.tckn}</p>}
                </div>
            )}

            {formData.billingType === 'corporate' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Vergi Dairesi <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="taxOffice"
                            value={formData.taxOffice || ''}
                            onChange={handleChange}
                            placeholder="Vergi Dairesi Adı"
                            className={`w-full px-4 py-3 rounded-xl border transition outline-none ${errors?.taxOffice
                                ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                                : 'border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200'
                                }`}
                        />
                        {errors?.taxOffice && <p className="text-red-500 text-xs">{errors.taxOffice}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Vergi Numarası <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="taxNumber"
                            value={formData.taxNumber || ''}
                            onChange={handleChange}
                            maxLength={10}
                            placeholder="10 haneli Vergi No"
                            className={`w-full px-4 py-3 rounded-xl border transition outline-none ${errors?.taxNumber
                                ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                                : 'border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200'
                                }`}
                        />
                        {errors?.taxNumber && <p className="text-red-500 text-xs">{errors.taxNumber}</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BillingSection;
