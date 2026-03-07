<?php
/**
 * Homepage Service
 * Ana sayfa slider ve içerik yönetimi
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/upload.php';

class HomepageService {
    private $conn;
    
    public function __construct() {
        $db = new Database();
        $this->conn = $db->getConnection();
    }
    
    /**
     * Public: Aktif sliderları getir (ana sayfa için)
     */
    public function getSlides() {
        $stmt = $this->conn->prepare("
            SELECT id, badge, icon_key, title, title_highlight, description,
                   primary_button_label, primary_button_to, secondary_button_label, secondary_button_to,
                   accent_color, background_image, sort_order
            FROM homepage_slides 
            WHERE is_active = 1 
            ORDER BY sort_order ASC, id ASC
        ");
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return array_map([$this, 'formatSlideForFrontend'], $rows);
    }
    
    /**
     * Admin: Tüm sliderları getir
     */
    public function getAllSlides() {
        $stmt = $this->conn->prepare("
            SELECT * FROM homepage_slides 
            ORDER BY sort_order ASC, id ASC
        ");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    /**
     * Admin: Slider getir
     */
    public function getSlideById($id) {
        $stmt = $this->conn->prepare("SELECT * FROM homepage_slides WHERE id = ?");
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if (!$row) {
            throw new Exception('Slider bulunamadı');
        }
        return $row;
    }
    
    /**
     * Admin: Slider oluştur
     */
    public function createSlide($data) {
        $imageUrl = null;
        if (isset($_FILES['background_image'])) {
            $imageUrl = Upload::handleImage($_FILES['background_image'], 'homepage');
        } elseif (!empty($data['background_image'])) {
            $imageUrl = $data['background_image'];
        }
        
        $stmt = $this->conn->prepare("
            INSERT INTO homepage_slides 
            (badge, icon_key, title, title_highlight, description, 
             primary_button_label, primary_button_to, secondary_button_label, secondary_button_to,
             accent_color, background_image, sort_order, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $data['badge'] ?? '',
            $data['icon_key'] ?? 'flower',
            $data['title'] ?? '',
            $data['title_highlight'] ?? '',
            $data['description'] ?? '',
            $data['primary_button_label'] ?? null,
            $data['primary_button_to'] ?? null,
            $data['secondary_button_label'] ?? null,
            $data['secondary_button_to'] ?? null,
            $data['accent_color'] ?? '#db2777',
            $imageUrl,
            $data['sort_order'] ?? 0,
            isset($data['is_active']) ? (int)$data['is_active'] : 1
        ]);
        
        return $this->getSlideById($this->conn->lastInsertId());
    }
    
    /**
     * Admin: Slider güncelle
     */
    public function updateSlide($id, $data) {
        $this->getSlideById($id);
        
        $imageUrl = null;
        if (isset($_FILES['background_image'])) {
            $imageUrl = Upload::handleImage($_FILES['background_image'], 'homepage');
        } elseif (isset($data['background_image'])) {
            $imageUrl = $data['background_image'];
        }
        
        $fields = [];
        $params = [];
        
        $allowed = ['badge', 'icon_key', 'title', 'title_highlight', 'description',
            'primary_button_label', 'primary_button_to', 'secondary_button_label', 'secondary_button_to',
            'accent_color', 'sort_order', 'is_active'];
        
        foreach ($allowed as $key) {
            if (array_key_exists($key, $data)) {
                $dbKey = $key;
                $fields[] = "$dbKey = ?";
                $params[] = $data[$key];
            }
        }
        
        if ($imageUrl !== null) {
            $fields[] = "background_image = ?";
            $params[] = $imageUrl;
        }
        
        if (empty($fields)) {
            return $this->getSlideById($id);
        }
        
        $params[] = $id;
        $sql = "UPDATE homepage_slides SET " . implode(', ', $fields) . " WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);
        
        return $this->getSlideById($id);
    }
    
    /**
     * Admin: Slider sil
     */
    public function deleteSlide($id) {
        $slide = $this->getSlideById($id);
        if (!empty($slide['background_image']) && strpos($slide['background_image'], '/api/uploads/') === 0) {
            Upload::delete($slide['background_image']);
        }
        $stmt = $this->conn->prepare("DELETE FROM homepage_slides WHERE id = ?");
        $stmt->execute([$id]);
        return true;
    }
    
    /**
     * Admin: Sıra güncelle
     */
    public function reorderSlides($order) {
        foreach ($order as $sortOrder => $id) {
            $stmt = $this->conn->prepare("UPDATE homepage_slides SET sort_order = ? WHERE id = ?");
            $stmt->execute([$sortOrder, $id]);
        }
        return $this->getAllSlides();
    }
    
    private function formatSlideForFrontend($row) {
        return [
            'id' => (int)$row['id'],
            'badge' => $row['badge'],
            'iconKey' => $row['icon_key'],
            'title' => $row['title'],
            'titleHighlight' => $row['title_highlight'],
            'description' => $row['description'],
            'primaryButton' => [
                'label' => $row['primary_button_label'],
                'to' => $row['primary_button_to']
            ],
            'secondaryButton' => [
                'label' => $row['secondary_button_label'],
                'to' => $row['secondary_button_to']
            ],
            'accentColor' => $row['accent_color'],
            'backgroundImage' => $row['background_image']
        ];
    }
}
