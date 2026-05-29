<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/headers.php';

$db = getDB();
$stmt = $db->query('SELECT COUNT(*) as total FROM Utilisateur');
$result = $stmt->fetch();

echo json_encode([
    'status' => 'ok',
    'message' => 'Connexion reussie',
    'utilisateurs' => $result['total']
]);