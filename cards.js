function GetCards(req, res) {
	const fs = require("fs");
	let rawdata = fs.readFileSync("data/cards.json");
	let cardsList = JSON.parse(rawdata);

	res.json({
		message: "OK",
		data: cardsList,
	});
}

function OpenBooster(req, res) {
	const fs = require("fs");
	let rawdata = fs.readFileSync("data/cards.json");

	let token = req.headers["authorization"];
	if (!token) {
		res.status(400).json({ message: "Erreur : Token manquant" });
		return;
	}

	let usersRawData = fs.readFileSync("data/users.json");
	let usersList = JSON.parse(usersRawData);

	let currentUser = null;
	for (let user of usersList) {
		if (user.token === token) {
			currentUser = user;
			break;
		}
	}

	if (!currentUser) {
		res.status(401).json({ message: "Erreur : Token invalide" });
		return;
	}

	if (currentUser.lastBooster) {
		const delay = 0; // 5 min
		const timeSinceLastBooster = Date.now() - currentUser.lastBooster;

		if (timeSinceLastBooster < delay * 60 * 1000) {
			res.status(429).json({
				message: `Erreur : Vous devez attendre ${delay} minutes avant d'ouvrir un nouveau booster`,
			});
			return;
		}
	}

	let cardsList = JSON.parse(rawdata);

	function drawCardByRarity() {
		const random = Math.random() * 100;
		let targetRarity;

		if (random < 80) {
			targetRarity = "common";
		} else if (random < 95) {
			targetRarity = "rare";
		} else {
			targetRarity = "legendary";
		}

		const availableCards = cardsList.filter(
			(card) => card.rarity === targetRarity,
		);
		return availableCards[
			Math.floor(Math.random() * availableCards.length)
		];
	}

	let booster = [];
	for (let i = 0; i < 5; i++) {
		booster.push(drawCardByRarity());
	}

	for (let card of booster) {
		let existingCard = currentUser.collection.find((c) => c.id === card.id);

		if (existingCard) {
			existingCard.nb++;
		} else {
			currentUser.collection.push({ id: card.id, nb: 1 });
		}
	}

	currentUser.lastBooster = Date.now();

	let data = JSON.stringify(usersList, null, 2);
	fs.writeFileSync("data/users.json", data);

	res.json({
		message: "OK",
		data: booster,
	});
}

function ConvertCard(req, res) {
	const fs = require("fs");

	let token = req.headers["authorization"];
	if (!token) {
		res.status(400).json({ message: "Erreur : Token manquant" });
		return;
	}

	let cardId = req.body.cardId;
	if (!cardId) {
		res.status(400).json({ message: "Erreur : ID de carte manquant" });
		return;
	}

	cardId = parseInt(cardId);
	if (isNaN(cardId)) {
		res.status(400).json({ message: "Erreur : ID de carte invalide" });
		return;
	}

	let usersRawData = fs.readFileSync("data/users.json");
	let usersList = JSON.parse(usersRawData);

	let currentUser = null;
	for (let user of usersList) {
		if (user.token === token) {
			currentUser = user;
			break;
		}
	}

	if (!currentUser) {
		res.status(401).json({ message: "Erreur : Token invalide" });
		return;
	}

	let cardInCollection = currentUser.collection.find((c) => c.id === cardId);

	if (!cardInCollection) {
		res.status(400).json({
			message: "Erreur : Vous ne possédez pas cette carte",
		});
		return;
	}

	if (cardInCollection.nb < 2) {
		res.status(400).json({
			message:
				"Erreur : Vous devez posséder au moins 2 exemplaires pour convertir cette carte",
		});
		return;
	}

	let cardsRawData = fs.readFileSync("data/cards.json");
	let cardsList = JSON.parse(cardsRawData);
	let card = cardsList.find((c) => c.id === cardId);

	if (!card) {
		res.status(400).json({ message: "Erreur : Carte introuvable" });
		return;
	}

	let pawValue = 0;
	switch (card.rarity) {
		case "common":
			pawValue = 10;
			break;
		case "rare":
			pawValue = 50;
			break;
		case "legendary":
			pawValue = 200;
			break;
	}

	cardInCollection.nb--;

	if (cardInCollection.nb === 0) {
		currentUser.collection = currentUser.collection.filter(
			(c) => c.id !== cardId,
		);
	}

	if (!currentUser.paw) {
		currentUser.paw = 0;
	}

	currentUser.paw += pawValue;

	let data = JSON.stringify(usersList, null, 2);
	fs.writeFileSync("data/users.json", data);

	res.json({
		message: "OK",
		data: {
			cardId: cardId,
			cardName: card.name,
			rarity: card.rarity,
			pawEarned: pawValue,
			totalPaw: currentUser.paw,
		},
	});
}

module.exports = {
	GetCards,
	OpenBooster,
	ConvertCard,
};
