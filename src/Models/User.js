const { DataTypes } = require("sequelize");
const bdd = require("../config/db.js");

const User = bdd.define("User", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	username: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	collection: {
		type: DataTypes.JSON,
		allowNull: false,
	},
	paw: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	tocken: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	lastBooster: {
		type: DataTypes.DATE,
		allowNull: true,
	},
});

module.exports = User;
