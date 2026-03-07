import { useState, useEffect } from 'react';
import { HiLocationMarker, HiPhone, HiOutlineHashtag, HiOutlineMail } from 'react-icons/hi';
import ContactCard from './components/ContactCard';
import { contactInfoAPI } from '../../services/contactInfo';
import type { ContactInfo } from '../../services/contactInfo';
import toast from 'react-hot-toast';

export default function Contact() {
    const [contact, setContact] = useState<ContactInfo>({
        id: null,
        phone: '',
        instagram: '',
        address: '',
        contact_email: '',
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        contactInfoAPI.get()
            .then(setContact)
            .catch(() => toast.error('İletişim bilgileri yüklenemedi.'))
            .finally(() => setIsLoading(false));
    }, []);

    const handleSave = async (field: 'phone' | 'instagram' | 'address' | 'contact_email', value: string) => {
        const updated = {
            phone: contact.phone,
            instagram: contact.instagram,
            address: contact.address,
            contact_email: contact.contact_email,
            [field]: value
        };
        const result = await contactInfoAPI.update(updated);
        setContact(result);
        toast.success('İletişim bilgisi güncellendi.');
    };

    return (
        <div className="p-4 sm:p-6 pb-20 sm:pb-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">İletişim Bilgileri</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Müşterilerinizin size ulaşabileceği iletişim bilgilerini buradan güncelleyebilirsiniz.
                </p>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-24">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <ContactCard
                        title="Açık Adres"
                        icon={<HiLocationMarker className="h-6 w-6 text-indigo-500" />}
                        value={contact.address}
                        onSave={(value) => handleSave('address', value)}
                        isTextArea
                    />
                    <ContactCard
                        title="Telefon Numarası"
                        icon={<HiPhone className="h-6 w-6 text-indigo-500" />}
                        value={contact.phone}
                        onSave={(value) => handleSave('phone', value)}
                    />
                    <ContactCard
                        title="Instagram Kullanıcı Adı"
                        icon={<HiOutlineHashtag className="h-6 w-6 text-indigo-500" />}
                        value={contact.instagram}
                        onSave={(value) => handleSave('instagram', value)}
                    />
                    <ContactCard
                        title="E-posta Adresi"
                        icon={<HiOutlineMail className="h-6 w-6 text-indigo-500" />}
                        value={contact.contact_email}
                        onSave={(value) => handleSave('contact_email', value)}
                    />
                </div>
            )}

            <div className="mt-8 bg-indigo-50 rounded-xl p-4 border border-indigo-100 flex items-start gap-3">
                <div className="bg-indigo-100 p-2 rounded-lg mt-0.5">
                    <HiLocationMarker className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                    <h3 className="font-medium text-indigo-900">Neden iletişim bilgileri önemli?</h3>
                    <p className="text-sm text-indigo-700 mt-1">
                        Bu bilgiler sitenizin alt kısmında (footer) ve İletişim sayfasında gösterilir. Müşterilerinizin size güvenmesi ve kolayca ulaşabilmesi için bilgilerinizin her zaman güncel olmasına dikkat edin.
                    </p>
                </div>
            </div>
        </div>
    );
}
