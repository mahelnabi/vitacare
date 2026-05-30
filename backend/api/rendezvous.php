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

if ($method === 'POST' && $action === 'reserver') { reserver(); }
elseif ($method === 'GET' && $action === 'mes-rdv') { mesRdv(); }
elseif ($method === 'GET' && $action === 'mes-rdv-intervenant') { mesRdvIntervenant(); }
elseif ($method === 'POST' && $action === 'annuler') { annuler(); }
elseif ($method === 'POST' && $action === 'modifier') { modifier(); }
else {
    http_response_code(404);
    echo json_encode(['error' => 'Action non trouvee']);
}

function reserver() {
    if (!isset($_SESSION['user_id'])) { http_response_code(401); echo json_encode(['error' => 'Non connecte']); return; }
    $data = json_decode(file_get_contents('php://input'), true);
    $id_service = intval($data['id_service'] ?? 0);
    $id_intervenant = intval($data['id_intervenant'] ?? 0);
    $id_dispo = intval($data['id_dispo'] ?? 0);
    $date_heure = $data['date_heure'] ?? '';
    if (!$id_service || !$id_intervenant || !$id_dispo || !$date_heure) {
        http_response_code(400); echo json_encode(['error' => 'Champs obligatoires manquants']); return;
    }
    $db = getDB();
    $stmt = $db->prepare('SELECT * FROM Disponibilite WHERE ID_dispo = ? AND statut = "libre"');
    $stmt->execute([$id_dispo]);
    if (!$stmt->fetch()) { http_response_code(409); echo json_encode(['error' => 'Ce creneau n est plus disponible']); return; }

    // Verifier qu'il n'y a pas de conflit de reservation
    $stmt = $db->prepare('SELECT * FROM Rendez_vous WHERE ID_patient = ? AND date_heure = ? AND statut != "annule"');
    $stmt->execute([$_SESSION['user_id'], $date_heure]);
    if ($stmt->fetch()) { http_response_code(409); echo json_encode(['error' => 'Vous avez deja un rendez-vous a ce creneau']); return; }

    $stmt = $db->prepare('INSERT INTO Rendez_vous (ID_patient, ID_intervenant, ID_service, date_heure, statut) VALUES (?, ?, ?, ?, "confirme")');
    $stmt->execute([$_SESSION['user_id'], $id_intervenant, $id_service, $date_heure]);
    $id_rdv = $db->lastInsertId();
    $stmt = $db->prepare('UPDATE Disponibilite SET statut = "reserve" WHERE ID_dispo = ?');
    $stmt->execute([$id_dispo]);
    $stmt = $db->prepare('INSERT INTO Notification (ID_utilisateur, message, type) VALUES (?, ?, "rdv")');
    $stmt->execute([$_SESSION['user_id'], 'Votre rendez-vous du ' . $date_heure . ' a ete confirme.']);
    http_response_code(201);
    echo json_encode(['message' => 'Rendez-vous reserve', 'id_rdv' => $id_rdv]);
}

