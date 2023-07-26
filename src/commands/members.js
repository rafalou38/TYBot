import Discord from "discord.js";
import { config } from "../context";
import { Member } from "../database/schemas/Member";
import { parseInput, getMemberFromText } from "../utils/commands";

/**
 *
 * @param {Discord.Client<boolean>} client
 * @param {Discord.Message} message
 */
export default async function (client, message) {
	const roles = await Promise.all(
		config.guilds[message.guildId].membersRolesIds.map(
			async (roleID) => await message.guild.roles.fetch(roleID)
		)
	);

	message.reply({
		embeds: [
			{
				title: "Utilisateurs du server:",
				thumbnail: {
					url: client.user.avatarURL(),
				},
				description:
					`membres: **${message.guild.memberCount}**\n\n` +
					roles.map((role, i) => `${role}:    **${role.members.size}**`).join("\n\n"),
			},
		],
	});
}
