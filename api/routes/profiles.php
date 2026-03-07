<?php
/**
 * Profile Routes
 */

require_once __DIR__ . '/../services/ProfileService.php';
require_once __DIR__ . '/../middleware/auth.php';

function getMyProfile($input, $params) {
    Auth::authenticate();
    
    try {
        $profileService = new ProfileService();
        $profile = $profileService->getById(Auth::getUserId());
        Response::json($profile);
    } catch (Exception $e) {
        Response::notFound('Profil bulunamadı');
    }
}

function updateMyProfile($input, $params) {
    Auth::authenticate();
    
    try {
        $profileService = new ProfileService();
        $updates = [];
        
        if (isset($input['username'])) $updates['username'] = $input['username'];
        if (array_key_exists('phone', $input)) $updates['phone'] = $input['phone'];
        
        $profile = $profileService->update(Auth::getUserId(), $updates);
        Response::json($profile);
    } catch (Exception $e) {
        Response::error($e->getMessage(), 400);
    }
}

function getAll($input, $params) {
    Auth::authenticate();
    Auth::isAdmin();
    
    try {
        $profileService = new ProfileService();
        $profiles = $profileService->getAll();
        Response::json($profiles);
    } catch (Exception $e) {
        Response::serverError($e->getMessage());
    }
}

function getById($input, $params) {
    Auth::authenticate();
    Auth::isAdmin();
    
    try {
        $profileService = new ProfileService();
        $profile = $profileService->getById($params['id']);
        Response::json($profile);
    } catch (Exception $e) {
        Response::notFound('Profil bulunamadı');
    }
}

function toggleActive($input, $params) {
    Auth::authenticate();
    Auth::isAdmin();
    
    try {
        $profileService = new ProfileService();
        $profile = $profileService->toggleActive($params['id']);
        Response::json($profile);
    } catch (Exception $e) {
        Response::error($e->getMessage(), 400);
    }
}

function updateRole($input, $params) {
    Auth::authenticate();
    Auth::isAdmin();
    
    if (empty($input['role']) || !in_array($input['role'], ['user', 'admin'])) {
        Response::error('Geçerli bir rol (user/admin) zorunludur', 400);
    }
    
    try {
        $profileService = new ProfileService();
        $profile = $profileService->updateRole($params['id'], $input['role']);
        Response::json($profile);
    } catch (Exception $e) {
        Response::error($e->getMessage(), 400);
    }
}
