# VitaCare - Plateforme de sante et bien-etre

Projet Web dynamique 2026 - ING2 ECE Paris - Equipe 8

Repository : https://github.com/mahelnabi/vitacare-td3-equipe8

## Description

VitaCare est une plateforme web de reservation et de gestion de services de sante et de bien-etre. Trois types d'utilisateurs interagissent sur la plateforme : les patients reservent des rendez-vous et s'inscrivent a des activites, les intervenants gerent leurs disponibilites, et les administrateurs supervisent la plateforme.

## Technologies

- Frontend : React avec Vite, port 5173
- Backend : PHP API REST, port 80
- Base de donnees : MySQL, port 3306
- Serveur local : MAMP (Windows)

## Prerequis

- Node.js v18 ou superieur
- MAMP avec Apache et MySQL
- Un navigateur web moderne

## Installation

### 1. Cloner le projet

```
git clone https://github.com/mahelnabi/vitacare-td3-equipe8.git
cd vitacare
```

### 2. Configurer la base de donnees

1. Lancer MAMP et verifier qu'Apache et MySQL sont actifs
2. Ouvrir phpMyAdmin a l'adresse `http://localhost/phpMyAdmin5/`
3. Cliquer sur l'onglet "SQL"
4. Coller le contenu du fichier `vitacare.sql` et cliquer sur "Executer"
5. La base de donnees `vitacare` est creee avec 8 tables et des donnees de test

### 3. Configurer le backend

Ouvrir `backend/config/database.php` et renseigner les identifiants MySQL :

```php
define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_NAME', 'vitacare');
define('DB_USER', 'root');
define('DB_PASS', 'votre_mot_de_passe');
```

Placer le dossier `backend` dans le repertoire `htdocs` de MAMP :

```
C:/MAMP/htdocs/vitacare/backend/
```

### 4. Lancer le frontend

```
cd frontend
npm install
npm run dev
```

Le site est accessible a l'adresse `http://localhost:5173`

## Structure du projet

```
vitacare/
├── frontend/
│   └── src/
│       ├── components/
│       │   └── Navbar.jsx
│       ├── pages/
│       │   ├── Accueil.jsx
│       │   ├── Activites.jsx
│       │   ├── Connexion.jsx
│       │   ├── Dashboard.jsx
│       │   ├── DashboardAdmin.jsx
│       │   ├── DashboardIntervenant.jsx
│       │   ├── FicheIntervenant.jsx
│       │   ├── FicheService.jsx
│       │   ├── GenerateurPDF.jsx
│       │   ├── Inscription.jsx
│       │   ├── Intervenants.jsx
│       │   ├── Panier.jsx
│       │   └── Profil.jsx
│       └── App.jsx
├── backend/
│   ├── api/
│   │   ├── activites.php
│   │   ├── admin.php
│   │   ├── auth.php
│   │   ├── avis.php
│   │   ├── disponibilites.php
│   │   ├── headers.php
│   │   ├── intervenants.php
│   │   ├── notifications.php
│   │   ├── profil.php
│   │   ├── rendezvous.php
│   │   ├── services.php
│   │   └── test.php
│   └── config/
│       └── database.php
├── vitacare.sql
└── README.md
```

## Comptes de test

Tous les comptes ont le mot de passe : `password`

| Email | Role |
|---|---|
| admin@vitacare.fr | Admin |
| sophie.morin@vitacare.fr | Intervenant |
| elise.garnier@vitacare.fr | Intervenant |
| thomas.rousseau@vitacare.fr | Intervenant |
| clara.bernard@vitacare.fr | Intervenant |
| antoine.petit@vitacare.fr | Intervenant |
| julie.lambert@vitacare.fr | Intervenant |
| pierre.moreau@vitacare.fr | Intervenant |
| marie.dupont@email.fr | Patient |
| jean.martin@email.fr | Patient |

## Fonctionnalites

**Patients**
- Catalogue de 13 services avec filtres par categorie et recherche
- Reservation de rendez-vous avec choix d'intervenant et de creneau
- Tunnel de reservation en 3 etapes avec paiement simule
- Modification et annulation de rendez-vous
- Inscription et desinscription aux activites collectives
- Tableau de bord avec RDV, historique, activites et notifications
- Telechargement d'un recapitulatif PDF par rendez-vous
- Avis et notes sur les intervenants apres consultation

**Intervenants**
- Tableau de bord dedie avec agenda et statistiques
- Gestion des disponibilites par creneaux horaires
- Profil public avec specialite, bio, services et avis patients

**Administrateurs**
- Statistiques globales de la plateforme
- Gestion des utilisateurs avec changement de role
- Validation et annulation des rendez-vous
- Ajout et suppression de services
- Consultation des participants aux activites

**Fonctionnalites supplementaires**
- Mode sombre avec memorisation de la preference
- Systeme d'avis et notes par etoiles (1 a 5)
- Generation PDF des recapitulatifs de rendez-vous
- Profil utilisateur modifiable

## Equipe

Projet realise par une equipe de 4 etudiants en ING2 a l'ECE Paris.

Les outils d'intelligence artificielle ont ete utilises comme support lors de certaines phases du projet. L'equipe a verifie, adapte et valide chaque element produit le mieux possible.
