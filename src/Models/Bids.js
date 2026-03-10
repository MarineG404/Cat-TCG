const { DataTypes } = require("sequelize");
const bdd = require("../config/db.js");

const Bids = bdd.define("Bids", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	cardId: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	sellerId: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	buyerId: {
		type: DataTypes.INTEGER,
		allowNull: true,
	},
	price: {
		type: DataTypes.INTEGER,
		allowNull: true,
	},
	endDate: {
		type: DataTypes.DATE,
		allowNull: true,
	},
	tempAmount: {
		type: DataTypes.JSON,
		allowNull: true,
	},
});

module.exports = Bids;
