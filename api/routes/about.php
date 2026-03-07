<?php
/**
 * About Page Routes
 * about_page tek satır yönetimi
 */

require_once __DIR__ . '/../services/AboutService.php';
require_once __DIR__ . '/../middleware/auth.php';

function getAboutInfo($input, $params) {
    try {
        $service = new AboutService();
        Response::json($service->get());
    } catch (Exception $e) {
        Response::serverError($e->getMessage());
    }
}

function updateAboutInfo($input, $params) {
    Auth::authenticate();
    Auth::isAdmin();

    $data = !empty($_POST) ? $_POST : $input;
    $file = isset($_FILES['image']) ? $_FILES['image'] : null;

    try {
        $service = new AboutService();
        $result = $service->update($data, $file);
        Response::json($result);
    } catch (Exception $e) {
        Response::serverError($e->getMessage());
    }
}
