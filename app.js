const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/config/swagger");

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
app.use("/", usersRoutes);
app.use("/", cardsRoutes);
app.use("/", bidsRoutes);

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`API TCG listening on http://localhost:${PORT}`);
});

module.exports = app;
