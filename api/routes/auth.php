<?php
/**
 * Auth Routes
 */

require_once __DIR__ . '/../services/AuthService.php';
require_once __DIR__ . '/../middleware/auth.php';

function signUp($input, $params) {
    if (empty($input['email']) || empty($input['password']) || empty($input['username'])) {
        Response::error('E-posta, şifre ve kullanıcı adı zorunludur', 400);
    }
    
    try {
        $authService = new AuthService();
        $data = $authService->signUp(
            $input['email'],
            $input['password'],
            $input['username'],
            $input['phone'] ?? null
        );
        
        Response::json([
            'message' => 'Kullanıcı başarıyla oluşturuldu',
            'user' => $data['user'],
            'session' => $data['session']
        ], 201);
    } catch (Exception $e) {
        Response::error($e->getMessage(), 400);
    }
}

function signIn($input, $params) {
    if (empty($input['email']) || empty($input['password'])) {
        Response::error('E-posta ve şifre zorunludur', 400);
    }
    
    try {
        $authService = new AuthService();
        $data = $authService->signIn($input['email'], $input['password']);
        
        Response::json([
            'message' => 'Giriş başarılı',
            'user' => $data['user'],
            'session' => $data['session']
        ]);
    } catch (Exception $e) {
        Response::error($e->getMessage(), 401);
    }
}

function signOut($input, $params) {
    Auth::authenticate();
    Response::json(['message' => 'Çıkış başarılı']);
}

function getMe($input, $params) {
    Auth::authenticate();
    Response::json(['user' => Auth::getUser()]);
}

function resetPassword($input, $params) {
    if (empty($input['email'])) {
        Response::error('E-posta adresi zorunludur', 400);
    }
    
    try {
        $authService = new AuthService();
        $result = $authService->resetPassword($input['email']);
        Response::json($result);
    } catch (Exception $e) {
        Response::error($e->getMessage(), 400);
    }
}

function updatePassword($input, $params) {
    Auth::authenticate();
    
    if (empty($input['newPassword'])) {
        Response::error('Yeni şifre zorunludur', 400);
    }
    
    try {
        $authService = new AuthService();
        $result = $authService->updatePassword(Auth::getUserId(), $input['newPassword']);
        Response::json($result);
    } catch (Exception $e) {
        Response::error($e->getMessage(), 400);
    }
}

function deleteAccount($input, $params) {
    Auth::authenticate();

    try {
        $authService = new AuthService();
        $result = $authService->deleteAccount(Auth::getUserId());
        Response::json($result);
    } catch (Exception $e) {
        Response::error($e->getMessage(), 400);
    }
}
