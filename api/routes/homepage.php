<?php
/**
 * Homepage Routes
 * Ana sayfa slider ve içerik API
 */

require_once __DIR__ . '/../services/HomepageService.php';
require_once __DIR__ . '/../middleware/auth.php';

function getSlides($input, $params) {
    try {
        $service = new HomepageService();
        $slides = $service->getSlides();
        Response::json(['slides' => $slides]);
    } catch (Exception $e) {
        Response::serverError($e->getMessage());
    }
}

function adminGetSlides($input, $params) {
    Auth::authenticate();
    Auth::isAdmin();
    
    try {
        $service = new HomepageService();
        $slides = $service->getAllSlides();
        Response::json($slides);
    } catch (Exception $e) {
        Response::serverError($e->getMessage());
    }
}

function adminCreateSlide($input, $params) {
    Auth::authenticate();
    Auth::isAdmin();
    
    $data = !empty($_POST) ? $_POST : $input;
    
    if (empty($data['title']) || empty($data['title_highlight'])) {
        Response::error('Başlık ve vurgu metni zorunludur', 400);
    }
    
    try {
        $service = new HomepageService();
        $slide = $service->createSlide($data);
        Response::json($slide, 201);
    } catch (Exception $e) {
        Response::serverError($e->getMessage());
    }
}

function adminUpdateSlide($input, $params) {
    Auth::authenticate();
    Auth::isAdmin();
    
    $data = !empty($_POST) ? $_POST : $input;
    
    try {
        $service = new HomepageService();
        $slide = $service->updateSlide($params['id'], $data);
        Response::json($slide);
    } catch (Exception $e) {
        Response::serverError($e->getMessage());
    }
}

function adminDeleteSlide($input, $params) {
    Auth::authenticate();
    Auth::isAdmin();
    
    try {
        $service = new HomepageService();
        $service->deleteSlide($params['id']);
        Response::json(['success' => true]);
    } catch (Exception $e) {
        Response::serverError($e->getMessage());
    }
}

function adminReorderSlides($input, $params) {
    Auth::authenticate();
    Auth::isAdmin();
    
    $order = $input['order'] ?? [];
    if (!is_array($order)) {
        Response::error('Geçersiz sıra verisi', 400);
    }
    
    try {
        $service = new HomepageService();
        $slides = $service->reorderSlides($order);
        Response::json($slides);
    } catch (Exception $e) {
        Response::serverError($e->getMessage());
    }
}
