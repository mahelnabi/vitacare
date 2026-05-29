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
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Action non trouvee']);
}
 
function liste() {
    $db = getDB();
    $stmt = $db->prepare('
        SELECT u.ID_utilisateur, u.nom, u.prenom, u.telephone, u.specialite, u.bio,
               COUNT(DISTINCT r.ID_rdv) as nb_rdvs,
               COUNT(DISTINCT ist.ID_service) as nb_services
        FROM Utilisateur u
        LEFT JOIN Rendez_vous r ON u.ID_utilisateur = r.ID_intervenant
        LEFT JOIN Intervenant_Service ist ON u.ID_utilisateur = ist.ID_intervenant
        WHERE u.role = "intervenant"
        GROUP BY u.ID_utilisateur
        ORDER BY u.nom ASC
    ');
    $stmt->execute();
    $intervenants = $stmt->fetchAll();
    echo json_encode(['intervenants' => $intervenants]);
}
 
function detail($id) {
    $db = getDB();
 
    $stmt = $db->prepare('
        SELECT u.ID_utilisateur, u.nom, u.prenom, u.telephone, u.specialite, u.bio,
               COUNT(DISTINCT r.ID_rdv) as nb_rdvs
        FROM Utilisateur u
        LEFT JOIN Rendez_vous r ON u.ID_utilisateur = r.ID_intervenant
        WHERE u.ID_utilisateur = ? AND u.role = "intervenant"
        GROUP BY u.ID_utilisateur
    ');
    $stmt->execute([$id]);
    $intervenant = $stmt->fetch();
 
    if (!$intervenant) {
        http_response_code(404);
        echo json_encode(['error' => 'Intervenant non trouve']);
        return;
    }
 
    $stmt2 = $db->prepare('
        SELECT s.ID_service, s.nom_service, s.duree_min, s.tarif, s.categorie
        FROM Service s
        JOIN Intervenant_Service ist ON s.ID_service = ist.ID_service
        WHERE ist.ID_intervenant = ?
        ORDER BY s.categorie, s.nom_service
    ');
    $stmt2->execute([$id]);
    $services = $stmt2->fetchAll();
 
    echo json_encode(['intervenant' => $intervenant, 'services' => $services]);
}