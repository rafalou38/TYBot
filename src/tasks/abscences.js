import Discord, { Colors } from "discord.js";
import { config } from "../context.js";
import { Member } from "../database/schemas/Member.js";
import { parseInput, getMemberFromText } from "../utils/commands.js";
import { log } from "../utils/prettyLog.js";
import { Absence } from "../database/schemas/Absence.js";
import { dateDiff } from "../database/utils/time.js";
/**
 *
 * @param {Discord.Guild} guild
 */
export async function checkAbsences(guild) {
	const absences = await Absence.find({});
	console.log(absences);
	for (const absence of absences) {
		const diff = dateDiff(new Date(), absence.date);
		if (diff.day == 0) {
			try {
				const channel = await guild.channels.fetch(absence.channelID);
				await channel.messages.delete(absence.messageID);
			} catch (error) {
				console.log("Failed to delete absence");
			}
			await absence.delete();
		}
	}
}
