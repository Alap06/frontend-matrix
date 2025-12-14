# 🧪 Profils de Test - SGE Frontend

## 📋 Comptes de Test Disponibles

### 👨‍🎓 Compte Étudiant

```json
{
  "email": "etudiant@issatkr.rnu.tn",
  "password": "Student@2025",
  "role": "student",
  "firstName": "Ahmed",
  "lastName": "Ben Ali",
  "studentId": "20241234",
  "phone": "20123456"
}
```

**Accès Dashboard** : `/student`

**Données simulées** :
- Moyenne générale : 14.5/20
- Absences : 2
- Documents en attente : 3
- Clubs actifs : 2

---

### 👨‍🏫 Compte Enseignant

```json
{
  "email": "enseignant@issatkr.rnu.tn",
  "password": "Teacher@2025",
  "role": "teacher",
  "firstName": "Fatma",
  "lastName": "Gharbi",
  "teacherId": "PROF789",
  "phone": "21654321"
}
```

**Accès Dashboard** : `/teacher`

**Données simulées** :
- Classes : 8
- Étudiants : 240
- Cours aujourd'hui : 4
- Notes à saisir : 12

---

### 👨‍💼 Compte Administrateur

```json
{
  "email": "admin@issatkr.rnu.tn",
  "password": "Admin@2025",
  "role": "admin",
  "firstName": "Mohamed",
  "lastName": "Trabelsi",
  "adminId": "ADM001",
  "phone": "98765432"
}
```

**Accès Dashboard** : `/admin`

**Données simulées** :
- Total étudiants : 5247
- Total enseignants : 198
- Documents en attente : 42
- Clubs actifs : 28

---

## 🔧 Configuration Mock Backend

### Option 1 : Données Mock dans le Frontend

Créer un fichier `src/services/mockAuth.js` :

```javascript
// Mock authentication service pour tests
export const mockLogin = async (email, password) => {
  // Simuler un délai réseau
  await new Promise(resolve => setTimeout(resolve, 1000))

  const users = {
    'etudiant@issatkr.rnu.tn': {
      token: 'mock-token-student-123',
      user: {
        id: 1,
        email: 'etudiant@issatkr.rnu.tn',
        role: 'student',
        firstName: 'Ahmed',
        lastName: 'Ben Ali',
        studentId: '20241234',
        phone: '20123456'
      }
    },
    'enseignant@issatkr.rnu.tn': {
      token: 'mock-token-teacher-456',
      user: {
        id: 2,
        email: 'enseignant@issatkr.rnu.tn',
        role: 'teacher',
        firstName: 'Fatma',
        lastName: 'Gharbi',
        teacherId: 'PROF789',
        phone: '21654321'
      }
    },
    'admin@issatkr.rnu.tn': {
      token: 'mock-token-admin-789',
      user: {
        id: 3,
        email: 'admin@issatkr.rnu.tn',
        role: 'admin',
        firstName: 'Mohamed',
        lastName: 'Trabelsi',
        adminId: 'ADM001',
        phone: '98765432'
      }
    }
  }

  const userData = users[email]
  
  if (userData && password.includes('2025')) {
    return { success: true, ...userData }
  }
  
  return { success: false, error: 'Email ou mot de passe incorrect' }
}
```

### Option 2 : JSON Server (Backend Mock)

1. **Installer JSON Server** :
```bash
npm install -g json-server
```

2. **Créer `db.json`** à la racine :
```json
{
  "users": [
    {
      "id": 1,
      "email": "etudiant@issatkr.rnu.tn",
      "password": "Student@2025",
      "role": "student",
      "firstName": "Ahmed",
      "lastName": "Ben Ali",
      "studentId": "20241234"
    },
    {
      "id": 2,
      "email": "enseignant@issatkr.rnu.tn",
      "password": "Teacher@2025",
      "role": "teacher",
      "firstName": "Fatma",
      "lastName": "Gharbi",
      "teacherId": "PROF789"
    },
    {
      "id": 3,
      "email": "admin@issatkr.rnu.tn",
      "password": "Admin@2025",
      "role": "admin",
      "firstName": "Mohamed",
      "lastName": "Trabelsi",
      "adminId": "ADM001"
    }
  ]
}
```

3. **Lancer le serveur** :
```bash
json-server --watch db.json --port 8000
```

---

## 🧪 Tests Manuels

### Test 1 : Connexion Étudiant
1. Aller sur `http://localhost:3000/login`
2. Email : `etudiant@issatkr.rnu.tn`
3. Password : `Student@2025`
4. ✅ Devrait rediriger vers `/student`

### Test 2 : Navigation Étudiant
- ✅ Dashboard avec graphiques
- ✅ Profil étudiant
- ✅ Documents administratifs
- ✅ Notes et résultats
- ✅ Absences
- ✅ Clubs et événements
- ✅ Réclamations

### Test 3 : Connexion Enseignant
1. Se déconnecter
2. Email : `enseignant@issatkr.rnu.tn`
3. Password : `Teacher@2025`
4. ✅ Devrait rediriger vers `/teacher`

