const fs = require("fs");
const path = require("path");
const swaggerSpec = require("../src/config/swagger");

const outputDir = path.join(__dirname, "../docs");
const outputFile = path.join(outputDir, "swagger.json");

if (!fs.existsSync(outputDir)) {
	fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputFile, JSON.stringify(swaggerSpec, null, 2), "utf-8");

console.log(`swagger.json généré dans docs/swagger.json`);
