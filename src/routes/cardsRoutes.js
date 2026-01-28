const express = require("express");
const router = express.Router();
const cardsController = require("../controllers/cardsController");

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
router.get("/cards", cardsController.GetCards);

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
router.put("/booster", cardsController.OpenBooster);

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
router.post("/convert", cardsController.ConvertCard);

module.exports = router;
