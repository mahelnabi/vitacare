<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/headers.php';
 
session_start();
 
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
 
if ($method === 'POST' && $action === 'inscription') {
    inscription();
} elseif ($method === 'POST' && $action === 'connexion') {
    connexion();
} elseif ($method === 'POST' && $action === 'deconnexion') {
    deconnexion();
} elseif ($method === 'GET' && $action === 'me') {
    me();
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Action non trouvee']);
}
 
function inscription() {
    $data = json_decode(file_get_contents('php://input'), true);
 
    $nom = trim($data['nom'] ?? '');
    $prenom = trim($data['prenom'] ?? '');
    $email = trim($data['email'] ?? '');
    $mot_de_passe = $data['mot_de_passe'] ?? '';
    $role = $data['role'] ?? 'patient';
    $telephone = trim($data['telephone'] ?? '');
 
    if (!$nom || !$prenom || !$email || !$mot_de_passe) {
        http_response_code(400);
        echo json_encode(['error' => 'Tous les champs obligatoires doivent etre remplis']);
        return;
    }
 
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Email invalide']);
        return;
    }
 
    if (strlen($mot_de_passe) < 6) {
        http_response_code(400);
        echo json_encode(['error' => 'Le mot de passe doit contenir au moins 6 caracteres']);
        return;
    }
 
    if (!in_array($role, ['patient', 'intervenant'])) {
        $role = 'patient';
    }
 
    $db = getDB();
 
    $stmt = $db->prepare('SELECT ID_utilisateur FROM Utilisateur WHERE email = ?');
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(['error' => 'Cet email est deja utilise']);
        return;
    }
 
    $hash = password_hash($mot_de_passe, PASSWORD_BCRYPT);
 
    $stmt = $db->prepare('INSERT INTO Utilisateur (nom, prenom, email, mot_de_passe, role, telephone) VALUES (?, ?, ?, ?, ?, ?)');
    $stmt->execute([$nom, $prenom, $email, $hash, $role, $telephone]);
 
    $id = $db->lastInsertId();
 
    http_response_code(201);
    echo json_encode([
        'message' => 'Compte cree avec succes',
        'utilisateur' => [
            'id' => $id,
            'nom' => $nom,
            'prenom' => $prenom,
            'email' => $email,
            'role' => $role
        ]
    ]);
}
 
function connexion() {
    $data = json_decode(file_get_contents('php://input'), true);
 
    $email = trim($data['email'] ?? '');
    $mot_de_passe = $data['mot_de_passe'] ?? '';
 
    if (!$email || !$mot_de_passe) {
        http_response_code(400);
        echo json_encode(['error' => 'Email et mot de passe requis']);
        return;
    }
 
    $db = getDB();
 
    $stmt = $db->prepare('SELECT * FROM Utilisateur WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();
 
    if (!$user || !password_verify($mot_de_passe, $user['mot_de_passe'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Email ou mot de passe incorrect']);
        return;
    }
 
    session_regenerate_id(true);
    $_SESSION['user_id'] = $user['ID_utilisateur'];
    $_SESSION['user_role'] = $user['role'];
    $_SESSION['user_nom'] = $user['nom'];
    $_SESSION['user_prenom'] = $user['prenom'];
 
    echo json_encode([
        'message' => 'Connexion reussie',
        'utilisateur' => [
            'id' => $user['ID_utilisateur'],
            'nom' => $user['nom'],
            'prenom' => $user['prenom'],
            'email' => $user['email'],
            'role' => $user['role']
        ]
    ]);
}
 
function deconnexion() {
    session_destroy();
    echo json_encode(['message' => 'Deconnexion reussie']);
}
 
function me() {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Non connecte']);
        return;
    }
 
    echo json_encode([
        'utilisateur' => [
            'id' => $_SESSION['user_id'],
            'nom' => $_SESSION['user_nom'],
            'prenom' => $_SESSION['user_prenom'],
            'role' => $_SESSION['user_role']
        ]
    ]);
}