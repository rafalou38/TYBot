import Discord from "discord.js";
import { Member } from "../database/schemas/Member";
import { calcRequiredXPForLevel } from "../database/utils/xp";
import { parseInput, getMemberFromText } from "../utils/commands";

const ranks = new Map([
	[1, "🥇"],
	[2, "🥈"],
	[3, "🥉"],
	[4, "4️⃣"],
	[5, "5️⃣"],
	[6, "6️⃣"],
	[7, "7️⃣"],
	[8, "8️⃣"],
	[9, "9️⃣"],
]);

/**
 *
 * @param {Discord.Client<boolean>} client
 * @param {Discord.Message} message
 */
export default async function (client, message) {
	// CALCULATE RANK

	/**@type {import("../../types/db/Member.js").IMember[]} */
	const lead = await Member.find(
		{
			guildID: message.guild.id,
		},
		"xp level userID",
		{
			limit: 9,
		}
	).sort("-level -xp");
	message.reply({
		embeds: [
			{
				title: "Classement",
				thumbnail: {
					url: message.guild.iconURL(),
				},
				description:
					"Classement du serveur\n\n" +
					lead.map((usr, i) => ranks.get(i + 1) + `: <@${usr.userID}>`).join("\n\n"),
			},
		],
	});
}
