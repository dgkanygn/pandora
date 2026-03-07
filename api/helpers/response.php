<?php
/**
 * Response Helper Functions
 */

class Response {
    /**
     * Send JSON response with status code
     */
    public static function json($data, $statusCode = 200) {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    /**
     * Send success response
     */
    public static function success($data, $statusCode = 200) {
        self::json($data, $statusCode);
    }
    
    /**
     * Send error response
     */
    public static function error($message, $statusCode = 400) {
        self::json(['error' => $message], $statusCode);
    }
    
    /**
     * Send 404 not found response
     */
    public static function notFound($message = 'Resource not found') {
        self::error($message, 404);
    }
    
    /**
     * Send 401 unauthorized response
     */
    public static function unauthorized($message = 'Unauthorized') {
        self::error($message, 401);
    }
    
    /**
     * Send 403 forbidden response
     */
    public static function forbidden($message = 'Forbidden') {
        self::error($message, 403);
    }
    
    /**
     * Send 500 server error response
     */
    public static function serverError($message = 'Internal server error') {
        self::error($message, 500);
    }
}
