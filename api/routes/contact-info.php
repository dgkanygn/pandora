<?php
/**
 * Contact Info Routes
 * site_contact_info tek satır yönetimi
 */

require_once __DIR__ . '/../services/ContactInfoService.php';
require_once __DIR__ . '/../middleware/auth.php';

function getContactInfo($input, $params) {
    try {
        $service = new ContactInfoService();
        Response::json($service->get());
    } catch (Exception $e) {
        Response::serverError($e->getMessage());
    }
}

function updateContactInfo($input, $params) {
    Auth::authenticate();
    Auth::isAdmin();

    $data = !empty($_POST) ? $_POST : $input;

    try {
        $service = new ContactInfoService();
        $result = $service->update($data);
        Response::json($result);
    } catch (Exception $e) {
        Response::serverError($e->getMessage());
    }
}
