-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Anamakine: localhost:3306
-- Üretim Zamanı: 03 Mar 2026, 16:10:28
-- Sunucu sürümü: 10.11.14-MariaDB-cll-lve
-- PHP Sürümü: 8.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `eskisehirisg_cicekci`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `blog_posts`
--

CREATE TABLE `blog_posts` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `cover_image` varchar(500) DEFAULT NULL,
  `is_published` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `view_count` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `blog_posts`
--

INSERT INTO `blog_posts` (`id`, `title`, `slug`, `content`, `cover_image`, `is_published`, `created_at`, `updated_at`, `view_count`) VALUES
(3, 'İç Mekan Bitkilerinde Doğru Işık Seçimi', 'ic-mekan-bitkilerinde-dogru-isik-secimi', 'Evinizi Ormana Çevirin: Hangi Çiçek Nerede Durmalı? Content: Her bitkinin ışık ihtiyacı farklıdır. Sukulentler doğrudan güneş ışığına aşıkken, Paşa Kılıcı veya Deve Tabanı gibi türler yarı gölge köşelerde daha mutlu olur. Bitkinizin yaprakları sararıyorsa, ona yeni bir pencere kenarı bulmanın vakti gelmiş olabilir.', NULL, 1, '2026-02-10 11:21:43', NULL, 0),
(4, 'Kesme Çiçeklerin Ömrünü Uzatmanın Sırları', 'kesme-ciceklerin-omrunu-uzatmanin-sirlari', 'Vazodaki Güzelliği Koruyun: Buket Bakım Rehberi Content: Çiçeklerinizin vazoda daha uzun süre taze kalması için saplarını 45 derecelik açıyla kesin ve suyuna bir çay kaşığı şeker ekleyin. Ayrıca suyun içindeki yaprakları temizlemek, bakteri oluşumunu engelleyerek çiçeklerin ömrünü iki katına çıkaracaktır.', NULL, 1, '2026-02-10 11:21:54', NULL, 0),
(5, 'Mevsimlik Çiçek Bakımı', 'mevsimlik-cicek-bakimi', 'Baharın Habercisi: Tek Yıllık Çiçeklerin Gücü Content: Petunya ve Kadife gibi tek yıllık çiçekler, kısa sürede bahçenizi renk cümbüşüne çevirir. Bu bitkilerin sırrı \"baş kesme\" (deadheading) yöntemidir; yani kurumuş çiçekleri koparırsanız, bitki tüm enerjisini yeni tomurcuklar üretmeye harcar.', NULL, 1, '2026-02-10 11:22:06', NULL, 0),
(6, 'Hediye Çiçek Seçimi', 'hediye-cicek-secimi', 'Hangi Çiçek Ne Anlatır? Renklerin Gizli Dili Content: Sadece kırmızı gül değil, her çiçeğin bir mesajı var! Beyaz çiçekler masumiyeti ve yeni başlangıçları simgelerken, sarı çiçekler dostluk ve neşeyi temsil eder. Sevdiklerinize çiçek gönderirken bu gizli dili kullanarak mesajınızı güçlendirebilirsiniz.', NULL, 1, '2026-02-10 11:22:17', '2026-02-26 22:48:48', 1),
(7, 'Sukulentlerin Dayanıklılığı', 'sukulentlerin-dayanikliligi', 'Minimalistlerin Favorisi: Sukulent Bakımında Az Çoktur Content: Sukulentleri öldürmenin en hızlı yolu onları çok sulamaktır. Toprak tamamen kurumadan su vermeyin. Unutmayın, bu dayanıklı dostlarımız ihmal edilmeyi, fazla şefkat gösterilmesine (aşırı sulamaya) tercih ederler.', NULL, 1, '2026-02-10 11:22:29', NULL, 0);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image_url`, `is_active`, `created_at`, `updated_at`) VALUES
(4, 'Kesme Çiçekler', 'kesme-cicekler', 'Vazo ömrü uzun olan, buket ve aranjman yapımı için özel olarak yetiştirilen ticari değeri yüksek çiçeklerdir.', NULL, 1, '2026-02-10 11:02:22', NULL),
(5, 'Sukulent ve Kaktüs Çiçekleri', 'sukulent-ve-kaktus-cicekleri', 'Su tutma kapasitesi yüksek, kurakçıl şartlara dayanıklı ve genellikle egzotik formlarda çiçek açan bitkilerdir.', NULL, 1, '2026-02-10 11:02:42', NULL),
(6, 'Sarmaşık ve Tırmanıcı Çiçekler', 'sarmasik-ve-tirmanici-cicekler', 'Duvarları, çitleri veya çardakları sarmak için dikey yönde büyüme eğilimi gösteren estetik bitkilerdir.', NULL, 1, '2026-02-10 11:05:10', NULL),
(7, 'Egzotik ve Tropikal Çiçekler', 'egzotik-ve-tropikal-cicekler', 'Yüksek nem ve sıcaklık isteyen, alışılagelmişin dışında form ve renklere sahip olan nadir çiçeklerdir.', NULL, 1, '2026-02-10 11:05:18', NULL),
(8, 'Tek Yıllık Çiçekler', 'tek-yillik-cicekler', 'Yaşam döngülerini bir büyüme sezonu içinde tamamlayan, genellikle hızlı büyüyen ve bol çiçek açan bitkilerdir.', NULL, 1, '2026-02-10 11:05:35', NULL);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `homepage_slides`
--

CREATE TABLE `homepage_slides` (
  `id` int(11) NOT NULL,
  `badge` varchar(100) NOT NULL,
  `icon_key` varchar(50) NOT NULL DEFAULT 'flower',
  `title` varchar(255) NOT NULL,
  `title_highlight` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `primary_button_label` varchar(100) DEFAULT NULL,
  `primary_button_to` varchar(255) DEFAULT NULL,
  `secondary_button_label` varchar(100) DEFAULT NULL,
  `secondary_button_to` varchar(255) DEFAULT NULL,
  `accent_color` varchar(20) DEFAULT '#db2777',
  `background_image` varchar(500) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `homepage_slides`
--

INSERT INTO `homepage_slides`
(`id`, `badge`, `icon_key`, `title`, `title_highlight`, `description`,
 `primary_button_label`, `primary_button_to`,
 `secondary_button_label`, `secondary_button_to`,
 `accent_color`, `background_image`,
 `sort_order`, `is_active`, `created_at`, `updated_at`)
VALUES
(1, 'Taze Çiçekler', 'flower', 'Mutluluk Kapınıza', 'Gelsin.',
'Her durum için özenle seçilmiş, taze ve kokulu çiçek koleksiyonumuzu keşfedin. Sevdiklerinizi mutlu etmenin en doğal yolu.',
'Alışverişe Başla', '/products',
'Daha Fazla Bilgi', '/about',
'#db2777', '/assets/blog_post-Ce0O1-Kx.png',
0, 1, '2026-03-03 08:21:52', NULL),

(2, 'Özel Günler', 'gift', 'Sevdiklerinize', 'Sürpriz Yapın.',
'Doğum günleri, yıl dönümleri ve özel anlara özel hazırlanmış buketlerle unutulmaz anılar yaratın.',
'Buketi Keşfet', '/products',
'Koleksiyona Bak', '/products',
'#7c3aed', '/assets/product-DGNRd8Bx.png',
1, 1, '2026-03-03 08:21:52', NULL),

(3, 'Hızlı Teslimat', 'delivery', 'Aynı Gün', 'Kapınızda.',
'Siparişinizi sabah verin, öğleden sonra sevdiklerinizin kapısında olsun. Hızlı ve güvenli teslimat garantisiyle.',
'Hemen Sipariş Ver', '/products',
'Blog''u Oku', '/blog',
'#059669', '/api/uploads/blogs/1770646589-c3b80db5.png',
2, 1, '2026-03-03 08:21:52', NULL);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `neighborhoods`
--

CREATE TABLE `neighborhoods` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `price` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `neighborhoods`
--

INSERT INTO `neighborhoods` (`id`, `name`, `price`) VALUES
(1, 'Göztepe Mh.', 0),
(2, 'Güllük Mh.', 0),
(3, 'Gültepe Mh.', 50),
(4, 'Gündoğdu Mh.', 70),
(5, 'Hacıalibey Mh.', 0),
(6, 'Hacısiyet Mh.', 0),
(7, 'Hayriye Mh.', 0),
(8, 'Hoşnudiye Mh.', 0),
(9, 'Huzur Mh.', 50),
(10, 'Ihlamurkent', 70),
(11, 'Işıklar Mh.', 0),
(12, 'İhsaniye Mh.', 0),
(13, 'İmişehir Organize Sanayi', 250),
(14, 'İnönü mah.', 500),
(15, 'İstiklal mah.', 0),
(16, 'Karabayır bağ.', 100),
(17, 'Çamlıca', 50),
(18, 'Çankaya Mh.', 50),
(19, 'Çukurhisar', 300),
(20, 'Dede mh.', 0),
(21, 'Deliklitaş', 0),
(22, 'Dumlupınar kyk', 50),
(23, 'Emek Mh.', 50),
(24, 'Erenköy Mh.', 50),
(25, 'Ertuğrulgazi Mh.', 0),
(26, 'Esentepe Mh.', 50),
(27, 'Eskibağlar mh.', 0),
(28, 'Fatih mh.', 0),
(29, 'Fevzi Çakmak Mh.', 50),
(30, 'Gaffar Okkan Cd.', 0),
(31, 'Göçmen Evleri', 70),
(32, 'Gökmeydan Mh.', 0),
(33, '61 Evler', 0),
(34, '71 Evler', 100),
(35, '75. yıl mah.', 250),
(36, 'Akarbaşı mah.', 0),
(37, 'Akcami mh.', 0),
(38, 'Anadolu Ü. Civarı', 0),
(39, 'Anemon otel', 0),
(40, 'Arifiye mah.', 0),
(41, 'Aşağı Söğütönü', 100),
(42, 'Atatürk Bulvarı', 0),
(43, 'Atayurt okulları', 100),
(44, 'Bahçelievler', 0),
(45, 'Baksan', 0),
(46, 'Batıkent', 70),
(47, 'Beşevler Mh.', 0),
(48, 'Bursa Yolu', 100),
(49, 'Büyükdere', 0),
(50, 'Cumhuriye Mh.', 0),
(51, 'Cunudiye Mh.', 0),
(52, 'Kırmızıtoprak Mh.', 0),
(53, 'Kızılcıklı MP Cd.', 0),
(54, 'Köprübaşı', 0),
(55, 'Kumlubel', 0),
(56, 'Kurtuluş mah.', 0),
(57, 'Kuyubaşı Mh.', 50),
(58, 'Küme Evleri', 50),
(59, 'Kütahya yolu', 150),
(60, 'Mamure mh.', 0),
(61, 'Merkez', 0),
(62, 'Mustafa Kemal Paşa Mh.', 0),
(63, 'Muttalip Cd.', 0),
(64, 'Muttalip Mahallesi', 150),
(65, 'Organize san.', 250),
(66, 'Orhangazi Mh.', 100),
(67, 'Orta mh.', 100),
(68, 'Osmangazi Mh.', 0),
(69, 'Osmangazi üniv', 50),
(70, 'Ömerağa Mh.', 0),
(71, 'Ömür Mh.', 100),
(72, 'Radar Mh.', 50),
(73, 'Raykent', 0),
(74, 'Rixos otel', 50),
(75, 'Sakarya Cd.', 0),
(76, 'Sakintepe Mh.', 200),
(77, 'Sazova Mh.', 60),
(78, 'Sıraevler', 40),
(79, 'Sivrihisar', 120),
(80, 'Sivrihisar Cd.', 0),
(81, 'Sultandere', 200),
(82, 'Sümer Mh.', 0),
(83, 'Sütlüce Mh.', 30),
(84, 'Şarhöyük Mh.', 30),
(85, 'Şarkiye mh.', 0),
(86, 'Şeker mh.', 0),
(87, 'Şirintepe Mh.', 50),
(88, 'Takkalı mah.', 70),
(89, 'Ted koleji', 150),
(90, 'Teksan', 250),
(91, 'Terzievleri', 50),
(92, 'Tunalı Mh.', 0),
(93, 'Uluönder Mh.', 0),
(94, 'Üniversite Evleri', 50),
(95, 'Vadişehir', 70),
(96, 'Vatan Cd.', 0),
(97, 'Vişnelik Mh.', 0),
(98, 'Yeni Bağlar Mh.', 0),
(99, 'Yeni Mh.', 0),
(100, 'Yenidoğan Mh.', 50),
(101, 'Yenikent', 0),
(102, 'Yenişehir konakları', 250),
(103, 'Yeşiltepe Mh.', 50),
(104, 'Yıldıztepe Mh.', 0),
(105, 'Yukarı Söğütönü', 150),
(106, 'Yunuskent', 0),
(107, 'Zafer Mh.', 0),
(108, 'Zincirlikuyu Mh.', 100);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` varchar(36) DEFAULT NULL,
  `order_code` varchar(16) NOT NULL,
  `total_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `status` enum('pending','paid','shipped','delivered','cancelled') DEFAULT 'pending',
  `address` text NOT NULL,
  `customer_name` varchar(100) NOT NULL,
  `customer_email` varchar(150) NOT NULL,
  `customer_phone` varchar(20) NOT NULL,
  `receiver_name` varchar(100) NOT NULL,
  `receiver_phone` varchar(20) NOT NULL,
  `delivery_date` date NOT NULL,
  `delivery_time_slot` varchar(50) NOT NULL,
  `city` varchar(100) DEFAULT NULL,
  `district` varchar(100) NOT NULL,
  `delivery_note` text DEFAULT NULL,
  `show_name_on_card` tinyint(1) DEFAULT 0,
  `delivery_confirmation` tinyint(1) DEFAULT 0,
  `user_message` text DEFAULT NULL,
  `invoice_type` varchar(20) DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `contract_accepted` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `flower_note` varchar(300) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `order_code`, `total_price`, `status`, `address`, `customer_name`, `customer_email`, `customer_phone`, `receiver_name`, `receiver_phone`, `delivery_date`, `delivery_time_slot`, `city`, `district`, `delivery_note`, `show_name_on_card`, `delivery_confirmation`, `user_message`, `invoice_type`, `payment_method`, `contract_accepted`, `created_at`, `updated_at`, `flower_note`) VALUES
(2, NULL, 'Z2WCLDK6F566RA3R', 420.00, 'paid', 'huzur mh güven sokak', 'doğukan uygun', 'dogukanuygun@gmail.com', '5337070226', 'ahmet yılmaz', '5402652321', '2026-02-10', '15:00-18:00', 'İstanbul', 'Huzur Mh.', 'taziye', 1, 0, 'başınız sağ olsun', 'receipt', 'credit_card', 1, '2026-02-10 11:36:15', '2026-02-10 13:00:46', NULL),
(3, NULL, 'L6NQC3L6UV5WE8JS', 500.00, 'shipped', 'asdasdasdsadsads asdsadsadsadasd', 'yusuf çetin', 'cycetin@gmail.com', '0545 269 1343', 'yusuf çetin', '0545 269 1343', '2026-02-11', '15:00-18:00', 'İstanbul', 'Akcami mh.', 'asdasdasdasdsadsadsad', 0, 0, 'asdasdasdsadasdasd', 'receipt', 'credit_card', 1, '2026-02-10 13:04:24', '2026-02-10 13:05:53', NULL),
(4, '0c58eeab-6889-429b-ae5b-fef5bc6d5e76', 'GUYAFEVXEJXFFRTN', 500.00, 'delivered', 'asdasdasd', 'deneme deneme', 'cycetin@gmail.com', '05452691343', 'sadsadsad', '5435435435435', '2026-02-10', '09:00-12:00', 'İstanbul', 'Gültepe Mh.', 'asdasdsad', 1, 1, 'asdasdas', 'receipt', 'credit_card', 1, '2026-02-10 13:14:39', '2026-02-10 13:15:02', NULL),
(5, '0c58eeab-6889-429b-ae5b-fef5bc6d5e76', '6EWCMPRBZQJHWFHL', 500.00, 'pending', 'asdasdasdasd', 'cycetin', 'cycetin@gmail.com', '534535435', 'asdasdasd', '5435435435', '2026-02-11', '18:00-21:00', 'İstanbul', 'Hacıalibey Mh.', 'asdasdsadasd', 1, 1, 'asdasdasdasdsadsadas', 'individual', 'credit_card', 1, '2026-02-10 13:17:09', NULL, NULL),
(6, NULL, 'FNS2BQR32LEMR929', 620.00, 'pending', 'dfsdffsdfsd', 'lsdalsd', 'sdasdadsa', '424343343432', 'fssfdfsdfdsffds', '34224343234', '2026-02-15', '15:00-18:00', 'İstanbul', 'Karabayır bağ.', 'sfdfsdfsdsddfdf', 1, 1, 'sfdsdfsdffdsfsd', 'receipt', 'transfer', 1, '2026-02-11 16:33:12', NULL, NULL),
(7, NULL, 'CT8GYD6UK36GFH8P', 1000.00, 'pending', 'dsdsadsasdasdasda', 'sadsasads', 'asdasdasd', '3432424324', 'sdsfsdfsdfsfdsfd', '324243343423423', '2026-02-15', '12:00-15:00', 'İstanbul', 'Huzur Mh.', 'sdadassdasdasdasda', 0, 0, 'asdasdasdsaddsa', 'receipt', 'transfer', 1, '2026-02-11 16:33:51', NULL, NULL),
(8, NULL, '4MLETQ3SU4WDNZR2', 500.00, 'pending', 'sasdadsasa', 'sdsadadsasd', 'sadasdasd', '343242432424334', 'asdadsadsads', '234234324343', '2026-02-10', '12:00-15:00', 'İstanbul', 'İmişehir Organize Sanayi', 'sdadsadsadsa', 0, 0, 'asasdadsadsads', 'individual', 'transfer', 1, '2026-02-11 16:34:37', NULL, NULL),
(9, NULL, '5SEFGLYMNPKVN42V', 1000.00, 'pending', 'sdaadssad', 'asdsdasada', 'asdasdasdasd', '343243234243', 'dsadsasdaddsadsa', '3424232432424', '2026-02-05', '12:00-15:00', 'İstanbul', 'Çamlıca', 'sdadsasdasda', 0, 0, 'sadsadsdasasasda', 'individual', 'transfer', 1, '2026-02-11 16:35:11', NULL, NULL),
(10, NULL, 'HEN378ZY2J9XSLXT', 100.00, 'pending', 'dfsfdfddfdf', 'test', 'test@test.com', '05337070226', 'dasasdsaddsadsa', '05337070226', '2026-02-15', '10:30', 'Eskişehir', 'Bursa Yolu', '', 0, 0, '', 'receipt', 'transfer', 1, '2026-02-12 19:10:28', NULL, NULL),
(11, NULL, '7M44HMXJ2MFJ53AT', 1000.00, 'pending', 'test', 'doğukan uygun', 'dgkanygn@gmail.com', '05337070226', 'ahmet yurtsever', '05337070226', '2026-02-15', '15:00', 'Eskişehir', 'Atatürk Bulvarı', '', 0, 0, '', 'receipt', 'transfer', 1, '2026-02-12 19:50:52', '2026-02-14 00:11:34', NULL),
(12, NULL, 'H9EVVGGM2A7PGUME', 1000.00, 'pending', 'test', 'doğukan uygun', 'dgkanygn@gmail.com', '05337070226', 'test bey', '05337070226', '2026-02-15', '15:00', 'Eskişehir', 'Aşağı Söğütönü', '', 0, 0, '', 'receipt', 'transfer', 1, '2026-02-12 19:53:02', NULL, NULL),
(13, NULL, 'TLCBZ6XGD43K86LB', 1000.00, 'paid', 'test', 'doğu uygun', 'dgkanygn@gmail.com', '05337070226', 'test', '05337070226', '2026-02-15', '10:30', 'Eskişehir', 'Işıklar Mh.', '', 0, 0, '', 'receipt', 'transfer', 1, '2026-02-12 20:03:29', '2026-02-12 20:05:35', NULL),
(14, NULL, 'M9SX7JADYUK7TKG8', 420.00, 'pending', 'test', 'asdsdsad', 'dgkanygn@gmail.com', '05337070226', 'aaaaaaaaa', '05355651224', '2026-03-10', '10:30', 'Eskişehir', 'Çankaya Mh.', '', 0, 0, '', 'individual', 'credit_card', 1, '2026-02-18 08:48:28', NULL, NULL),
(15, NULL, 'VUUNS9QYX9QK427M', 900.00, 'pending', 'dassaddsasdasdadsa', 'ASDASDSDSD', 'sadasd@asdasd.com', '05337775555', 'asdsaddsasadsda', '05333666665', '2026-03-10', '10:30', 'Eskişehir', '71 Evler', 'sdadsadsasdadsa', 0, 0, 'dsadassadsaddas', 'individual', 'credit_card', 1, '2026-02-21 14:33:57', NULL, NULL);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `product_name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `product_name`, `price`, `quantity`) VALUES
(2, 2, 4, 'Cennet Kuşu (Strelitzia)', 120.00, 1),
(3, 2, 3, 'Kadife Çiçeği (Tagetes)', 300.00, 1),
(4, 3, 6, 'Eçeverya (Echeveria Elegans)', 500.00, 1),
(5, 4, 5, 'Mor Salkım (Wisteria)', 500.00, 1),
(6, 5, 5, 'Mor Salkım (Wisteria)', 500.00, 1),
(7, 6, 5, 'Mor Salkım (Wisteria)', 500.00, 1),
(8, 6, 4, 'Cennet Kuşu (Strelitzia)', 120.00, 1),
(9, 7, 5, 'Mor Salkım (Wisteria)', 500.00, 1),
(10, 7, 6, 'Eçeverya (Echeveria Elegans)', 500.00, 1),
(11, 8, 6, 'Eçeverya (Echeveria Elegans)', 500.00, 1),
(12, 9, 6, 'Eçeverya (Echeveria Elegans)', 500.00, 1),
(13, 9, 5, 'Mor Salkım (Wisteria)', 500.00, 1),
(14, 10, NULL, 'test 1', 100.00, 1),
(15, 11, 5, 'Mor Salkım (Wisteria)', 500.00, 1),
(16, 11, 6, 'Eçeverya (Echeveria Elegans)', 500.00, 1),
(17, 12, 5, 'Mor Salkım (Wisteria)', 500.00, 2),
(18, 13, 6, 'Eçeverya (Echeveria Elegans)', 500.00, 2),
(19, 14, 3, 'Kadife Çiçeği (Tagetes)', 300.00, 1),
(20, 14, 4, 'Cennet Kuşu (Strelitzia)', 120.00, 1),
(21, 15, 3, 'Kadife Çiçeği (Tagetes)', 300.00, 3);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `stock` int(11) DEFAULT 0,
  `image_url` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `view_count` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `products`
