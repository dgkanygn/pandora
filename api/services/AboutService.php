<?php
/**
 * About Service
 * about_page tablosunu yönetir — tek satır (singleton) pattern
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/upload.php';

class AboutService {
    private $conn;

    public function __construct() {
        $db = new Database();
        $this->conn = $db->getConnection();
    }

    /**
     * Public + Admin: Tek hakkımızda kaydını getir
     */
    public function get() {
        $stmt = $this->conn->prepare("
            SELECT id, title, description, image_url, created_at, updated_at
            FROM about_page
            ORDER BY id ASC
            LIMIT 1
        ");
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // Tablo boşsa boş nesne döndür
        if (!$row) {
            return ['id' => null, 'title' => '', 'description' => '', 'image_url' => null];
        }

        return $row;
    }

    /**
     * Admin: Güncelle — kayıt yoksa oluştur (upsert)
     */
    public function update($data, $file = null) {
        $existing = $this->get();
        $imageUrl = $existing['image_url'];

        // Resim dosyası varsa yükle
        if ($file && $file['error'] === UPLOAD_ERR_OK) {
            // Eski resmi sil
            if ($imageUrl) {
                Upload::delete($imageUrl);
            }
            $imageUrl = Upload::handleImage($file, 'about');
        }

        if ($existing['id'] === null) {
            // İlk kez oluştur
            $stmt = $this->conn->prepare("
                INSERT INTO about_page (title, description, image_url)
                VALUES (?, ?, ?)
            ");
            $stmt->execute([
                $data['title'] ?? '',
                $data['description'] ?? '',
                $imageUrl
            ]);
        } else {
            $stmt = $this->conn->prepare("
                UPDATE about_page
                SET title = ?, description = ?, image_url = ?, updated_at = NOW()
                WHERE id = ?
            ");
            $stmt->execute([
                $data['title'] ?? $existing['title'],
                $data['description'] ?? $existing['description'],
                $imageUrl,
                $existing['id'],
            ]);
        }

        return $this->get();
    }
}
