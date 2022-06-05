import Discord from "discord.js";
import { config } from "../context.js";

/**
 *
 * @param {Discord.Client<boolean>} client
 * @param {Discord.Message} message
 */
export default async function (client, message) {
	if (!message.member.permissions.has("ADMINISTRATOR") && message.author.id !== config.myID) {
		return message.reply({
			embeds: [
				{
					title: "Erreur",
					color: "RED",
					description: "Tu n'as pas le permission d'utiliser cette commande",
				},
			],
		});
	}

	message.delete();

	const roles = message.content.replace("-react-roles ", "");
	const rolesObject = roles.split(",").map((role) => {
		const [emoji, name, id] = role.split(":");
		return {
			emoji: emoji,
			name: name,
			id: id,
		};
	});

	const reply = await message.channel?.send({
		embeds: [
			{
				title: "Roles",
				description:
					"Clique sur une réaction pour obtenir le role correspondant" +
					"\n" +
					rolesObject
						.map((role) => role.emoji + " = " + role.name + " (" + role.id + ")")
						.join("\n"),
				color: "GREEN",
			},
		],
	});

	rolesObject.forEach((role) => {
		reply?.react(role.emoji);
	});

	return {
		status: "OK",
		label: "succès",
	};
}
