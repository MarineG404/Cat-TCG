const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("../Models/User");
const Bid = require("../Models/Bid");

var TokenGenerator = require("token-generator")({
	salt: "your secret ingredient for this magic recipe",
	timestampMap: "abcdefghij", // 10 chars array for obfuscation proposes
});

async function RegisterUser(req, res) {
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

	let existingUser = await User.findOne({ where: { username: username } });
	if (existingUser) {
		res.status(400).json({
			message: "Erreur : Utilisateur déjà existant",
		});
		return;
	}

	newPassword = bcrypt.hashSync(password, saltRounds);
	let newUser = await User.create({
		username: username,
		password: newPassword,
		collection: [],
		paw: 0,
	});

	res.json({ message: "OK" });
}

async function LoginUser(req, res) {
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

	let user = await User.findOne({ where: { username: username } });
	if (!user) {
		res.status(400).json({ message: "Erreur : Utilisateur non trouvé" });
		return;
	}

	if (bcrypt.compareSync(password, user.password)) {
		const token = TokenGenerator.generate();
		user.token = token;
		await user.save();

		res.json({
			message: "OK",
			data: {
				token: token,
			},
		});
	} else {
		res.status(400).json({
			message: "Erreur : Mauvais mot de passe",
		});
	}
}

async function GetUser(req, res) {
	let token = req.headers["authorization"];
	if (!token) {
		res.status(400).json({ message: "Erreur : Token manquant" });
		return;
	}

	let user = await User.findOne({ where: { token: token } });
	if (!user) {
		res.status(401).json({ message: "Erreur : Token invalide" });
		return;
	}

	let userBids = await Bid.findAll({ where: { sellerId: user.id } });

	res.json({
		message: "OK",
		data: {
			id: user.id,
			username: user.username,
			collection: user.collection,
			paw: user.paw,
			bids: userBids,
		},
	});
}

async function UpdateUser(req, res) {
	let token = req.headers["authorization"];
	if (!token) {
		res.status(400).json({ message: "Erreur : Token manquant" });
		return;
	}

	let user = await User.findOne({ where: { token: token } });
	if (!user) {
		res.status(401).json({ message: "Erreur : Token invalide" });
		return;
	}

	if (req.body.username) {
		user.username = req.body.username;
		await user.save();
		res.json({ message: "OK, new username is : " + user.username });
	}
}

async function DisconnectUser(req, res) {
	let token = req.headers["authorization"];
	if (!token) {
		res.status(400).json({ message: "Erreur : Token manquant" });
		return;
	}

	let user = await User.findOne({ where: { token: token } });
	if (!user) {
		res.status(400).json({ message: "Erreur : Utilisateur non trouvé" });
		return;
	}

	user.token = null;
	await user.save();

	res.json({ message: "Déconnecté avec succès" });
}

module.exports = {
	RegisterUser,
	LoginUser,
	GetUser,
	UpdateUser,
	DisconnectUser,
};