function mesRdv() {
    if (!isset($_SESSION['user_id'])) { http_response_code(401); echo json_encode(['error' => 'Non connecte']); return; }
    $db = getDB();
    $stmt = $db->prepare('
        SELECT r.*, s.nom_service, s.duree_min, s.tarif,
               u.nom as intervenant_nom, u.prenom as intervenant_prenom, u.ID_utilisateur as ID_intervenant
        FROM Rendez_vous r
        JOIN Service s ON r.ID_service = s.ID_service
        JOIN Utilisateur u ON r.ID_intervenant = u.ID_utilisateur
        WHERE r.ID_patient = ?
        ORDER BY r.date_heure DESC
    ');
    $stmt->execute([$_SESSION['user_id']]);
    echo json_encode(['rdvs' => $stmt->fetchAll()]);
}

function mesRdvIntervenant() {
    if (!isset($_SESSION['user_id'])) { http_response_code(401); echo json_encode(['error' => 'Non connecte']); return; }
    $db = getDB();
    $stmt = $db->prepare('
        SELECT r.*, s.nom_service, s.duree_min, s.tarif,
               u.nom as patient_nom, u.prenom as patient_prenom
        FROM Rendez_vous r
        JOIN Service s ON r.ID_service = s.ID_service
        JOIN Utilisateur u ON r.ID_patient = u.ID_utilisateur
        WHERE r.ID_intervenant = ?
        ORDER BY r.date_heure DESC
    ');
    $stmt->execute([$_SESSION['user_id']]);
    echo json_encode(['rdvs' => $stmt->fetchAll()]);
}

function annuler() {
    if (!isset($_SESSION['user_id'])) { http_response_code(401); echo json_encode(['error' => 'Non connecte']); return; }
    $data = json_decode(file_get_contents('php://input'), true);
    $id_rdv = intval($data['id_rdv'] ?? 0);
    if (!$id_rdv) { http_response_code(400); echo json_encode(['error' => 'id_rdv requis']); return; }
    $db = getDB();
    $stmt = $db->prepare('SELECT * FROM Rendez_vous WHERE ID_rdv = ? AND ID_patient = ?');
    $stmt->execute([$id_rdv, $_SESSION['user_id']]);
    if (!$stmt->fetch()) { http_response_code(404); echo json_encode(['error' => 'Rendez-vous non trouve']); return; }

    $stmt = $db->prepare('UPDATE Rendez_vous SET statut = "annule" WHERE ID_rdv = ?');
    $stmt->execute([$id_rdv]);

    // Liberer le creneau
    $stmt = $db->prepare('UPDATE Disponibilite SET statut = "libre" WHERE ID_intervenant = (SELECT ID_intervenant FROM Rendez_vous WHERE ID_rdv = ?) AND date = DATE((SELECT date_heure FROM Rendez_vous WHERE ID_rdv = ?)) AND heure_debut = TIME((SELECT date_heure FROM Rendez_vous WHERE ID_rdv = ?))');
    $stmt->execute([$id_rdv, $id_rdv, $id_rdv]);

    $stmt = $db->prepare('INSERT INTO Notification (ID_utilisateur, message, type) VALUES (?, ?, "rdv")');
    $stmt->execute([$_SESSION['user_id'], 'Votre rendez-vous a ete annule.']);
    echo json_encode(['message' => 'Rendez-vous annule']);
}

function modifier() {
    if (!isset($_SESSION['user_id'])) { http_response_code(401); echo json_encode(['error' => 'Non connecte']); return; }
    $data = json_decode(file_get_contents('php://input'), true);
    $id_rdv = intval($data['id_rdv'] ?? 0);
    $id_dispo_nouveau = intval($data['id_dispo_nouveau'] ?? 0);
    $date_heure_nouvelle = $data['date_heure_nouvelle'] ?? '';

    if (!$id_rdv || !$id_dispo_nouveau || !$date_heure_nouvelle) {
        http_response_code(400); echo json_encode(['error' => 'Champs obligatoires manquants']); return;
    }

    $db = getDB();
    $stmt = $db->prepare('SELECT * FROM Rendez_vous WHERE ID_rdv = ? AND ID_patient = ? AND statut = "confirme"');
    $stmt->execute([$id_rdv, $_SESSION['user_id']]);
    $rdv = $stmt->fetch();
    if (!$rdv) { http_response_code(404); echo json_encode(['error' => 'Rendez-vous non trouve ou non modifiable']); return; }

    $stmt = $db->prepare('SELECT * FROM Disponibilite WHERE ID_dispo = ? AND statut = "libre"');
    $stmt->execute([$id_dispo_nouveau]);
    if (!$stmt->fetch()) { http_response_code(409); echo json_encode(['error' => 'Ce creneau n est plus disponible']); return; }

    // Liberer l'ancien creneau
    $stmt = $db->prepare('UPDATE Disponibilite SET statut = "libre" WHERE ID_intervenant = ? AND date = DATE(?) AND heure_debut = TIME(?)');
    $stmt->execute([$rdv['ID_intervenant'], $rdv['date_heure'], $rdv['date_heure']]);

    // Reserver le nouveau
    $stmt = $db->prepare('UPDATE Disponibilite SET statut = "reserve" WHERE ID_dispo = ?');
    $stmt->execute([$id_dispo_nouveau]);

    // Mettre a jour le RDV
    $stmt = $db->prepare('UPDATE Rendez_vous SET date_heure = ? WHERE ID_rdv = ?');
    $stmt->execute([$date_heure_nouvelle, $id_rdv]);

    $stmt = $db->prepare('INSERT INTO Notification (ID_utilisateur, message, type) VALUES (?, ?, "rdv")');
    $stmt->execute([$_SESSION['user_id'], 'Votre rendez-vous a ete modifie. Nouveau creneau : ' . $date_heure_nouvelle]);
    echo json_encode(['message' => 'Rendez-vous modifie']);
}