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
} elseif ($method === 'GET' && $action === 'mes-inscriptions') {
    mesInscriptions();
} elseif ($method === 'POST' && $action === 'inscrire') {
    inscrire();
} elseif ($method === 'POST' && $action === 'desinscrire') {
    desinscrire();
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Action non trouvee']);
}
 
function liste() {
    $db = getDB();
    $stmt = $db->prepare('
        SELECT a.*, s.nom_service, s.categorie,
               COUNT(i.ID_inscription) as nb_inscrits
        FROM Activite a
        JOIN Service s ON a.ID_service = s.ID_service
        LEFT JOIN Inscription i ON a.ID_activite = i.ID_activite AND i.statut = "confirme"
        WHERE a.date_heure >= NOW()
        GROUP BY a.ID_activite
        ORDER BY a.date_heure ASC
    ');
    $stmt->execute();
    $activites = $stmt->fetchAll();
 
    echo json_encode(['activites' => $activites]);
}
 
function mesInscriptions() {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Non connecte']);
        return;
    }
 
    $db = getDB();
    $stmt = $db->prepare('
        SELECT i.*, a.nom_activite, a.date_heure, a.lieu, a.tarif
        FROM Inscription i
        JOIN Activite a ON i.ID_activite = a.ID_activite
        WHERE i.ID_patient = ?
        ORDER BY a.date_heure ASC
    ');
    $stmt->execute([$_SESSION['user_id']]);
    $activites = $stmt->fetchAll();
 
    echo json_encode(['activites' => $activites]);
}
 
function inscrire() {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Non connecte']);
        return;
    }
 
    $data = json_decode(file_get_contents('php://input'), true);
    $id_activite = intval($data['id_activite'] ?? 0);
 
    if (!$id_activite) {
        http_response_code(400);
        echo json_encode(['error' => 'id_activite requis']);
        return;
    }
 
    $db = getDB();
 
    $stmt = $db->prepare('SELECT * FROM Inscription WHERE ID_patient = ? AND ID_activite = ?');
    $stmt->execute([$_SESSION['user_id'], $id_activite]);
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(['error' => 'Vous etes deja inscrit a cette activite']);
        return;
    }
 
    $stmt = $db->prepare('
        SELECT a.capacite_max, COUNT(i.ID_inscription) as nb_inscrits
        FROM Activite a
        LEFT JOIN Inscription i ON a.ID_activite = i.ID_activite AND i.statut = "confirme"
        WHERE a.ID_activite = ?
        GROUP BY a.ID_activite
    ');
    $stmt->execute([$id_activite]);
    $info = $stmt->fetch();
 
    if (!$info) {
        http_response_code(404);
        echo json_encode(['error' => 'Activite non trouvee']);
        return;
    }
 
    $statut = $info['nb_inscrits'] >= $info['capacite_max'] ? 'liste_attente' : 'confirme';
 
    $stmt = $db->prepare('INSERT INTO Inscription (ID_patient, ID_activite, statut) VALUES (?, ?, ?)');
    $stmt->execute([$_SESSION['user_id'], $id_activite, $statut]);
 
    $stmt = $db->prepare('INSERT INTO Notification (ID_utilisateur, message, type) VALUES (?, ?, "activite")');
    $stmt->execute([$_SESSION['user_id'], 'Votre inscription a l activite a ete confirmee.']);
 
    http_response_code(201);
    echo json_encode(['message' => 'Inscription reussie', 'statut' => $statut]);
}
 
function desinscrire() {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Non connecte']);
        return;
    }
 
    $data = json_decode(file_get_contents('php://input'), true);
    $id_activite = intval($data['id_activite'] ?? 0);
 
    if (!$id_activite) {
        http_response_code(400);
        echo json_encode(['error' => 'id_activite requis']);
        return;
    }
 
    $db = getDB();
    $stmt = $db->prepare('DELETE FROM Inscription WHERE ID_patient = ? AND ID_activite = ?');
    $stmt->execute([$_SESSION['user_id'], $id_activite]);
 
    echo json_encode(['message' => 'Desinscription reussie']);
}