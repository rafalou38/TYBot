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

	if (DBMember.level >= config.maxLevel || (count && count > 0)) return;

	DBMember.xp += count || config.xpIncrement;
	const requiredXPForLevel = calcRequiredXPForLevel(DBMember.level);
	if (DBMember.xp >= requiredXPForLevel) {
		DBMember.xp = 0;
		DBMember.level += 1;
		const xpRoles = config.guilds[member.guild.id].xpRolesIDS;
		if (DBMember.level && xpRoles[DBMember.level]) {
			let role = await member.guild.roles.fetch(
				config.guilds[member.guild.id].xpRolesIDS[DBMember.level]
			);
			member.roles.add(role);
			if (xpRoles[DBMember.level - 5]) member.roles.remove(xpRoles[DBMember.level - 5]);
		}
		await DBMember.save();
		return DBMember.level;
	}
	await DBMember.save();
}
/**
 * @param {Discord.GuildMember} member
 * @returns {Promise<Number | void>}
 */
export async function addLvl(member, count = null) {
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
	DBMember.level += count || 1;
	await DBMember.save();
}
export function calcRequiredXPForLevel(level = 0) {
	if (level >= 100) return Infinity;
	return 20 + level * config.xpRequiredIncrease;
}
