const { DataTypes } = require("sequelize");
const bdd = require("../config/db.js");

const Card = bdd.define("Card", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	rarity: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});

module.exports = Card;
