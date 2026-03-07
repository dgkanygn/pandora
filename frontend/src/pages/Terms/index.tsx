import Footer from '@/components/Footer';
import Navbar from '../../components/Navbar';

const Terms: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-12 pt-32 max-w-4xl">
                <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">Şartlar ve Koşullar</h1>

                    <div className="prose max-w-none text-gray-600 space-y-6">
                        <section>
                            <h2 className="text-xl font-bold text-gray-800 mb-3">1. Giriş</h2>
                            <p>
                                Pandora'ya hoş geldiniz. Bu web sitesini kullanarak, aşağıdaki şartlar ve koşulları kabul etmiş sayılırsınız.
                                Lütfen sitemizi kullanmadan önce bu metni dikkatlice okuyunuz.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-800 mb-3">2. Hizmet Kullanımı</h2>
                            <p>
                                Sitemiz üzerinden sunulan hizmetleri sadece yasal amaçlar için kullanabilirsiniz.
                                Başkalarının haklarına zarar verecek veya hizmetin işleyişini bozacak davranışlarda bulunamazsınız.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-800 mb-3">3. Sipariş ve Ödeme</h2>
                            <p>
                                Verdiğiniz siparişler, stok durumuna ve ödeme onayına tabidir.
                                Fiyatlar ve ürün bilgileri önceden haber verilmeksizin değiştirilebilir.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-800 mb-3">4. Gizlilik</h2>
                            <p>
                                Kişisel verileriniz, Gizlilik Politikamız çerçevesinde korunmaktadır.
                                Bilgileriniz üçüncü şahıslarla izniniz olmaksızın paylaşılmaz.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-800 mb-3">5. Değişiklikler</h2>
                            <p>
                                Bu şartlar ve koşullar zaman zaman güncellenebilir.
                                Değişiklikleri takip etmek kullanıcının sorumluluğundadır.
                            </p>
                        </section>

                        <div className="mt-8 pt-6 border-t font-medium text-gray-800">
                            Son Güncelleme: 01.02.2026
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Terms;
