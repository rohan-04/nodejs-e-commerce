const Sequelize = require('sequelize');

//  Import the DB connection
const sequelize = require('../util/database');

const User = sequelize.define('user', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	name: Sequelize.STRING,
	email: Sequelize.STRING,
});

module.exports = User;
