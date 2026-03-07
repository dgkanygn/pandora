<?php
/**
 * JWT Helper Functions
 * Simple JWT implementation without external libraries
 */

class JWT {
    /**
     * Encode a payload into a JWT token
     */
    public static function encode($payload, $secret = null) {
        $secret = $secret ?: JWT_SECRET;
        
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        $payload['iat'] = time();
        $payload['exp'] = time() + JWT_EXPIRY;
        $payload = json_encode($payload);
        
        $base64Header = self::base64UrlEncode($header);
        $base64Payload = self::base64UrlEncode($payload);
        
        $signature = hash_hmac('sha256', $base64Header . '.' . $base64Payload, $secret, true);
        $base64Signature = self::base64UrlEncode($signature);
        
        return $base64Header . '.' . $base64Payload . '.' . $base64Signature;
    }
    
    /**
     * Decode and verify a JWT token
     */
    public static function decode($token, $secret = null) {
        $secret = $secret ?: JWT_SECRET;
        
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            throw new Exception('Invalid token format');
        }
        
        list($base64Header, $base64Payload, $base64Signature) = $parts;
        
        // Verify signature
        $signature = hash_hmac('sha256', $base64Header . '.' . $base64Payload, $secret, true);
        $expectedSignature = self::base64UrlEncode($signature);
        
        if (!hash_equals($expectedSignature, $base64Signature)) {
            throw new Exception('Invalid token signature');
        }
        
        // Decode payload
        $payload = json_decode(self::base64UrlDecode($base64Payload), true);
        
        if (!$payload) {
            throw new Exception('Invalid token payload');
        }
        
        // Check expiration
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            throw new Exception('Token has expired');
        }
        
        return $payload;
    }
    
    /**
     * URL-safe Base64 encoding
     */
    private static function base64UrlEncode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
    
    /**
     * URL-safe Base64 decoding
     */
    private static function base64UrlDecode($data) {
        return base64_decode(strtr($data, '-_', '+/'));
    }
}
