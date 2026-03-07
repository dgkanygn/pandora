<?php
/**
 * Product Routes
 */

require_once __DIR__ . '/../services/ProductService.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../helpers/upload.php';

function getActive($input, $params) {
    try {
        $productService = new ProductService();
        $options = [
            'categorySlugs' => !empty($_GET['category']) ? explode(',', $_GET['category']) : null,
            'search' => $_GET['search'] ?? null,
            'minPrice' => isset($_GET['minPrice']) ? floatval($_GET['minPrice']) : null,
            'maxPrice' => isset($_GET['maxPrice']) ? floatval($_GET['maxPrice']) : null,
            'sortBy' => $_GET['sortBy'] ?? null,
            'sortOrder' => $_GET['sortOrder'] ?? null,
            'limit' => isset($_GET['limit']) ? intval($_GET['limit']) : null,
            'offset' => isset($_GET['offset']) ? intval($_GET['offset']) : null
        ];
        $products = $productService->getActive($options);
        Response::json($products);
    } catch (Exception $e) {
        Response::serverError($e->getMessage());
    }
}

function getAll($input, $params) {
    Auth::authenticate();
    Auth::isAdmin();
    
    try {
        $productService = new ProductService();
        
        // Determine if category param is ID or slug
        $categoryParam = !empty($_GET['category']) ? explode(',', $_GET['category']) : null;
        $categoryIds = null;
        $categorySlugs = null;
        
        if ($categoryParam) {
            // Check if first value is numeric (ID) or string (slug)
            if (is_numeric($categoryParam[0])) {
                $categoryIds = $categoryParam;
            } else {
                $categorySlugs = $categoryParam;
            }
        }
        
        $options = [
            'categoryIds' => $categoryIds,
            'categorySlugs' => $categorySlugs,
            'search' => $_GET['search'] ?? null,
            'minPrice' => isset($_GET['minPrice']) ? floatval($_GET['minPrice']) : null,
            'maxPrice' => isset($_GET['maxPrice']) ? floatval($_GET['maxPrice']) : null,
            'sortBy' => $_GET['sortBy'] ?? null,
            'sortOrder' => $_GET['sortOrder'] ?? null,
            'limit' => isset($_GET['limit']) ? intval($_GET['limit']) : null,
            'offset' => isset($_GET['offset']) ? intval($_GET['offset']) : null
        ];
        $products = $productService->getAll($options);
        Response::json($products);
    } catch (Exception $e) {
        Response::serverError($e->getMessage());
    }
}

function getById($input, $params) {
    try {
        $productService = new ProductService();
        $product = $productService->getById($params['id']);
        Response::json($product);
    } catch (Exception $e) {
        Response::notFound('Ürün bulunamadı');
    }
}

function create($input, $params) {
    Auth::authenticate();
    Auth::isAdmin();
    
    // Handle multipart form data for file upload
    $data = !empty($_POST) ? $_POST : $input;
    
    if (empty($data['name']) || !isset($data['price'])) {
        Response::error('Ad ve fiyat zorunludur', 400);
    }
    
    try {
        $imageUrl = null;
        if (isset($_FILES['image'])) {
            $imageUrl = Upload::handleImage($_FILES['image'], 'products');
        }
        
        $productService = new ProductService();
        $product = $productService->create([
            'category_id' => $data['category_id'] ?? null,
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'price' => floatval($data['price']),
            'stock' => isset($data['stock']) ? intval($data['stock']) : 0,
            'is_active' => isset($data['is_active']) ? ($data['is_active'] === 'true' || $data['is_active'] === true ? 1 : 0) : 1,
            'image_url' => $imageUrl
        ]);
        
        Response::json($product, 201);
    } catch (Exception $e) {
        Response::error($e->getMessage(), 400);
    }
}

