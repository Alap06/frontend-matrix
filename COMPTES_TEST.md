# 🔐 Comptes de Test SGE - Guide Rapide

## ✅ Comment Tester

1. **Ouvrir l'application** : http://localhost:3000
2. **Cliquer sur "Se connecter"**
3. **Choisir le type de compte** dans le menu déroulant
4. **Entrer les identifiants** ci-dessous
5. **Cliquer sur "Se connecter"**

---

## 👨‍🎓 Compte Étudiant

**Type** : Étudiant
**Email** : `etudiant@issatkr.rnu.tn`
**Mot de passe** : `Student@2025`

➡️ Accès au dashboard étudiant avec : notes, absences, documents, clubs

---

## 👨‍🏫 Compte Enseignant

**Type** : Enseignant  
**Email** : `enseignant@issatkr.rnu.tn`
**Mot de passe** : `Teacher@2025`

➡️ Accès au dashboard enseignant avec : classes, étudiants, notes à saisir

---

## 👨‍💼 Compte Administrateur

**Type** : Administrateur
**Email** : `admin@issatkr.rnu.tn`
**Mot de passe** : `Admin@2025`

➡️ Accès au dashboard admin avec : gestion étudiants, enseignants, documents, clubs

---

## 🎯 Points à Tester

### ✅ Authentification
- [x] Connexion avec chaque type de compte
- [x] Sélection du rôle dans le menu déroulant
- [x] Messages d'erreur si identifiants incorrects
- [x] Redirection automatique vers le bon dashboard

### ✅ Navigation
- [x] Menu latéral avec toutes les sections
- [x] Toggle sidebar (collapse/expand)
- [x] Menu utilisateur (nom, rôle, déconnexion)
- [x] Navigation entre les différentes pages

### ✅ Internationalisation
- [x] Bouton de changement de langue (FR ↔ AR)
- [x] Changement de direction (LTR ↔ RTL)
- [x] Traduction de tous les textes

### ✅ Design & Animations
- [x] Animations Framer Motion
- [x] Couleurs ISSAT Kairouan
- [x] Responsive (mobile, tablet, desktop)
- [x] Cards avec hover effects

### ✅ Dashboards
- [x] **Étudiant** : Statistiques, graphiques, événements
- [x] **Enseignant** : Classes, étudiants, notes
- [x] **Admin** : Vue d'ensemble, gestion complète

---

## 🚀 Accès Rapide

```
Étudiant  : etudiant@issatkr.rnu.tn / Student@2025
Enseignant: enseignant@issatkr.rnu.tn / Teacher@2025
Admin     : admin@issatkr.rnu.tn / Admin@2025
```

---

## 📝 Notes

- **Mode Mock** : Le frontend fonctionne avec des données simulées (pas de backend requis pour l'instant)
- **Authentification** : Les tokens JWT sont simulés dans `src/services/mockAuth.js`
- **Données** : Toutes les statistiques et données sont des mocks pour la démo
- **Persistance** : Les données de connexion sont stockées dans le localStorage

---

## 🔧 Désactiver le Mode Mock

Pour utiliser le vrai backend Django quand il sera prêt :

1. Ouvrir `src/hooks/useAuth.js`
2. Changer la ligne 14 : `const USE_MOCK = false`
3. Configurer l'URL de l'API dans `src/services/api.js`

---

**🎉 Bon test !**
