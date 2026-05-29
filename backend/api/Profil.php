<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
 
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/headers.php';
 
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
 
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Non connecte']);
    exit;
}
 
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
 
if ($method === 'POST' && $action === 'modifier') {
    modifier();
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Action non trouvee']);
}
 
function modifier() {
    $data = json_decode(file_get_contents('php://input'), true);
 
    $nom = trim($data['nom'] ?? '');
    $prenom = trim($data['prenom'] ?? '');
    $telephone = trim($data['telephone'] ?? '');
    $mot_de_passe = $data['mot_de_passe'] ?? null;
 
    if (!$nom || !$prenom) {
        http_response_code(400);
        echo json_encode(['error' => 'Nom et prenom obligatoires']);
        return;
    }
 
    $db = getDB();
 
    if ($mot_de_passe && strlen($mot_de_passe) >= 6) {
        $hash = password_hash($mot_de_passe, PASSWORD_BCRYPT);
        $stmt = $db->prepare('UPDATE Utilisateur SET nom=?, prenom=?, telephone=?, mot_de_passe=? WHERE ID_utilisateur=?');
        $stmt->execute([$nom, $prenom, $telephone, $hash, $_SESSION['user_id']]);
    } else {
        $stmt = $db->prepare('UPDATE Utilisateur SET nom=?, prenom=?, telephone=? WHERE ID_utilisateur=?');
        $stmt->execute([$nom, $prenom, $telephone, $_SESSION['user_id']]);
    }
 
    $_SESSION['user_nom'] = $nom;
    $_SESSION['user_prenom'] = $prenom;
 
    echo json_encode(['message' => 'Profil mis a jour']);
}