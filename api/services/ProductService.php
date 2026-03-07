<?php
/**
 * Product Service
 * Handles product CRUD operations
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/upload.php';

class ProductService {
    private $conn;
    
    public function __construct() {
        $db = new Database();
        $this->conn = $db->getConnection();
    }
    
    /**
     * Get all active products (public)
     */
    public function getActive($options = []) {
        $where = ["p.is_active = 1"];
        $params = [];
        $joins = "LEFT JOIN categories c ON p.category_id = c.id";
        
        // Filter by category slugs
        if (!empty($options['categorySlugs'])) {
            $joins = "INNER JOIN categories c ON p.category_id = c.id";
            $placeholders = implode(',', array_fill(0, count($options['categorySlugs']), '?'));
            $where[] = "c.slug IN ($placeholders)";
            $params = array_merge($params, $options['categorySlugs']);
        }
        
        // Search by name
        if (!empty($options['search'])) {
            $where[] = "p.name LIKE ?";
            $params[] = '%' . $options['search'] . '%';
        }
        
        // Price range
        if (!empty($options['minPrice'])) {
            $where[] = "p.price >= ?";
            $params[] = $options['minPrice'];
        }
        if (!empty($options['maxPrice'])) {
            $where[] = "p.price <= ?";
            $params[] = $options['maxPrice'];
        }
        
        // Sorting
        $sortField = $options['sortBy'] ?? 'created_at';
        $sortOrder = ($options['sortOrder'] ?? 'desc') === 'asc' ? 'ASC' : 'DESC';
        $allowedSortFields = ['name', 'price', 'created_at', 'stock'];
        if (!in_array($sortField, $allowedSortFields)) {
            $sortField = 'created_at';
        }
        
        $sql = "
            SELECT p.*, 
                   JSON_OBJECT('id', c.id, 'name', c.name, 'slug', c.slug) as category
            FROM products p 
            $joins
            WHERE " . implode(' AND ', $where) . "
            ORDER BY p.$sortField $sortOrder
        ";
        
        if (!empty($options['limit'])) {
            $offset = $options['offset'] ?? 0;
            $sql .= " LIMIT " . intval($offset) . ", " . intval($options['limit']);
        }
        
        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);
        $products = $stmt->fetchAll();
        
        // Parse category JSON
        foreach ($products as &$product) {
            $product['category'] = json_decode($product['category'], true);
            if ($product['category']['id'] === null) {
                $product['category'] = null;
            }
        }
        
        return $products;
    }
    
    /**
     * Get all products (admin)
     */
    public function getAll($options = []) {
        $where = ["1=1"];
        $params = [];
        $joins = "LEFT JOIN categories c ON p.category_id = c.id";
        
        // Filter by category IDs (for admin panel)
        if (!empty($options['categoryIds'])) {
            $placeholders = implode(',', array_fill(0, count($options['categoryIds']), '?'));
            $where[] = "p.category_id IN ($placeholders)";
            $params = array_merge($params, $options['categoryIds']);
        }
        // Filter by category slugs (for public API)
        elseif (!empty($options['categorySlugs'])) {
            $joins = "INNER JOIN categories c ON p.category_id = c.id";
            $placeholders = implode(',', array_fill(0, count($options['categorySlugs']), '?'));
            $where[] = "c.slug IN ($placeholders)";
            $params = array_merge($params, $options['categorySlugs']);
        }
        
        // Search by name
        if (!empty($options['search'])) {
            $where[] = "p.name LIKE ?";
            $params[] = '%' . $options['search'] . '%';
        }
        
        $sql = "
            SELECT p.*, 
                   JSON_OBJECT('id', c.id, 'name', c.name, 'slug', c.slug) as category
            FROM products p 
            $joins
            WHERE " . implode(' AND ', $where) . "
            ORDER BY p.created_at DESC
        ";
        
        if (!empty($options['limit'])) {
            $offset = $options['offset'] ?? 0;
            $sql .= " LIMIT " . intval($offset) . ", " . intval($options['limit']);
        }
        
        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);
        $products = $stmt->fetchAll();
        
        // Parse category JSON and attach images for admin list
        $ids = array_column($products, 'id');
        $imagesMap = $this->getProductImagesMap($ids);
        $imageRowsMap = $this->getProductImageRowsMap($ids);
        foreach ($products as &$product) {
            $product['category'] = json_decode($product['category'], true);
            if ($product['category']['id'] === null) {
                $product['category'] = null;
            }
            $product['images'] = $imagesMap[$product['id']] ?? [];
            $product['image_rows'] = $imageRowsMap[$product['id']] ?? [];
            if (empty($product['images']) && !empty($product['image_url'])) {
                $product['images'] = [$product['image_url']];
            }
        }
        
        return $products;
    }
    
    /**
     * Get first image per product for list views (batch)
     */
    private function getProductImagesMap($productIds) {
        if (empty($productIds)) return [];
        try {
            $placeholders = implode(',', array_fill(0, count($productIds), '?'));
            $stmt = $this->conn->prepare("
                SELECT product_id, image_url FROM product_images 
                WHERE product_id IN ($placeholders) 
                ORDER BY sort_order ASC, id ASC
            ");
            $stmt->execute(array_values($productIds));
            $rows = $stmt->fetchAll();
            $map = [];
            foreach ($productIds as $id) {
                $map[$id] = [];
            }
            foreach ($rows as $row) {
                $map[$row['product_id']][] = $row['image_url'];
            }
            return $map;
        } catch (Exception $e) {
            return [];
        }
    }

    /**
     * Get full image rows (id, image_url, sort_order) per product for admin
     */
    private function getProductImageRowsMap($productIds) {
        if (empty($productIds)) return [];
        try {
            $placeholders = implode(',', array_fill(0, count($productIds), '?'));
            $stmt = $this->conn->prepare("
                SELECT product_id, id, image_url, sort_order FROM product_images 
                WHERE product_id IN ($placeholders) 
                ORDER BY sort_order ASC, id ASC
            ");
            $stmt->execute(array_values($productIds));
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $map = [];
            foreach ($productIds as $id) {
                $map[$id] = [];
            }
            foreach ($rows as $row) {
                $pid = $row['product_id'];
                unset($row['product_id']);
                $map[$pid][] = $row;
            }
            return $map;
        } catch (Exception $e) {
            return [];
        }
    }
    
    /**
     * Get product by ID
     */
    public function getById($id) {
        $stmt = $this->conn->prepare("
            SELECT p.*, 
                   JSON_OBJECT('id', c.id, 'name', c.name, 'slug', c.slug) as category
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.id = ?
        ");
        $stmt->execute([$id]);
        $product = $stmt->fetch();
        
        if (!$product) {
            throw new Exception('Ürün bulunamadı');
        }
        
        $product['category'] = json_decode($product['category'], true);
        if ($product['category']['id'] === null) {
            $product['category'] = null;
        }
        
        // Attach images from product_images (gallery support)
        $imageRows = $this->getProductImages($id);
        // Legacy: product_images boşsa ama products.image_url varsa, migrate et
        if (empty($imageRows) && !empty($product['image_url'])) {
            $stmt = $this->conn->prepare("
                INSERT INTO product_images (product_id, image_url, sort_order) VALUES (?, ?, 0)
            ");
            $stmt->execute([$id, $product['image_url']]);
            $imageRows = $this->getProductImages($id);
        }
        $product['images'] = array_map(fn($r) => $r['image_url'], $imageRows);
        $product['image_rows'] = $imageRows; // id, image_url for admin primary-image
        if (empty($product['images']) && !empty($product['image_url'])) {
            $product['images'] = [$product['image_url']];
        }
        
        return $product;
    }
    
    /**
     * Get product images for gallery (returns id, image_url for admin; frontend uses image_url array)
     */
    public function getProductImages($productId) {
        try {
            $stmt = $this->conn->prepare("
                SELECT id, image_url, sort_order FROM product_images 
                WHERE product_id = ? 
                ORDER BY sort_order ASC, id ASC
            ");
            $stmt->execute([$productId]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            return [];
        }
    }
    
    /**
     * Get product images as simple url array (for frontend compatibility)
     */
    public function getProductImageUrls($productId) {
        $rows = $this->getProductImages($productId);
        return array_map(fn($r) => $r['image_url'], $rows);
    }
    
    /**
     * Add image to product gallery
     */
    public function addProductImage($productId, $imageUrl) {
        $this->getById($productId); // Verify product exists
        
        $stmt = $this->conn->prepare("
            SELECT COALESCE(MAX(sort_order), -1) + 1 FROM product_images WHERE product_id = ?
        ");
        $stmt->execute([$productId]);
        $sortOrder = $stmt->fetchColumn();
        
        $stmt = $this->conn->prepare("
            INSERT INTO product_images (product_id, image_url, sort_order) VALUES (?, ?, ?)
        ");
        $stmt->execute([$productId, $imageUrl, $sortOrder]);
        
        // Update products.image_url if first image
        $images = $this->getProductImageUrls($productId);
        if (count($images) === 1) {
            $this->conn->prepare("UPDATE products SET image_url = ?, updated_at = NOW() WHERE id = ?")
                ->execute([$imageUrl, $productId]);
        }
        
        return $this->getById($productId);
    }
    
    /**
     * Delete product image
     */
    public function deleteProductImage($productId, $imageId) {
        $stmt = $this->conn->prepare("
            SELECT id, image_url FROM product_images WHERE product_id = ? AND id = ?
        ");
        $stmt->execute([$productId, $imageId]);
        $row = $stmt->fetch();
        
        if (!$row) {
            throw new Exception('Görsel bulunamadı');
        }
        
        $stmt = $this->conn->prepare("DELETE FROM product_images WHERE id = ?");
        $stmt->execute([$imageId]);
        Upload::delete($row['image_url']);
        
        // Update products.image_url to first remaining image
        $images = $this->getProductImageUrls($productId);
        $newPrimary = !empty($images) ? $images[0] : null;
        $this->conn->prepare("UPDATE products SET image_url = ?, updated_at = NOW() WHERE id = ?")
            ->execute([$newPrimary, $productId]);
        
        return $this->getById($productId);
    }
    
    /**
     * Set primary/main image for product (from gallery)
     */
    public function setPrimaryImage($productId, $imageId) {
        $stmt = $this->conn->prepare("
            SELECT id, image_url FROM product_images 
            WHERE product_id = ? AND id = ?
        ");
        $stmt->execute([$productId, $imageId]);
        $row = $stmt->fetch();
        
        if (!$row) {
            throw new Exception('Görsel bulunamadı');
        }
        
        $this->conn->prepare("UPDATE products SET image_url = ?, updated_at = NOW() WHERE id = ?")
            ->execute([$row['image_url'], $productId]);
        
        return $this->getById($productId);
    }
    
    /**
     * Delete first product image (for remove_image in update)
     */
    public function deleteFirstProductImage($productId) {
        $stmt = $this->conn->prepare("SELECT id, image_url FROM product_images WHERE product_id = ? ORDER BY sort_order ASC, id ASC LIMIT 1");
        $stmt->execute([$productId]);
        $row = $stmt->fetch();
        if ($row) {
            return $this->deleteProductImage($productId, $row['id']);
        }
        return $this->getById($productId);
    }
    
    /**
     * Get products by category slug
     */
    public function getByCategorySlug($slug) {
        $stmt = $this->conn->prepare("
            SELECT p.*, 
                   JSON_OBJECT('id', c.id, 'name', c.name, 'slug', c.slug) as category
            FROM products p 
            INNER JOIN categories c ON p.category_id = c.id
            WHERE c.slug = ? AND p.is_active = 1
        ");
        $stmt->execute([$slug]);
        $products = $stmt->fetchAll();
        
        // Parse category JSON
        foreach ($products as &$product) {
            $product['category'] = json_decode($product['category'], true);
        }
        
        return $products;
    }
    
    /**
     * Create product (admin)
     */
    public function create($data) {
        $stmt = $this->conn->prepare("
            INSERT INTO products (category_id, name, description, price, stock, image_url, is_active, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        ");
        $stmt->execute([
            $data['category_id'] ?? null,
            $data['name'],
            $data['description'] ?? null,
            $data['price'],
            $data['stock'] ?? 0,
            $data['image_url'] ?? null,
            $data['is_active'] ?? 1
        ]);
        
        $id = $this->conn->lastInsertId();
        
        // Add to product_images for gallery support
        if (!empty($data['image_url'])) {
            try {
                $imgStmt = $this->conn->prepare("INSERT INTO product_images (product_id, image_url, sort_order) VALUES (?, ?, 0)");
                $imgStmt->execute([$id, $data['image_url']]);
            } catch (Exception $e) {}
        }
        
        return $this->getById($id);
    }
    
    /**
     * Update product (admin)
     */
    public function update($id, $updates) {
        $fields = [];
        $values = [];
        
        $allowedFields = ['category_id', 'name', 'description', 'price', 'stock', 'image_url', 'is_active'];
        
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
        
        $sql = "UPDATE products SET " . implode(', ', $fields) . " WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute($values);
        
        return $this->getById($id);
    }
    
    /**
     * Delete product (admin)
     */
    public function delete($id) {
        $product = $this->getById($id); // Check exists
        
        // Delete image files from disk
        foreach ($product['images'] ?? [] as $url) {
            Upload::delete($url);
        }
        if (!empty($product['image_url']) && !in_array($product['image_url'], $product['images'] ?? [])) {
            Upload::delete($product['image_url']);
        }
        
        $stmt = $this->conn->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$id]);
        
        return ['message' => 'Ürün başarıyla silindi'];
    }
    
    /**
     * Toggle active status (admin)
     */
    public function toggleActive($id) {
        $product = $this->getById($id);
        $newStatus = $product['is_active'] ? 0 : 1;
        
        $stmt = $this->conn->prepare("UPDATE products SET is_active = ?, updated_at = NOW() WHERE id = ?");
        $stmt->execute([$newStatus, $id]);
        
        return $this->getById($id);
    }
    
    /**
     * Update stock (admin)
     */
    public function updateStock($id, $quantity) {
        $stmt = $this->conn->prepare("UPDATE products SET stock = ?, updated_at = NOW() WHERE id = ?");
        $stmt->execute([$quantity, $id]);
        
        return $this->getById($id);
    }
    
    /**
     * Get best-selling products (public)
     */
    public function getBestSellers($limit = 6) {
        $stmt = $this->conn->prepare("
            SELECT p.*, SUM(oi.quantity) as total_sold,
                   JSON_OBJECT('id', c.id, 'name', c.name, 'slug', c.slug) as category
            FROM order_items oi
            INNER JOIN products p ON oi.product_id = p.id AND p.is_active = 1
            LEFT JOIN categories c ON p.category_id = c.id
            GROUP BY oi.product_id
            ORDER BY total_sold DESC
            LIMIT ?
        ");
        $stmt->execute([intval($limit)]);
        $products = $stmt->fetchAll();
        
        // Parse category JSON
        foreach ($products as &$product) {
            $product['category'] = json_decode($product['category'], true);
            if ($product['category']['id'] === null) {
                $product['category'] = null;
            }
            $product['total_sold'] = intval($product['total_sold']);
        }
        
        return $products;
    }
    /**
     * Increment view count
     */
    public function incrementViewCount($id) {
        $stmt = $this->conn->prepare("UPDATE products SET view_count = view_count + 1 WHERE id = ?");
        $stmt->execute([$id]);
        return ['success' => true];
    }

    /**
     * Get most viewed products
     */
    public function getMostViewed($limit = 10) {
        $stmt = $this->conn->prepare("
            SELECT p.*, 
                   JSON_OBJECT('id', c.id, 'name', c.name, 'slug', c.slug) as category
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.is_active = 1
            ORDER BY p.view_count DESC
            LIMIT ?
        ");
        $stmt->execute([intval($limit)]);
        $products = $stmt->fetchAll();
        
        // Parse category JSON
        foreach ($products as &$product) {
            $product['category'] = json_decode($product['category'], true);
            if ($product['category']['id'] === null) {
                $product['category'] = null;
            }
        }
        
        return $products;
    }
}
