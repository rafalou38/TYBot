import Discord, { Colors } from "discord.js";
import { config } from "../../context.js";

/**
 *
 * @param {Discord.Message} oldMessage
 * @param {Discord.Message} newMessage
 */
export async function logEdit(oldMessage, newMessage) {
	if (newMessage.author.bot) return;
	/** @type {Discord.TextChannel} */
	const channel = await newMessage.guild.channels.fetch(
		config.guilds[newMessage.guildId].logsChannelID
	);

	channel.send({
		embeds: [
			{
				title: "Message Modifié",
				url: newMessage.url,
				thumbnail: {
					url: newMessage.author.avatarURL(),
				},
				description: `<@${newMessage.author.id}> à modifié un de ces messages.`,
				color: Colors.Blue,
				fields: [
					{
						name: "Ancien message:",
						value: "```" + oldMessage.content + "```",
					},
					{
						name: "Nouveau message:",
						value: "```" + newMessage.content + "```",
					},
				],
			},
		],
	});
}
