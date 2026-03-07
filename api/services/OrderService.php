<?php
/**
 * Order Service
 * Handles order CRUD operations
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/MailService.php';

class OrderService {
    private $conn;
    
    public function __construct() {
        $db = new Database();
        $this->conn = $db->getConnection();
    }
    
    /**
     * Generate unique 16-character order code
     */
    private function generateOrderCode() {
        $chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        $result = '';
        for ($i = 0; $i < 16; $i++) {
            $result .= $chars[random_int(0, strlen($chars) - 1)];
        }
        return $result;
    }
    
    /**
     * Get user orders with pagination
     */
    public function getByUserId($userId, $limit = null, $offset = null) {
        $sql = "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC";
        $params = [$userId];

        if ($limit !== null) {
            $sql .= " LIMIT ?";
            $params[] = (int) $limit;
            if ($offset !== null) {
                $sql .= " OFFSET ?";
                $params[] = (int) $offset;
            }
        }

        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);
        $orders = $stmt->fetchAll();
        
        // Get items for each order
        foreach ($orders as &$order) {
            $order['order_items'] = $this->getOrderItems($order['id']);
        }
        
        return $orders;
    }

    /**
     * Count user orders
     */
    public function countByUserId($userId) {
        $stmt = $this->conn->prepare("SELECT COUNT(*) as total FROM orders WHERE user_id = ?");
        $stmt->execute([$userId]);
        $result = $stmt->fetch();
        return (int) $result['total'];
    }
    
    /**
     * Get all orders (admin)
     */
    public function getAll($options = []) {
        $where = ["1=1"];
        $params = [];
        
        if (!empty($options['status'])) {
            $where[] = "o.status = ?";
            $params[] = $options['status'];
        }

        if (!empty($options['date_from'])) {
            $where[] = "o.created_at >= ?";
            $params[] = $options['date_from'] . ' 00:00:00';
        }
        if (!empty($options['date_to'])) {
            $where[] = "o.created_at <= ?";
            $params[] = $options['date_to'] . ' 23:59:59';
        }
        
        $sql = "
            SELECT o.*, 
                   JSON_OBJECT('id', p.id, 'username', p.username, 'phone', p.phone) as profile
            FROM orders o
            LEFT JOIN profiles p ON o.user_id = p.id
            WHERE " . implode(' AND ', $where) . "
            ORDER BY o.created_at DESC
        ";
        
        if (!empty($options['limit'])) {
            $offset = $options['offset'] ?? 0;
            $sql .= " LIMIT " . intval($offset) . ", " . intval($options['limit']);
        }
        
        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);
        $orders = $stmt->fetchAll();
        
        // Parse profile JSON and get items
        foreach ($orders as &$order) {
            $order['profile'] = json_decode($order['profile'], true);
            if ($order['profile']['id'] === null) {
                $order['profile'] = null;
            }
            $order['order_items'] = $this->getOrderItems($order['id']);
        }
        
        return $orders;
    }
    
    /**
     * Get order by ID
     */
    public function getById($id) {
        $stmt = $this->conn->prepare("
            SELECT o.*, 
                   JSON_OBJECT('id', p.id, 'username', p.username, 'phone', p.phone) as profile
            FROM orders o
            LEFT JOIN profiles p ON o.user_id = p.id
            WHERE o.id = ?
        ");
        $stmt->execute([$id]);
        $order = $stmt->fetch();
        
        if (!$order) {
            throw new Exception('Sipariş bulunamadı');
        }
        
        $order['profile'] = json_decode($order['profile'], true);
        if ($order['profile']['id'] === null) {
            $order['profile'] = null;
        }
        $order['order_items'] = $this->getOrderItems($id);
        
        return $order;
    }
    
    /**
     * Get order by order_code (public - for order tracking)
     */
    public function getByOrderCode($orderCode) {
        $stmt = $this->conn->prepare("
            SELECT id, order_code, total_price, status, customer_name, receiver_name,
                   delivery_date, delivery_time_slot, city, district, address, created_at
            FROM orders WHERE order_code = ?
        ");
        $stmt->execute([$orderCode]);
        $order = $stmt->fetch();
        
        if (!$order) {
            throw new Exception('Sipariş bulunamadı');
        }
        
        $order['order_items'] = $this->getOrderItems($order['id']);
        
        return $order;
    }
    
    /**
     * Get order items
     */
    private function getOrderItems($orderId) {
        $stmt = $this->conn->prepare("
            SELECT id, product_id, product_name, price, quantity
            FROM order_items WHERE order_id = ?
            ORDER BY id ASC
        ");
        $stmt->execute([$orderId]);
        return $stmt->fetchAll();
    }
    
    /**
     * Create order with items
     */
    public function create($userId, $orderData, $items) {
        $transactionStarted = false;
        try {
            // Validate stock and active status BEFORE starting transaction
            foreach ($items as $item) {
                $stmtCheck = $this->conn->prepare(
                    "SELECT name, stock, is_active FROM products WHERE id = ?"
                );
                $stmtCheck->execute([$item['product_id']]);
                $product = $stmtCheck->fetch();

                if (!$product) {
                    throw new Exception("Ürün bulunamadı: #{$item['product_id']}");
                }

                if ((int)$product['is_active'] !== 1) {
                    throw new Exception("'{$product['name']}' ürünü şu anda satışa sunulmamaktadır.");
                }

                if ((int)$product['stock'] < (int)$item['quantity']) {
                    $available = (int)$product['stock'];
                    throw new Exception(
                        "'{$product['name']}' ürününden yeterli stok bulunmamaktadır. " .
                        "Mevcut stok: {$available} adet."
                    );
                }
            }

            $this->conn->beginTransaction();
            $transactionStarted = true;
            
            // Calculate total price
            $totalPrice = array_reduce($items, function($sum, $item) {
                return $sum + ($item['price'] * $item['quantity']);
            }, 0);
            
            // Generate unique order code
            $orderCode = $this->generateOrderCode();
            
            // Create order
            $stmt = $this->conn->prepare("
                INSERT INTO orders (
                    user_id, order_code, total_price, status, address,
                    customer_name, customer_email, customer_phone,
                    receiver_name, delivery_date, delivery_time_slot,
                    receiver_phone, city, district, delivery_note,
                    show_name_on_card, delivery_confirmation, user_message,
                    invoice_type, payment_method, contract_accepted, created_at
                ) VALUES (?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            ");
            $stmt->execute([
                $userId,
                $orderCode,
                $totalPrice,
                $orderData['address'],
                $orderData['customer_name'] ?? null,
                $orderData['customer_email'] ?? null,
                $orderData['customer_phone'] ?? null,
                $orderData['receiver_name'] ?? null,
                $orderData['delivery_date'] ?? null,
                $orderData['delivery_time_slot'] ?? null,
                $orderData['receiver_phone'] ?? null,
                $orderData['city'] ?? null,
                $orderData['district'] ?? null,
                $orderData['delivery_note'] ?? null,
                $orderData['show_name_on_card'] ?? 0,
                $orderData['delivery_confirmation'] ?? 0,
                $orderData['user_message'] ?? null,
                $orderData['invoice_type'] ?? null,
                $orderData['payment_method'] ?? null,
                $orderData['contract_accepted'] ?? 0
            ]);
            
            $orderId = $this->conn->lastInsertId();
            
            // Create order items
            $stmtItem = $this->conn->prepare("
                INSERT INTO order_items (order_id, product_id, product_name, price, quantity)
                VALUES (?, ?, ?, ?, ?)
            ");
            
            foreach ($items as $item) {
                $stmtItem->execute([
                    $orderId,
                    $item['product_id'],
                    $item['product_name'],
                    $item['price'],
                    $item['quantity']
                ]);
                
                // Update product stock
                $this->conn->prepare("
                    UPDATE products SET stock = GREATEST(0, stock - ?) WHERE id = ?
                ")->execute([$item['quantity'], $item['product_id']]);
            }
            
            $this->conn->commit();
            
            $order = $this->getById($orderId);

            // Send order created email
            try {
                $mailService = new MailService();
                $mailService->sendOrderCreatedEmail($order);
            } catch (Exception $e) {
                // Log email error but don't fail the order creation
                error_log("Email sending failed: " . $e->getMessage());
            }

            return $order;
        } catch (Exception $e) {
            if ($transactionStarted) {
                $this->conn->rollBack();
            }
            throw $e;
        }
    }
    
    /**
     * Update order status (admin)
     */
    public function updateStatus($id, $status) {
        $validStatuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
        
        if (!in_array($status, $validStatuses)) {
            throw new Exception('Geçersiz sipariş durumu');
        }
        
        $stmt = $this->conn->prepare("UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?");
        $stmt->execute([$status, $id]);
        
        $order = $this->getById($id);

        // Send status updated email
        try {
            $mailService = new MailService();
            $mailService->sendOrderStatusUpdatedEmail($order);
        } catch (Exception $e) {
            error_log("Email sending failed: " . $e->getMessage());
        }

        return $order;
    }
    
    /**
     * Cancel order
     */
    public function cancel($id, $userId = null) {
        // Verify ownership if userId provided
        if ($userId) {
            $stmt = $this->conn->prepare("SELECT user_id, status FROM orders WHERE id = ?");
            $stmt->execute([$id]);
            $order = $stmt->fetch();
            
            if (!$order || $order['user_id'] !== $userId) {
                throw new Exception('Sipariş bulunamadı');
            }
            
            if ($order['status'] !== 'pending') {
                throw new Exception('Yalnızca beklemedeki siparişler iptal edilebilir');
            }
        }
        
        $stmt = $this->conn->prepare("UPDATE orders SET status = 'cancelled', updated_at = NOW() WHERE id = ?");
        $stmt->execute([$id]);
        
        $order = $this->getById($id);

        // Send status updated email
        try {
            $mailService = new MailService();
            $mailService->sendOrderStatusUpdatedEmail($order);
        } catch (Exception $e) {
            error_log("Email sending failed: " . $e->getMessage());
        }

        return $order;
    }
    
    /**
     * Get order stats (admin) with period filtering
     * @param string $period - 'today' | 'week' | 'month' | 'all_time'
     */
    public function getStats($period = 'month') {
        $where = "1=1";
        $params = [];

        switch ($period) {
            case 'today':
                $where = "DATE(created_at) = CURDATE()";
                break;
            case 'week':
                $where = "created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
                break;
            case 'month':
                $where = "created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
                break;
            case 'all_time':
            default:
                $where = "1=1";
                break;
        }

        $stmt = $this->conn->prepare("SELECT status, total_price FROM orders WHERE $where");
        $stmt->execute($params);
        $orders = $stmt->fetchAll();
        
        $stats = [
            'total' => count($orders),
            'totalRevenue' => 0,
            'byStatus' => [],
            'period' => $period
        ];
        
        foreach ($orders as $order) {
            $stats['totalRevenue'] += floatval($order['total_price']);
            
            $status = $order['status'];
            if (!isset($stats['byStatus'][$status])) {
                $stats['byStatus'][$status] = ['count' => 0, 'revenue' => 0];
            }
            $stats['byStatus'][$status]['count']++;
            $stats['byStatus'][$status]['revenue'] += floatval($order['total_price']);
        }
        
        return $stats;
    }
}
