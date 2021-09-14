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
				thumbnail: {
					url: client.user.avatarURL(),
				},
				fields: [
					{
						name: "```-help```",
						value: "Permet d'afficher ce message",
					},
					{
						name: "```-invite (@user)```",
						value:
							"Affiche le nombre d'invitations de l'utilisateur, si aucun utilisateur n'est donné vérifie les invitations de la personne executant la commande",
					},
					{
						name: "```-members```",
						value: "Affiche le nombre de personnes",
					},
				],
			},
		],
	});
}
