import Discord, { Colors } from "discord.js";
import { config } from "../../context";

/**
 *
 * @param {Discord.GuildMember} member
 */
export async function logJoin(member) {
	/** @type {Discord.TextChannel} */
	const channel = await member.guild.channels.fetch(config.guilds[member.guild.id].logsChannelID);

	const createdAt =
		member.user.createdAt.getDate() +
		"/" +
		(member.user.createdAt.getMonth() + 1) +
		"/" +
		member.user.createdAt.getFullYear() +
		" " +
		member.user.createdAt.getHours() +
		"h" +
		member.user.createdAt.getMinutes();

	channel.send({
		embeds: [
			{
				title: `${member.user.tag} à rejoint`,
				description: `${member} vient de rejoindre le serveur.`,
				color: Colors.Green,
				thumbnail: {
					url: member.user.avatarURL(),
				},
				author: {
					iconURL: member.user.avatarURL(),
					name: member.user.tag,
				},
				fields: [
					{
						name: "Création du compte:",
						value: createdAt,
					},
				],
				footer: {
					text: `ID: ${member.id}`,
				},
				timestamp: new Date().toISOString(),
			},
		],
	});
}
