const bcrypt = require("bcrypt");
const saltRounds = 10;

var TokenGenerator = require("token-generator")({
	salt: "your secret ingredient for this magic recipe",
	timestampMap: "abcdefghij", // 10 chars array for obfuscation proposes
});

function RegisterUser(req, res) {
	const fs = require("fs");
	let rawdata = fs.readFileSync("data/users.json");
	let usersList = JSON.parse(rawdata);

	if (!req.body) {
		res.status(400).json({ message: "Erreur : Aucune données" });
		return;
	}

	let username = req.body.username;
	let password = req.body.password;
	if (!username || !password) {
		res.status(400).json({ message: "Erreur : Données incomplètes" });
		return;
	}

	for (let user of usersList) {
		if (user.username === username) {
			res.status(400).json({
				message: "Erreur : Utilisateur déjà existant",
			});
			return;
		}
	}

	newPassword = bcrypt.hashSync(password, saltRounds);
	let newUser = {
		id: usersList.length + 1,
		username: username,
		password: newPassword,
		collection: [],
	};

	usersList.push(newUser);

	let data = JSON.stringify(usersList, null, 2);
	fs.writeFileSync("data/users.json", data);

	res.json({ message: "OK" });
}

function LoginUser(req, res) {
	const fs = require("fs");
	let rawdata = fs.readFileSync("data/users.json");
	let usersList = JSON.parse(rawdata);

	if (!req.body) {
		res.status(400).json({ message: "Erreur : Aucune données" });
		return;
	}

	let username = req.body.username;
	let password = req.body.password;

	if (!username || !password) {
		res.status(400).json({ message: "Erreur : Données incomplètes" });
		return;
	}

	for (let user of usersList) {
		if (user.username === username) {
			if (bcrypt.compareSync(password, user.password)) {
				res.json({
					message: "OK",
					data: {
						token: TokenGenerator.generate(),
					},
				});
				return;
			} else {
				res.status(400).json({
					message: "Erreur : Mauvais mot de passe",
				});
				return;
			}
		}
	}

	res.status(400).json({ message: "Erreur : Utilisateur non trouvé" });
}

function GetUser(req, res) {
	const fs = require("fs");
	let rawdata = fs.readFileSync("data/users.json");
	let usersList = JSON.parse(rawdata);

	let token = req.headers["authorization"];
	if (!token) {
		res.status(400).json({ message: "Erreur : Token manquant" });
		return;
	}

	for (let user of usersList) {
		if (user.token === token) {
			res.json({
				message: "OK",
				data: {
					id: user.id,
					username: user.username,
					collection: user.collection,
				},
			});
			return;
		} else {
			res.status(400).json({ message: "Erreur : Token invalide" });
			return;
		}
	}

	res.status(400).json({ message: "Erreur : Utilisateur non trouvé" });
}

function UpdateUser(req, res) {
	const fs = require("fs");
	let rawdata = fs.readFileSync("data/users.json");
	let usersList = JSON.parse(rawdata);

	let token = req.headers["authorization"];
	if (!token) {
		res.status(400).json({ message: "Erreur : Token manquant" });
		return;
	}

	for (let user of usersList) {
		if (user.token === token) {
			if (req.body.username) {
				user.username = req.body.username;

				let data = JSON.stringify(usersList, null, 2);
				fs.writeFileSync("data/users.json", data);

				res.json({ message: "OK, new username is : " + user.username });
				return;
			}
		}
	}
}

function DisconnectUser(req, res) {
	const fs = require("fs");
	let rawdata = fs.readFileSync("data/users.json");
	let usersList = JSON.parse(rawdata);

	let token = req.headers["authorization"];
	if (!token) {
		res.status(400).json({ message: "Erreur : Token manquant" });
		return;
	}

	for (let user of usersList) {
		if (user.token === token) {
			user.token = null;

			let data = JSON.stringify(usersList, null, 2);
			fs.writeFileSync("data/users.json", data);

			res.json({ message: "Déconnecté avec succès" });
			return;
		}
	}

	res.status(400).json({ message: "Erreur : Utilisateur non trouvé" });
}

module.exports = {
	RegisterUser,
	LoginUser,
	GetUser,
	UpdateUser,
	DisconnectUser,
};
