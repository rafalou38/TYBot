import Discord from "discord.js";
import { config } from "../context.js";
import { Member } from "../database/schemas/Member.js";
import { parseInput, getMemberFromText } from "../utils/commands.js";

/**
 *
 * @param {Discord.Guild} guild
 */
export async function checkBirthday(guild) {
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
	const chanel = guild.channels.cache.get(config.anivChannelID);

	users.forEach((user) => {
		chanel.send({
			embeds: [
				{
					title: "🎊   anniversaire   🎁",
					description: `c'est l'anniversaire de <@${user.userID}>!`,
					color: "PURPLE",
				},
			],
		});
	});
}