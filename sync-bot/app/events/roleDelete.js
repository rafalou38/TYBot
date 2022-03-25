import request from "request";
import { Op } from "sequelize";

export const name = "roleDelete";
export function execute(role, client) {
	client.database.Guild.findOne({
		where: { guild_id: role.guild.id, url: { [Op.not]: null } },
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
}
