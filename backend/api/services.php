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
$id = $_GET['id'] ?? null;
 
if ($method === 'GET' && $action === 'liste') {
    liste();
} elseif ($method === 'GET' && $action === 'detail' && $id) {
    detail($id);
} elseif ($method === 'POST' && $action === 'ajouter') {
    ajouter();
} elseif ($method === 'PUT' && $action === 'modifier' && $id) {
    modifier($id);
} elseif ($method === 'DELETE' && $action === 'supprimer' && $id) {
    supprimer($id);
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Action non trouvee']);
}
 
function liste() {
    $db = getDB();
    $categorie = $_GET['categorie'] ?? '';
    $recherche = $_GET['recherche'] ?? '';
 
    $sql = 'SELECT * FROM Service WHERE 1=1';
    $params = [];
 
    if ($categorie) {
        $sql .= ' AND categorie = ?';
        $params[] = $categorie;
    }
    if ($recherche) {
        $sql .= ' AND (nom_service LIKE ? OR description LIKE ?)';
        $params[] = '%' . $recherche . '%';
        $params[] = '%' . $recherche . '%';
    }
 
    $sql .= ' ORDER BY nom_service ASC';
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $services = $stmt->fetchAll();
 
    echo json_encode(['services' => $services, 'total' => count($services)]);
}
 
function detail($id) {
    $db = getDB();
 
    $stmt = $db->prepare('SELECT * FROM Service WHERE ID_service = ?');
    $stmt->execute([$id]);
    $service = $stmt->fetch();
 
    if (!$service) {
        http_response_code(404);
        echo json_encode(['error' => 'Service non trouve']);
        return;
    }
 
    // Recuperer uniquement les intervenants associes a ce service
    $stmt2 = $db->prepare('
        SELECT u.ID_utilisateur, u.nom, u.prenom, u.telephone, u.specialite, u.bio
        FROM Utilisateur u
        JOIN Intervenant_Service ist ON u.ID_utilisateur = ist.ID_intervenant
        WHERE ist.ID_service = ?
        AND u.role = "intervenant"
        ORDER BY u.nom ASC
    ');
    $stmt2->execute([$id]);
    $intervenants = $stmt2->fetchAll();
 
    echo json_encode(['service' => $service, 'intervenants' => $intervenants]);
}
 
function ajouter() {
    if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Acces refuse']);
        return;
    }
    $data = json_decode(file_get_contents('php://input'), true);
    $nom = trim($data['nom_service'] ?? '');
    $description = trim($data['description'] ?? '');
    $duree = intval($data['duree_min'] ?? 0);
    $tarif = floatval($data['tarif'] ?? 0);
    $categorie = trim($data['categorie'] ?? '');
 
    if (!$nom || !$duree || !$tarif || !$categorie) {
        http_response_code(400);
        echo json_encode(['error' => 'Champs obligatoires manquants']);
        return;
    }
 
    $db = getDB();
    $stmt = $db->prepare('INSERT INTO Service (nom_service, description, duree_min, tarif, categorie) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([$nom, $description, $duree, $tarif, $categorie]);
    http_response_code(201);
    echo json_encode(['message' => 'Service ajoute', 'id' => $db->lastInsertId()]);
}
 
function modifier($id) {
    if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Acces refuse']);
        return;
    }
    $data = json_decode(file_get_contents('php://input'), true);
    $nom = trim($data['nom_service'] ?? '');
    $description = trim($data['description'] ?? '');
    $duree = intval($data['duree_min'] ?? 0);
    $tarif = floatval($data['tarif'] ?? 0);
    $categorie = trim($data['categorie'] ?? '');
 
    if (!$nom || !$duree || !$tarif || !$categorie) {
        http_response_code(400);
        echo json_encode(['error' => 'Champs obligatoires manquants']);
        return;
    }
 
    $db = getDB();
    $stmt = $db->prepare('UPDATE Service SET nom_service=?, description=?, duree_min=?, tarif=?, categorie=? WHERE ID_service=?');
    $stmt->execute([$nom, $description, $duree, $tarif, $categorie, $id]);
    echo json_encode(['message' => 'Service modifie']);
}
 
function supprimer($id) {
    if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Acces refuse']);
        return;
    }
    $db = getDB();
    $stmt = $db->prepare('DELETE FROM Service WHERE ID_service = ?');
    $stmt->execute([$id]);
    echo json_encode(['message' => 'Service supprime']);
}