function AddBid(req, res) {
	const fs = require("fs");
	let rawdata = fs.readFileSync("data/users.json");
	let usersList = JSON.parse(rawdata);

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

	let cardInCollection = currentUser.collection.find((c) => c.id === idCard);

	if (!cardInCollection || cardInCollection.nb < 1) {
		res.status(400).json({
			message: "Erreur : Vous ne possédez pas cette carte",
		});
		return;
	}

	let bidsRawData = fs.readFileSync("data/bid.json");
	let bidsList = JSON.parse(bidsRawData);

	let activeBidsCount = bidsList.filter(
		(bid) => bid.card_id === idCard && bid.seller_id === currentUser.id,
	).length;

	if (activeBidsCount >= cardInCollection.nb) {
		res.status(400).json({
			message:
				"Erreur : Vous avez déjà mis toutes vos cartes de ce type aux enchères",
		});
		return;
	}

	let newBid = {
		id: bidsList.length > 0 ? bidsList[bidsList.length - 1].id + 1 : 1,
		card_id: idCard,
		seller_id: currentUser.id,
		end_date: null,
		bidder_id: null,
		bid: req.body.bid || 0,
	};

	bidsList.push(newBid);

	cardInCollection.nb--;

	let bidsData = JSON.stringify(bidsList, null, 2);
	fs.writeFileSync("data/bid.json", bidsData);
	res.json({
		message: "OK",
		data: newBid,
	});
}

function PlaceBid(req, res) {}

function GetBids(req, res) {}

function GetBid(req, res) {}

function CloseBid(req, res) {}

module.exports = {
	AddBid,
	PlaceBid,
	GetBids,
	GetBid,
	CloseBid,
};
