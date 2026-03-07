<?php
/**
 * ContactInfo Service
 * site_contact_info tablosunu yönetir — tek satır (singleton) pattern
 */

require_once __DIR__ . '/../config/database.php';

class ContactInfoService {
    private $conn;

    public function __construct() {
        $db = new Database();
        $this->conn = $db->getConnection();
    }

    /**
     * Public + Admin: Tek iletişim kaydını getir
     */
    public function get() {
        $stmt = $this->conn->prepare("
            SELECT id, phone, instagram, address, contact_email, created_at, updated_at
            FROM site_contact_info
            ORDER BY id ASC
            LIMIT 1
        ");
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // Tablo boşsa boş nesne döndür
        if (!$row) {
            return ['id' => null, 'phone' => '', 'instagram' => '', 'address' => '', 'contact_email' => ''];
        }

        return $row;
    }

    /**
     * Admin: Güncelle — kayıt yoksa oluştur (upsert)
     */
    public function update($data) {
        $existing = $this->get();

        if ($existing['id'] === null) {
            // İlk kez oluştur
            $stmt = $this->conn->prepare("
                INSERT INTO site_contact_info (phone, instagram, address, contact_email)
                VALUES (?, ?, ?, ?)
            ");
            $stmt->execute([
                $data['phone']     ?? '',
                $data['instagram'] ?? '',
                $data['address']   ?? '',
                $data['contact_email'] ?? '',
            ]);
        } else {
            $stmt = $this->conn->prepare("
                UPDATE site_contact_info
                SET phone = ?, instagram = ?, address = ?, contact_email = ?, updated_at = NOW()
                WHERE id = ?
            ");
            $stmt->execute([
                $data['phone']     ?? $existing['phone'],
                $data['instagram'] ?? $existing['instagram'],
                $data['address']   ?? $existing['address'],
                $data['contact_email'] ?? $existing['contact_email'],
                $existing['id'],
            ]);
        }

        return $this->get();
    }
}
