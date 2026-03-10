const Card = require("../Models/Card");
const User = require("../Models/User");
const Bid = require("../Models/Bid");

async function GetCards(req, res) {
	allCards = await Card.findAll();

	res.json({
		message: "OK",
		data: allCards,
	});
}

async function OpenBooster(req, res) {
	let token = req.headers["authorization"];
	if (!token) {
		res.status(400).json({ message: "Erreur : Token manquant" });
		return;
	}

	allUsers = await User.findAll();

	currentUser = await User.findOne({ where: { token: token } });

	if (!currentUser) {
		res.status(401).json({ message: "Erreur : Token invalide" });
		return;
	}

	if (currentUser.lastBooster) {
		const delay = 5; // minutes
		const timeSinceLastBooster = Date.now() - currentUser.lastBooster;

		if (timeSinceLastBooster < delay * 60 * 1000) {
			res.status(429).json({
				message: `Erreur : Vous devez attendre ${delay} minutes avant d'ouvrir un nouveau booster`,
			});
			return;
		}
	}

	let cardsList = await Card.findAll();

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

	await currentUser.save();

	res.json({
		message: "OK",
		data: booster,
	});
}

async function ConvertCard(req, res) {
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

	let allUsers = await User.findAll();

	let currentUser = null;
	for (let user of allUsers) {
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

	let allBids = await Bid.findAll();
	let activeBidsCount = allBids.filter(
		(bid) => bid.cardId === cardId && bid.sellerId === currentUser.id,
	).length;

	let availableCards = cardInCollection.nb - activeBidsCount;

	if (availableCards < 2) {
		res.status(400).json({
			message:
				"Erreur : Vous devez posséder au moins 2 exemplaires disponibles (hors enchères) pour convertir cette carte",
		});
		return;
	}

	let card = await Card.findByPk(cardId);

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

	await currentUser.save();

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
