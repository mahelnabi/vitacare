<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
 
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/headers.php';
 
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
 
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
 
if ($method === 'GET' && $action === 'liste') {
    liste();
} elseif ($method === 'POST' && $action === 'lire') {
    lire();
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Action non trouvee']);
}
 
function liste() {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Non connecte']);
        return;
    }
 
    $db = getDB();
    $stmt = $db->prepare('
        SELECT * FROM Notification
        WHERE ID_utilisateur = ?
        ORDER BY date_envoi DESC
        LIMIT 20
    ');
    $stmt->execute([$_SESSION['user_id']]);
    $notifications = $stmt->fetchAll();
 
    echo json_encode(['notifications' => $notifications]);
}
 
function lire() {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Non connecte']);
        return;
    }
 
    $id = $_GET['id'] ?? null;
 
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'id requis']);
        return;
    }
 
    $db = getDB();
    $stmt = $db->prepare('UPDATE Notification SET lue = 1 WHERE ID_notif = ? AND ID_utilisateur = ?');
    $stmt->execute([$id, $_SESSION['user_id']]);
 
    echo json_encode(['message' => 'Notification marquee comme lue']);
}