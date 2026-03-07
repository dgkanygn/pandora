<?php
/**
 * Category Service
 * Handles category CRUD operations
 */

require_once __DIR__ . '/../config/database.php';

class CategoryService {
    private $conn;
    
    public function __construct() {
        $db = new Database();
        $this->conn = $db->getConnection();
    }
    
    /**
     * Get all active categories (public)
     */
    public function getActive($options = []) {
        $sql = "SELECT * FROM categories WHERE is_active = 1 ORDER BY name ASC";
        $params = [];
        
        if (!empty($options['limit'])) {
            $offset = $options['offset'] ?? 0;
            $sql .= " LIMIT " . intval($offset) . ", " . intval($options['limit']);
        }
        
        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }
    
    /**
     * Get all categories (admin)
     */
    public function getAll($options = []) {
        $sql = "SELECT * FROM categories ORDER BY created_at DESC";
        $params = [];
        
        if (!empty($options['limit'])) {
            $offset = $options['offset'] ?? 0;
            $sql .= " LIMIT " . intval($offset) . ", " . intval($options['limit']);
        }
        
        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }
    
    /**
     * Get category by ID
     */
    public function getById($id) {
        $stmt = $this->conn->prepare("SELECT * FROM categories WHERE id = ?");
        $stmt->execute([$id]);
        $category = $stmt->fetch();
        
        if (!$category) {
            throw new Exception('Kategori bulunamadı');
        }
        
        return $category;
    }
    
    /**
     * Get category by slug
     */
    public function getBySlug($slug) {
        $stmt = $this->conn->prepare("SELECT * FROM categories WHERE slug = ? AND is_active = 1");
        $stmt->execute([$slug]);
        $category = $stmt->fetch();
        
        if (!$category) {
            throw new Exception('Kategori bulunamadı');
        }
        
        return $category;
    }
    
    /**
     * Create category (admin)
     */
    public function create($data) {
        $stmt = $this->conn->prepare("
            INSERT INTO categories (name, slug, description, image_url, is_active, created_at)
            VALUES (?, ?, ?, ?, ?, NOW())
        ");
        $stmt->execute([
            $data['name'],
            $data['slug'],
            $data['description'] ?? null,
            $data['image_url'] ?? null,
            $data['is_active'] ?? 1
        ]);
        
        $id = $this->conn->lastInsertId();
        return $this->getById($id);
    }
    
    /**
     * Update category (admin)
     */
    public function update($id, $updates) {
        $fields = [];
        $values = [];
        
        $allowedFields = ['name', 'slug', 'description', 'image_url', 'is_active'];
        
        foreach ($allowedFields as $field) {
            if (array_key_exists($field, $updates)) {
                $fields[] = "$field = ?";
                $values[] = $updates[$field];
            }
        }
        
        if (empty($fields)) {
            return $this->getById($id);
        }
        
        $fields[] = "updated_at = NOW()";
        $values[] = $id;
        
        $sql = "UPDATE categories SET " . implode(', ', $fields) . " WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute($values);
        
        return $this->getById($id);
    }
    
    /**
     * Delete category (admin)
     */
    public function delete($id) {
        $this->getById($id); // Check exists
        
        $stmt = $this->conn->prepare("DELETE FROM categories WHERE id = ?");
        $stmt->execute([$id]);
        
        return ['message' => 'Kategori başarıyla silindi'];
    }
    
    /**
     * Toggle active status (admin)
     */
    public function toggleActive($id) {
        $category = $this->getById($id);
        $newStatus = $category['is_active'] ? 0 : 1;
        
        $stmt = $this->conn->prepare("UPDATE categories SET is_active = ?, updated_at = NOW() WHERE id = ?");
        $stmt->execute([$newStatus, $id]);
        
        return $this->getById($id);
    }
    /**
     * Get categories with most products
     */
    public function getMostProducts($limit = 10) {
        $stmt = $this->conn->prepare("
            SELECT c.*, COUNT(p.id) as product_count 
            FROM categories c 
            LEFT JOIN products p ON c.id = p.category_id AND p.is_active = 1
            WHERE c.is_active = 1
            GROUP BY c.id 
            ORDER BY product_count DESC 
            LIMIT ?
        ");
        $stmt->execute([intval($limit)]);
        return $stmt->fetchAll();
    }
}
