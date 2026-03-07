<?php
/**
 * Category Routes
 */

require_once __DIR__ . '/../services/CategoryService.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../helpers/upload.php';

function getActive($input, $params) {
    try {
        $categoryService = new CategoryService();
        $options = [
            'limit' => isset($_GET['limit']) ? intval($_GET['limit']) : null,
            'offset' => isset($_GET['offset']) ? intval($_GET['offset']) : null
        ];
        $categories = $categoryService->getActive($options);
        Response::json($categories);
    } catch (Exception $e) {
        Response::serverError($e->getMessage());
    }
}

function getAll($input, $params) {
    Auth::authenticate();
    Auth::isAdmin();
    
    try {
        $categoryService = new CategoryService();
        $options = [
            'limit' => isset($_GET['limit']) ? intval($_GET['limit']) : null,
            'offset' => isset($_GET['offset']) ? intval($_GET['offset']) : null
        ];
        $categories = $categoryService->getAll($options);
        Response::json($categories);
    } catch (Exception $e) {
        Response::serverError($e->getMessage());
    }
}

function getById($input, $params) {
    Auth::authenticate();
    Auth::isAdmin();
    
    try {
        $categoryService = new CategoryService();
        $category = $categoryService->getById($params['id']);
        Response::json($category);
    } catch (Exception $e) {
        Response::notFound('Kategori bulunamadı');
    }
}

function getBySlug($input, $params) {
    try {
        $categoryService = new CategoryService();
        $category = $categoryService->getBySlug($params['slug']);
        Response::json($category);
    } catch (Exception $e) {
        Response::notFound('Kategori bulunamadı');
    }
}

function create($input, $params) {
    Auth::authenticate();
    Auth::isAdmin();
    
    // Handle multipart form data for file upload
    $data = !empty($_POST) ? $_POST : $input;
    
    if (empty($data['name']) || empty($data['slug'])) {
        Response::error('Ad ve slug zorunludur', 400);
    }
    
    try {
        $imageUrl = null;
        if (isset($_FILES['image'])) {
            $imageUrl = Upload::handleImage($_FILES['image'], 'categories');
        }
        
        $categoryService = new CategoryService();
        $category = $categoryService->create([
            'name' => $data['name'],
            'slug' => $data['slug'],
            'description' => $data['description'] ?? null,
            'is_active' => isset($data['is_active']) ? ($data['is_active'] === 'true' || $data['is_active'] === true ? 1 : 0) : 1,
            'image_url' => $imageUrl
        ]);
        
        Response::json($category, 201);
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
        $categoryService = new CategoryService();
        $updates = [];
        
        if (isset($data['name'])) $updates['name'] = $data['name'];
        if (isset($data['slug'])) $updates['slug'] = $data['slug'];
        if (array_key_exists('description', $data)) $updates['description'] = $data['description'];
        if (isset($data['is_active'])) {
            $updates['is_active'] = ($data['is_active'] === 'true' || $data['is_active'] === true) ? 1 : 0;
        }
        
        // Handle image upload
        if (isset($_FILES['image']) && !empty($_FILES['image']['tmp_name'])) {
            // Delete old image
            $existingCategory = $categoryService->getById($params['id']);
            if (!empty($existingCategory['image_url'])) {
                Upload::delete($existingCategory['image_url']);
            }
            $updates['image_url'] = Upload::handleImage($_FILES['image'], 'categories');
        } elseif (isset($data['remove_image']) && ($data['remove_image'] === 'true' || $data['remove_image'] === true)) {
            $existingCategory = $categoryService->getById($params['id']);
            if (!empty($existingCategory['image_url'])) {
                Upload::delete($existingCategory['image_url']);
            }
            $updates['image_url'] = null;
        }
        
        $category = $categoryService->update($params['id'], $updates);
        Response::json($category);
    } catch (Exception $e) {
        Response::error($e->getMessage(), 400);
    }
}

function delete($input, $params) {
    Auth::authenticate();
    Auth::isAdmin();
    
    try {
        $categoryService = new CategoryService();
        
        // Delete image if exists
        $category = $categoryService->getById($params['id']);
        if (!empty($category['image_url'])) {
            Upload::delete($category['image_url']);
        }
        
        $result = $categoryService->delete($params['id']);
        Response::json($result);
    } catch (Exception $e) {
        Response::error($e->getMessage(), 400);
    }
}

function toggleActive($input, $params) {
    Auth::authenticate();
    Auth::isAdmin();
    
    try {
        $categoryService = new CategoryService();
        $category = $categoryService->toggleActive($params['id']);
        Response::json($category);
    } catch (Exception $e) {
        Response::error($e->getMessage(), 400);
    }
}

function getMostProducts($input, $params) {
    try {
        $categoryService = new CategoryService();
        $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;
        $categories = $categoryService->getMostProducts($limit);
        Response::json($categories);
    } catch (Exception $e) {
        Response::serverError($e->getMessage());
    }
}
