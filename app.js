const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const users = require("./users");
const card = require("./cards");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", swaggerUi.serve);
app.get("/", swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Enregistrer un nouvel utilisateur
 *     tags:
 *       - Utilisateurs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nom d'utilisateur
 *               password:
 *                 type: string
 *                 description: Mot de passe
 *     responses:
 *       200:
 *         description: Utilisateur enregistré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OK
 *       400:
 *         description: Erreur lors de l'enregistrement
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
app.post("/register", users.RegisterUser);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags:
 *       - Utilisateurs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nom d'utilisateur
 *               password:
 *                 type: string
 *                 description: Mot de passe
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: Token d'authentification
 *       400:
 *         description: Erreur de connexion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
app.post("/login", users.LoginUser);

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Récupérer les informations de l'utilisateur connecté
 *     tags:
 *       - Utilisateurs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Token d'authentification
 *     responses:
 *       200:
 *         description: Informations de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     username:
 *                       type: string
 *                     collection:
 *                       type: array
 *                       items:
 *                         type: object
 *       400:
 *         description: Erreur d'authentification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
app.get("/user", users.GetUser);

/**
 * @swagger
 * /user:
 *   patch:
 *     summary: Mettre à jour le nom d'utilisateur
 *     tags:
 *       - Utilisateurs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Token d'authentification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nouveau nom d'utilisateur
 *     responses:
 *       200:
 *         description: Nom d'utilisateur mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Erreur lors de la mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
app.patch("/user", users.UpdateUser);

/**
 * @swagger
 * /disconnect:
 *   post:
 *     summary: Déconnecter l'utilisateur
 *     tags:
 *       - Utilisateurs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Token d'authentification
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Déconnecté avec succès
 *       400:
 *         description: Erreur lors de la déconnexion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
app.post("/disconnect", users.DisconnectUser);

/**
 * @swagger
 * /cards:
 *   get:
 *     summary: Récupérer la liste des cartes disponibles
 *     tags:
 *       - Cartes
 *     responses:
 *       200:
 *         description: Liste des cartes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: Chat de gouttière
 *                       rarity:
 *                         type: string
 *                         example: common
 */
app.get("/cards", card.GetCards);

/**
 * @swagger
 * /booster:
 *   put:
 *     summary: Ouvrir un booster de cartes
 *     tags:
 *       - Cartes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Token d'authentification
 *     responses:
 *       200:
 *         description: Booster ouvert avec succès - 5 cartes aléatoires selon la rareté
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       rarity:
 *                         type: string
 *       400:
 *         description: Token manquant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur : Token manquant"
 *       401:
 *         description: Token invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur : Token invalide"
 *       429:
 *         description: Délai non respecté (5 minutes entre chaque booster)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur : Vous devez attendre 5 minutes avant d'ouvrir un nouveau booster"
 */
app.put("/booster", card.OpenBooster);

/**
 * @swagger
 * /convert:
 *   post:
 *     summary: Convertir une carte en monnaie (paw)
 *     description: Permet de convertir un doublon en paw. L'utilisateur doit posséder au moins 2 exemplaires. Valeurs - Common 10 paw, Rare 50 paw, Legendary 200 paw
 *     tags:
 *       - Cartes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Token d'authentification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cardId
 *             properties:
 *               cardId:
 *                 type: integer
 *                 description: ID de la carte à convertir
 *                 example: 25
 *     responses:
 *       200:
 *         description: Carte convertie avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: object
 *                   properties:
 *                     cardId:
 *                       type: integer
 *                       example: 25
 *                     cardName:
 *                       type: string
 *                       example: Maine Coon
 *                     rarity:
 *                       type: string
 *                       example: rare
 *                     pawEarned:
 *                       type: integer
 *                       example: 50
 *                     totalPaw:
 *                       type: integer
 *                       example: 150
 *       400:
 *         description: Erreur lors de la conversion (token manquant, carte manquante, pas assez d'exemplaires)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur : Vous devez posséder au moins 2 exemplaires pour convertir cette carte"
 *       401:
 *         description: Token invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur : Token invalide"
 */
app.post("/convert", card.ConvertCard);

app.listen(3000, () => {
	console.log(`API TCG listening on http://localhost:3000`);
});

module.exports = app;
