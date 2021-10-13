import Discord from "discord.js";
import { config } from "../../context.js";
/**
 *
 * @param {Discord.GuildChannel} channel
 */
export async function logChannelDelete(channel) {
	/** @type {Discord.TextChannel} */
	const logChannel = await channel.guild.channels.fetch(
		config.guilds[channel.guild.id].logsChannelID
	);

	logChannel.send({
		embeds: [
			{
				title: `Salon supprimé`,
				description: `ancien nom: ${channel.name}`,
				color: "RED",
				timestamp: new Date(),
			},
		],
	});
}
/**
 *
 * @param {Discord.GuildChannel} channel
 */
export async function logChannelCreate(channel) {
	/** @type {Discord.TextChannel} */
	const logChannel = await channel.guild.channels.fetch(
		config.guilds[channel.guild.id].logsChannelID
	);

	logChannel.send({
		embeds: [
			{
				title: `Salon crée`,
				description: `Nouveau salon: ${channel}`,
				color: "GREEN",
				timestamp: new Date(),
			},
		],
	});
}
