-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : dim. 31 mai 2026 à 18:20
-- Version du serveur : 5.7.24
-- Version de PHP : 8.3.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `vitacare`
--

-- --------------------------------------------------------

--
-- Structure de la table `activite`
--

CREATE TABLE `activite` (
  `ID_activite` int(11) NOT NULL,
  `ID_service` int(11) NOT NULL,
  `nom_activite` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `date_heure` datetime NOT NULL,
  `lieu` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `capacite_max` int(11) NOT NULL DEFAULT '10',
  `tarif` decimal(8,2) NOT NULL DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `activite`
--

INSERT INTO `activite` (`ID_activite`, `ID_service`, `nom_activite`, `description`, `date_heure`, `lieu`, `capacite_max`, `tarif`) VALUES
(1, 3, 'Yoga doux du matin', 'Seance collective de yoga doux pour bien commencer la semaine.', '2026-05-28 09:00:00', 'Salle A - VitaCare Centre', 12, '15.00'),
(2, 2, 'Atelier nutrition equilibree', 'Atelier collectif sur les bases d une alimentation saine et equilibree.', '2026-05-31 10:00:00', 'Salle B - VitaCare Centre', 8, '20.00'),
(3, 3, 'Meditation guidee', 'Seance de meditation guidee pour debutants.', '2026-06-01 08:00:00', 'Salle A - VitaCare Centre', 15, '10.00'),
(4, 6, 'Seance de sophrologie collective', 'Decouvrez les bases de la sophrologie en groupe pour gerer le stress du quotidien.', '2026-06-03 18:00:00', 'Salle B - VitaCare Centre', 10, '25.00'),
(5, 12, 'Atelier meditation pleine conscience', 'Initiation a la meditation de pleine conscience pour debutants. Tapis fournis.', '2026-06-05 08:00:00', 'Salle A - VitaCare Centre', 12, '15.00'),
(6, 9, 'Circuit training debutant', 'Seance de remise en forme collective adaptee aux debutants. Tenue de sport requise.', '2026-06-04 07:00:00', 'Salle de sport - VitaCare Centre', 8, '20.00');

-- --------------------------------------------------------

--
-- Structure de la table `avis`
--

CREATE TABLE `avis` (
  `ID_avis` int(11) NOT NULL,
  `ID_patient` int(11) NOT NULL,
  `ID_intervenant` int(11) NOT NULL,
  `ID_rdv` int(11) NOT NULL,
  `note` int(11) NOT NULL,
  `commentaire` text COLLATE utf8mb4_unicode_ci,
  `date_avis` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `avis`
--

INSERT INTO `avis` (`ID_avis`, `ID_patient`, `ID_intervenant`, `ID_rdv`, `note`, `commentaire`, `date_avis`) VALUES
(1, 6, 2, 1, 5, 'Excellente seance, je recommande vivement. Sophie est tres professionnelle et a l ecoute.', '2026-05-27 12:58:38'),
(2, 4, 2, 4, 5, 'Excellente seance, Sophie est tres professionnelle et tres a l ecoute. Je recommande vivement.', '2026-05-10 18:00:00'),
(3, 4, 3, 5, 4, 'Elise est tres competente, elle a bien analyse mon bilan et propose un plan realiste. Tres satisfaite.', '2026-05-12 19:00:00'),
(4, 4, 8, 6, 5, 'Clara est fantastique. La seance de sophrologie m a vraiment aidee a mieux gerer mon stress. Merci !', '2026-05-15 20:00:00'),
(5, 4, 10, 7, 5, 'Julie est une psychologue exceptionnelle. Elle met immediatement a l aise et sait exactement comment aider.', '2026-05-18 17:00:00'),
(6, 5, 9, 9, 4, 'Antoine est un excellent coach, programme bien adapte a mon niveau. Quelques exercices difficiles mais tres efficaces.', '2026-05-08 20:00:00'),
(7, 5, 2, 10, 5, 'Sophie est une massotherapeute hors pair. Apres la seance je me suis senti completement detendu. A refaire !', '2026-05-11 18:00:00'),
(8, 5, 11, 11, 4, 'Pierre maitrise parfaitement les techniques d acupuncture. Mes douleurs chroniques ont nettement diminue apres 1 seance.', '2026-05-14 19:00:00'),
(9, 5, 3, 12, 5, 'Elise est tres professionnelle. Elle a etabli un plan alimentaire complet et facile a suivre. Tres bonne experience.', '2026-05-17 20:00:00'),
(11, 4, 7, 8, 2, '', '2026-05-27 14:25:56');

-- --------------------------------------------------------

--
-- Structure de la table `disponibilite`
--

CREATE TABLE `disponibilite` (
  `ID_dispo` int(11) NOT NULL,
  `ID_intervenant` int(11) NOT NULL,
  `date` date NOT NULL,
  `heure_debut` time NOT NULL,
  `heure_fin` time NOT NULL,
  `statut` enum('libre','reserve') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'libre'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `disponibilite`
--

INSERT INTO `disponibilite` (`ID_dispo`, `ID_intervenant`, `date`, `heure_debut`, `heure_fin`, `statut`) VALUES
(1, 2, '2026-05-28', '09:00:00', '10:00:00', 'reserve'),
(2, 2, '2026-05-28', '10:00:00', '11:00:00', 'reserve'),
(3, 2, '2026-05-28', '11:00:00', '12:00:00', 'reserve'),
(4, 2, '2026-05-29', '09:00:00', '10:00:00', 'libre'),
(5, 2, '2026-05-29', '14:00:00', '15:00:00', 'libre'),
(6, 3, '2026-05-28', '10:00:00', '11:00:00', 'libre'),
(7, 3, '2026-05-29', '11:00:00', '12:00:00', 'libre'),
(8, 2, '2026-05-31', '11:34:00', '12:37:00', 'libre'),
(9, 2, '2026-06-19', '13:41:00', '14:41:00', 'libre'),
(10, 7, '2026-05-29', '09:00:00', '10:00:00', 'libre'),
(11, 7, '2026-05-29', '10:00:00', '11:00:00', 'libre'),
(12, 7, '2026-05-30', '14:00:00', '15:00:00', 'libre'),
(13, 7, '2026-05-30', '15:00:00', '16:00:00', 'libre'),
(14, 8, '2026-05-29', '11:00:00', '12:00:00', 'libre'),
(15, 8, '2026-05-30', '09:00:00', '10:00:00', 'libre'),
(16, 8, '2026-05-31', '10:00:00', '11:00:00', 'libre'),
(17, 9, '2026-05-28', '14:00:00', '15:00:00', 'libre'),
(18, 9, '2026-05-29', '16:00:00', '17:00:00', 'libre'),
(19, 10, '2026-05-30', '11:00:00', '12:00:00', 'libre'),
(20, 10, '2026-05-31', '14:00:00', '15:00:00', 'libre'),
(21, 11, '2026-05-29', '09:00:00', '10:00:00', 'libre'),
(22, 11, '2026-05-31', '09:00:00', '10:00:00', 'libre'),
(23, 2, '2026-06-02', '09:00:00', '10:00:00', 'libre'),
(24, 2, '2026-06-02', '10:00:00', '11:00:00', 'reserve'),
(25, 2, '2026-06-02', '11:00:00', '12:00:00', 'libre'),
(26, 2, '2026-06-03', '14:00:00', '15:00:00', 'libre'),
(27, 2, '2026-06-03', '15:00:00', '16:00:00', 'libre'),
(28, 2, '2026-06-04', '09:00:00', '10:00:00', 'libre'),
(29, 2, '2026-06-05', '10:00:00', '11:00:00', 'libre'),
(30, 2, '2026-06-05', '14:00:00', '15:00:00', 'libre'),
(31, 3, '2026-06-02', '10:00:00', '11:00:00', 'libre'),
(32, 3, '2026-06-02', '14:00:00', '15:00:00', 'libre'),
(33, 3, '2026-06-03', '09:00:00', '10:00:00', 'libre'),
(34, 3, '2026-06-03', '11:00:00', '12:00:00', 'libre'),
(35, 3, '2026-06-04', '14:00:00', '15:00:00', 'libre'),
(36, 3, '2026-06-05', '09:00:00', '10:00:00', 'libre'),
(37, 3, '2026-06-05', '15:00:00', '16:00:00', 'libre'),
(38, 7, '2026-06-02', '09:00:00', '10:00:00', 'libre'),
(39, 7, '2026-06-02', '11:00:00', '12:00:00', 'libre'),
(40, 7, '2026-06-03', '10:00:00', '11:00:00', 'libre'),
(41, 7, '2026-06-04', '09:00:00', '10:00:00', 'libre'),
(42, 7, '2026-06-04', '14:00:00', '15:00:00', 'libre'),
(43, 7, '2026-06-05', '11:00:00', '12:00:00', 'libre'),
(44, 8, '2026-06-02', '14:00:00', '15:00:00', 'libre'),
(45, 8, '2026-06-02', '15:00:00', '16:00:00', 'libre'),
(46, 8, '2026-06-03', '09:00:00', '10:00:00', 'libre'),
(47, 8, '2026-06-03', '14:00:00', '15:00:00', 'libre'),
(48, 8, '2026-06-04', '10:00:00', '11:00:00', 'libre'),
(49, 8, '2026-06-05', '14:00:00', '15:00:00', 'libre'),
(50, 9, '2026-06-02', '07:00:00', '08:00:00', 'reserve'),
(51, 9, '2026-06-02', '08:00:00', '09:00:00', 'libre'),
(52, 9, '2026-06-03', '07:00:00', '08:00:00', 'libre'),
(53, 9, '2026-06-04', '08:00:00', '09:00:00', 'libre'),
(54, 9, '2026-06-05', '07:00:00', '08:00:00', 'libre'),
(55, 9, '2026-06-05', '08:00:00', '09:00:00', 'libre'),
(56, 10, '2026-06-02', '10:00:00', '11:00:00', 'libre'),
(57, 10, '2026-06-02', '14:00:00', '15:00:00', 'libre'),
(58, 10, '2026-06-03', '10:00:00', '11:00:00', 'libre'),
(59, 10, '2026-06-03', '15:00:00', '16:00:00', 'libre'),
(60, 10, '2026-06-04', '11:00:00', '12:00:00', 'libre'),
(61, 10, '2026-06-05', '10:00:00', '11:00:00', 'reserve'),
(62, 11, '2026-06-02', '09:00:00', '10:00:00', 'libre'),
(63, 11, '2026-06-03', '11:00:00', '12:00:00', 'libre'),
(64, 11, '2026-06-04', '09:00:00', '10:00:00', 'reserve'),
(65, 11, '2026-06-04', '14:00:00', '15:00:00', 'libre'),
(66, 11, '2026-06-05', '09:00:00', '10:00:00', 'libre');

-- --------------------------------------------------------

--
-- Structure de la table `inscription`
--

CREATE TABLE `inscription` (
  `ID_inscription` int(11) NOT NULL,
  `ID_patient` int(11) NOT NULL,
  `ID_activite` int(11) NOT NULL,
  `date_inscription` datetime DEFAULT CURRENT_TIMESTAMP,
  `statut` enum('confirme','annule','liste_attente') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'confirme'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `inscription`
--

INSERT INTO `inscription` (`ID_inscription`, `ID_patient`, `ID_activite`, `date_inscription`, `statut`) VALUES
(1, 1, 1, '2026-05-26 13:24:16', 'confirme'),
(2, 4, 1, '2026-05-27 13:14:43', 'confirme'),
(3, 4, 2, '2026-05-27 13:14:43', 'confirme'),
(4, 5, 1, '2026-05-27 13:14:43', 'confirme'),
(5, 5, 3, '2026-05-27 13:14:43', 'confirme'),
(6, 4, 3, '2026-05-29 18:38:46', 'confirme');

-- --------------------------------------------------------

--
-- Structure de la table `intervenant_service`
--

CREATE TABLE `intervenant_service` (
  `ID` int(11) NOT NULL,
  `ID_intervenant` int(11) NOT NULL,
  `ID_service` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `intervenant_service`
--

INSERT INTO `intervenant_service` (`ID`, `ID_intervenant`, `ID_service`) VALUES
(1, 2, 1),
(2, 2, 3),
(3, 2, 6),
(4, 3, 2),
(5, 3, 10),
(7, 7, 5),
(8, 7, 8),
(10, 8, 3),
(11, 8, 6),
(12, 8, 12),
(13, 9, 5),
(14, 9, 9),
(16, 10, 4),
(17, 10, 11),
(18, 10, 13),
(19, 11, 6),
(20, 11, 7),
(21, 11, 12);

-- --------------------------------------------------------

--
-- Structure de la table `notification`
--

CREATE TABLE `notification` (
  `ID_notif` int(11) NOT NULL,
  `ID_utilisateur` int(11) NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('rdv','activite','systeme') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'systeme',
  `date_envoi` datetime DEFAULT CURRENT_TIMESTAMP,
  `lue` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `notification`
--

INSERT INTO `notification` (`ID_notif`, `ID_utilisateur`, `message`, `type`, `date_envoi`, `lue`) VALUES
(1, 6, 'Votre rendez-vous du 2026-05-28 10:00:00 a ete confirme.', 'rdv', '2026-05-26 12:20:36', 0),
(2, 1, 'Votre rendez-vous du 2026-05-28 11:00:00 a ete confirme.', 'rdv', '2026-05-26 13:12:23', 0),
(3, 1, 'Votre inscription a l activite a ete confirmee.', 'activite', '2026-05-26 13:24:16', 0),
(4, 1, 'Votre rendez-vous du 2026-05-28 09:00:00 a ete confirme.', 'rdv', '2026-05-27 00:10:08', 0),
(5, 4, 'Votre rendez-vous du 2026-06-02 avec Sophie Morin est confirme.', 'rdv', '2026-05-27 13:14:43', 0),
(6, 4, 'Votre rendez-vous du 2026-06-03 avec Julie Lambert est confirme.', 'rdv', '2026-05-27 13:14:43', 0),
(7, 4, 'Rappel : votre seance de yoga doux est demain a 09h00.', 'activite', '2026-05-27 13:14:43', 1),
(8, 4, 'Nouveau service disponible : Hypnotherapie.', 'systeme', '2026-05-27 13:14:43', 1),
(9, 5, 'Votre rendez-vous du 2026-06-02 avec Antoine Petit est confirme.', 'rdv', '2026-05-27 13:14:43', 0),
(10, 5, 'Votre rendez-vous du 2026-06-04 avec Pierre Moreau est confirme.', 'rdv', '2026-05-27 13:14:43', 0),
(11, 5, 'Rappel : votre seance de circuit training est demain a 07h00.', 'activite', '2026-05-27 13:14:43', 1),
(12, 4, 'Votre rendez-vous a ete modifie. Nouveau creneau : 2026-06-05 10:00:00', 'rdv', '2026-05-29 18:12:10', 0),
(13, 4, 'Votre inscription a l activite a ete confirmee.', 'activite', '2026-05-29 18:38:46', 0);

-- --------------------------------------------------------

--
-- Structure de la table `rendez_vous`
--

CREATE TABLE `rendez_vous` (
  `ID_rdv` int(11) NOT NULL,
  `ID_patient` int(11) NOT NULL,
  `ID_intervenant` int(11) NOT NULL,
  `ID_service` int(11) NOT NULL,
  `date_heure` datetime NOT NULL,
  `statut` enum('en_attente','confirme','annule') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'en_attente',
  `note_patient` text COLLATE utf8mb4_unicode_ci,
  `date_creation` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `rendez_vous`
--

INSERT INTO `rendez_vous` (`ID_rdv`, `ID_patient`, `ID_intervenant`, `ID_service`, `date_heure`, `statut`, `note_patient`, `date_creation`) VALUES
(1, 6, 2, 1, '2026-05-28 10:00:00', 'confirme', NULL, '2026-05-26 12:20:36'),
(2, 1, 2, 1, '2026-05-28 11:00:00', 'confirme', NULL, '2026-05-26 13:12:23'),
(3, 1, 2, 1, '2026-05-28 09:00:00', 'confirme', NULL, '2026-05-27 00:10:08'),
(4, 4, 2, 1, '2026-05-10 10:00:00', 'confirme', 'Seance tres apaisante', '2026-05-01 09:00:00'),
(5, 4, 3, 2, '2026-05-12 14:00:00', 'confirme', NULL, '2026-05-02 10:00:00'),
(6, 4, 8, 6, '2026-05-15 09:00:00', 'confirme', 'Tres bonne seance de sophrologie', '2026-05-05 11:00:00'),
(7, 4, 10, 4, '2026-05-18 10:00:00', 'confirme', NULL, '2026-05-08 09:00:00'),
(8, 4, 7, 8, '2026-05-20 14:00:00', 'confirme', 'Excellent praticien', '2026-05-10 10:00:00'),
(9, 5, 9, 9, '2026-05-08 07:00:00', 'confirme', NULL, '2026-04-28 08:00:00'),
(10, 5, 2, 1, '2026-05-11 09:00:00', 'confirme', 'Tres bon massage', '2026-05-01 10:00:00'),
(11, 5, 11, 7, '2026-05-14 11:00:00', 'confirme', NULL, '2026-05-04 09:00:00'),
(12, 5, 3, 11, '2026-05-17 14:00:00', 'confirme', 'Plan alimentaire tres bien adapte', '2026-05-07 11:00:00'),
(13, 5, 8, 6, '2026-05-21 15:00:00', 'confirme', NULL, '2026-05-11 09:00:00'),
(14, 4, 2, 1, '2026-06-02 10:00:00', 'confirme', NULL, '2026-05-25 10:00:00'),
(15, 4, 10, 12, '2026-06-05 10:00:00', 'confirme', NULL, '2026-05-25 11:00:00'),
(16, 5, 9, 9, '2026-06-02 07:00:00', 'confirme', NULL, '2026-05-25 09:00:00'),
(17, 5, 11, 7, '2026-06-04 09:00:00', 'confirme', NULL, '2026-05-25 14:00:00');

-- --------------------------------------------------------

--
-- Structure de la table `service`
--

CREATE TABLE `service` (
  `ID_service` int(11) NOT NULL,
  `nom_service` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `duree_min` int(11) NOT NULL,
  `tarif` decimal(8,2) NOT NULL,
  `categorie` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `service`
--

INSERT INTO `service` (`ID_service`, `nom_service`, `description`, `duree_min`, `tarif`, `categorie`, `image_url`) VALUES
(1, 'Massage therapeutique', 'Massage adapte pour soulager les tensions musculaires et favoriser la relaxation.', 60, '75.00', 'Bien-etre', NULL),
(2, 'Consultation nutrition', 'Bilan nutritionnel personnalise et conseils alimentaires adaptes a votre mode de vie.', 60, '60.00', 'Nutrition', NULL),
(3, 'Yoga et relaxation', 'Seance de yoga doux pour debutants et intermediaires, axee sur la respiration.', 60, '20.00', 'Bien-etre', NULL),
(4, 'Soutien psychologique', 'Consultation individuelle avec un psychologue clinicien.', 50, '65.00', 'Sante mentale', NULL),
(5, 'Physiotherapie', 'Seance de kinesitherapie pour douleurs articulaires et musculaires.', 45, '55.00', 'Sante', NULL),
(6, 'Sophrologie', 'Technique de relaxation dynamique combinant respiration, mouvements doux et visualisation positive pour reduire le stress.', 60, '55.00', 'Bien-etre', NULL),
(7, 'Acupuncture', 'Medecine traditionnelle chinoise utilisant de fines aiguilles pour stimuler des points energetiques et soulager douleurs et tensions.', 45, '70.00', 'Sante', NULL),
(8, 'Osteopathie', 'Traitement manuel des dysfonctions du systeme musculo-squelettique pour restaurer la mobilite et reduire les douleurs.', 45, '65.00', 'Sante', NULL),
(9, 'Coaching sportif', 'Programme de remise en forme personnalise avec un coach certifie, adapte a votre niveau et vos objectifs.', 60, '50.00', 'Bien-etre', NULL),
(10, 'Dietetique', 'Consultation avec un dieteticien pour etablir un plan alimentaire personnalise adapte a votre sante et vos objectifs.', 50, '55.00', 'Nutrition', NULL),
(11, 'Psychologie cognitive', 'Therapie cognitivo-comportementale pour traiter anxiete, depression, phobies et troubles du comportement.', 55, '80.00', 'Sante mentale', NULL),
(12, 'Meditation guidee', 'Seance individuelle de meditation guidee pour apprendre a gerer le stress et developper la pleine conscience.', 45, '40.00', 'Bien-etre', NULL),
(13, 'Hypnotherapie', 'Utilisation de l etat hypnotique pour traiter phobies, addictions, troubles du sommeil et douleurs chroniques.', 60, '75.00', 'Sante mentale', NULL),
(14, 'test', 'test d\'ajou de service manuellement', 10, '5.00', 'Bien-etre', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

CREATE TABLE `utilisateur` (
  `ID_utilisateur` int(11) NOT NULL,
  `nom` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prenom` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mot_de_passe` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('patient','intervenant','admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'patient',
  `telephone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photo_profil` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_creation` datetime DEFAULT CURRENT_TIMESTAMP,
  `specialite` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bio` text COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `utilisateur`
--

INSERT INTO `utilisateur` (`ID_utilisateur`, `nom`, `prenom`, `email`, `mot_de_passe`, `role`, `telephone`, `photo_profil`, `date_creation`, `specialite`, `bio`) VALUES
(1, 'Admin', 'VitaCare', 'admin@vitacare.fr', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', '0600000000', NULL, '2026-05-25 23:00:59', NULL, NULL),
(2, 'Morin', 'Sophie', 'sophie.morin@vitacare.fr', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'intervenant', '0611111111', NULL, '2026-05-25 23:00:59', 'Massotherapeute agreee', 'Specialiste du massage therapeutique avec 8 ans d experience. Formee a l Institut de Massage de Paris, Sophie accompagne ses patients dans la gestion des douleurs musculaires et la relaxation profonde.'),
(3, 'Garnier', 'Elise', 'elise.garnier@vitacare.fr', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'intervenant', '0622222222', NULL, '2026-05-25 23:00:59', 'Dieteticienne clinicienne', 'Dieteticienne diplômee d etat avec une expertise en nutrition sportive et nutrition preventive. Elise etablit des plans alimentaires personnalises adaptes a chaque profil de patient.'),
(4, 'Dupont', 'Marie', 'marie.dupont@email.fr', '$2y$10$GaVyXXr1oLNHKlGggEDsi.QADW6j43Ou7oHHxgegbakNF1B9hPkHO', 'patient', '', NULL, '2026-05-25 23:00:59', NULL, NULL),
(5, 'Martin', 'Jean', 'jean.martin@email.fr', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'patient', '0644444444', NULL, '2026-05-25 23:00:59', NULL, NULL),
(6, 'mahel', 'nabi', 'mahel@test.fr', '$2y$10$GG8tI.izWpiKJqVugxX8Mu91ujTLKAJeBmAQXqQfZV8CMk.Jrim7C', 'patient', '+33666693696', NULL, '2026-05-26 11:44:08', NULL, NULL),
(7, 'Rousseau', 'Thomas', 'thomas.rousseau@vitacare.fr', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'intervenant', '0655555555', NULL, '2026-05-27 11:51:20', 'Osteopathe DO', 'Osteopathe diplome, Thomas traite les dysfonctions du systeme musculo-squelettique. Specialise dans les douleurs chroniques du dos et les traumatismes sportifs.'),
(8, 'Bernard', 'Clara', 'clara.bernard@vitacare.fr', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'intervenant', '0666666666', NULL, '2026-05-27 11:51:20', 'Sophrologue certifiee', 'Sophrologue certifiee RNCP, Clara accompagne ses patients dans la gestion du stress, de l anxiete et de la preparation mentale aux evenements importants.'),
(9, 'Petit', 'Antoine', 'antoine.petit@vitacare.fr', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'intervenant', '0677777777', NULL, '2026-05-27 11:51:20', 'Coach sportif certifie', 'Coach sportif certifie avec 5 ans d experience en remise en forme et preparation physique. Antoine adapte ses programmes a tous les niveaux et objectifs.'),
(10, 'Lambert', 'Julie', 'julie.lambert@vitacare.fr', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'intervenant', '0688888888', NULL, '2026-05-27 11:51:20', 'Psychologue clinicienne', 'Psychologue clinicienne specialisee en therapies cognitivo-comportementales. Julie accompagne adultes et adolescents dans la gestion de l anxiete, de la depression et des troubles du comportement.'),
(11, 'Moreau', 'Pierre', 'pierre.moreau@vitacare.fr', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'intervenant', '0699999999', NULL, '2026-05-27 11:51:20', 'Acupuncteur traditionnel', 'Praticien en acupuncture traditionnelle chinoise depuis 10 ans. Pierre traite douleurs chroniques, troubles du sommeil et desequilibres energetiques par des techniques millénaires.');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `activite`
--
ALTER TABLE `activite`
  ADD PRIMARY KEY (`ID_activite`),
  ADD KEY `ID_service` (`ID_service`);

--
-- Index pour la table `avis`
--
ALTER TABLE `avis`
  ADD PRIMARY KEY (`ID_avis`),
  ADD UNIQUE KEY `unique_avis` (`ID_patient`,`ID_rdv`),
  ADD KEY `ID_intervenant` (`ID_intervenant`),
  ADD KEY `ID_rdv` (`ID_rdv`);

--
-- Index pour la table `disponibilite`
--
ALTER TABLE `disponibilite`
  ADD PRIMARY KEY (`ID_dispo`),
  ADD KEY `ID_intervenant` (`ID_intervenant`);

--
-- Index pour la table `inscription`
--
ALTER TABLE `inscription`
  ADD PRIMARY KEY (`ID_inscription`),
  ADD UNIQUE KEY `unique_inscription` (`ID_patient`,`ID_activite`),
  ADD KEY `ID_activite` (`ID_activite`);

--
-- Index pour la table `intervenant_service`
--
ALTER TABLE `intervenant_service`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `unique_intervenant_service` (`ID_intervenant`,`ID_service`),
  ADD KEY `ID_service` (`ID_service`);

--
-- Index pour la table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`ID_notif`),
  ADD KEY `ID_utilisateur` (`ID_utilisateur`);

--
-- Index pour la table `rendez_vous`
--
ALTER TABLE `rendez_vous`
  ADD PRIMARY KEY (`ID_rdv`),
  ADD KEY `ID_patient` (`ID_patient`),
  ADD KEY `ID_intervenant` (`ID_intervenant`),
  ADD KEY `ID_service` (`ID_service`);

--
-- Index pour la table `service`
--
ALTER TABLE `service`
  ADD PRIMARY KEY (`ID_service`);

--
-- Index pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  ADD PRIMARY KEY (`ID_utilisateur`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `activite`
--
ALTER TABLE `activite`
  MODIFY `ID_activite` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `avis`
--
ALTER TABLE `avis`
  MODIFY `ID_avis` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `disponibilite`
--
ALTER TABLE `disponibilite`
  MODIFY `ID_dispo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT pour la table `inscription`
--
ALTER TABLE `inscription`
  MODIFY `ID_inscription` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `intervenant_service`
--
ALTER TABLE `intervenant_service`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT pour la table `notification`
--
ALTER TABLE `notification`
  MODIFY `ID_notif` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT pour la table `rendez_vous`
--
ALTER TABLE `rendez_vous`
  MODIFY `ID_rdv` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT pour la table `service`
--
ALTER TABLE `service`
  MODIFY `ID_service` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  MODIFY `ID_utilisateur` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `activite`
--
ALTER TABLE `activite`
  ADD CONSTRAINT `activite_ibfk_1` FOREIGN KEY (`ID_service`) REFERENCES `service` (`ID_service`) ON DELETE CASCADE;

--
-- Contraintes pour la table `avis`
--
ALTER TABLE `avis`
  ADD CONSTRAINT `avis_ibfk_1` FOREIGN KEY (`ID_patient`) REFERENCES `utilisateur` (`ID_utilisateur`) ON DELETE CASCADE,
  ADD CONSTRAINT `avis_ibfk_2` FOREIGN KEY (`ID_intervenant`) REFERENCES `utilisateur` (`ID_utilisateur`) ON DELETE CASCADE,
  ADD CONSTRAINT `avis_ibfk_3` FOREIGN KEY (`ID_rdv`) REFERENCES `rendez_vous` (`ID_rdv`) ON DELETE CASCADE;

--
-- Contraintes pour la table `disponibilite`
--
ALTER TABLE `disponibilite`
  ADD CONSTRAINT `disponibilite_ibfk_1` FOREIGN KEY (`ID_intervenant`) REFERENCES `utilisateur` (`ID_utilisateur`) ON DELETE CASCADE;

--
-- Contraintes pour la table `inscription`
--
ALTER TABLE `inscription`
  ADD CONSTRAINT `inscription_ibfk_1` FOREIGN KEY (`ID_patient`) REFERENCES `utilisateur` (`ID_utilisateur`) ON DELETE CASCADE,
  ADD CONSTRAINT `inscription_ibfk_2` FOREIGN KEY (`ID_activite`) REFERENCES `activite` (`ID_activite`) ON DELETE CASCADE;

--
-- Contraintes pour la table `intervenant_service`
--
ALTER TABLE `intervenant_service`
  ADD CONSTRAINT `intervenant_service_ibfk_1` FOREIGN KEY (`ID_intervenant`) REFERENCES `utilisateur` (`ID_utilisateur`) ON DELETE CASCADE,
  ADD CONSTRAINT `intervenant_service_ibfk_2` FOREIGN KEY (`ID_service`) REFERENCES `service` (`ID_service`) ON DELETE CASCADE;

--
-- Contraintes pour la table `notification`
--
ALTER TABLE `notification`
  ADD CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`ID_utilisateur`) REFERENCES `utilisateur` (`ID_utilisateur`) ON DELETE CASCADE;

--
-- Contraintes pour la table `rendez_vous`
--
ALTER TABLE `rendez_vous`
  ADD CONSTRAINT `rendez_vous_ibfk_1` FOREIGN KEY (`ID_patient`) REFERENCES `utilisateur` (`ID_utilisateur`) ON DELETE CASCADE,
  ADD CONSTRAINT `rendez_vous_ibfk_2` FOREIGN KEY (`ID_intervenant`) REFERENCES `utilisateur` (`ID_utilisateur`) ON DELETE CASCADE,
  ADD CONSTRAINT `rendez_vous_ibfk_3` FOREIGN KEY (`ID_service`) REFERENCES `service` (`ID_service`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
