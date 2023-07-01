/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import Discord, { Colors } from "discord.js";

/**
 * @returns {Discord.APIEmbed}
 */
export function absenceEmbed(absence) {
	/** @type {Discord.APIEmbed} */
	const embed = {
		title: "Absence",
		description:
			`<@${
				absence.userID
			}> sera absent du **${absence.dateStart.toLocaleDateString("fr-FR")}** au **${absence.dateEnd.toLocaleDateString("fr-FR")}**\n` +
			"```\n" +
			absence.reason +
			"\n```\n",
		thumbnail: {
			url: absence.thumbnail,
		},
	};
	const now = new Date();
	if (now < absence.dateStart) {
		embed.color = Colors.Grey;
		embed.description += `**Départ:** <t:${Math.round(absence.dateStart.getTime() / 1000)}:R>`;
	} else {
		embed.color = Colors.DarkRed;
		embed.description += `**Retour:** <t:${Math.round(absence.dateEnd.getTime() / 1000)}:R>`;
	}

	return embed;
}
