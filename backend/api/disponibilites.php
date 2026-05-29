<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/headers.php';
 
session_start();
 
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
 
if ($method === 'GET' && $action === 'liste') {
    liste();
} elseif ($method === 'POST' && $action === 'ajouter') {
    ajouter();
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Action non trouvee']);
}
 
function liste() {
    $id_intervenant = $_GET['id_intervenant'] ?? null;
 
    if (!$id_intervenant) {
        http_response_code(400);
        echo json_encode(['error' => 'id_intervenant requis']);
        return;
    }
 
    $db = getDB();
    $stmt = $db->prepare('
        SELECT * FROM Disponibilite
        WHERE ID_intervenant = ?
        AND statut = "libre"
        AND date >= CURDATE()
        ORDER BY date ASC, heure_debut ASC
    ');
    $stmt->execute([$id_intervenant]);
    $dispos = $stmt->fetchAll();
 
    echo json_encode(['disponibilites' => $dispos]);
}
 
function ajouter() {
    if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'intervenant') {
        http_response_code(403);
        echo json_encode(['error' => 'Acces refuse']);
        return;
    }
 
    $data = json_decode(file_get_contents('php://input'), true);
 
    $date = $data['date'] ?? '';
    $heure_debut = $data['heure_debut'] ?? '';
    $heure_fin = $data['heure_fin'] ?? '';
 
    if (!$date || !$heure_debut || !$heure_fin) {
        http_response_code(400);
        echo json_encode(['error' => 'Champs obligatoires manquants']);
        return;
    }
 
    $db = getDB();
    $stmt = $db->prepare('INSERT INTO Disponibilite (ID_intervenant, date, heure_debut, heure_fin, statut) VALUES (?, ?, ?, ?, "libre")');
    $stmt->execute([$_SESSION['user_id'], $date, $heure_debut, $heure_fin]);
 
    http_response_code(201);
    echo json_encode(['message' => 'Disponibilite ajoutee', 'id' => $db->lastInsertId()]);
}