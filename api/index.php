<?php
/**
 * Main Entry Point - API Router
 * PHP + MySQL REST API
 */

// Enable error reporting for development
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Set JSON content type
header('Content-Type: application/json; charset=utf-8');

// Load composer packages
require_once __DIR__ . '/vendor/autoload.php';

// Load configuration
require_once __DIR__ . '/config/config.php';

// CORS Headers
header('Access-Control-Allow-Origin: ' . CORS_ALLOWED_ORIGINS);
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Max-Age: 86400');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Load helpers
require_once __DIR__ . '/helpers/response.php';
require_once __DIR__ . '/helpers/jwt.php';
require_once __DIR__ . '/helpers/upload.php';

// Parse request URI
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$basePath = '/api';

// Remove base path if present
if (strpos($requestUri, $basePath) === 0) {
    $requestUri = substr($requestUri, strlen($basePath));
}

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

// Method override for FormData requests (PHP doesn't populate $_POST/$_FILES for PUT/PATCH)
// Frontend sends POST with _method=PUT/PATCH field
if ($method === 'POST' && isset($_POST['_method'])) {
    $method = strtoupper($_POST['_method']);
}

// Get request body for POST/PUT/PATCH requests
$input = json_decode(file_get_contents('php://input'), true) ?? [];

// Simple router
$routes = [
    // Health check
    'GET /health' => function() {
        Response::json([
            'status' => 'ok',
            'timestamp' => date('c')
        ]);
    },
    
    // Auth routes
    'POST /auth/signup' => 'routes/auth.php::signUp',
    'POST /auth/signin' => 'routes/auth.php::signIn',
    'POST /auth/signout' => 'routes/auth.php::signOut',
    'GET /auth/me' => 'routes/auth.php::getMe',
    'POST /auth/reset-password' => 'routes/auth.php::resetPassword',
    'POST /auth/update-password' => 'routes/auth.php::updatePassword',
    'DELETE /auth/account' => 'routes/auth.php::deleteAccount',
    
    // Profile routes
    'GET /profiles/me' => 'routes/profiles.php::getMyProfile',
    'PUT /profiles/me' => 'routes/profiles.php::updateMyProfile',
    'GET /profiles' => 'routes/profiles.php::getAll',
    'GET /profiles/{id}' => 'routes/profiles.php::getById',
    'PATCH /profiles/{id}/toggle-active' => 'routes/profiles.php::toggleActive',
    'PATCH /profiles/{id}/role' => 'routes/profiles.php::updateRole',
    
    // Category routes
    'GET /categories/most-products' => 'routes/categories.php::getMostProducts',
    'GET /categories' => 'routes/categories.php::getActive',
    'GET /categories/slug/{slug}' => 'routes/categories.php::getBySlug',
    'GET /categories/admin/all' => 'routes/categories.php::getAll',
    'GET /categories/{id}' => 'routes/categories.php::getById',
    'POST /categories' => 'routes/categories.php::create',
    'PUT /categories/{id}' => 'routes/categories.php::update',
    'DELETE /categories/{id}' => 'routes/categories.php::delete',
    'PATCH /categories/{id}/toggle-active' => 'routes/categories.php::toggleActive',
    
    // Product routes
    'GET /products' => 'routes/products.php::getActive',
    'GET /products/admin/all' => 'routes/products.php::getAll',
    'GET /products/best-sellers' => 'routes/products.php::getBestSellers',
    'GET /products/most-viewed' => 'routes/products.php::getMostViewed',
    'GET /products/{id}' => 'routes/products.php::getById',
    'POST /products/{id}/view' => 'routes/products.php::incrementViewCount',
    'POST /products' => 'routes/products.php::create',
    'PUT /products/{id}' => 'routes/products.php::update',
    'POST /products/{id}/images' => 'routes/products.php::addImage',
    'PATCH /products/{id}/images/{imageId}/primary' => 'routes/products.php::setPrimaryImage',
    'DELETE /products/{id}/images/{imageId}' => 'routes/products.php::deleteImage',
    'DELETE /products/{id}' => 'routes/products.php::delete',
    'PATCH /products/{id}/toggle-active' => 'routes/products.php::toggleActive',
    'PATCH /products/{id}/stock' => 'routes/products.php::updateStock',
    
    // Order routes
    'GET /orders/track/{orderCode}' => 'routes/orders.php::getByOrderCode',
    'POST /orders' => 'routes/orders.php::create',
    'GET /orders/my-orders' => 'routes/orders.php::getMyOrders',
    'GET /orders' => 'routes/orders.php::getAll',
    'GET /orders/admin/stats' => 'routes/orders.php::getStats',
    'GET /orders/{id}' => 'routes/orders.php::getById',
    'POST /orders/{id}/cancel' => 'routes/orders.php::cancel',
    'PATCH /orders/{id}/status' => 'routes/orders.php::updateStatus',
    
    // Order Item routes
    'GET /order-items/order/{orderId}' => 'routes/order-items.php::getByOrderId',
    'GET /order-items/{id}' => 'routes/order-items.php::getById',
    'POST /order-items' => 'routes/order-items.php::create',
    'POST /order-items/bulk' => 'routes/order-items.php::createBulk',
    'PATCH /order-items/{id}' => 'routes/order-items.php::update',
    'DELETE /order-items/{id}' => 'routes/order-items.php::delete',
    'DELETE /order-items/order/{orderId}' => 'routes/order-items.php::deleteByOrderId',
    
    // Blog routes
    'GET /blogs/most-viewed' => 'routes/blogs.php::getMostViewed',
    'GET /blogs' => 'routes/blogs.php::getPublished',
    'GET /blogs/slug/{slug}' => 'routes/blogs.php::getBySlug',
    'GET /blogs/admin/all' => 'routes/blogs.php::getAll',
    'GET /blogs/{id}' => 'routes/blogs.php::getById',
    'POST /blogs/{id}/view' => 'routes/blogs.php::incrementViewCount',
    'POST /blogs' => 'routes/blogs.php::create',
    'PUT /blogs/{id}' => 'routes/blogs.php::update',
    'DELETE /blogs/{id}' => 'routes/blogs.php::delete',
    'PATCH /blogs/{id}/toggle-published' => 'routes/blogs.php::togglePublished',

    // Neighborhood routes
    'GET /neighborhoods' => 'routes/neighborhoods.php::getAll',
    'GET /neighborhoods/{id}' => 'routes/neighborhoods.php::getById',
    'POST /neighborhoods' => 'routes/neighborhoods.php::create',
    'PUT /neighborhoods/{id}' => 'routes/neighborhoods.php::update',
    'DELETE /neighborhoods/{id}' => 'routes/neighborhoods.php::delete',

    // Homepage Slides routes
    'GET /homepage-slides' => 'routes/homepage.php::getSlides',
    'GET /homepage-slides/admin/all' => 'routes/homepage.php::adminGetSlides',
    'POST /homepage-slides' => 'routes/homepage.php::adminCreateSlide',
    'PUT /homepage-slides/{id}' => 'routes/homepage.php::adminUpdateSlide',
    'DELETE /homepage-slides/{id}' => 'routes/homepage.php::adminDeleteSlide',
    'PATCH /homepage-slides/reorder' => 'routes/homepage.php::adminReorderSlides',

    // Contact Info routes (singleton)
    'GET /contact-info' => 'routes/contact-info.php::getContactInfo',
    'PUT /contact-info' => 'routes/contact-info.php::updateContactInfo',

    // About Page routes (singleton)
    'GET /about' => 'routes/about.php::getAboutInfo',
    'POST /about' => 'routes/about.php::updateAboutInfo', // Using POST to allow multipart form data (image upload)
];

