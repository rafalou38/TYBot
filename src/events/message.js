import Discord from "discord.js";
import { config } from "../context.js";
import { Member } from "../database/schemas/Member.js";
import { addXP } from "../database/utils/xp.js";
import { getChanelById } from "../utils/channels.js";
import { getInvite } from "../utils/invites.js";
import { log } from "../utils/prettyLog.js";

/** @type {Record<string, Date} */
const lastMessages = {};
/**
 *
 * @param {Discord.Message} message
 */
export async function countXP(message) {
	if (message.author.bot) return;

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
		message.channel.send(
			`<@${message.author.id}> à monté de niveau:\nil est désormais au niveau **${newLevel}**`
		);
	}
}
