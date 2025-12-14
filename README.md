# 🎓 Système de Gestion Étudiant (SGE) - Frontend

<div align="center">

![ISSAT Kairouan](https://img.shields.io/badge/ISSAT-Kairouan-c07921?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2.0-61dafb?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0.8-646cff?style=for-the-badge&logo=vite)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Application web moderne et animée pour la gestion académique et administrative**

[🚀 Démarrage Rapide](#-installation-express) · [📖 Documentation](#-documentation) · [🎨 Design](#-design-system) · [🌍 i18n](#-internationalisation)

</div>

---

## ✨ Fonctionnalités Principales

### 🔐 Authentification Complète
- ✅ Connexion sécurisée (JWT)
- ✅ Inscription étudiants
- ✅ Mot de passe oublié / Réinitialisation
- ✅ Protection des routes par rôle
- ✅ Session persistante (Remember me)

### 👨‍🎓 Espace Étudiant
- 📊 Dashboard avec statistiques personnalisées
- 📈 Graphiques d'évolution des notes (Chart.js)
- 📄 Gestion des documents administratifs
- 📅 Suivi des absences
- 👥 Clubs et événements
- 📢 Système de réclamations sécurisé

### 👨‍🏫 Espace Enseignant
- 📚 Gestion des classes
- ✍️ Saisie et validation des notes
- 📋 Gestion des absences
- 📊 Statistiques des étudiants

### 👨‍💼 Espace Administration
- 📈 Dashboard global avec KPIs
- 👥 Gestion des utilisateurs (étudiants/enseignants)
- 📄 Validation et génération de documents
- 🎯 Modération des clubs
- 📢 Traitement des réclamations

---

## 🚀 Installation Express

### Prérequis
- Node.js ≥ 16.x
- npm ≥ 8.x

### Installation Automatique (Recommandé)

```powershell
# Cloner et installer
cd "d:\Project web\frontend_matrix"
.\install.ps1
```

### Installation Manuelle

```powershell
# Installer les dépendances
npm install

# Créer le fichier de configuration
Copy-Item .env.example .env

# Démarrer le serveur de développement
npm run dev
```

🎉 **L'application est maintenant accessible sur http://localhost:3000**

---

## 🎨 Design System

### 🎨 Palette de Couleurs ISSAT Kairouan

```css
--primary-orange: #c07921  /* Orange principal */
--primary-blue:   #212c4f  /* Bleu institutionnel */
--secondary-gray: #666362  /* Gris secondaire */
--accent-blue:    #65a8c9  /* Bleu accent */
--white:          #ffffff  /* Blanc pur */
```

### ✨ Animations & Interactions
- 🎭 **Framer Motion** pour des animations fluides
- 🌊 Transitions douces et naturelles
- 💫 Micro-interactions sur tous les éléments
- 🎨 Glassmorphism et effets modernes
- ⚡ Performance optimisée (60fps)

### 📱 Responsive Design
- 📱 **Mobile First** : < 768px
- 💻 **Tablet** : 768px - 1024px
- 🖥️ **Desktop** : > 1024px

---

## 🛠️ Technologies

### Core Stack
| Technologie | Version | Usage |
|------------|---------|-------|
| ⚛️ React | 18.2.0 | Framework UI |
| 🚀 Vite | 5.0.8 | Build tool & dev server |
| 🛣️ React Router | 6.20.0 | Routing & navigation |

### UI & UX
| Bibliothèque | Version | Usage |
|-------------|---------|-------|
| 🎭 Framer Motion | 10.16.16 | Animations avancées |
| 📊 Chart.js | 4.4.1 | Graphiques interactifs |
| 🎨 React Icons | 4.12.0 | Icônes SVG |
| 🔔 React Toastify | 9.1.3 | Notifications toast |

### Formulaires & Validation
| Bibliothèque | Version | Usage |
|-------------|---------|-------|
| 📝 React Hook Form | 7.49.2 | Gestion formulaires |
| ✅ Validation | Built-in | Validation temps réel |

### Internationalisation
| Bibliothèque | Version | Usage |
|-------------|---------|-------|
| 🌍 i18next | 23.7.11 | Core i18n |
| 🗣️ React i18next | 13.5.0 | React bindings |

### API & Authentification
| Bibliothèque | Version | Usage |
|-------------|---------|-------|
| 🔌 Axios | 1.6.2 | HTTP client |
| 🔐 JWT Decode | 4.0.0 | Token management |

---

## 📁 Architecture du Projet

```
frontend_matrix/
├── 📂 src/
│   ├── 🎨 index.css              # Styles globaux & variables CSS
│   ├── ⚛️ main.jsx               # Point d'entrée
│   ├── 🚀 App.jsx                # Composant principal & routing
│   │
│   ├── 📂 components/            # Composants réutilisables
│   │   └── ProtectedRoute.jsx   # HOC de protection des routes
│   │
│   ├── 📂 hooks/                 # Custom React hooks
│   │   └── useAuth.js           # Hook d'authentification
│   │
│   ├── 📂 layouts/               # Layouts principaux
│   │   ├── AuthLayout.jsx       # Layout authentification
│   │   └── DashboardLayout.jsx  # Layout dashboard avec sidebar
│   │
│   ├── 📂 pages/                 # Pages de l'application
│   │   ├── HomePage.jsx         # Page d'accueil
│   │   ├── 🔐 auth/             # Pages authentification
│   │   ├── 👨‍🎓 student/          # Espace étudiant
│   │   ├── 👨‍🏫 teacher/          # Espace enseignant
│   │   └── 👨‍💼 admin/            # Espace administration
│   │
│   ├── 📂 services/              # Services & API
│   │   └── api.js               # Configuration Axios
│   │
│   └── 📂 i18n/                  # Internationalisation
│       ├── config.js            # Configuration i18next
│       └── locales/             # Fichiers de traduction
│           ├── fr.json          # 🇫🇷 Français
│           └── ar.json          # 🇸🇦 العربية
│
├── 📄 package.json               # Dépendances npm
├── ⚙️ vite.config.js            # Configuration Vite
├── 🌍 .env.example              # Variables d'environnement
├── 📖 README.md                 # Ce fichier
├── 🚀 QUICK_START.md            # Guide de démarrage rapide
├── 📚 INSTALLATION.md           # Guide d'installation détaillé
└── 📋 STRUCTURE_COMPLETE.md     # Documentation complète
```

---

## 🌐 Internationalisation

### Support Multilingue
- 🇫🇷 **Français** (par défaut)
- 🇸🇦 **العربية (Arabe)** avec support RTL complet

### Changement de Langue
```jsx
import { useTranslation } from 'react-i18next'

const { t, i18n } = useTranslation()

// Utilisation
<h1>{t('common.welcome')}</h1>

// Changer la langue
i18n.changeLanguage('ar')
```

---

## 🛣️ Routes & Navigation

### Routes Publiques
```
/                    → Page d'accueil
/login               → Connexion
/register            → Inscription
/forgot-password     → Récupération mot de passe
/reset-password/:token → Réinitialisation
```

### Routes Protégées - Étudiant
```
/student             → Dashboard
/student/profile     → Profil personnel
/student/documents   → Documents administratifs
/student/grades      → Notes et résultats
/student/absences    → Suivi des absences
/student/clubs       → Clubs et événements
/student/reclamations → Réclamations
```

### Routes Protégées - Enseignant
```
/teacher             → Dashboard enseignant
/teacher/classes     → Gestion des classes
/teacher/grades      → Saisie des notes
/teacher/absences    → Gestion des absences
```

### Routes Protégées - Administration
```
/admin               → Dashboard administration
/admin/students      → Gestion des étudiants
/admin/teachers      → Gestion des enseignants
/admin/documents     → Validation des documents
/admin/clubs         → Modération des clubs
/admin/reclamations  → Traitement des réclamations
```

---

## 🔧 Scripts NPM

```bash
npm run dev          # Serveur de développement avec hot-reload
npm run build        # Build de production optimisé
npm run preview      # Prévisualisation du build
npm run lint         # Vérification ESLint
```

---

## 🔐 Authentification & Sécurité

- 🔒 **JWT Tokens** stockés en localStorage
- 🛡️ **Routes protégées** par rôle (student/teacher/admin)
- 🔄 **Auto-refresh** des tokens (à implémenter côté backend)
- 🚫 **Protection CSRF**
- 🔐 **Validation** côté client et serveur
- 📝 **Audit trail** des actions sensibles

---

## 📖 Documentation

- 📘 **[QUICK_START.md](QUICK_START.md)** - Démarrage rapide et astuces
- 📗 **[INSTALLATION.md](INSTALLATION.md)** - Guide d'installation détaillé
- 📙 **[STRUCTURE_COMPLETE.md](STRUCTURE_COMPLETE.md)** - Architecture complète

---

## 🎯 Prochaines Étapes

### En Développement
- [ ] 🔌 Connexion complète avec backend Django
- [ ] 📄 Upload et téléchargement de documents
- [ ] 🔔 Notifications temps réel (WebSocket)
- [ ] 📱 Progressive Web App (PWA)
- [ ] 🧪 Tests unitaires (Jest/React Testing Library)
- [ ] 📊 Analytics et monitoring
- [ ] 🔍 Optimisation SEO

### Optimisations Futures
- [ ] ⚡ Code splitting avancé
- [ ] 🖼️ Lazy loading des images
- [ ] 💾 Service Workers pour le offline
- [ ] 📦 Réduction de la taille du bundle
- [ ] 🚀 Performance optimizations

---

## 🤝 Contribution

Ce projet suit les meilleures pratiques React 2025 :
- ✅ Composants fonctionnels avec Hooks
- ✅ Code modulaire et réutilisable
- ✅ Convention de nommage cohérente
- ✅ Commentaires et documentation
- ✅ Accessibilité (a11y)

---

## 📝 License

Ce projet est développé pour **ISSAT Kairouan** dans le cadre du Système de Gestion Étudiant.

---

## 🆘 Support & Contact

Pour toute question ou problème :

1. 📖 Consulter la [documentation complète](STRUCTURE_COMPLETE.md)
2. 🚀 Lire le [guide de démarrage rapide](QUICK_START.md)
3. 🔍 Vérifier les issues existantes
4. 💬 Ouvrir une nouvelle issue si nécessaire

---

<div align="center">

**Développé avec ❤️ pour ISSAT Kairouan**

🎓 **SGE - Système de Gestion Étudiant** | 2025

[⬆ Retour en haut](#-système-de-gestion-étudiant-sge---frontend)

</div>
