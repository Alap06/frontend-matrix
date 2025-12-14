# Guide d'Installation et Configuration - SGE Frontend

## 📋 Prérequis

- Node.js (v16 ou supérieur)
- npm ou yarn
- Git

## 🚀 Installation

### 1. Cloner le projet (si nécessaire)
```bash
cd "d:\Project web\frontend_matrix"
```

### 2. Installer les dépendances
```powershell
npm install
```

### 3. Configuration de l'environnement

Créer un fichier `.env` à la racine du projet :

```env
VITE_API_URL=http://localhost:8000/api
```

## 🎯 Démarrage du Projet

### Mode Développement
```powershell
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

### Build Production
```powershell
npm run build
```

### Preview du Build
```powershell
npm run preview
```

## 🎨 Structure du Projet

```
frontend_matrix/
├── public/              # Fichiers statiques
├── src/
│   ├── assets/         # Images, icônes, etc.
│   ├── components/     # Composants réutilisables
│   │   └── ProtectedRoute.jsx
│   ├── hooks/          # Custom React hooks
│   │   └── useAuth.js
│   ├── i18n/           # Internationalisation
│   │   ├── config.js
│   │   └── locales/
│   │       ├── fr.json
│   │       └── ar.json
│   ├── layouts/        # Layouts principaux
│   │   ├── AuthLayout.jsx
│   │   └── DashboardLayout.jsx
│   ├── pages/          # Pages de l'application
│   │   ├── HomePage.jsx
│   │   ├── auth/       # Pages d'authentification
│   │   ├── student/    # Pages étudiant
│   │   ├── teacher/    # Pages enseignant
│   │   └── admin/      # Pages admin
│   ├── services/       # Services API
│   │   └── api.js
│   ├── styles/         # Styles globaux
│   ├── App.jsx         # Composant principal
│   ├── main.jsx        # Point d'entrée
│   └── index.css       # Styles globaux
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🎨 Palette de Couleurs ISSAT Kairouan

- **Primary Orange**: `#c07921`
- **Primary Blue**: `#212c4f`
- **Secondary Gray**: `#666362`
- **Accent Blue**: `#65a8c9`
- **White**: `#ffffff`

## 🔐 Authentification

Le système utilise JWT (JSON Web Tokens) :
- Les tokens sont stockés dans `localStorage`
- Durée de vie configurable
- Refresh automatique (à implémenter côté backend)

## 🌐 Routes Disponibles

### Routes Publiques
- `/` - Page d'accueil
- `/login` - Connexion
- `/register` - Inscription
- `/forgot-password` - Mot de passe oublié
- `/reset-password/:token` - Réinitialisation

### Routes Protégées - Étudiant
- `/student` - Dashboard
- `/student/profile` - Profil
- `/student/documents` - Documents
- `/student/grades` - Notes
- `/student/absences` - Absences
- `/student/clubs` - Clubs
- `/student/reclamations` - Réclamations

### Routes Protégées - Enseignant
- `/teacher` - Dashboard
- `/teacher/classes` - Classes
- `/teacher/grades` - Saisie notes
- `/teacher/absences` - Gestion absences

### Routes Protégées - Admin
- `/admin` - Dashboard
- `/admin/students` - Gestion étudiants
- `/admin/teachers` - Gestion enseignants
- `/admin/documents` - Gestion documents
- `/admin/clubs` - Gestion clubs
- `/admin/reclamations` - Gestion réclamations

## 📦 Bibliothèques Principales

- **React 18** - Framework UI
- **React Router v6** - Routing
- **Framer Motion** - Animations
- **Axios** - Requêtes HTTP
- **React i18next** - Internationalisation (FR/AR)
- **Chart.js** - Graphiques et visualisations
- **React Hook Form** - Gestion des formulaires
- **React Toastify** - Notifications
- **React Icons** - Icônes

## 🔧 Configuration Backend

Assurez-vous que le backend Django est configuré avec :
- CORS configuré pour accepter `http://localhost:3000`
- JWT authentication activée
- Endpoints API selon la structure attendue

## 🌍 Internationalisation

L'application supporte FR (Français) et AR (Arabe) :

```javascript
import { useTranslation } from 'react-i18next'

const { t, i18n } = useTranslation()

// Utilisation
<h1>{t('common.welcome')}</h1>

// Changer la langue
i18n.changeLanguage('ar')
```

## 🎭 Animations

Utilise Framer Motion pour les animations :

```javascript
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Contenu animé
</motion.div>
```

## 📱 Responsive Design

L'application est entièrement responsive avec breakpoints :
- Mobile : < 768px
- Tablet : 768px - 1024px
- Desktop : > 1024px

## 🔒 Sécurité

- Protection CSRF
- Validation côté client
- Routes protégées par rôle
- Tokens sécurisés
- HTTPS recommandé en production

## 🐛 Debugging

```powershell
# Vérifier les erreurs de lint
npm run lint

# Nettoyer le cache
Remove-Item -Recurse -Force node_modules
npm install
```

## 📝 Développement Futur

Pages à compléter avec fonctionnalités complètes :
- [ ] Gestion complète des documents (upload, téléchargement)
- [ ] Interface de notes avec graphiques détaillés
- [ ] Système de clubs avec inscriptions
- [ ] Réclamations anonymes sécurisées
- [ ] Notifications temps réel (WebSocket)
- [ ] Export PDF des documents
- [ ] Signatures électroniques
- [ ] Dashboard analytics avancé

## 💡 Conseils

1. Toujours tester en mode développement avant le build
2. Utiliser les variables d'environnement pour les configs
3. Maintenir les traductions FR/AR à jour
4. Tester sur différents navigateurs
5. Optimiser les images avant utilisation

## 🆘 Support

Pour toute question ou problème :
1. Vérifier la documentation React/Vite
2. Consulter les logs de la console
3. Vérifier la connexion avec le backend
4. Tester avec les données mock si nécessaire

---

**Développé pour ISSAT Kairouan**
Système de Gestion Étudiant (SGE) - 2025
