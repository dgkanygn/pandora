import React from 'react';
import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';

const DistanceSalesContract: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="container mx-auto px-6 md:px-12 lg:px-24 xl:px-32 py-12 pt-32">
                <div className="flex items-center gap-2 mb-8 text-sm text-gray-500">
                    <Link to="/" className="hover:text-pink-600">Anasayfa</Link>
                    <span>/</span>
                    <span className="text-gray-900 font-medium">Mesafeli Satış Sözleşmesi</span>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">Mesafeli Satış Sözleşmesi</h1>

                    <div className="prose prose-pink max-w-none text-gray-700 space-y-6">
                        <p className="font-bold">MESAFELİ SATIŞ SÖZLEŞMESİ</p>

                        <p>İşbu sözleşme 13.06.2003 tarih ve 25137 sayılı Resmi Gazetede yayınlanan Mesafeli Sözleşmeler Uygulama Usul ve Esasları Hakkında Yönetmelik gereği internet üzerinden gerçekleştiren satışlar için sözleşme yapılması zorunluluğuna istinaden düzenlenmiş olup, maddeler halinde aşağıdaki gibidir.</p>

                        <h3 className="text-lg font-bold text-gray-900">MADDE 1 - KONU</h3>
                        <p>İşbu sözleşmenin konusu, SATICI'nın, ALICI'ya satışını yaptığı, aşağıda nitelikleri ve satış fiyatı belirtilen ürünün satışı ve teslimi ile ilgili olarak 4077 sayılı Tüketicilerin Korunması Hakkındaki Kanun-Mesafeli Sözleşmeleri Uygulama Esas ve Usulleri Hakkında Yönetmelik hükümleri gereğince tarafların hak ve yükümlülüklerinin kapsamaktadır.</p>

                        <h3 className="text-lg font-bold text-gray-900">MADDE 2.1 - SATICI BİLGİLERİ</h3>
                        <p>
                            Ünvan: (Bundan sonra SATICI olarak anılacaktır)<br />
                            Adres: <br />
                            Telefon: <br />
                            Faks: <br />
                            E-Posta:
                        </p>

                        <h3 className="text-lg font-bold text-gray-900">MADDE 2.2 - ALICI BİLGİLERİ</h3>
                        <p>
                            Müşteri olarak www.eskisehircicek.com.tr alışveriş sitesine üye olan kişi.<br />
                            Üye olurken veya sipariş verirken kullanılan adres ve iletişim bilgileri esas alınır.
                        </p>

                        <h3 className="text-lg font-bold text-gray-900">MADDE 3 - SÖZLEŞME KONUSU ÜRÜN BİLGİLERİ</h3>
                        <p>Malın / Ürünün / Hizmetin türü, miktarı, marka/modeli, rengi, adedi, satış bedeli, ödeme şekli, siparişin sonlandığı andaki bilgilerden oluşmaktadır</p>

                        <h3 className="text-lg font-bold text-gray-900">MADDE 4 - GENEL HÜKÜMLER</h3>
                        <p>4.1 - ALICI, Madde 3'te belirtilen sözleşme konusu ürün veya ürünlerin temel nitelikleri, satış fiyatı ve ödeme şekli ile teslimata ilişkin tüm ön bilgileri okuyup bilgi sahibi olduğunu ve elektronik ortamda gerekli teyidi verdiğini beyan eder.</p>

                        <p>4.2 - Sözleşme konusu ürün veya ürünler, yasal 30 günlük süreyi aşmamak koşulu ile her bir ürün için ALICI'nın yerleşim yerinin uzaklıgına bağlı olarak ön bilgiler içinde açıklanan süre içinde ALICI veya gösterdiği adresteki kişi/kuruluşa teslim edilir. Bu süre ALICI?Ya daha önce bildirilmek kaydıyla en fazla 10 gün daha uzatılabilir.</p>

                        <p>4.3 - Sözleşme konusu ürün, ALICI'dan başka bir kişi/kuruluşa teslim edilecek ise, teslim edilecek kişi/kuruluşun teslimatı kabul etmemesininden SATICI sorumlu tutulamaz.</p>

                        <p>4.4 - SATICI, sözleşme konusu ürünün saglam, eksiksiz, siparişte belirtilen niteliklere uygun ve varsa garanti belgeleri ve kullanım klavuzları ile teslim edilmesinden sorumludur.</p>

                        <p>4.5 - Sözleşme konusu ürünün teslimatı için işbu sözleşmenin imzalı nüshasının SATICI'ya ulaştırılmış olması ve bedelinin ALICI'nın tercih ettigi ödeme şekli ile ödenmiş olması şarttır. Herhangi bir nedenle ürün bedeli ödenmez veya banka kayıtlarında iptal edilir ise, SATICI ürünün teslimi yükümlülügünden kurtulmuş kabul edilir.</p>

                        <p>4.6- Ürünün tesliminden sonra ALICI'ya ait kredi kartının ALICI'nın kusurundan kaynaklanmayan bir şekilde yetkisiz kişilerce haksız veya hukuka aykırı olarak kullanılması nedeni ile ilgili banka veya finans kuruluşun ürün bedelini SATICI'ya ödememesi halinde, ALICI'nın kendisine teslim edilmiş olması kaydıyla ürünün 3 gün içinde SATICI'ya gönderilmesi zorunludur. Bu takdirde nakliye giderleri ALICI'ya aittir.</p>

                        <p>4.7- SATICI mücbir sebepler veya nakliyeyi engelleyen hava muhalefeti, ulaşımın kesilmesi gibi olağanüstü durumlar nedeni ile sözleşme konusu ürünü süresi içinde teslim edemez ise, durumu ALICI'ya bildirmekle yükümlüdür. Bu takdirde ALICI siparişin iptal edilmesini, sözleşme konusu ürünün varsa emsali ile değiştirilmesini, ve/veya teslimat süresinin engelleyici durumun ortadan kalkmasına kadar ertelenmesi haklarından birini kullanabilir. ALICI'nın siparişi iptal etmesi halinde ödedigi tutar 10 gün içinde kendisine nakten ve defaten ödenir.</p>

                        <p>4.8- Garanti belgesi ile satılan ürünlerden olan veya olmayan ürünlerin arızalı veya bozuk olanlar, garanti şartları içinde gerekli onarımın yapılması için SATICI'ya gönderilebilir, bu takdirde kargo giderleri SATICI tarafından karşılanacaktır.</p>

                        <p>4.9- İşbu sözleşme, SATICI tarafından ALICI'ya faks veya e-posta yoluyla ulaştırılmasından sonra geçerlilik kazanır.</p>

                        <h3 className="text-lg font-bold text-gray-900">MADDE 5 - CAYMA HAKKI</h3>
                        <p>ALICI, sözleşme konusu ürünün kendisine veya gösterdiği adresteki kişi/kuruluşa tesliminden itibaren (7) gün içinde cayma hakkına sahiptir. Cayma hakkının kullanılması için bu süre içinde SATICI'ya faks, e-posta veya telefon ile bildirimde bulunulması ve ürünün ilgili madde hükümleri çercevesinde kullanılmamış olması şarttır. Bu hakkın kullanılması halinde, 3. kişiye veya ALICI'ya teslim edilen ürünün SATICI'ya gönderildigine ilişkin kargo teslim tutanağı örnegi ile fatura aslının iadesi zorunludur. Bu belgelerin ulaşmasını takip eden 7 gün içinde ürün bedeli ALICI'ya iade edilir. Fatura aslı gönderilmez ise KDV ve varsa sair yasal yükümlülükler iade edilemez. Cayma hakkı nedeni ile iade edilen ürünün kargo bedeli SATICI tarafından karşılanır.</p>

                        <p>Niteliği itibarıyle iade edilemeyecek ürünler, tek kullanımlık ürünler, kopyalanabilir yazılım ve programlar, hızlı bozulan veya son kullanım tarihi geçen ürünler için cayma hakkı kullanılamaz.</p>

                        <p>Ayrıca, tüketicinin özel istek ve talepleri uyarınca üretilen veya üzerinde değişiklik ya da ilaveler yapılarak kişiye özel hale getirilen mallarda tüketici cayma hakkını kullanamaz.</p>

                        <h3 className="text-lg font-bold text-gray-900">DİĞER HUSUSLAR:</h3>
                        <p>Ödemenin kredi kartı veya benzeri bir ödeme kartı ile yapılması halinde tüketici, kartın kendi rızası dışında ve hukuka aykırı biçimde kullanıldığı gerekçesiyle ödeme işleminin iptal edilmesini talep edebilir. Bu halde, kartı çıkaran kuruluş itirazın kendisine bildirilmesinden itibaren 10 gün içinde ödeme tutarını tüketiciye iade eder.</p>

                        <p>Borçlunun temerrüde düşmesi halinde, Borçlu borcun gecikmeli ifasından dolayı alacaklının oluşan zarar ve ziyanını ödemeyi kabul eder.</p>

                        <p>İşbu sözleşmenin uygulanmasında, Sanayi ve Ticaret Bakanlığınca ilan edilen değere kadar Tüketici Hakem Heyetleri ile SATICI veya ALICI'nın yerleşim yerindeki Tüketici Mahkemeleri yetkilidir.</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default DistanceSalesContract;
