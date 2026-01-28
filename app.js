const express = require("express");
const app = express();
const users = require("./users");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.json({
		message: "Bienvenue sur l'API TCG",
		data: {},
	});
});

app.post("/register", users.RegisterUser);
app.get("/login", users.LoginUser);
app.get("/user", users.GetUser);

app.listen(3000, () => {
	console.log(`API TCG listening on http://localhost:3000`);
});

module.exports = app;
