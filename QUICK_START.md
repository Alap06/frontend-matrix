# 🚀 Démarrage Rapide - SGE Frontend

## Installation Express

```powershell
# 1. Naviguer vers le dossier du projet
cd "d:\Project web\frontend_matrix"

# 2. Lancer le script d'installation automatique
.\install.ps1

# OU manuellement :
npm install
Copy-Item .env.example .env
```

## Démarrage

```powershell
# Démarrer le serveur de développement
npm run dev
```

Ouvrir le navigateur sur : **http://localhost:3000**

## Commandes Utiles

```powershell
# Développement
npm run dev              # Démarre le serveur de dev avec hot-reload

# Production
npm run build            # Crée un build optimisé dans /dist
npm run preview          # Prévisualise le build de production

# Qualité du code
npm run lint             # Vérifie les erreurs ESLint
```

## 🎯 Comptes de Test (À configurer avec le backend)

### Étudiant
- **Email**: `etudiant@issatkr.rnu.tn`
- **Password**: `student123`
- **Rôle**: `student`

### Enseignant
- **Email**: `enseignant@issatkr.rnu.tn`
- **Password**: `teacher123`
- **Rôle**: `teacher`

### Administrateur
- **Email**: `admin@issatkr.rnu.tn`
- **Password**: `admin123`
- **Rôle**: `admin`

## 🎨 Aperçu des Interfaces

### 🏠 Page d'Accueil
- Hero section animée avec gradient
- Section features avec cartes interactives
- Statistiques animées
- Footer professionnel

### 🔐 Authentification
- **Login** : Formulaire moderne avec validation
- **Register** : Inscription multi-étapes
- **Forgot Password** : Réinitialisation sécurisée
- Animations smooth et feedback visuel

### 👨‍🎓 Dashboard Étudiant
- **Overview** : Statistiques personnelles
- **Graphiques** : Évolution des notes (Chart.js)
- **Activités** : Timeline des dernières actions
- **Événements** : Calendrier des événements à venir
- **Navigation** : Sidebar responsive avec icônes

Sections disponibles :
- 📊 Notes et résultats
- 📄 Documents administratifs
- 📅 Absences et présences
- 👥 Clubs et événements
- 📢 Réclamations

### 👨‍🏫 Dashboard Enseignant
- Vue d'ensemble des classes
- Statistiques des étudiants
- Gestion des notes
- Suivi des absences

### 👨‍💼 Dashboard Administration
- Statistiques globales
- Gestion des utilisateurs
- Validation des documents
- Modération des clubs

## 🎨 Personnalisation

### Modifier les Couleurs

Éditer `src/index.css` :

```css
:root {
  --primary-orange: #c07921;
  --primary-blue: #212c4f;
  --accent-blue: #65a8c9;
  /* ... autres couleurs */
}
```

### Ajouter des Traductions

Éditer `src/i18n/locales/fr.json` ou `ar.json` :

```json
{
  "nouveau": {
    "cle": "Texte en français"
  }
}
```

Utiliser dans les composants :

```jsx
import { useTranslation } from 'react-i18next'

const { t } = useTranslation()
<h1>{t('nouveau.cle')}</h1>
```

## 🔧 Configuration Backend

### Configurer l'URL de l'API

Éditer `.env` :

```env
VITE_API_URL=http://localhost:8000/api
```

### Endpoints Attendus

```
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
GET    /api/auth/me

GET    /api/student/dashboard
GET    /api/student/documents
GET    /api/student/grades
GET    /api/student/absences
GET    /api/student/clubs

GET    /api/teacher/classes
POST   /api/teacher/grades
GET    /api/teacher/absences

GET    /api/admin/statistics
GET    /api/admin/students
GET    /api/admin/documents
```

## 📱 Responsive Breakpoints

- **Mobile** : < 768px
- **Tablet** : 768px - 1024px
- **Desktop** : > 1024px

## 🌍 Changement de Langue

Cliquer sur l'icône 🌐 dans le header ou la sidebar pour basculer entre FR/AR.

Le changement est instantané et modifie :
- Tous les textes
- La direction (LTR ↔ RTL)
- Les alignements

## 🎭 Animations Disponibles

Utiliser les classes CSS :
- `.animate-fadeIn` - Apparition en fondu
- `.animate-slideInUp` - Glissement du bas
- `.animate-slideInDown` - Glissement du haut
- `.animate-scaleIn` - Zoom-in

Ou utiliser Framer Motion :

```jsx
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Contenu
</motion.div>
```

## 🐛 Résolution de Problèmes

### Erreur "Cannot find module"
```powershell
Remove-Item -Recurse -Force node_modules
npm install
```

### Port 3000 déjà utilisé
Modifier `vite.config.js` :
```javascript
server: {
  port: 3001, // Changer le port
}
```

### Problème de CORS
Vérifier la configuration CORS du backend Django.

### Animations lentes
Désactiver les animations de développement dans `framer-motion`.

## 📚 Documentation Complète

- **Architecture** : Voir `STRUCTURE_COMPLETE.md`
- **Installation** : Voir `INSTALLATION.md`
- **API** : Voir documentation backend Django
- **Components** : Commentaires dans le code

## 🎯 Checklist Avant Production

- [ ] Configurer les variables d'environnement
- [ ] Tester toutes les routes
- [ ] Vérifier la responsiveness
- [ ] Tester les deux langues (FR/AR)
- [ ] Optimiser les images
- [ ] Activer HTTPS
- [ ] Configurer les meta tags SEO
- [ ] Tester les performances (Lighthouse)
- [ ] Mettre en place les analytics
- [ ] Configurer le monitoring d'erreurs

## 💡 Astuces

1. **Dev Tools** : Utiliser React DevTools pour débugger
2. **Hot Reload** : Les changements sont instantanés
3. **Console** : Surveiller la console pour les warnings
4. **Network** : Vérifier les appels API dans l'onglet Network
5. **Responsive** : Utiliser le mode responsive des DevTools

## 🆘 Support

En cas de problème :

1. Vérifier les logs de la console
2. Consulter `INSTALLATION.md`
3. Vérifier la connexion backend
4. Nettoyer le cache : `Ctrl + Shift + R`
5. Réinstaller : `npm install`

---

**Bon développement ! 🚀**

*ISSAT Kairouan - SGE 2025*
