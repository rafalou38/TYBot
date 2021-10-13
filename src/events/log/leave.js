import Discord from "discord.js";
import { config } from "../../context.js";

/**
 *
 * @param {Discord.GuildMember} member
 */
export async function logLeave(member) {
	/** @type {Discord.TextChannel} */
	const channel = await member.guild.channels.fetch(config.guilds[member.guild.id].logsChannelID);

	channel.send({
		embeds: [
			{
				title: `${member.user.tag} est parti`,
				description: `${member} vient de quitter le serveur.`,
				color: "RED",
				thumbnail: {
					url: member.user.avatarURL(),
				},
				author: {
					iconURL: member.user.avatarURL(),
					name: member.user.tag,
				},
				footer: {
					text: `ID: ${member.id}`,
				},
				timestamp: new Date(),
			},
		],
	});
}
