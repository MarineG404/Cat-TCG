function GetCards(req, res) {
	const fs = require("fs");
	let rawdata = fs.readFileSync("data/cards.json");
	let cardsList = JSON.parse(rawdata);

	res.json({
		message: "OK",
		data: cardsList,
	});
}

module.exports = {
	GetCards,
};
