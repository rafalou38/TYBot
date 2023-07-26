import { GuildMember } from "discord.js";
import { config } from "../../context";
import { Member } from "../schemas/Member";

/**
 *
 * @param {GuildMember} member
 */
export async function userActive(member) {
	member.roles.add(config.guilds[member.guild.id].activeRoleID || "");

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

	DBMember.lastActive = new Date();
	await DBMember.save();
}
