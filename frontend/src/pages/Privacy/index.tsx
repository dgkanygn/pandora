import Footer from '@/components/Footer';
import Navbar from '../../components/Navbar';

const Privacy: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-12 pt-32 max-w-4xl">
                <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">Gizlilik ve KVKK Politikası</h1>

                    <div className="prose max-w-none text-gray-600 space-y-8">
                        <section>
                            <h2 className="text-xl font-bold text-gray-800 mb-3">1. Giriş ve Amaç</h2>
                            <p>
                                Pandora olarak kişisel verilerinizin güvenliği hususuna azami hassasiyet göstermekteyiz.
                                Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında, veri sorumlusu sıfatıyla
                                işlediğimiz kişisel verileriniz hakkında sizleri aydınlatmak amacıyla hazırlanmıştır.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-800 mb-3">2. İşlenen Kişisel Verileriniz</h2>
                            <p className="mb-2">Tarafımızca işlenen kişisel verileriniz şunlardır:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Kimlik Bilgileri (Ad, Soyad)</li>
                                <li>İletişim Bilgileri (E-posta adresi, Telefon numarası, Adres)</li>
                                <li>İşlem Güvenliği Bilgileri (IP adresi, Giriş-Çıkış kayıtları)</li>
                                <li>Müşteri İşlem Bilgileri (Sipariş geçmişi, Sepet bilgileri)</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-800 mb-3">3. Kişisel Verilerin İşlenme Amaçları</h2>
                            <p>
                                Kişisel verileriniz; ürün ve hizmetlerin sizlere sunulabilmesi, sipariş süreçlerinin yönetilmesi,
                                iletişim faaliyetlerinin yürütülmesi ve yasal yükümlülüklerin yerine getirilmesi amaçlarıyla işlenmektedir.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-800 mb-3">4. Çerez (Cookie) Politikası</h2>
                            <p>
                                Sitemizde, kullanıcı deneyimini geliştirmek, sitenin verimli çalışmasını sağlamak ve hizmetlerimizi
                                kişiselleştirmek amacıyla çerezler kullanılmaktadır. Tarayıcı ayarlarınızdan çerezleri dilediğiniz zaman yönetebilir
                                veya silebilirsiniz. Ancak çerezleri devre dışı bırakmanız durumunda sitenin bazı fonksiyonları çalışmayabilir.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-800 mb-3">5. Haklarınız</h2>
                            <p>
                                KVKK'nın 11. maddesi uyarınca; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme,
                                verilerin düzeltilmesini veya silinmesini isteme haklarına sahipsiniz. Taleplerinizi iletişim formumuz üzerinden bize iletebilirsiniz.
                            </p>
                        </section>

                        <div className="mt-8 pt-6 border-t font-medium text-gray-800">
                            Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Privacy;
