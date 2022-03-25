const request = require("request");
const SQ = require("sequelize");

module.exports = {
	name: "roleCreate",
	execute(role, client) {
		client.database.Guild.findOne({
			where: { guild_id: role.guild.id, url: { [SQ.Op.not]: null } },
		}).then((guild) => {
			if (guild == null) return;

			client.statistics.requestsPerInterval++;

			request.post(
				{
					url: guild.url + "api/discord/roles",
					auth: { bearer: guild.sync_token },
					json: {
						id: role.id,
						name: role.name,
						color: role.color.toString(16).padStart(6, "0"),
					},
				},
				(err) => {
					if (err) {
						return console.error("Request failed", err);
					}
				}
			);
		});
	},
};
