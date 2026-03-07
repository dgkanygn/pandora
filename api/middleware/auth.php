<?php
/**
 * Authentication Middleware
 */

require_once __DIR__ . '/../helpers/jwt.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../config/database.php';

class Auth {
    private static $user = null;
    private static $token = null;
    private static $userRole = null;
    
    /**
     * Verify JWT token and set user
     * @return bool
     */
    public static function authenticate() {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? null;
        
        if (!$authHeader || !preg_match('/^Bearer\s+(.+)$/', $authHeader, $matches)) {
            Response::unauthorized('Authorization token required');
        }
        
        $token = $matches[1];
        
        try {
            $payload = JWT::decode($token);
            
            if (!isset($payload['user_id'])) {
                Response::unauthorized('Invalid token');
            }
            
            // Get user from database
            $db = new Database();
            $conn = $db->getConnection();
            
            $stmt = $conn->prepare("SELECT * FROM profiles WHERE id = ? AND is_active = 1");
            $stmt->execute([$payload['user_id']]);
            $user = $stmt->fetch();
            
            if (!$user) {
                Response::unauthorized('User not found or inactive');
            }
            
            self::$user = $user;
            self::$token = $token;
            self::$userRole = $user['role'];
            
            return true;
        } catch (Exception $e) {
            Response::unauthorized($e->getMessage());
        }
    }
    
    /**
     * Check if user is admin
     */
    public static function isAdmin() {
        if (!self::$user) {
            Response::unauthorized('Authentication required');
        }
        
        if (self::$user['role'] !== 'admin') {
            Response::forbidden('Admin access required');
        }
        
        return true;
    }
    
    /**
     * Optional authentication - doesn't fail if no token
     */
    public static function optionalAuth() {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? null;
        
        if (!$authHeader || !preg_match('/^Bearer\s+(.+)$/', $authHeader, $matches)) {
            return true;
        }
        
        $token = $matches[1];
        
        try {
            $payload = JWT::decode($token);
            
            if (isset($payload['user_id'])) {
                $db = new Database();
                $conn = $db->getConnection();
                
                $stmt = $conn->prepare("SELECT * FROM profiles WHERE id = ? AND is_active = 1");
                $stmt->execute([$payload['user_id']]);
                $user = $stmt->fetch();
                
                if ($user) {
                    self::$user = $user;
                    self::$token = $token;
                    self::$userRole = $user['role'];
                }
            }
        } catch (Exception $e) {
            // Silently fail - continue without auth
        }
        
        return true;
    }
    
    /**
     * Get current authenticated user
     */
    public static function getUser() {
        return self::$user;
    }
    
    /**
     * Get current user ID
     */
    public static function getUserId() {
        return self::$user ? self::$user['id'] : null;
    }
    
    /**
     * Get current user role
     */
    public static function getUserRole() {
        return self::$userRole;
    }
    
    /**
     * Get current token
     */
    public static function getToken() {
        return self::$token;
    }
}
