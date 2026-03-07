-- ============================================================
-- homepage_slides tablosu migrasyonu
-- Çalıştırmadan önce mevcut tabloyu kontrol ediniz.
-- ============================================================

CREATE TABLE IF NOT EXISTS `homepage_slides` (
    `id`                        INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `badge`                     VARCHAR(100)  NOT NULL DEFAULT '',
    `icon_key`                  VARCHAR(20)   NOT NULL DEFAULT '🌸',
    `title`                     VARCHAR(255)  NOT NULL DEFAULT '',
    `title_highlight`           VARCHAR(255)  NOT NULL DEFAULT '',
    `description`               TEXT          NOT NULL,
    `primary_button_label`      VARCHAR(100)  NULL,
    `primary_button_to`         VARCHAR(255)  NULL,
    `secondary_button_label`    VARCHAR(100)  NULL,
    `secondary_button_to`       VARCHAR(255)  NULL,
    `accent_color`              VARCHAR(20)   NOT NULL DEFAULT '#db2777',
    `background_image`          VARCHAR(500)  NULL,
    `sort_order`                INT           NOT NULL DEFAULT 0,
    `is_active`                 TINYINT(1)    NOT NULL DEFAULT 1,
    `created_at`                TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`                TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_sort_active` (`sort_order`, `is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Örnek başlangıç verileri (isteğe bağlı)
-- ============================================================

INSERT IGNORE INTO `homepage_slides`
    (`id`, `badge`, `icon_key`, `title`, `title_highlight`, `description`,
     `primary_button_label`, `primary_button_to`,
     `secondary_button_label`, `secondary_button_to`,
     `accent_color`, `background_image`, `sort_order`, `is_active`)
VALUES
(1,
 'Yeni Sezon',
 '🌸',
 'Sevdiklerinize En Güzel',
 'Çiçekleri Gönderin',
 'Taze çiçekler, özenli paketleme ve hızlı teslimat ile sevdiklerinize özel anlar yaşatın.',
 'Ürünleri Keşfet',
 '/products',
 'Bize Ulaşın',
 '/contact',
 '#db2777',
 NULL,
 1,
 1),
(2,
 'Özel Tasarım',
 '💐',
 'Her Duyguya Özel',
 'Buketler',
 'Doğum günü, yıl dönümü veya sadece "seni düşündüm" demek için mükemmel çiçek aranjmanları.',
 'Sipariş Ver',
 '/products',
 NULL,
 NULL,
 '#7c3aed',
 NULL,
 2,
 1);
