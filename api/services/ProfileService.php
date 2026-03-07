<?php
/**
 * Profile Service
 * Handles user profile operations
 */

require_once __DIR__ . '/../config/database.php';

class ProfileService {
    private $conn;
    
    public function __construct() {
        $db = new Database();
        $this->conn = $db->getConnection();
    }
    
    /**
     * Get profile by ID
     */
    public function getById($id) {
        $stmt = $this->conn->prepare("
            SELECT id, email, username, phone, role, is_active, created_at, updated_at
            FROM profiles WHERE id = ?
        ");
        $stmt->execute([$id]);
        $profile = $stmt->fetch();
        
        if (!$profile) {
            throw new Exception('Profil bulunamadı');
        }
        
        return $profile;
    }
    
    /**
     * Get all profiles (admin)
     */
    public function getAll() {
        $stmt = $this->conn->prepare("
            SELECT id, email, username, phone, role, is_active, created_at, updated_at
            FROM profiles
            ORDER BY created_at DESC
        ");
        $stmt->execute();
        return $stmt->fetchAll();
    }
    
    /**
     * Update profile
     */
    public function update($id, $updates) {
        $fields = [];
        $values = [];
        
        $allowedFields = ['username', 'phone'];
        
        foreach ($allowedFields as $field) {
            if (isset($updates[$field])) {
                $fields[] = "$field = ?";
                $values[] = $updates[$field];
            }
        }
        
        if (empty($fields)) {
            throw new Exception('Güncellenecek geçerli alan bulunamadı');
        }
        
        $fields[] = "updated_at = NOW()";
        $values[] = $id;
        
        $sql = "UPDATE profiles SET " . implode(', ', $fields) . " WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute($values);
        
        return $this->getById($id);
    }
    
    /**
     * Toggle active status (admin)
     */
    public function toggleActive($id) {
        $stmt = $this->conn->prepare("SELECT is_active FROM profiles WHERE id = ?");
        $stmt->execute([$id]);
        $profile = $stmt->fetch();
        
        if (!$profile) {
            throw new Exception('Profil bulunamadı');
        }
        
        $newStatus = $profile['is_active'] ? 0 : 1;
        
        $stmt = $this->conn->prepare("UPDATE profiles SET is_active = ?, updated_at = NOW() WHERE id = ?");
        $stmt->execute([$newStatus, $id]);
        
        return $this->getById($id);
    }
    
    /**
     * Update role (admin)
     */
    public function updateRole($id, $role) {
        if (!in_array($role, ['user', 'admin'])) {
            throw new Exception('Geçersiz rol');
        }
        
        $stmt = $this->conn->prepare("UPDATE profiles SET role = ?, updated_at = NOW() WHERE id = ?");
        $stmt->execute([$role, $id]);
        
        return $this->getById($id);
    }
}
