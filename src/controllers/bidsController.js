const Bid = require("../Models/Bid");
const User = require("../Models/User");

async function AddBid(req, res) {
	let token = req.headers["authorization"];

	if (!token) {
		res.status(400).json({ message: "Erreur : Token manquant" });
		return;
	}

	if (!req.body.cardId) {
		res.status(400).json({ message: "Erreur : ID de carte manquant" });
		return;
	}

	idCard = parseInt(req.body.cardId);
	if (isNaN(idCard)) {
		res.status(400).json({ message: "Erreur : ID de carte invalide" });
		return;
	}

	let currentUser = await User.findOne({ where: { token: token } });

	if (!currentUser) {
		res.status(401).json({ message: "Erreur : Token invalide" });
		return;
	}

	let cardInCollection = currentUser.collection.find((c) => c.id === idCard);

	if (!cardInCollection || cardInCollection.nb < 1) {
		res.status(400).json({
			message: "Erreur : Vous ne possédez pas cette carte",
		});
		return;
	}

	let activeBidsCount = await Bid.count({
		where: { cardId: idCard, sellerId: currentUser.id },
	});

	if (activeBidsCount >= cardInCollection.nb) {
		res.status(400).json({
			message:
				"Erreur : Vous avez déjà mis toutes vos cartes de ce type aux enchères",
		});
		return;
	}

	let newBid = await Bid.create({
		cardId: idCard,
		sellerId: currentUser.id,
		endDate: null,
		buyerId: null,
		price: req.body.bid || 0,
	});

	cardInCollection.nb--;
	await currentUser.save();

	res.json({
		message: "OK",
		data: newBid,
	});
}

async function PlaceBid(req, res) {
	let token = req.headers["authorization"];

	if (!token) {
		res.status(400).json({ message: "Erreur : Token manquant" });
		return;
	}

	if (!req.body) {
		res.status(400).json({
			message: "Erreur : Corps de la requête manquant",
		});
		return;
	}

	if (!req.body.idBid) {
		res.status(400).json({ message: "Erreur : ID d'enchère manquant" });
		return;
	}

	let currentUser = await User.findOne({ where: { token: token } });

	if (!currentUser) {
		res.status(401).json({ message: "Erreur : Token invalide" });
		return;
	}

	let idBid = parseInt(req.body.idBid);
	if (isNaN(idBid)) {
		res.status(400).json({ message: "Erreur : ID d'enchère invalide" });
		return;
	}

	let bid = await Bid.findByPk(idBid);

	if (!bid) {
		res.status(400).json({ message: "Erreur : Enchère introuvable" });
		return;
	}

	if (bid.sellerId === currentUser.id) {
		res.status(400).json({
			message:
				"Erreur : Vous ne pouvez pas enchérir sur votre propre enchère",
		});
		return;
	}

	if (bid.buyerId === currentUser.id) {
		res.status(400).json({
			message: "Erreur : Vous êtes déjà le plus haut enchérisseur",
		});
		return;
	}

	if (bid.endDate && new Date(bid.endDate) < new Date()) {
		res.status(400).json({ message: "Erreur : Cette enchère est fermée" });
		return;
	}

	if (!req.body.bid) {
		res.status(400).json({
			message: "Erreur : Montant de l'enchère manquant",
		});
		return;
	}

	let newBidAmount = parseInt(req.body.bid);
	if (isNaN(newBidAmount) || newBidAmount <= 0) {
		res.status(400).json({
			message: "Erreur : Montant de l'enchère invalide",
		});
		return;
	}

	if (newBidAmount <= bid.price) {
		res.status(400).json({
			message:
				"Erreur : Votre enchère doit être supérieure à l'enchère actuelle",
		});
		return;
	}

	if (currentUser.paw < newBidAmount) {
		res.status(400).json({
			message: "Erreur : Vous n'avez pas assez de paw pour cette enchère",
		});
		return;
	}

	// refund previous bidder if exists
	if (bid.tempAmount) {
		let previousBidder = await User.findByPk(bid.tempAmount.idUser);
		if (previousBidder) {
			previousBidder.paw += bid.tempAmount.amount;
			await previousBidder.save();
		}
	}

	// deduct new bidder's paw
	currentUser.paw -= newBidAmount;
	await currentUser.save();

	let tempAmount = {
		idUser: currentUser.id,
		amount: newBidAmount,
	};

	bid.price = newBidAmount;
	bid.buyerId = currentUser.id;
	bid.tempAmount = tempAmount;
	await bid.save();

	res.json({ message: "OK", data: bid });
}

async function GetBids(req, res) {
	let allBids = await Bid.findAll();

	res.json({
		message: "OK",
		data: allBids,
	});
}

async function GetBid(req, res) {
	let idBid = parseInt(req.params.id);
	if (isNaN(idBid)) {
		res.status(400).json({ message: "Erreur : ID d'enchère invalide" });
		return;
	}

	let bid = await Bid.findByPk(idBid);

	if (!bid) {
		res.status(404).json({ message: "Erreur : Enchère introuvable" });
		return;
	}

	res.json({
		message: "OK",
		data: bid,
	});
}

async function CloseBid(req, res) {
	let token = req.headers["authorization"];

	if (!token) {
		res.status(400).json({ message: "Erreur : Token manquant" });
		return;
	}

	if (!req.body.idBid) {
		res.status(400).json({ message: "Erreur : ID d'enchère manquant" });
		return;
	}

	let currentUser = await User.findOne({ where: { token: token } });

	if (!currentUser) {
		res.status(401).json({ message: "Erreur : Token invalide" });
		return;
	}

	let idBid = parseInt(req.body.idBid);
	if (isNaN(idBid)) {
		res.status(400).json({ message: "Erreur : ID d'enchère invalide" });
		return;
	}

	let bid = await Bid.findByPk(idBid);

	if (!bid) {
		res.status(400).json({ message: "Erreur : Enchère introuvable" });
		return;
	}

	if (bid.sellerId !== currentUser.id) {
		res.status(403).json({
			message: "Erreur : Vous n'êtes pas le vendeur de cette enchère",
		});
		return;
	}

	if (bid.endDate) {
		res.status(400).json({
			message: "Erreur : Cette enchère est déjà fermée",
		});
		return;
	}

	if (!bid.buyerId) {
		res.status(400).json({
			message:
				"Erreur : Impossible de clôturer une enchère sans enchérisseur",
		});
		return;
	}

	let winner = await User.findByPk(bid.buyerId);
	if (!winner) {
		res.status(500).json({
			message: "Erreur : Enchérisseur introuvable",
		});
		return;
	}

	// use tempAmount to get the actual amount paid by the winner
	currentUser.paw += bid.tempAmount.amount;
	await currentUser.save();

	let winnerCard = winner.collection.find((c) => c.id === bid.cardId);
	if (winnerCard) {
		winnerCard.nb++;
	} else {
		winner.collection.push({ id: bid.cardId, nb: 1 });
	}
	await winner.save();

	bid.endDate = new Date();
	await bid.save();

	res.json({
		message: "OK",
		data: {
			bid: bid,
			winner_id: winner.id,
			winner_username: winner.username,
			amount_paid: bid.price,
		},
	});
}

module.exports = {
	AddBid,
	PlaceBid,
	GetBids,
	GetBid,
	CloseBid,
};
