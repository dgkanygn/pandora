<?php
/**
 * Order Item Service
 * Handles order item operations
 */

require_once __DIR__ . '/../config/database.php';

class OrderItemService {
    private $conn;
    
    public function __construct() {
        $db = new Database();
        $this->conn = $db->getConnection();
    }
    
    /**
     * Get all items for a specific order
     */
    public function getByOrderId($orderId) {
        $stmt = $this->conn->prepare("
            SELECT * FROM order_items WHERE order_id = ?
            ORDER BY id ASC
        ");
        $stmt->execute([$orderId]);
        return $stmt->fetchAll();
    }
    
    /**
     * Get a single order item by ID
     */
    public function getById($id) {
        $stmt = $this->conn->prepare("SELECT * FROM order_items WHERE id = ?");
        $stmt->execute([$id]);
        $item = $stmt->fetch();
        
        if (!$item) {
            throw new Exception('Sipariş kalemi bulunamadı');
        }
        
        return $item;
    }
    
    /**
     * Create order items (bulk insert)
     */
    public function createBulk($orderId, $items) {
        $stmt = $this->conn->prepare("
            INSERT INTO order_items (order_id, product_id, product_name, price, quantity)
            VALUES (?, ?, ?, ?, ?)
        ");
        
        $createdItems = [];
        foreach ($items as $item) {
            $stmt->execute([
                $orderId,
                $item['product_id'],
                $item['product_name'],
                $item['price'],
                $item['quantity']
            ]);
            $createdItems[] = $this->getById($this->conn->lastInsertId());
        }
        
        return $createdItems;
    }
    
    /**
     * Create a single order item
     */
    public function create($data) {
        $stmt = $this->conn->prepare("
            INSERT INTO order_items (order_id, product_id, product_name, price, quantity)
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $data['order_id'],
            $data['product_id'],
            $data['product_name'],
            $data['price'],
            $data['quantity']
        ]);
        
        return $this->getById($this->conn->lastInsertId());
    }
    
    /**
     * Update an order item
     */
    public function update($id, $updates) {
        $fields = [];
        $values = [];
        
        $allowedFields = ['product_id', 'product_name', 'price', 'quantity'];
        
        foreach ($allowedFields as $field) {
            if (array_key_exists($field, $updates)) {
                $fields[] = "$field = ?";
                $values[] = $updates[$field];
            }
        }
        
        if (empty($fields)) {
            return $this->getById($id);
        }
        
        $values[] = $id;
        
        $sql = "UPDATE order_items SET " . implode(', ', $fields) . " WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute($values);
        
        return $this->getById($id);
    }
    
    /**
     * Delete an order item
     */
    public function delete($id) {
        $this->getById($id); // Check exists
        
        $stmt = $this->conn->prepare("DELETE FROM order_items WHERE id = ?");
        $stmt->execute([$id]);
        
        return ['success' => true];
    }
    
    /**
     * Delete all items for a specific order
     */
    public function deleteByOrderId($orderId) {
        $stmt = $this->conn->prepare("DELETE FROM order_items WHERE order_id = ?");
        $stmt->execute([$orderId]);
        
        return ['success' => true];
    }
}
