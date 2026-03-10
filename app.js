require("dotenv").config();
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/config/swagger");
const bdd = require("./src/config/db");

const usersRoutes = require("./src/routes/usersRoutes");
const cardsRoutes = require("./src/routes/cardsRoutes");
const bidsRoutes = require("./src/routes/bidsRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use("/", swaggerUi.serve);
app.get("/", swaggerUi.setup(swaggerSpec));

// Routes
app.use("/connect", (req, res) => {
	res.json({ message: "Welcome to the API catTCG !" });
});
app.use("/", usersRoutes);
app.use("/", cardsRoutes);
app.use("/", bidsRoutes);

const PORT = 3000;

bdd.sync({ alter: true })
	.then(() => {
		console.log("✅ Base de données synchronisée");
		app.listen(PORT, () => {
			console.log(`🐱 API TCG listening on http://localhost:${PORT}`);
		});
	})
	.catch((err) => {
		console.error("❌ Erreur de synchronisation:", err);
	});

module.exports = app;
