import Discord, { Colors } from "discord.js";
import { config } from "../context";
import { Member } from "../database/schemas/Member";
import { parseInput, getMemberFromText } from "../utils/commands";
import { log } from "../utils/prettyLog";
import { Absence } from "../database/schemas/Absence";
import { dateDiff } from "../database/utils/time";
import { absenceEmbed } from "../database/utils/embed";
/**
 *
 * @param {Discord.Guild} guild
 */
export async function checkAbsences(guild) {
	const absences = await Absence.find({});
	const now = new Date();
	for (const absence of absences) {
		const channel = await guild.channels.fetch(absence.channelID);
		if (now >= absence.dateEnd) {
			try {
				await channel.messages.delete(absence.messageID);
			} catch (error) {
				console.log("Failed to delete absence");
			}
			await absence.delete();
		} else {
			try {
				const message = await channel.messages.fetch(absence.messageID);
				await message.edit({
					embeds: [absenceEmbed(absence)],
				});
			} catch {}
		}
	}
}
