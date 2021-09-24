import Discord from "discord.js";

/**
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
						value: "Afficher ce message",
					},
					{
						name: "```-invite (@user)```",
						value:
							"Affiche le nombre d'invitations de l'utilisateur, si aucun utilisateur n'est donné vérifie les invitations de la personne executant la commande",
					},
					{
						name: "```-members```",
						value: "Affiche le nombre de personnes sur le server",
					},
					{
						name: "```-xp (@user)```",
						value:
							"Affiche l'experience, le niveau et le rang de l'utilisateur, si aucun utilisateur n'est donné vérifie pour la personne executant la commande",
					},
					{
						name: "```-add-xp @utilisateur <nombre>```",
						value: "Ajoute de l'xp a un utilisateur",
					},
					{
						name: "```-ticket-here```",
						value: "Crée un bouton créer des tickets pour parler aux administrateurs",
					},
					{
						name: "```-suggestion <texte de la suggestion>```",
						value: "Crée une suggestion",
					},
					{
						name: "```-sondage <texte du sondage>```",
						value: "Crée un sondage",
					},
					{
						name: "```-giveaway <temps (secondes)> <prix>```",
						value: "Crée un giveaway avec une réaction pour participer",
					},
					{
						name: "```-aniv jour/mois``` exemple: ```-aniv 03/01``` -> 3 janvier",
						value: "Définit votre anniversaire pour qu'il soit annoncé le jour venu par le bot.",
					},
					{
						name: "```-profile (@user)",
						value: "Affiche le profile de l'utilisateur",
					},
					{
						name: "```-server```",
						value: "Affiche les informations du server",
					},
				],
			},
		],
	});
}
