const bcrypt = require("bcrypt");
const saltRounds = 10;
const myPlaintextPassword = "s0/\/\P4$$w0rD";
const someOtherPlaintextPassword = "not_bacon";

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
						token: user.token,
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

module.exports = {
	RegisterUser,
	LoginUser,
};
