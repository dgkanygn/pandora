<?php
/**
 * Application Configuration
 */

// Load environment variables from .env if exists
if (file_exists(__DIR__ . '/../.env')) {
    $lines = file(__DIR__ . '/../.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        if (strpos($line, '=') !== false) {
            list($name, $value) = explode('=', $line, 2);
            $value = trim($value);
            $value = preg_replace('/^(["\'])(.*)\1$/', '$2', $value);
            putenv(trim($name) . '=' . $value);
        }
    }
}

// JWT Configuration
define('JWT_SECRET', getenv('JWT_SECRET') ?: 'your-super-secret-key-change-this-in-production');
define('JWT_EXPIRY', getenv('JWT_EXPIRY') ?: 7200);

// CORS Configuration
define('CORS_ALLOWED_ORIGINS', getenv('CORS_ORIGINS') ?: '*');

// Upload Configuration
define('UPLOAD_DIR', __DIR__ . '/../uploads');
define('MAX_FILE_SIZE', 5 * 1024 * 1024); // 5MB
define('ALLOWED_IMAGE_TYPES', ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']);

// Base URL for uploads
define('UPLOAD_BASE_URL', getenv('UPLOAD_BASE_URL') ?: 'https://eskisehirisg.com/api/uploads');

// Ensure upload directories exist
$uploadDirs = ['categories', 'products', 'blogs'];
foreach ($uploadDirs as $dir) {
    $path = UPLOAD_DIR . '/' . $dir;
    if (!is_dir($path)) {
        mkdir($path, 0755, true);
    }
}