/**
 * Match route with parameters
 */
function matchRoute($method, $uri, $routes) {
    $uri = rtrim($uri, '/');
    if (empty($uri)) $uri = '/';
    
    // Try exact match first
    $routeKey = "$method $uri";
    if (isset($routes[$routeKey])) {
        return ['handler' => $routes[$routeKey], 'params' => []];
    }
    
    // Try pattern matching
    foreach ($routes as $pattern => $handler) {
        list($routeMethod, $routePath) = explode(' ', $pattern, 2);
        
        if ($routeMethod !== $method) continue;
        
        // Convert route pattern to regex
        $regex = preg_replace('/\{([^}]+)\}/', '([^/]+)', $routePath);
        $regex = '#^' . $regex . '$#';
        
        if (preg_match($regex, $uri, $matches)) {
            array_shift($matches); // Remove full match
            
            // Extract param names
            preg_match_all('/\{([^}]+)\}/', $routePath, $paramNames);
            $params = [];
            foreach ($paramNames[1] as $i => $name) {
                $params[$name] = $matches[$i] ?? null;
            }
            
            return ['handler' => $handler, 'params' => $params];
        }
    }
    
    return null;
}

// Match and execute route
$match = matchRoute($method, $requestUri, $routes);

if ($match === null) {
    Response::notFound('Route not found');
}

$handler = $match['handler'];
$params = $match['params'];

// Execute handler
if (is_callable($handler)) {
    $handler();
} elseif (is_string($handler)) {
    list($file, $function) = explode('::', $handler);
    require_once __DIR__ . '/' . $file;
    $function($input, $params);
} else {
    Response::serverError('Invalid route handler');
}
