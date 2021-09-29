import Discord from "discord.js";
import { config } from "../../context.js";
import { Member } from "../schemas/Member.js";

/**
 *	if the user level's up return new level
 * @param {Discord.GuildMember} member
 * @returns {Promise<Number | void>}
 */
export async function addXP(member, count = null) {
	/** @type {import("../../../types/db/Member.js").IMember} */
	let DBMember = await Member.findOne({
		guildID: member.guild.id,
		userID: member.id,
	});

	if (!DBMember) {
		DBMember = new Member({
			guildID: member.guild.id,
			userID: member.id,
		});
	}
	DBMember.xp += count || config.xpIncrement;
	const requiredXPForLevel = calcRequiredXPForLevel(DBMember.level);
	if (DBMember.xp >= requiredXPForLevel) {
		DBMember.xp = 0;
		DBMember.level += 1;
		if (DBMember.level && config.xpRolesIDS[DBMember.level]) {
			let role = await member.guild.roles.fetch(config.xpRolesIDS[DBMember.level]);
			member.roles.add(role);
		}
		await DBMember.save();
		return DBMember.level;
	}
	await DBMember.save();
}

export function calcRequiredXPForLevel(level = 0) {
	return 20 + level * config.xpRequiredIncrease;
}
