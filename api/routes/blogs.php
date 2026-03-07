<?php
/**
 * Blog Routes
 */

require_once __DIR__ . '/../services/BlogService.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../helpers/upload.php';

function getPublished($input, $params) {
    try {
        $blogService = new BlogService();
        $options = [
            'search' => $_GET['search'] ?? null,
            'limit' => isset($_GET['limit']) ? intval($_GET['limit']) : null,
            'offset' => isset($_GET['offset']) ? intval($_GET['offset']) : null
        ];
        $posts = $blogService->getPublished($options);
        Response::json($posts);
    } catch (Exception $e) {
        Response::serverError($e->getMessage());
    }
}

function getAll($input, $params) {
    Auth::authenticate();
    Auth::isAdmin();
    
    try {
        $blogService = new BlogService();
        $options = [
            'limit' => isset($_GET['limit']) ? intval($_GET['limit']) : null,
            'offset' => isset($_GET['offset']) ? intval($_GET['offset']) : null
        ];
        $posts = $blogService->getAll($options);
        Response::json($posts);
    } catch (Exception $e) {
        Response::serverError($e->getMessage());
    }
}

function getById($input, $params) {
    try {
        $blogService = new BlogService();
        $post = $blogService->getById($params['id']);
        Response::json($post);
    } catch (Exception $e) {
        Response::notFound('Blog yazısı bulunamadı');
    }
}

function getBySlug($input, $params) {
    try {
        $blogService = new BlogService();
        $post = $blogService->getBySlug($params['slug']);
        Response::json($post);
    } catch (Exception $e) {
        Response::notFound('Blog yazısı bulunamadı');
    }
}

function create($input, $params) {
    Auth::authenticate();
    Auth::isAdmin();
    
    // Handle multipart form data for file upload
    $data = !empty($_POST) ? $_POST : $input;
    
    if (empty($data['title']) || empty($data['slug']) || empty($data['content'])) {
        Response::error('Başlık, slug ve içerik zorunludur', 400);
    }
    
    try {
        $coverImage = null;
        if (isset($_FILES['image'])) {
            $coverImage = Upload::handleImage($_FILES['image'], 'blogs');
        }
        
        $blogService = new BlogService();
        
        $isPublished = 0;
        if (isset($data['is_published'])) {
            $val = $data['is_published'];
            if ($val === 'true' || $val === '1' || $val === 1 || $val === true) {
                $isPublished = 1;
            }
        }

        $post = $blogService->create([
            'title' => $data['title'],
            'slug' => $data['slug'],
            'content' => $data['content'],
            'cover_image' => $coverImage,
            'is_published' => $isPublished
        ]);
        
        Response::json($post, 201);
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
        $blogService = new BlogService();
        $updates = [];
        
        if (isset($data['title'])) $updates['title'] = $data['title'];
        if (isset($data['slug'])) $updates['slug'] = $data['slug'];
        if (isset($data['content'])) $updates['content'] = $data['content'];
        if (isset($data['is_published'])) {
            $val = $data['is_published'];
            $updates['is_published'] = ($val === 'true' || $val === '1' || $val === 1 || $val === true) ? 1 : 0;
        }
        
        // Handle cover image upload
        if (isset($_FILES['image']) && !empty($_FILES['image']['tmp_name'])) {
            $existingPost = $blogService->getById($params['id']);
            if (!empty($existingPost['cover_image'])) {
                Upload::delete($existingPost['cover_image']);
            }
            $updates['cover_image'] = Upload::handleImage($_FILES['image'], 'blogs');
        } elseif (isset($data['remove_image']) && ($data['remove_image'] === 'true' || $data['remove_image'] === true)) {
            $existingPost = $blogService->getById($params['id']);
            if (!empty($existingPost['cover_image'])) {
                Upload::delete($existingPost['cover_image']);
            }
            $updates['cover_image'] = null;
        }
        
        $post = $blogService->update($params['id'], $updates);
        Response::json($post);
    } catch (Exception $e) {
        Response::error($e->getMessage(), 400);
    }
}

function delete($input, $params) {
    Auth::authenticate();
    Auth::isAdmin();
    
    try {
        $blogService = new BlogService();
        
        // Delete cover image if exists
        $post = $blogService->getById($params['id']);
        if (!empty($post['cover_image'])) {
            Upload::delete($post['cover_image']);
        }
        
        $result = $blogService->delete($params['id']);
        Response::json($result);
    } catch (Exception $e) {
        Response::error($e->getMessage(), 400);
    }
}

function togglePublished($input, $params) {
    Auth::authenticate();
    Auth::isAdmin();
    
    try {
        $blogService = new BlogService();
        $post = $blogService->togglePublished($params['id']);
        Response::json($post);
    } catch (Exception $e) {
        Response::error($e->getMessage(), 400);
    }
}

function incrementViewCount($input, $params) {
    try {
        $blogService = new BlogService();
        $result = $blogService->incrementViewCount($params['id']);
        Response::json($result);
    } catch (Exception $e) {
        Response::error($e->getMessage(), 400);
    }
}

function getMostViewed($input, $params) {
    try {
        $blogService = new BlogService();
        $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;
        $posts = $blogService->getMostViewed($limit);
        Response::json($posts);
    } catch (Exception $e) {
        Response::serverError($e->getMessage());
    }
}