function update($input, $params) {
    Auth::authenticate();
    Auth::isAdmin();
    
    // Handle multipart form data for file upload
    $data = !empty($_POST) ? $_POST : $input;
    
    try {
        $productService = new ProductService();
        $updates = [];
        
        if (array_key_exists('category_id', $data)) $updates['category_id'] = $data['category_id'];
        if (isset($data['name'])) $updates['name'] = $data['name'];
        if (array_key_exists('description', $data)) $updates['description'] = $data['description'];
        if (isset($data['price'])) $updates['price'] = floatval($data['price']);
        if (isset($data['stock'])) $updates['stock'] = intval($data['stock']);
        if (isset($data['is_active'])) {
            $v = $data['is_active'];
            $updates['is_active'] = ($v === 'true' || $v === true || $v === '1' || $v === 1) ? 1 : 0;
        }
        
        // Handle image upload - add to gallery
        if (isset($_FILES['image']) && !empty($_FILES['image']['tmp_name'])) {
            $imageUrl = Upload::handleImage($_FILES['image'], 'products');
            $product = $productService->addProductImage($params['id'], $imageUrl);
            if (!empty($updates)) {
                $product = $productService->update($params['id'], $updates);
            }
            Response::json($product);
            return;
        } elseif (isset($data['remove_image']) && ($data['remove_image'] === 'true' || $data['remove_image'] === true)) {
            $existingProduct = $productService->getById($params['id']);
            if (!empty($existingProduct['images'])) {
                $product = $productService->deleteFirstProductImage($params['id']);
                if (!empty($updates)) {
                    $product = $productService->update($params['id'], $updates);
                }
                Response::json($product);
                return;
            }
            $updates['image_url'] = null;
        }
        
        $product = $productService->update($params['id'], $updates);
        Response::json($product);
    } catch (Exception $e) {
        Response::error($e->getMessage(), 400);
    }
}

function addImage($input, $params) {
    Auth::authenticate();
    Auth::isAdmin();
    
    if (!isset($_FILES['image']) || empty($_FILES['image']['tmp_name'])) {
        Response::error('Resim dosyası gerekli', 400);
    }
    
    try {
        $imageUrl = Upload::handleImage($_FILES['image'], 'products');
        $productService = new ProductService();
        $product = $productService->addProductImage($params['id'], $imageUrl);
        Response::json($product);
    } catch (Exception $e) {
        Response::error($e->getMessage(), 400);
    }
}

function setPrimaryImage($input, $params) {
    Auth::authenticate();
    Auth::isAdmin();
    
    try {
        $productService = new ProductService();
        $product = $productService->setPrimaryImage($params['id'], $params['imageId']);
        Response::json($product);
    } catch (Exception $e) {
        Response::error($e->getMessage(), 400);
    }
}

function deleteImage($input, $params) {
    Auth::authenticate();
    Auth::isAdmin();
    
    try {
        $productService = new ProductService();
        $product = $productService->deleteProductImage($params['id'], $params['imageId']);
        Response::json($product);
    } catch (Exception $e) {
        Response::error($e->getMessage(), 400);
    }
}

function delete($input, $params) {
    Auth::authenticate();
    Auth::isAdmin();
    
    try {
        $productService = new ProductService();
        $result = $productService->delete($params['id']);
        Response::json($result);
    } catch (Exception $e) {
        Response::error($e->getMessage(), 400);
    }
}

function toggleActive($input, $params) {
    Auth::authenticate();
    Auth::isAdmin();
    
    try {
        $productService = new ProductService();
        $product = $productService->toggleActive($params['id']);
        Response::json($product);
    } catch (Exception $e) {
        Response::error($e->getMessage(), 400);
    }
}

function updateStock($input, $params) {
    Auth::authenticate();
    Auth::isAdmin();
    
    if (!isset($input['quantity'])) {
        Response::error('Miktar zorunludur', 400);
    }
    
    try {
        $productService = new ProductService();
        $product = $productService->updateStock($params['id'], intval($input['quantity']));
        Response::json($product);
    } catch (Exception $e) {
        Response::error($e->getMessage(), 400);
    }
}

function getBestSellers($input, $params) {
    try {
        $productService = new ProductService();
        $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 6;
        $products = $productService->getBestSellers($limit);
        Response::json($products);
    } catch (Exception $e) {
        Response::serverError($e->getMessage());
    }
}

function incrementViewCount($input, $params) {
    try {
        $productService = new ProductService();
        $result = $productService->incrementViewCount($params['id']);
        Response::json($result);
    } catch (Exception $e) {
        Response::error($e->getMessage(), 400);
    }
}

function getMostViewed($input, $params) {
    try {
        $productService = new ProductService();
        $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;
        $products = $productService->getMostViewed($limit);
        Response::json($products);
    } catch (Exception $e) {
        Response::serverError($e->getMessage());
    }
}
