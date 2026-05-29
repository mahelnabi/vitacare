<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
 
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/headers.php';
 
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
 
if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['error' => 'Acces refuse']);
    exit;
}
 
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
 
if ($method === 'GET' && $action === 'stats') {
    stats();
} elseif ($method === 'GET' && $action === 'utilisateurs') {
    utilisateurs();
} elseif ($method === 'GET' && $action === 'rdvs') {
    rdvs();
} elseif ($method === 'POST' && $action === 'supprimer-utilisateur') {
    supprimerUtilisateur();
} elseif ($method === 'POST' && $action === 'supprimer-rdv') {
    supprimerRdv();
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Action non trouvee']);
}
 
function stats() {
    $db = getDB();
 
    $nbUsers = $db->query('SELECT COUNT(*) FROM Utilisateur WHERE role = "patient"')->fetchColumn();
    $nbIntervenants = $db->query('SELECT COUNT(*) FROM Utilisateur WHERE role = "intervenant"')->fetchColumn();
    $nbRdvs = $db->query('SELECT COUNT(*) FROM Rendez_vous')->fetchColumn();
    $nbServices = $db->query('SELECT COUNT(*) FROM Service')->fetchColumn();
    $nbRdvsMois = $db->query('SELECT COUNT(*) FROM Rendez_vous WHERE MONTH(date_heure) = MONTH(NOW())')->fetchColumn();
    $nbAttente = $db->query('SELECT COUNT(*) FROM Rendez_vous WHERE statut = "en_attente"')->fetchColumn();
 
    echo json_encode([
        'nb_patients' => $nbUsers,
        'nb_intervenants' => $nbIntervenants,
        'nb_rdvs' => $nbRdvs,
        'nb_services' => $nbServices,
        'nb_rdvs_mois' => $nbRdvsMois,
        'nb_attente' => $nbAttente,
    ]);
}
 
function utilisateurs() {
    $db = getDB();
    $stmt = $db->prepare('
        SELECT ID_utilisateur, nom, prenom, email, role, telephone, date_creation
        FROM Utilisateur
        ORDER BY date_creation DESC
    ');
    $stmt->execute();
    $users = $stmt->fetchAll();
    echo json_encode(['utilisateurs' => $users]);
}
 
function rdvs() {
    $db = getDB();
    $stmt = $db->prepare('
        SELECT r.*,
               s.nom_service,
               p.nom as patient_nom, p.prenom as patient_prenom,
               i.nom as intervenant_nom, i.prenom as intervenant_prenom
        FROM Rendez_vous r
        JOIN Service s ON r.ID_service = s.ID_service
        JOIN Utilisateur p ON r.ID_patient = p.ID_utilisateur
        JOIN Utilisateur i ON r.ID_intervenant = i.ID_utilisateur
        ORDER BY r.date_heure DESC
        LIMIT 50
    ');
    $stmt->execute();
    $rdvs = $stmt->fetchAll();
    echo json_encode(['rdvs' => $rdvs]);
}
 
function supprimerUtilisateur() {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = intval($data['id'] ?? 0);
 
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'id requis']);
        return;
    }
 
    if ($id === $_SESSION['user_id']) {
        http_response_code(400);
        echo json_encode(['error' => 'Impossible de supprimer votre propre compte']);
        return;
    }
 
    $db = getDB();
    $stmt = $db->prepare('DELETE FROM Utilisateur WHERE ID_utilisateur = ?');
    $stmt->execute([$id]);
    echo json_encode(['message' => 'Utilisateur supprime']);
}
 
function supprimerRdv() {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = intval($data['id'] ?? 0);
 
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'id requis']);
        return;
    }
 
    $db = getDB();
    $stmt = $db->prepare('UPDATE Rendez_vous SET statut = "annule" WHERE ID_rdv = ?');
    $stmt->execute([$id]);
    echo json_encode(['message' => 'Rendez-vous annule']);
}