--

INSERT INTO `products` (`id`, `category_id`, `name`, `description`, `price`, `stock`, `image_url`, `is_active`, `created_at`, `updated_at`, `view_count`) VALUES
(2, 8, 'Petunya (Petunia Hybrida)', 'Balkon ve bahçelerin vazgeçilmezi olan, bahardan donlara kadar aralıksız çiçek açan popüler bir türdür.', 250.00, 10, NULL, 1, '2026-02-10 11:08:16', '2026-02-26 23:27:55', 3),
(3, 8, 'Kadife Çiçeği (Tagetes)', 'Canlı turuncu ve sarı tonlarıyla bilinen, haşereleri uzak tutma özelliği sayesinde bahçelerde sıkça tercih edilen dayanıklı bir çiçektir.', 300.00, 7, 'https://eskisehirisg.com/api/uploads/products/1772147690-c624084c.png', 1, '2026-02-10 11:08:31', '2026-03-01 12:29:51', 10),
(4, 7, 'Cennet Kuşu (Strelitzia)', 'Sıradışı formuyla bir kuşun başını andıran, turuncu ve mavi renklerin hakim olduğu görkemli bir tropikal bitkidir.', 120.00, 2, 'https://eskisehirisg.com/api/uploads/products/1772148124-1b06a19c.png', 1, '2026-02-10 11:09:05', '2026-03-03 12:53:48', 11),
(5, 6, 'Mor Salkım (Wisteria)', 'Bahar aylarında salkımlar halinde açan hoş kokulu mor çiçekleri ile çardak ve duvarları tamamen kaplayan güçlü bir tırmanıcıdır.', 500.00, 2, NULL, 1, '2026-02-10 11:19:21', '2026-02-27 08:39:31', 8),
(6, 5, 'Eçeverya (Echeveria Elegans)', 'Gül formundaki yaprak dizilimiyle dikkat çeken, az su isteyen ve doğrudan güneş ışığını seven estetik bir sukulenttir.', 500.00, 0, NULL, 1, '2026-02-10 11:19:51', '2026-03-01 12:29:19', 2),
(10, 8, 'deneme', 'deneme', 200.00, 20, 'https://eskisehirisg.com/api/uploads/products/1772522571-02dda797.webp', 1, '2026-03-03 07:22:51', '2026-03-03 12:53:41', 1);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `product_images`
--