### Test 4 : Connexion Admin
1. Se déconnecter
2. Email : `admin@issatkr.rnu.tn`
3. Password : `Admin@2025`
4. ✅ Devrait rediriger vers `/admin`

### Test 5 : Routes Protégées
- ✅ Accéder à `/student` sans connexion → redirect vers `/login`
- ✅ Étudiant essaie d'accéder `/admin` → redirect vers `/`

### Test 6 : Internationalisation
- ✅ Cliquer sur le bouton langue (FR ↔ AR)
- ✅ Vérifier que le texte change
- ✅ Vérifier que la direction change (LTR ↔ RTL)

### Test 7 : Responsive
- ✅ Mobile (< 768px)
- ✅ Tablet (768px - 1024px)
- ✅ Desktop (> 1024px)

### Test 8 : Animations
- ✅ Page d'accueil : shapes animées
- ✅ Login : slide in animation
- ✅ Dashboard : fade in des stats cards
- ✅ Sidebar : transition smooth

---

## 🎯 Scénarios de Test Complets

### Scénario A : Parcours Étudiant Complet

1. **Inscription**
   - Aller sur `/register`
   - Remplir le formulaire
   - Valider les champs

2. **Connexion**
   - Se connecter avec les identifiants
   - Vérifier la redirection

3. **Dashboard**
   - Voir les statistiques
   - Interagir avec le graphique
   - Cliquer sur les events

4. **Navigation**
   - Tester toutes les sections
   - Vérifier le sidebar collapse
   - Tester le user menu

5. **Déconnexion**
   - Se déconnecter
   - Vérifier la redirection vers login

### Scénario B : Test Multi-rôles

1. Se connecter en tant qu'étudiant
2. Vérifier l'accès dashboard étudiant
3. Se déconnecter
4. Se connecter en tant qu'enseignant
5. Vérifier l'accès dashboard enseignant
6. Tester les restrictions d'accès

---

## 🔍 Tests de Validation

### Formulaire Login
- ✅ Email invalide → message d'erreur
- ✅ Champs vides → validation required
- ✅ Mot de passe incorrect → toast error
- ✅ Credentials valides → connexion réussie

### Formulaire Register
- ✅ Email déjà utilisé → erreur
- ✅ Mots de passe différents → erreur
- ✅ Mot de passe < 8 caractères → erreur
- ✅ Tous les champs valides → inscription réussie

### Mot de Passe Oublié
- ✅ Email valide → email envoyé
- ✅ Email invalide → erreur

---

## 🌐 Test Navigateurs

### Desktop
- ✅ Chrome/Edge (dernier)
- ✅ Firefox (dernier)
- ✅ Safari (dernier)

### Mobile
- ✅ Chrome Mobile
- ✅ Safari iOS
- ✅ Samsung Internet

---

## 📊 Performance Tests

### Lighthouse Scores à viser
- **Performance** : > 90
- **Accessibility** : > 90
- **Best Practices** : > 90
- **SEO** : > 80

### Tests de charge
- ✅ Navigation rapide entre pages
- ✅ Animations fluides (60fps)
- ✅ Chargement initial < 3s
- ✅ Hot reload < 1s

---

## 💡 Conseils de Test

1. **Ouvrir les DevTools** (F12)
   - Console pour les erreurs
   - Network pour les requêtes API
   - React DevTools pour les composants

2. **Tester le mode responsive**
   - Ctrl + Shift + M (Toggle device toolbar)
   - Tester différentes tailles d'écran

3. **Tester les animations**
   - Réduire la vitesse dans DevTools
   - Vérifier la fluidité

4. **Tester l'accessibilité**
   - Navigation au clavier (Tab)
   - Lecteur d'écran
   - Contraste des couleurs

---

## 🐛 Problèmes Connus & Solutions

### Problème : CORS Error
**Solution** : Configurer CORS sur le backend Django ou utiliser un proxy

### Problème : Token expiré
**Solution** : Implémenter le refresh token ou augmenter la durée de validité

### Problème : Animations lentes
**Solution** : Désactiver les animations en développement ou réduire leur complexité

---

## 📝 Checklist de Test

- [ ] ✅ Connexion avec les 3 types de comptes
- [ ] ✅ Navigation entre toutes les pages
- [ ] ✅ Toggle langue FR/AR
- [ ] ✅ Responsive sur mobile/tablet/desktop
- [ ] ✅ Animations fonctionnent
- [ ] ✅ Formulaires valident correctement
- [ ] ✅ Routes protégées fonctionnent
- [ ] ✅ Déconnexion fonctionne
- [ ] ✅ Messages d'erreur s'affichent
- [ ] ✅ Graphiques se chargent
- [ ] ✅ Sidebar collapse/expand
- [ ] ✅ User menu dropdown

---

**🎉 Bon testing !**

*Pour activer le mode mock, modifier `src/hooks/useAuth.js` pour utiliser `mockLogin` au lieu des vraies requêtes API.*
