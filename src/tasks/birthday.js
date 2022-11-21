import Discord from "discord.js";
import { config } from "../context.js";
import { Member } from "../database/schemas/Member.js";
import { parseInput, getMemberFromText } from "../utils/commands.js";
import { log } from "../utils/prettyLog.js";
/**
 *
 * @param {Discord.Guild} guild
 */
export async function checkBirthday(guild) {
	log("checking birthday:");
	const birthRole = await guild.roles.fetch(config.guilds[guild.id].birthdayRoleID);
	let removeRoles = birthRole.members;

	log("\tUsers with role: ", removeRoles.map(v => v.user.tag));

	const today = new Date();
	let month = today.getMonth() + 1;
	let day = today.getDate();

	if (month < 10) {
		month = 0 + month.toString();
	}
	if (day < 10) {
		day = 0 + day.toString();
	}

	const now = day + "/" + month;

	/**@type {import("../../types/db/Member.js").IMember[]} */
	const users = await Member.find({
		birthday: now,
		guildID: guild.id,
	});

	/** @type {Discord.TextChannel}*/
	const chanel = guild.channels.cache.get(config.guilds[guild.id].anivChannelID);

	await Promise.all(users.map(async (user) => {
		let alreadySent = false;
		log(`\ttoday is ${user.userID}`);
		removeRoles = removeRoles.filter((m) => {
			if (m.id == user.userID) {
				alreadySent = true;
				return false;
			} else {
				return true;
			}
		});

		if (!alreadySent) {
			await chanel.send({
				embeds: [
					{
						title: "🎊   anniversaire   🎁",
						description: `C'est l'anniversaire de <@${user.userID}>!`,
						color: "PURPLE",
					},
				],
			});
			await guild.members.cache.get(user.userID).roles.add(birthRole);
			log("\t\t role added");
		}
	}));

	removeRoles.forEach(async (member) => {
		await member.roles.remove(birthRole);
		log(`\tremoved birthday of ${member.user.tag}`);
	});
}
