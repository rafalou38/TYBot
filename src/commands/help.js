import Discord from "discord.js";

/**
 * ban a user
 *
 * !ban @utilisateur raison
 *
 * @param {Discord.Client<boolean>} client
 * @param {Discord.Message} message
 */
export default async function (client, message) {
	message.reply({
		embeds: [
			{
				title: "Voila mes commandes",
				author: client.user.username,
				fields: [
					{
						name: "```-help```",
						value: "Permet d'afficher ce message",
					},
				],
			},
		],
	});
}
