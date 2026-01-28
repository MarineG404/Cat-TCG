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
								type: "object",
							},
							description:
								"Collection de cartes de l'utilisateur",
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
	apis: ["./app.js", "./users.js"],
};

module.exports = swaggerJsdoc(options);
