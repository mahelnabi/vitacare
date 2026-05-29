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
if ($method === 'GET' && $action === 'liste-intervenant') {
    listeIntervenant();
} elseif ($method === 'GET' && $action === 'mes-avis') {
    mesAvis();
} elseif ($method === 'POST' && $action === 'ajouter') {
    ajouter();
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Action non trouvee']);
}
function listeIntervenant() {
    $id = $_GET['id_intervenant'] ?? null;
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'id_intervenant requis']);
        return;
    }
    $db = getDB();
    $stmt = $db->prepare('
        SELECT a.*, u.nom as patient_nom, u.prenom as patient_prenom
        FROM Avis a
        JOIN Utilisateur u ON a.ID_patient = u.ID_utilisateur
        WHERE a.ID_intervenant = ?
        ORDER BY a.date_avis DESC
    ');
    $stmt->execute([$id]);
    $avis = $stmt->fetchAll();
    $stmt2 = $db->prepare('SELECT AVG(note) as moyenne, COUNT(*) as total FROM Avis WHERE ID_intervenant = ?');
    $stmt2->execute([$id]);
    $stats = $stmt2->fetch();
    echo json_encode([
        'avis' => $avis,
        'moyenne' => $stats['moyenne'] ? round($stats['moyenne'], 1) : null,
        'total' => intval($stats['total'])
    ]);
}
function mesAvis() {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Non connecte']);
        return;
    }
    $db = getDB();
    $stmt = $db->prepare('SELECT ID_rdv FROM Avis WHERE ID_patient = ?');
    $stmt->execute([$_SESSION['user_id']]);
    $avis = $stmt->fetchAll();
    $rdvs_notes = array_column($avis, 'ID_rdv');
    echo json_encode(['rdvs_notes' => $rdvs_notes]);
}
function ajouter() {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Non connecte']);
        return;
    }
    $data = json_decode(file_get_contents('php://input'), true);
    $id_rdv = intval($data['id_rdv'] ?? 0);
    $id_intervenant = intval($data['id_intervenant'] ?? 0);
    $note = intval($data['note'] ?? 0);
    $commentaire = trim($data['commentaire'] ?? '');
    if (!$id_rdv || !$id_intervenant || $note < 1 || $note > 5) {
        http_response_code(400);
        echo json_encode(['error' => 'Donnees invalides']);
        return;
    }
    $db = getDB();
    // Verifier que le RDV est bien passe et confirme
    $stmt = $db->prepare('SELECT * FROM Rendez_vous WHERE ID_rdv = ? AND ID_patient = ? AND statut = "confirme" AND date_heure < NOW()');
    $stmt->execute([$id_rdv, $_SESSION['user_id']]);
    if (!$stmt->fetch()) {
        http_response_code(403);
        echo json_encode(['error' => 'Vous ne pouvez laisser un avis que pour une consultation passee et confirmee']);
        return;
    }
    $stmt = $db->prepare('SELECT ID_avis FROM Avis WHERE ID_patient = ? AND ID_rdv = ?');
    $stmt->execute([$_SESSION['user_id'], $id_rdv]);
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(['error' => 'Vous avez deja laisse un avis pour ce rendez-vous']);
        return;
    }
    $stmt = $db->prepare('INSERT INTO Avis (ID_patient, ID_intervenant, ID_rdv, note, commentaire) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([$_SESSION['user_id'], $id_intervenant, $id_rdv, $note, $commentaire]);
    http_response_code(201);
    echo json_encode(['message' => 'Avis ajoute']);
}