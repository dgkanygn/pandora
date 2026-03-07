<?php
/**
 * Order Item Routes
 */

require_once __DIR__ . '/../services/OrderItemService.php';
require_once __DIR__ . '/../middleware/auth.php';

function getByOrderId($input, $params) {
    Auth::authenticate();
    
    try {
        $orderItemService = new OrderItemService();
        $items = $orderItemService->getByOrderId($params['orderId']);
        Response::json($items);
    } catch (Exception $e) {
        Response::serverError($e->getMessage());
    }
}

function getById($input, $params) {
    Auth::authenticate();
    
    try {
        $orderItemService = new OrderItemService();
        $item = $orderItemService->getById($params['id']);
        Response::json($item);
    } catch (Exception $e) {
        Response::notFound('Sipariş kalemi bulunamadı');
    }
}

function create($input, $params) {
    Auth::authenticate();
    Auth::isAdmin();
    
    if (empty($input['order_id'])) {
        Response::error('order_id zorunludur', 400);
    }
    if (empty($input['product_id'])) {
        Response::error('product_id zorunludur', 400);
    }
    if (empty($input['product_name'])) {
        Response::error('product_name zorunludur', 400);
    }
    if (!isset($input['price'])) {
        Response::error('price zorunludur', 400);
    }
    if (empty($input['quantity']) || $input['quantity'] <= 0) {
        Response::error('Mıktar 0’dan büyük olmalıdır', 400);
    }
    
    try {
        $orderItemService = new OrderItemService();
        $item = $orderItemService->create($input);
        Response::json($item, 201);
    } catch (Exception $e) {
        Response::error($e->getMessage(), 400);
    }
}

function createBulk($input, $params) {
    Auth::authenticate();
    Auth::isAdmin();
    
    if (empty($input['order_id'])) {
        Response::error('order_id zorunludur', 400);
    }
    if (empty($input['items']) || !is_array($input['items']) || count($input['items']) === 0) {
        Response::error('items dizisi zorunludur ve boş olamaz', 400);
    }
    
    // Validate each item
    foreach ($input['items'] as $item) {
        if (empty($item['product_id']) || empty($item['product_name']) || 
            !isset($item['price']) || empty($item['quantity'])) {
            Response::error('Her kalemde product_id, product_name, price ve quantity bulunmalıdır', 400);
        }
        if ($item['quantity'] <= 0) {
            Response::error('Mıktar 0’dan büyük olmalıdır', 400);
        }
    }
    
    try {
        $orderItemService = new OrderItemService();
        $items = $orderItemService->createBulk($input['order_id'], $input['items']);
        Response::json($items, 201);
    } catch (Exception $e) {
        Response::error($e->getMessage(), 400);
    }
}

function update($input, $params) {
    Auth::authenticate();
    Auth::isAdmin();
    
    if (isset($input['quantity']) && $input['quantity'] <= 0) {
        Response::error('Mıktar 0’dan büyük olmalıdır', 400);
    }
    
    try {
        $orderItemService = new OrderItemService();
        $item = $orderItemService->update($params['id'], $input);
        Response::json($item);
    } catch (Exception $e) {
        Response::error($e->getMessage(), 400);
    }
}

function delete($input, $params) {
    Auth::authenticate();
    Auth::isAdmin();
    
    try {
        $orderItemService = new OrderItemService();
        $orderItemService->delete($params['id']);
        Response::json(['message' => 'Sipariş kalemi başarıyla silindi']);
    } catch (Exception $e) {
        Response::error($e->getMessage(), 400);
    }
}

function deleteByOrderId($input, $params) {
    Auth::authenticate();
    Auth::isAdmin();
    
    try {
        $orderItemService = new OrderItemService();
        $orderItemService->deleteByOrderId($params['orderId']);
        Response::json(['message' => 'Sipariş kalemleri başarıyla silindi']);
    } catch (Exception $e) {
        Response::error($e->getMessage(), 400);
    }
}
