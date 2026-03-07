<?php
/**
 * Blog Service
 * Handles blog post CRUD operations
 */

require_once __DIR__ . '/../config/database.php';

class BlogService {
    private $conn;
    
    public function __construct() {
        $db = new Database();
        $this->conn = $db->getConnection();
    }
    
    /**
     * Get all published blog posts (public)
     */
    public function getPublished($options = []) {
        $where = ["is_published = 1"];
        $params = [];
        
        // Search by title
        if (!empty($options['search'])) {
            $where[] = "title LIKE ?";
            $params[] = '%' . $options['search'] . '%';
        }
        
        $sql = "SELECT * FROM blog_posts WHERE " . implode(' AND ', $where) . " ORDER BY created_at DESC";
        
        if (!empty($options['limit'])) {
            $offset = $options['offset'] ?? 0;
            $sql .= " LIMIT " . intval($offset) . ", " . intval($options['limit']);
        }
        
        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }
    
    /**
     * Get all blog posts (admin)
     */
    public function getAll($options = []) {
        $sql = "SELECT * FROM blog_posts ORDER BY created_at DESC";
        
        if (!empty($options['limit'])) {
            $offset = $options['offset'] ?? 0;
            $sql .= " LIMIT " . intval($offset) . ", " . intval($options['limit']);
        }
        
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll();
    }
    
    /**
     * Get blog post by ID
     */
    public function getById($id) {
        $stmt = $this->conn->prepare("SELECT * FROM blog_posts WHERE id = ?");
        $stmt->execute([$id]);
        $post = $stmt->fetch();
        
        if (!$post) {
            throw new Exception('Blog yazısı bulunamadı');
        }
        
        return $post;
    }
    
    /**
     * Get blog post by slug (public)
     */
    public function getBySlug($slug) {
        $stmt = $this->conn->prepare("SELECT * FROM blog_posts WHERE slug = ? AND is_published = 1");
        $stmt->execute([$slug]);
        $post = $stmt->fetch();
        
        if (!$post) {
            throw new Exception('Blog yazısı bulunamadı');
        }
        
        return $post;
    }
    
    /**
     * Create blog post (admin)
     */
    public function create($data) {
        $stmt = $this->conn->prepare("
            INSERT INTO blog_posts (title, slug, content, cover_image, is_published, created_at)
            VALUES (?, ?, ?, ?, ?, NOW())
        ");
        $stmt->execute([
            $data['title'],
            $data['slug'],
            $data['content'],
            $data['cover_image'] ?? null,
            isset($data['is_published']) ? (int) !!$data['is_published'] : 0
        ]);
        
        return $this->getById($this->conn->lastInsertId());
    }
    
    /**
     * Update blog post (admin)
     */
    public function update($id, $updates) {
        $fields = [];
        $values = [];
        
        $allowedFields = ['title', 'slug', 'content', 'cover_image', 'is_published'];
        
        foreach ($allowedFields as $field) {
            if (array_key_exists($field, $updates)) {
            $fields[] = "$field = ?";

            if ($field === 'is_published') {
                $values[] = (int) !!$updates[$field];
            } else {
                $values[] = $updates[$field];
            }
            }
        }       
        
        if (empty($fields)) {
            return $this->getById($id);
        }
        
        $fields[] = "updated_at = NOW()";
        $values[] = $id;
        
        $sql = "UPDATE blog_posts SET " . implode(', ', $fields) . " WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute($values);
        
        return $this->getById($id);
    }
    
    /**
     * Delete blog post (admin)
     */
    public function delete($id) {
        $this->getById($id); // Check exists
        
        $stmt = $this->conn->prepare("DELETE FROM blog_posts WHERE id = ?");
        $stmt->execute([$id]);
        
        return ['message' => 'Blog yazısı başarıyla silindi'];
    }
    
    /**
     * Toggle published status (admin)
     */
    public function togglePublished($id) {
        $post = $this->getById($id);
        $newStatus = $post['is_published'] ? 0 : 1;
        
        $stmt = $this->conn->prepare("UPDATE blog_posts SET is_published = ?, updated_at = NOW() WHERE id = ?");
        $stmt->execute([$newStatus, $id]);
        
        return $this->getById($id);
    }
    /**
     * Increment view count
     */
    public function incrementViewCount($id) {
        $stmt = $this->conn->prepare("UPDATE blog_posts SET view_count = view_count + 1 WHERE id = ?");
        $stmt->execute([$id]);
        return ['success' => true];
    }

    /**
     * Get most viewed blog posts
     */
    public function getMostViewed($limit = 10) {
        $stmt = $this->conn->prepare("
            SELECT * FROM blog_posts 
            WHERE is_published = 1
            ORDER BY view_count DESC
            LIMIT ?
        ");
        $stmt->execute([intval($limit)]);
        return $stmt->fetchAll();
    }
}
