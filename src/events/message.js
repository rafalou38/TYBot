import Discord from "discord.js";
import { config } from "../context";
import { Member } from "../database/schemas/Member";
import { addXP } from "../database/utils/xp";
import { getChanelById } from "../utils/channels";
import { getInvite } from "../utils/invites";
import { log } from "../utils/prettyLog";
import { userActive } from "../database/utils/activity";

/** @type {Record<string, Date} */
const lastMessages = {};
/**
 *
 * @param {Discord.Message} message
 */
export async function countXP(message) {
	if (message.author.bot) return;
	userActive(message.member);

	const last = lastMessages[message.author.id];
	const now = new Date();
	let newLevel = null;
	if (last) {
		const diffSec = Math.abs(last - now) / 1000;
		if (diffSec > config.xpAddDelaySeconds) {
			lastMessages[message.author.id] = now;
			newLevel = await addXP(message.member);
		}
	} else {
		newLevel = await addXP(message.member);
		lastMessages[message.author.id] = now;
	}

	if (newLevel) {
		const channel = await message.guild.channels.fetch(
			config.guilds[message.guildId].levelUpChannelID
		);
		await channel.send(
			`<@${message.author.id}> est monté de niveau:\nil est désormais au niveau **${newLevel}**`
		);
	}
}
