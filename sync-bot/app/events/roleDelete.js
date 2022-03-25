const request = require("request");
const SQ = require("sequelize");

module.exports = {
	name: "roleDelete",
	execute(role, client) {
		client.database.Guild.findOne({
			where: { guild_id: role.guild.id, url: { [SQ.Op.not]: null } },
		}).then((guild) => {
			if (guild == null) return;

			client.statistics.requestsPerInterval++;

			request.delete(
				{
					url: `${guild.url}api/discord/roles/${role.id}`,
					auth: { bearer: guild.sync_token },
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
