import Discord from "discord.js";
import { config } from "../../context.js";

/**
 *
 * @param {Discord.Message} oldMessage
 * @param {Discord.Message} newMessage
 */
export async function logDelete(message) {
	if (message.author.bot) return;
	/** @type {Discord.TextChannel} */
	const channel = await message.guild.channels.fetch(config.logsChannelID);

	channel.send({
		embeds: [
			{
				title: "Message supprimé.",
				description: `<@${message.author.id}> à supprimé un de ces messages.`,
				color: "RED",
				thumbnail: {
					url: message.author.avatarURL(),
				},
				fields: [
					{
						name: "Ancien message:",
						value: "```" + message.content + "```",
					},
				],
			},
		],
	});
}
