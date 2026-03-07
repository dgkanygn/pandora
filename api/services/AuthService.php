<?php
/**
 * Auth Service
 * Handles user authentication operations
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/jwt.php';

class AuthService {
    private $conn;
    
    public function __construct() {
        $db = new Database();
        $this->conn = $db->getConnection();
    }
    
    /**
     * Register a new user
     */
    public function signUp($email, $password, $username, $phone = null) {
        // Check if email already exists
        $stmt = $this->conn->prepare("SELECT id FROM profiles WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            throw new Exception('Bu e-posta adresi zaten kayıtlı');
        }
        
        // Check if username already exists
        $stmt = $this->conn->prepare("SELECT id FROM profiles WHERE username = ?");
        $stmt->execute([$username]);
        if ($stmt->fetch()) {
            throw new Exception('Bu kullanıcı adı zaten alınmış');
        }
        
        // Hash password
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        
        // Generate UUID
        $userId = $this->generateUUID();
        
        // Insert user
        $stmt = $this->conn->prepare("
            INSERT INTO profiles (id, email, password, username, phone, role, is_active, created_at)
            VALUES (?, ?, ?, ?, ?, 'user', 1, NOW())
        ");
        $stmt->execute([$userId, trim($email), $hashedPassword, $username, $phone]);
        
        // Get created user
        $stmt = $this->conn->prepare("SELECT id, email, username, phone, role, is_active, created_at FROM profiles WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch();
        
        // Generate token
        $token = JWT::encode(['user_id' => $userId, 'email' => $email]);
        
        return [
            'user' => $user,
            'session' => [
                'access_token' => $token
            ]
        ];
    }
    
    /**
     * Sign in user
     */
    public function signIn($email, $password) {
        $stmt = $this->conn->prepare("SELECT * FROM profiles WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        
        if (!$user) {
            throw new Exception('E-posta adresi veya şifre hatalı');
        }
        
        if (!$user['is_active']) {
            throw new Exception('Hesabınız devre dışı bırakılmış');
        }
        
        if (!password_verify($password, $user['password'])) {
            throw new Exception('E-posta adresi veya şifre hatalı');
        }
        
        // Generate token
        $token = JWT::encode(['user_id' => $user['id'], 'email' => $user['email']]);
        
        // Remove password from response
        unset($user['password']);
        
        return [
            'user' => $user,
            'session' => [
                'access_token' => $token
            ]
        ];
    }
    
    /**
     * Get session (user from token)
     */
    public function getSession($userId) {
        $stmt = $this->conn->prepare("SELECT id, email, username, phone, role, is_active, created_at FROM profiles WHERE id = ?");
        $stmt->execute([$userId]);
        return $stmt->fetch();
    }
    
    /**
     * Reset password (placeholder - would need email service)
     */
    public function resetPassword($email) {
        $stmt = $this->conn->prepare("SELECT id FROM profiles WHERE email = ?");
        $stmt->execute([$email]);
        
        if (!$stmt->fetch()) {
            throw new Exception('Bu e-posta adresi kayıtlı değil');
        }
        
        // In production, send email with reset link
        return ['message' => 'Şifre sıfırlama e-postası gönderildi'];
    }
    
    /**
     * Delete account and all associated data
     */
    public function deleteAccount($userId) {
        // First verify user exists
        $stmt = $this->conn->prepare("SELECT id FROM profiles WHERE id = ?");
        $stmt->execute([$userId]);
        if (!$stmt->fetch()) {
            throw new Exception('Kullanıcı bulunamadı');
        }

        // Delete the profile (orders.user_id will be SET NULL via FK constraint)
        $stmt = $this->conn->prepare("DELETE FROM profiles WHERE id = ?");
        $stmt->execute([$userId]);

        return ['message' => 'Hesabınız başarıyla silindi'];
    }

    /**
     * Update password
     */
    public function updatePassword($userId, $newPassword) {
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
        
        $stmt = $this->conn->prepare("UPDATE profiles SET password = ? WHERE id = ?");
        $stmt->execute([$hashedPassword, $userId]);
        
        return ['message' => 'Şifreniz başarıyla güncellendi'];
    }
    
    /**
     * Generate UUID v4
     */
    private function generateUUID() {
        $data = random_bytes(16);
        $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
        $data[8] = chr(ord($data[8]) & 0x3f | 0x80);
        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }
}
