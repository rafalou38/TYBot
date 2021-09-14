import Discord from "discord.js";
import { Member } from "../database/schemas/Member.js";
import { parseInput, getMemberFromText } from "../utils/commands.js";

/**
 * ban a user
 *
 * !ban @utilisateur raison
 *
 * @param {Discord.Client<boolean>} client
 * @param {Discord.Message} message
 */
export default async function (client, message) {
	// TODO: more detailed: bots, connected...
	message.reply({
		embeds: [
			{
				title: "Utilisateurs du server:",
				thumbnail: {
					url: client.user.avatarURL(),
				},
				description: `${message.guild.memberCount}`,
			},
		],
	});
}
