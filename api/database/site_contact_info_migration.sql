-- ============================================================
-- site_contact_info tablosu migrasyonu
-- ============================================================

CREATE TABLE IF NOT EXISTS `site_contact_info` (
    `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `phone`       VARCHAR(50)  NOT NULL DEFAULT '',
    `instagram`   VARCHAR(100) NOT NULL DEFAULT '',
    `address`     TEXT         NOT NULL,
    `created_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Başlangıç kaydı (isteğe bağlı)
INSERT IGNORE INTO `site_contact_info` (`id`, `phone`, `instagram`, `address`)
VALUES (1, '', '', '');
