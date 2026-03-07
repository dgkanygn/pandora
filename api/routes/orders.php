<?php
/**
 * Order Routes
 */

require_once __DIR__ . '/../services/OrderService.php';
require_once __DIR__ . '/../middleware/auth.php';

function getMyOrders($input, $params) {
    Auth::authenticate();
    
    try {
        $orderService = new OrderService();

        $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : null;
        $offset = isset($_GET['offset']) ? (int) $_GET['offset'] : null;

        $orders = $orderService->getByUserId(Auth::getUserId(), $limit, $offset);
        $total = $orderService->countByUserId(Auth::getUserId());

        Response::json([
            'orders' => $orders,
            'total' => $total
        ]);
    } catch (Exception $e) {
        Response::serverError($e->getMessage());
    }
}

function getAll($input, $params) {
    Auth::authenticate();
    Auth::isAdmin();
    
    try {
        $orderService = new OrderService();
        $options = [
            'status' => $_GET['status'] ?? null,
            'date_from' => $_GET['date_from'] ?? null,
            'date_to' => $_GET['date_to'] ?? null,
            'limit' => isset($_GET['limit']) ? intval($_GET['limit']) : null,
            'offset' => isset($_GET['offset']) ? intval($_GET['offset']) : null
        ];
        $orders = $orderService->getAll($options);
        Response::json($orders);
    } catch (Exception $e) {
        Response::serverError($e->getMessage());
    }
}

function getById($input, $params) {
    Auth::authenticate();
    
    try {
        $orderService = new OrderService();
        $order = $orderService->getById($params['id']);
        
        // Check ownership unless admin
        if (Auth::getUserRole() !== 'admin' && $order['user_id'] !== Auth::getUserId()) {
            Response::forbidden('Erişim reddedildi');
        }
        
        Response::json($order);
    } catch (Exception $e) {
        Response::notFound('Sipariş bulunamadı');
    }
}

function getByOrderCode($input, $params) {
    try {
        $orderService = new OrderService();
        $order = $orderService->getByOrderCode($params['orderCode']);
        Response::json($order);
    } catch (Exception $e) {
        Response::notFound('Sipariş bulunamadı. Lütfen sipariş numaranızı kontrol ediniz.');
    }
}

function create($input, $params) {
    // Support guest checkout
    Auth::optionalAuth();
    
    if (empty($input['address'])) {
        Response::error('Adres zorunludur', 400);
    }
    
    if (empty($input['items']) || !is_array($input['items']) || count($input['items']) === 0) {
        Response::error('Sipariş kalemleri zorunludur', 400);
    }
    
    // Validate items
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
        $orderService = new OrderService();
        
        $orderData = [
            'address' => $input['address'],
            'customer_name' => $input['customer_name'] ?? null,
            'customer_email' => $input['customer_email'] ?? null,
            'customer_phone' => $input['customer_phone'] ?? null,
            'receiver_name' => $input['receiver_name'] ?? null,
            'delivery_date' => $input['delivery_date'] ?? null,
            'delivery_time_slot' => $input['delivery_time_slot'] ?? null,
            'receiver_phone' => $input['receiver_phone'] ?? null,
            'city' => $input['city'] ?? null,
            'district' => $input['district'] ?? null,
            'delivery_note' => $input['delivery_note'] ?? null,
            'flower_note' => $input['flower_note'] ?? null,
            'show_name_on_card' => $input['show_name_on_card'] ?? false,
            'delivery_confirmation' => $input['delivery_confirmation'] ?? false,
            'user_message' => $input['user_message'] ?? null,
            'invoice_type' => $input['invoice_type'] ?? null,
            'payment_method' => $input['payment_method'] ?? null,
            'contract_accepted' => $input['contract_accepted'] ?? false
        ];
        
        $order = $orderService->create(Auth::getUserId(), $orderData, $input['items']);
        Response::json($order, 201);
    } catch (Exception $e) {
        Response::error($e->getMessage(), 400);
    }
}

function updateStatus($input, $params) {
    Auth::authenticate();
    Auth::isAdmin();
    
    if (empty($input['status'])) {
        Response::error('Durum zorunludur', 400);
    }
    
    try {
        $orderService = new OrderService();
        $order = $orderService->updateStatus($params['id'], $input['status']);
        Response::json($order);
    } catch (Exception $e) {
        Response::error($e->getMessage(), 400);
    }
}

function cancel($input, $params) {
    Auth::authenticate();
    
    try {
        $orderService = new OrderService();
        $userId = Auth::getUserRole() === 'admin' ? null : Auth::getUserId();
        $order = $orderService->cancel($params['id'], $userId);
        Response::json($order);
    } catch (Exception $e) {
        Response::error($e->getMessage(), 400);
    }
}

function getStats($input, $params) {
    Auth::authenticate();
    Auth::isAdmin();
    
    try {
        $orderService = new OrderService();
        $period = $_GET['period'] ?? 'month';
        $validPeriods = ['today', 'week', 'month', 'all_time'];
        if (!in_array($period, $validPeriods)) {
            $period = 'month';
        }
        $stats = $orderService->getStats($period);
        Response::json($stats);
    } catch (Exception $e) {
        Response::serverError($e->getMessage());
    }
}
