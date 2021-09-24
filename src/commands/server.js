import Discord from "discord.js";
import { description } from "../context.js";

/**
 *
 * @param {Discord.Client<boolean>} client
 * @param {Discord.Message} message
 */
export default async function (client, message) {
	const date = message.guild.createdAt;
	const creation = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
	message.reply({
		content: description,
		embeds: [
			{
				title: message.guild.name,
				description: message.guild.description,
				thumbnail: {
					url: message.guild.iconURL(),
				},
				fields: [
					{
						name: "Crée le:",
						value: creation,
					},
				],
			},
		],
	});
}
