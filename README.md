# 🐱 Cat TCG - API

API de collection de cartes de chats (Trading Card Game).

## 🗂️ Architecture du Projet

```
Cat-TCG/
├── app.js                    # Point d'entrée de l'application
├── package.json                 # Dépendances et scripts
├── data/                        # Données JSON (base de données)
│   ├── users.json
│   ├── cards.json
│   └── bid.json
└── src/
    ├── config/                  # Configuration
    │   └── swagger.js           # Configuration Swagger/OpenAPI
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

### Installation
```bash
npm install
```

### Développement
```bash
npm run dev
```
L'API démarre sur `http://localhost:3000`

## 📚 Documentation API

La documentation interactive Swagger est disponible à la racine :
- **URL**: http://localhost:3000/

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
- **Swagger** - Documentation API
- **bcrypt** - Hachage de mots de passe ([doc](https://www.npmjs.com/package/bcrypt))
- **token-generator** - Génération de tokens ([doc](https://www.npmjs.com/package/token-generator))