CREATE TABLE `product_images` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `image_url`, `sort_order`, `created_at`) VALUES
(1, 4, 'https://eskisehirisg.com/api/uploads/products/1772148121-a53bc765.png', 0, '2026-02-26 23:22:01'),
(2, 4, 'https://eskisehirisg.com/api/uploads/products/1772148122-ab606683.png', 1, '2026-02-26 23:22:02'),
(3, 4, 'https://eskisehirisg.com/api/uploads/products/1772148124-1b06a19c.png', 2, '2026-02-26 23:22:04'),
(4, 4, 'https://eskisehirisg.com/api/uploads/products/1772149699-412aedbd.png', 3, '2026-02-26 23:48:19'),
(5, 4, 'https://eskisehirisg.com/api/uploads/products/1772149969-fc69e5b1.png', 4, '2026-02-26 23:52:49'),
(6, 4, 'https://eskisehirisg.com/api/uploads/products/1772149970-a38f9f0f.png', 5, '2026-02-26 23:52:50'),
(7, 10, 'https://eskisehirisg.com/api/uploads/products/1772522571-02dda797.webp', 0, '2026-03-03 07:22:51'),
(8, 10, 'https://eskisehirisg.com/api/uploads/products/1772522572-6522bd44.png', 1, '2026-03-03 07:22:52'),
(9, 3, 'https://eskisehirisg.com/api/uploads/products/1772147690-c624084c.png', 0, '2026-03-03 07:33:59');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `profiles`
--

