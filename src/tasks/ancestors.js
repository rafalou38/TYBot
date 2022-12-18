import Discord from "discord.js";
import { config } from "../context.js";

/**
 *
 * @param {Discord.Guild} guild
 */
export async function checkAncestor(guild) {
	const members = await guild.members.fetch();
	const { ancestorRoleID, ancestor2RoleID, ancestor3RoleID } = config.guilds[guild.id];
	const now = new Date();
	members.forEach(async (member) => {
		const since = new Date(member.joinedTimestamp);
		const diff = now.getTime() - since.getTime();
		const diffYears = Math.floor(diff / (1000 * 3600 * 24 * 365));

		if (diffYears >= 3) {
			if (!member.roles.cache.has(ancestor3RoleID)) await member.roles.add(ancestor3RoleID);
		}
		if (diffYears >= 2) {
			if (!member.roles.cache.has(ancestor2RoleID)) await member.roles.add(ancestor2RoleID);
		}
		if (diffYears >= 1) {
			if (!member.roles.cache.has(ancestorRoleID)) await member.roles.add(ancestorRoleID);
		}
	});
}
