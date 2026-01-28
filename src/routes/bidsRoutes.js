const express = require("express");
const router = express.Router();
const bidsController = require("../controllers/bidsController");

/**
 * @swagger
 * /bid:
 *   post:
 *     summary: Créer une nouvelle enchère
 *     description: Permet à un utilisateur de mettre une carte de sa collection aux enchères
 *     tags:
 *       - Enchères
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
 *                 description: ID de la carte à mettre aux enchères
 *                 example: 15
 *               bid:
 *                 type: integer
 *                 description: Prix de départ de l'enchère (optionnel, 0 par défaut)
 *                 example: 100
 *     responses:
 *       200:
 *         description: Enchère créée avec succès
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
 *                       example: 1
 *                     card_id:
 *                       type: integer
 *                       example: 15
 *                     seller_id:
 *                       type: integer
 *                       example: 2
 *                     end_date:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     bidder_id:
 *                       type: integer
 *                       nullable: true
 *                       example: null
 *                     bid:
 *                       type: integer
 *                       example: 100
 *       400:
 *         description: Erreur lors de la création de l'enchère
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur : Vous ne possédez pas cette carte"
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
router.post("/bid", bidsController.AddBid);

/**
 * @swagger
 * /bid:
 *   put:
 *     summary: Placer une enchère sur une carte
 *     description: Permet à un utilisateur de placer une enchère sur une carte mise aux enchères par un autre utilisateur
 *     tags:
 *       - Enchères
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
 *               - idBid
 *               - bid
 *             properties:
 *               idBid:
 *                 type: integer
 *                 description: ID de l'enchère sur laquelle placer une offre
 *                 example: 1
 *               bid:
 *                 type: integer
 *                 description: Montant de l'enchère (doit être supérieur à l'enchère actuelle)
 *                 example: 150
 *     responses:
 *       200:
 *         description: Enchère placée avec succès
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
 *                       example: 1
 *                     card_id:
 *                       type: integer
 *                       example: 15
 *                     seller_id:
 *                       type: integer
 *                       example: 2
 *                     end_date:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     bidder_id:
 *                       type: integer
 *                       example: 3
 *                     bid:
 *                       type: integer
 *                       example: 150
 *       400:
 *         description: Erreur lors de l'enchère
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur : Votre enchère doit être supérieure à l'enchère actuelle"
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
router.put("/bid", bidsController.PlaceBid);

/**
 * @swagger
 * /bid:
 *   get:
 *     summary: Récupérer toutes les enchères
 *     description: Retourne la liste complète de toutes les enchères actives et terminées
 *     tags:
 *       - Enchères
 *     responses:
 *       200:
 *         description: Liste des enchères récupérée avec succès
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
 *                       card_id:
 *                         type: integer
 *                         example: 15
 *                       seller_id:
 *                         type: integer
 *                         example: 2
 *                       end_date:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       bidder_id:
 *                         type: integer
 *                         nullable: true
 *                         example: 3
 *                       bid:
 *                         type: integer
 *                         example: 150
 */
router.get("/bid", bidsController.GetBids);

/**
 * @swagger
 * /bid/{id}:
 *   get:
 *     summary: Récupérer une enchère spécifique
 *     description: Retourne les détails d'une enchère en fonction de son ID
 *     tags:
 *       - Enchères
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'enchère à récupérer
 *         example: 1
 *     responses:
 *       200:
 *         description: Enchère récupérée avec succès
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
 *                       example: 1
 *                     card_id:
 *                       type: integer
 *                       example: 15
 *                     seller_id:
 *                       type: integer
 *                       example: 2
 *                     end_date:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     bidder_id:
 *                       type: integer
 *                       nullable: true
 *                       example: 3
 *                     bid:
 *                       type: integer
 *                       example: 150
 *       400:
 *         description: ID d'enchère invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur : ID d'enchère invalide"
 *       404:
 *         description: Enchère introuvable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur : Enchère introuvable"
 */
router.get("/bid/:id", bidsController.GetBid);

/**
 * @swagger
 * /bid/close:
 *   delete:
 *     summary: Clôturer une enchère
 *     description: Permet au vendeur de clôturer son enchère. La carte est transférée au plus haut enchérisseur et l'argent au vendeur.
 *     tags:
 *       - Enchères
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
 *               - idBid
 *             properties:
 *               idBid:
 *                 type: integer
 *                 description: ID de l'enchère à clôturer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Enchère clôturée avec succès
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
 *                     bid:
 *                       $ref: '#/components/schemas/Bid'
 *                     winner_id:
 *                       type: integer
 *                     winner_username:
 *                       type: string
 *                     amount_paid:
 *                       type: integer
 *       400:
 *         description: Erreur lors de la clôture
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur : Impossible de clôturer une enchère sans enchérisseur"
 *       401:
 *         description: Token invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: Non autorisé (pas le vendeur)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur : Vous n'êtes pas le vendeur de cette enchère"
 */
router.delete("/bid/close", bidsController.CloseBid);

module.exports = router;
