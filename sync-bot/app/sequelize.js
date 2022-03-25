module.exports = function (config) {
	if (config == null) config = {};
	var SQ = {};

	const Sequelize = require("sequelize");
	const sequelize = new Sequelize(
		config.database || process.env.DB_DATABASE || "",
		config.username || process.env.DB_USERNAME || "",
		config.password || process.env.DB_PASSWORD || "",
		{
			dialect: config.dialect || process.env.DB_DIALECT || "sqlite",
			host: config.host || process.env.DB_HOST || "127.0.0.1",
			port: config.port || process.env.DB_PORT || 3306,
			pool: {
				max: 100,
				min: 0,
				acquire: 30000,
				idle: 10000,
			},
			storage: "db.sqlite",
			logging: false,
		}
	);

	SQ.Op = Sequelize.Op;

	SQ.Customer = sequelize.define("customer", {
		steamid: Sequelize.STRING,
		sync_token: Sequelize.STRING,
	});

	SQ.Guild = sequelize.define("guild", {
		guild_id: Sequelize.STRING,
		sync_token: Sequelize.STRING,
		url: Sequelize.STRING,
	});

	sequelize.sync({ force: false }).then(console.log("Database initialized."));

	return SQ;
};
