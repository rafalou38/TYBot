import Discord from "discord.js";
import { config } from "../../context.js";

/**
 *
 * @param {Discord.Message} message
 */
export async function logDelete(message) {
	if (message.author.bot) return;
	/** @type {Discord.TextChannel} */
	const channel = await message.guild.channels.fetch(config.guilds[message.guildId].logsChannelID);

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
