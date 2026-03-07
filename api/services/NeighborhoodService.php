<?php
/**
 * Neighborhood Service
 * Handles neighborhood CRUD operations
 */

require_once __DIR__ . '/../config/database.php';

class NeighborhoodService {
    private $conn;
    
    public function __construct() {
        $db = new Database();
        $this->conn = $db->getConnection();
    }
    
    /**
     * Get all neighborhoods with filtering and pagination
     */
    public function getAll($options = []) {
        $sql = "SELECT * FROM neighborhoods WHERE 1=1";
        $params = [];
        
        // Filter by name
        if (!empty($options['name'])) {
            $sql .= " AND name LIKE ?";
            $params[] = "%" . $options['name'] . "%";
        }
        
        // Default sort by name
        $sql .= " ORDER BY name ASC";
        
        // Pagination
        if (!empty($options['limit'])) {
            $offset = $options['offset'] ?? 0;
            $sql .= " LIMIT " . intval($offset) . ", " . intval($options['limit']);
        }
        
        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }
    
    /**
     * Get neighborhood by ID
     */
    public function getById($id) {
        $stmt = $this->conn->prepare("SELECT * FROM neighborhoods WHERE id = ?");
        $stmt->execute([$id]);
        $neighborhood = $stmt->fetch();
        
        if (!$neighborhood) {
            throw new Exception('Mahalle bulunamadı');
        }
        
        return $neighborhood;
    }
    
    /**
     * Create neighborhood (admin)
     */
    public function create($data) {
        if (empty($data['name'])) {
            throw new Exception('Mahalle adı zorunludur');
        }
        
        // Price defaults to 0 if not provided
        $price = isset($data['price']) ? $data['price'] : 0;
        
        $stmt = $this->conn->prepare("INSERT INTO neighborhoods (name, price) VALUES (?, ?)");
        $stmt->execute([$data['name'], $price]);
        
        $id = $this->conn->lastInsertId();
        return $this->getById($id);
    }
    
    /**
     * Update neighborhood (admin)
     */
    public function update($id, $updates) {
        $fields = [];
        $values = [];
        
        if (isset($updates['name'])) {
            $fields[] = "name = ?";
            $values[] = $updates['name'];
        }
        
        if (isset($updates['price'])) {
            $fields[] = "price = ?";
            $values[] = $updates['price'];
        }
        
        if (empty($fields)) {
            return $this->getById($id);
        }
        
        $values[] = $id;
        
        $sql = "UPDATE neighborhoods SET " . implode(', ', $fields) . " WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute($values);
        
        return $this->getById($id);
    }
    
    /**
     * Delete neighborhood (admin)
     */
    public function delete($id) {
        $this->getById($id); // Check exists
        
        $stmt = $this->conn->prepare("DELETE FROM neighborhoods WHERE id = ?");
        $stmt->execute([$id]);
        
        return ['message' => 'Mahalle başarıyla silindi'];
    }
}
