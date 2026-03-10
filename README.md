# 🐱 Cat TCG - API

API de collection de cartes de chats (Trading Card Game).

## 🗂️ Architecture du Projet

```
Cat-TCG/
├── app.js                       # Point d'entrée de l'application
├── package.json                 # Dépendances et scripts
├── .env                         # Variables d'environnement (base de données)
├── .env.example                 # Exemple de configuration
├── docs/                        # Documentation Swagger
│   ├── index.html               # Page GitHub Pages
│   └── swagger.json             # Spécification OpenAPI
├── scripts/                     # Scripts utilitaires
│   └── generate-swagger.js      # Génération de la documentation
├── .github/
│   └── workflows/
│       └── generate-swagger.yml # CI/CD pour la documentation
└── src/
    ├── config/                  # Configuration
    │   ├── db.js                # Connexion base de données (Sequelize)
    │   └── swagger.js           # Configuration Swagger/OpenAPI
    ├── Models/                  # Modèles Sequelize
    │   ├── User.js              # Modèle utilisateur
    │   ├── Card.js              # Modèle carte
    │   └── Bid.js               # Modèle enchère
    ├── controllers/             # Logique métier
    │   ├── usersController.js   # Gestion des utilisateurs
    │   ├── cardsController.js   # Gestion des cartes
    │   └── bidsController.js    # Gestion des enchères
    └── routes/                  # Définition des routes
        ├── usersRoutes.js       # Routes utilisateurs
        ├── cardsRoutes.js       # Routes cartes
        └── bidsRoutes.js        # Routes enchères
```

## 🚀 Démarrage

### Prérequis
- Node.js
- Base de données (MariaDB, SQLite, etc.)

### Configuration
1. Copier le fichier `.env.example` en `.env`
2. Configurer les variables d'environnement dans `.env` :
```env
DATABASE=nom_base
DATABASE_USER=utilisateur
DATABASE_PASSWORD=mot_de_passe
DATABASE_HOST=localhost
DATABASE_DIALECT=mariadb
```

### Installation
```bash
npm install
```

### Développement
```bash
npm run dev
```
L'API démarre sur `http://localhost:3000`

### Génération de la documentation
```bash
npm run docs
```

## 📚 Documentation API

[![API Docs](https://img.shields.io/badge/API%20Docs-Swagger%20UI-85EA2D?logo=swagger)](https://MarineG404.github.io/Cat-TCG/)

La documentation interactive est disponible à deux endroits :
- **GitHub Pages** : https://MarineG404.github.io/Cat-TCG/
- **En local** : http://localhost:3000/

## 🎯 Routes Disponibles

### Utilisateurs
- `POST /register` - Inscription
- `POST /login` - Connexion
- `GET /user` - Infos utilisateur (authentifié)
- `PATCH /user` - Modifier profil (authentifié)
- `POST /disconnect` - Déconnexion (authentifié)

### Cartes
- `GET /cards` - Liste des cartes
- `PUT /booster` - Ouvrir un booster (authentifié)
- `POST /convert` - Convertir une carte en paw (authentifié)

### Enchères
- `POST /bid` - Créer une enchère (authentifié)
- `PUT /bid` - Placer une enchère (authentifié)
- `GET /bid` - Liste des enchères
- `DELETE /bid` - Fermer une enchère (authentifié)

## 🔐 Authentification

L'authentification se fait via un token dans le header `authorization` :
```
Authorization: your-token-here
```

## 🛠️ Technologies

- **Express.js** - Framework web
- **Sequelize** - ORM pour base de données ([doc](https://sequelize.org/))
- **MariaDB / SQLite** - Bases de données supportées
- **Swagger** - Documentation API
- **bcrypt** - Hachage de mots de passe ([doc](https://www.npmjs.com/package/bcrypt))
- **token-generator** - Génération de tokens ([doc](https://www.npmjs.com/package/token-generator))
- **dotenv** - Gestion des variables d'environnement

