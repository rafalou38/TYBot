import Discord from "discord.js";
import { config } from "../../context.js";

/**
 *
 * @param {Discord.GuildMember} member
 */
export async function logLeave(member) {
	// check if user leaved because of kick
	const kick = await member.guild
		.fetchAuditLogs({
			type: "MEMBER_KICK",
			limit: 1,
		})
		.then((audit) =>
			audit.entries.first().target.id === member.id
				? {
						reason: audit.entries.first().reason,
						executor: audit.entries.first().executor,
				  }
				: false
		);

	/** @type {Discord.TextChannel} */
	const channel = await member.guild.channels.fetch(config.guilds[member.guild.id].logsChannelID);

	channel.send({
		embeds: [
			{
				title: kick
					? `${member.user.tag} a été kick par ${kick.executor.tag}`
					: `${member.user.tag} est parti`,
				description: kick
					? `pour la raison suivante: ${kick.reason}`
					: `${member} vient de quitter le serveur.`,
				color: kick ? "YELLOW" : "RED",
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
