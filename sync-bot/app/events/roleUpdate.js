const request = require("request");
const SQ = require("sequelize");

module.exports = {
	name: "roleUpdate",
	execute(oldRole, role, client) {
		if (oldRole.name == "@everyone" || role.name == "new role") return;

		if (oldRole.name == role.name && oldRole.color == role.color) return;

		client.database.Guild.findOne({
			where: { guild_id: role.guild.id, url: { [SQ.Op.not]: null } },
		}).then((guild) => {
			if (guild == null) return;

			client.statistics.requestsPerInterval++;

			request(
				{
					url: guild.url + "api/discord/roles/" + role.id,
					method: "PUT",
					auth: { bearer: guild.sync_token },
					json: {
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
