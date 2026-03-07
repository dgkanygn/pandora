<?php
/**
 * Neighborhood Routes
 */

require_once __DIR__ . '/../services/NeighborhoodService.php';
require_once __DIR__ . '/../middleware/auth.php';

function getAll($input, $params) {
    try {
        $service = new NeighborhoodService();
        $options = [
            'limit' => isset($_GET['limit']) ? intval($_GET['limit']) : null,
            'offset' => isset($_GET['offset']) ? intval($_GET['offset']) : null,
            'name' => isset($_GET['name']) ? $_GET['name'] : null
        ];
        
        $neighborhoods = $service->getAll($options);
        Response::json($neighborhoods);
    } catch (Exception $e) {
        Response::serverError($e->getMessage());
    }
}

function getById($input, $params) {
    try {
        $service = new NeighborhoodService();
        $neighborhood = $service->getById($params['id']);
        Response::json($neighborhood);
    } catch (Exception $e) {
        Response::notFound('Mahalle bulunamadı');
    }
}

function create($input, $params) {
    Auth::authenticate();
    Auth::isAdmin();
    
    $data = !empty($_POST) ? $_POST : $input;
    
    try {
        $service = new NeighborhoodService();
        $neighborhood = $service->create($data);
        Response::json($neighborhood, 201);
    } catch (Exception $e) {
        Response::error($e->getMessage(), 400);
    }
}

function update($input, $params) {
    Auth::authenticate();
    Auth::isAdmin();
    
    $data = !empty($_POST) ? $_POST : $input;
    
    try {
        $service = new NeighborhoodService();
        $neighborhood = $service->update($params['id'], $data);
        Response::json($neighborhood);
    } catch (Exception $e) {
        Response::error($e->getMessage(), 400);
    }
}

function delete($input, $params) {
    Auth::authenticate();
    Auth::isAdmin();
    
    try {
        $service = new NeighborhoodService();
        $result = $service->delete($params['id']);
        Response::json($result);
    } catch (Exception $e) {
        Response::error($e->getMessage(), 400);
    }
}
