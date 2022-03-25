import request from "request";
import { Op } from "sequelize";

export const name = "guildMemberUpdate";
export function execute(oldMember, member, client) {
	let addedRole = member._roles.filter(function (val) {
		return oldMember._roles.indexOf(val) < 0;
	})[0];

	let revokedRole = oldMember._roles.filter(function (val) {
		return member._roles.indexOf(val) < 0;
	})[0];

	if (!addedRole && !revokedRole) return;

	let callback = (err) => {
		if (err) {
			return console.error("Request failed", err);
		}
	};

	client.database.Guild.findOne({
		where: { guild_id: member.guild.id, url: { [Op.not]: null } },
	}).then((guild) => {
		if (guild == null) return;

		client.statistics.requestsPerInterval++;

		let role = member.guild.roles.cache.get(addedRole || revokedRole);
		let apiurl = guild.url + "api/discord/users/" + member.user.id + "/roles/" + role.id;

		if (addedRole) {
			request.post({ url: apiurl, auth: { bearer: guild.sync_token } }, callback);
		} else {
			request.delete({ url: apiurl, auth: { bearer: guild.sync_token } }, callback);
		}
	});
}
