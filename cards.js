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
		const delay = 5; // 5 min
		const timeSinceLastBooster = Date.now() - currentUser.lastBooster;

		if (timeSinceLastBooster < delay * 60 * 1000) {
			res.status(429).json({
				message: `Erreur : Vous devez attendre ${delay} minutes avant d'ouvrir un nouveau booster`,
			});
			return;
		}
	}

	let cardsList = JSON.parse(rawdata);
	let booster = [];
	for (let i = 0; i < 5; i++) {
		let randomIndex = Math.floor(Math.random() * cardsList.length);
		booster.push(cardsList[randomIndex]);
	}

	for (let card of booster) {
		currentUser.collection.push(card.id);
	}

	currentUser.lastBooster = Date.now();

	let data = JSON.stringify(usersList, null, 2);
	fs.writeFileSync("data/users.json", data);

	res.json({
		message: "OK",
		data: booster,
	});
}

module.exports = {
	GetCards,
	OpenBooster,
};
