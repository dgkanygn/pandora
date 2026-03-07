import React from 'react';

interface AdditionalOptionsSectionProps {
    formData: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    errors?: Partial<Record<string, string>>;
}

const AdditionalOptionsSection: React.FC<AdditionalOptionsSectionProps> = ({ formData, handleChange, errors = {} }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="bg-pink-100 text-pink-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                Ek Seçenekler
            </h2>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Çiçek üzerindeki kartta adınız görünsün mü?
                    </label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="showNameOnCard"
                                value="yes"
                                checked={formData.showNameOnCard === 'yes'}
                                onChange={handleChange}
                                className="text-pink-600 focus:ring-pink-500"
                            />
                            <span>Evet</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="showNameOnCard"
                                value="no"
                                checked={formData.showNameOnCard === 'no'}
                                onChange={handleChange}
                                className="text-pink-600 focus:ring-pink-500"
                            />
                            <span>Hayır</span>
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teslim teyidi ister misiniz?
                    </label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="deliveryConfirmation"
                                value="yes"
                                checked={formData.deliveryConfirmation === 'yes'}
                                onChange={handleChange}
                                className="text-pink-600 focus:ring-pink-500"
                            />
                            <span>Evet</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="deliveryConfirmation"
                                value="no"
                                checked={formData.deliveryConfirmation === 'no'}
                                onChange={handleChange}
                                className="text-pink-600 focus:ring-pink-500"
                            />
                            <span>Hayır</span>
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bize (çiçekçiye) bir mesajınız var mı?
                    </label>
                    <textarea
                        name="messageToFlorist"
                        value={formData.messageToFlorist}
                        onChange={handleChange}
                        maxLength={500}
                        rows={3}
                        className={`w-full px-4 py-3 rounded-xl border transition outline-none resize-none ${errors.messageToFlorist
                            ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                            : 'border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200'
                            }`}
                        placeholder="Özel istekleriniz..."
                    ></textarea>
                    {errors.messageToFlorist && <p className="text-red-500 text-xs">{errors.messageToFlorist}</p>}
                </div>
            </div>
        </div>
    );
};

export default AdditionalOptionsSection;
