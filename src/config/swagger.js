const swaggerJsdoc = require("swagger-jsdoc");

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Chat API",
			version: "1.0.0",
			description: "API TCG de chats à collectionner 🐱",
		},
		servers: [
			{
				url: "http://localhost:3000",
			},
		],
		components: {
			schemas: {
				User: {
					type: "object",
					properties: {
						id: {
							type: "integer",
							description: "ID de l'utilisateur",
						},
						username: {
							type: "string",
							description: "Nom d'utilisateur",
						},
						collection: {
							type: "array",
							items: {
								$ref: "#/components/schemas/CardInCollection",
							},
							description:
								"Collection de cartes de l'utilisateur",
						},
						paw: {
							type: "integer",
							description: "Monnaie du joueur",
						},
					},
				},
				Card: {
					type: "object",
					properties: {
						id: {
							type: "integer",
							description: "ID de la carte",
							example: 1,
						},
						name: {
							type: "string",
							description: "Nom de la carte",
							example: "Chat de gouttière",
						},
						rarity: {
							type: "string",
							enum: ["common", "rare", "legendary"],
							description: "Rareté de la carte",
							example: "common",
						},
					},
				},
				CardInCollection: {
					type: "object",
					properties: {
						id: {
							type: "integer",
							description: "ID de la carte",
						},
						nb: {
							type: "integer",
							description: "Nombre d'exemplaires possédés",
						},
					},
				},
				Bid: {
					type: "object",
					properties: {
						id: {
							type: "integer",
							description: "ID de l'enchère",
							example: 1,
						},
						card_id: {
							type: "integer",
							description: "ID de la carte mise aux enchères",
							example: 15,
						},
						seller_id: {
							type: "integer",
							description: "ID du vendeur",
							example: 2,
						},
						bidder_id: {
							type: "integer",
							nullable: true,
							description: "ID du plus haut enchérisseur",
							example: 3,
						},
						bid: {
							type: "integer",
							description: "Montant actuel de l'enchère",
							example: 150,
						},
						end_date: {
							type: "string",
							format: "date-time",
							nullable: true,
							description: "Date de fin de l'enchère",
							example: null,
						},
					},
				},
				Error: {
					type: "object",
					properties: {
						message: {
							type: "string",
							description: "Message d'erreur",
						},
					},
				},
			},
		},
	},
	apis: ["./src/routes/*.js"],
};

module.exports = swaggerJsdoc(options);
