<?php
header("Content-Type: application/json; charset=utf-8");

include('../config/config.php');

$secret_key = VK_APP_SERVER_SECRET; // Защищённый ключ приложения

// Загружаем список товаров из JSON файла
$pricesData = json_decode(file_get_contents('data/vk-prices.json'), true);

// Если загрузка не удалась - создаём пустой массив
if (!is_array($pricesData)) {
    $pricesData = [];
}

// Функция для поиска товара по item_id
function findItemById($items, $itemId) {
    foreach ($items as $item) {
        if (isset($item['item_id']) && $item['item_id'] == $itemId) {
            return $item;
        }
    }
    return null;
}

// Функция для формирования ответа о товаре
function buildItemResponse($item, $testMode = false) {
    $response = [
        'item_id' => $item['item_id'],
        'title' => $item['title'],
        'photo_url' => $item['photo_url'],
        'price' => intval($item['price'])
    ];
    
    // Если тестовый режим - добавляем пометку в название и меняем item_id
    if ($testMode) {
        $response['item_id'] = $item['item_id'] + 1000; // Смещаем ID для тестового режима
        $response['title'] .= ' (тестовый режим)';
    }
    
    return $response;
}

$input = $_POST;

// Логирование входящих данных (для отладки)
file_put_contents("logs/purchase.log", date('Y-m-d H:i:s') . " - " . json_encode($input, JSON_UNESCAPED_UNICODE) . "\n", FILE_APPEND);

// Проверка подписи
$sig = isset($input['sig']) ? $input['sig'] : '';
unset($input['sig']);
ksort($input);
$str = '';
foreach ($input as $k => $v) {
    $str .= $k . '=' . $v;
}

if ($sig != md5($str . $secret_key)) {
    $response['error'] = array(
        'error_code' => 10,
        'error_msg' => 'Несовпадение вычисленной и переданной подписи запроса.',
        'critical' => true
    );
} else {
    // Подпись правильная
    switch ($input['notification_type']) {
        case 'get_item':
            // Получение информации о товаре
            $itemId = isset($input['item']) ? intval($input['item']) : 0;
            $item = findItemById($pricesData, $itemId);
            
            if ($item) {
                $response['response'] = buildItemResponse($item, false);
            } else {
                $response['error'] = array(
                    'error_code' => 20,
                    'error_msg' => 'Товара с item_id ' . $itemId . ' не существует.',
                    'critical' => true
                );
            }
            break;

        case 'get_item_test':
            // Получение информации о товаре в тестовом режиме
            $itemId = isset($input['item']) ? intval($input['item']) : 0;
            $item = findItemById($pricesData, $itemId);
            
            if ($item) {
                $response['response'] = buildItemResponse($item, true);
            } else {
                $response['error'] = array(
                    'error_code' => 20,
                    'error_msg' => 'Товара с item_id ' . $itemId . ' не существует.',
                    'critical' => true
                );
            }
            break;

        case 'order_status_change':
            // Изменение статуса заказа (реальный режим)
            if (isset($input['status']) && $input['status'] == 'chargeable') {
                $order_id = intval($input['order_id']);
                $itemId = isset($input['item']) ? intval($input['item']) : 0;
                
                // Проверяем, что товар существует
                $item = findItemById($pricesData, $itemId);
                
                if (!$item) {
                    $response['error'] = array(
                        'error_code' => 20,
                        'error_msg' => 'Товар с item_id ' . $itemId . ' не найден в прайс-листе.',
                        'critical' => true
                    );
                    break;
                }
                
                // TODO: Здесь добавьте логику выдачи товара пользователю
                // 1. Получите user_id из $input['user_id']
                // 2. Добавьте монеты пользователю в базу данных
                // 3. Сохраните информацию о покупке
                
                $user_id = isset($input['user_id']) ? intval($input['user_id']) : 0;
                
                // Пример: запись в лог о выдаче товара
                file_put_contents("logs/order.log", date('Y-m-d H:i:s') . " - Пользователь {$user_id} купил {$item['title']} (order_id: {$order_id})\n", FILE_APPEND);
                
                $app_order_id = $order_id; // Или сгенерируйте свой ID заказа
                
                $response['response'] = array(
                    'order_id' => $order_id,
                    'app_order_id' => $app_order_id,
                );
            } else {
                $response['error'] = array(
                    'error_code' => 100,
                    'error_msg' => 'Передано непонятно что вместо chargeable.',
                    'critical' => true
                );
            }
            break;

        case 'order_status_change_test':
            // Изменение статуса заказа в тестовом режиме
            if (isset($input['status']) && $input['status'] == 'chargeable') {
                $order_id = intval($input['order_id']);
                
                // В тестовом режиме можно не выдавать реальный товар
                file_put_contents("logs/order_test.log", date('Y-m-d H:i:s') . " - Тестовый заказ: {$order_id}\n", FILE_APPEND);
                
                $app_order_id = $order_id;
                
                $response['response'] = array(
                    'order_id' => $order_id,
                    'app_order_id' => $app_order_id,
                );
            } else {
                $response['error'] = array(
                    'error_code' => 100,
                    'error_msg' => 'Передано непонятно что вместо chargeable.',
                    'critical' => true
                );
            }
            break;
            
        default:
            $response['error'] = array(
                'error_code' => 30,
                'error_msg' => 'Неизвестный тип уведомления: ' . $input['notification_type'],
                'critical' => true
            );
            break;
    }
}

echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>