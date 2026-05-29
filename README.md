# VitaCare — Plateforme de santé et bien-être

Projet Web dynamique 2026 - ING2 ECE Paris

## Description

VitaCare est une plateforme web de réservation et de gestion de services de santé et de bien-être. Elle permet à trois types d'utilisateurs d'interagir : les patients réservent des rendez-vous et s'inscrivent à des activités, les intervenants gèrent leurs disponibilités, et les administrateurs supervisent l'ensemble de la plateforme.

## Technologies utilisées

- Frontend : React (Vite)
- Backend : PHP (API REST)
- Base de données : MySQL
- Serveur local : MAMP

## Prérequis

- Node.js (v18 ou supérieur)
- MAMP (Apache + MySQL)
- Un navigateur web moderne

## Installation

### 1. Cloner le projet

```
git clone https://github.com/votre-repo/vitacare.git
cd vitacare
```

### 2. Configurer la base de données

1. Démarrer MAMP et s'assurer qu'Apache et MySQL tournent
2. Ouvrir phpMyAdmin à l'adresse `http://localhost/phpMyAdmin5/`
3. Cliquer sur l'onglet "SQL"
4. Copier-coller le contenu du fichier `vitacare.sql` et cliquer sur "Exécuter"
5. La base de données `vitacare` est créée avec 7 tables et des données de test

### 3. Configurer le backend

Ouvrir le fichier `backend/config/database.php` et adapter les identifiants MySQL :

```php
define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_NAME', 'vitacare');
define('DB_USER', 'root');
define('DB_PASS', 'votre_mot_de_passe');
```

Placer le dossier `backend` dans le répertoire `htdocs` de MAMP :
```
C:/MAMP/htdocs/vitacare/backend/
```

### 4. Lancer le frontend

```
cd frontend
npm install
npm run dev
```

Le site est accessible à l'adresse `http://localhost:5173`

## Structure du projet

```
vitacare/
├── frontend/                  (React - Vite)
│   └── src/
│       ├── components/
│       │   └── Navbar.jsx
│       ├── pages/
│       │   ├── Accueil.jsx
│       │   ├── Activites.jsx
│       │   ├── Connexion.jsx
│       │   ├── Dashboard.jsx
│       │   ├── DashboardAdmin.jsx
│       │   ├── FicheService.jsx
│       │   ├── Inscription.jsx
│       │   └── Intervenants.jsx
│       └── App.jsx
├── backend/                   (PHP - API REST)
│   ├── api/
│   │   ├── activites.php
│   │   ├── admin.php
│   │   ├── auth.php
│   │   ├── disponibilites.php
│   │   ├── headers.php
│   │   ├── intervenants.php
│   │   ├── notifications.php
│   │   ├── rendezvous.php
│   │   ├── services.php
│   │   └── test.php
│   └── config/
│       └── database.php
├── vitacare.sql               (Script de création de la base)
└── README.md
```

## Comptes de test

Tous les comptes ont le mot de passe : `password`

| Email | Rôle |
|---|---|
| admin@vitacare.fr | Admin |
| sophie.morin@vitacare.fr | Intervenant |
| elise.garnier@vitacare.fr | Intervenant |
| marie.dupont@email.fr | Patient |
| jean.martin@email.fr | Patient |

## Fonctionnalités principales

- Catalogue des services avec filtres par catégorie et recherche
- Inscription et connexion avec gestion des sessions
- Réservation de rendez-vous avec choix d'intervenant et de créneau
- Tableau de bord patient : RDV, activités, notifications
- Page activités avec inscription en ligne
- Page intervenants
- Tableau de bord admin : statistiques, gestion utilisateurs et RDV

## Equipe

Projet réalisé par une équipe de 4 étudiants en ING2 à l'ECE Paris.