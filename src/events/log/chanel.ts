import Discord, { Colors, DMChannel, NonThreadGuildBasedChannel, TextChannel } from "discord.js";
import { config } from "../../context";


export async function logChannelDelete(channel: NonThreadGuildBasedChannel | DMChannel) {
	if (channel.type !== Discord.ChannelType.GuildText) return;

	/** @type {Discord.TextChannel} */
	const logChannel = await channel.guild.channels.fetch(
		config.guilds[channel.guild.id].logsChannelID
	);
	if (logChannel.type !== Discord.ChannelType.GuildText) return;


	logChannel.send({
		embeds: [
			{
				title: "Salon supprimé",
				description: `Ancien nom: ${channel.name}`,
				color: Colors.Red,
				timestamp: new Date().toISOString(),
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
				title: "Salon crée",
				description: `Nouveau salon: ${channel}`,
				color: Colors.Green,
				timestamp: new Date().toISOString(),
			},
		],
	});
}