CREATE TABLE `profiles` (
  `id` varchar(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `username` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `profiles`
--

INSERT INTO `profiles` (`id`, `email`, `password`, `username`, `phone`, `role`, `is_active`, `created_at`, `updated_at`) VALUES
('0c58eeab-6889-429b-ae5b-fef5bc6d5e76', 'cycetin@gmail.com', '$2y$10$0WQxg2HV3.myU/Arz.7TLOyc7kqEsDy9MU2PmKd7b6IvXsfGOUCrm', 'deneme deneme', '05452691343', 'admin', 1, '2026-02-10 13:13:51', '2026-02-26 22:34:46'),
('eb13d7ca-fc05-4690-b4ee-c067cc54e4af', 'admin@admin.com', '$2y$10$50ws2K19X6D7HW43TLxbAOUxVbIERZxY/9Fyjx5v3DxSUFus/jrxq', 'admin', NULL, 'admin', 1, '2026-02-06 22:59:27', '2026-02-07 11:42:19');

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `blog_posts`
--
ALTER TABLE `blog_posts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_slug` (`slug`),
  ADD KEY `idx_is_published` (`is_published`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Tablo için indeksler `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_slug` (`slug`),
  ADD KEY `idx_is_active` (`is_active`);

--
-- Tablo için indeksler `homepage_slides`
--
ALTER TABLE `homepage_slides`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_sort` (`sort_order`),
  ADD KEY `idx_active` (`is_active`);

--
-- Tablo için indeksler `neighborhoods`
--
ALTER TABLE `neighborhoods`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_code` (`order_code`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_order_code` (`order_code`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Tablo için indeksler `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_order_id` (`order_id`),
  ADD KEY `idx_product_id` (`product_id`);

--
-- Tablo için indeksler `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_category` (`category_id`),
  ADD KEY `idx_is_active` (`is_active`),
  ADD KEY `idx_price` (`price`),
  ADD KEY `idx_name` (`name`);

--
-- Tablo için indeksler `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_product_id` (`product_id`);

--
-- Tablo için indeksler `profiles`
--
ALTER TABLE `profiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_username` (`username`),
  ADD KEY `idx_role` (`role`),
  ADD KEY `idx_is_active` (`is_active`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `blog_posts`
--
ALTER TABLE `blog_posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Tablo için AUTO_INCREMENT değeri `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Tablo için AUTO_INCREMENT değeri `homepage_slides`
--
ALTER TABLE `homepage_slides`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Tablo için AUTO_INCREMENT değeri `neighborhoods`
--
ALTER TABLE `neighborhoods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=111;

--
-- Tablo için AUTO_INCREMENT değeri `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Tablo için AUTO_INCREMENT değeri `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- Tablo için AUTO_INCREMENT değeri `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Tablo için AUTO_INCREMENT değeri `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Dökümü yapılmış tablolar için kısıtlamalar
--

--
-- Tablo kısıtlamaları `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `profiles` (`id`) ON DELETE SET NULL;

--
-- Tablo kısıtlamaları `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL;

--
-- Tablo kısıtlamaları `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Tablo kısıtlamaları `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
