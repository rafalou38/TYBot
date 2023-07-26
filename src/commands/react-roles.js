import Discord, { Colors, PermissionFlagsBits } from "discord.js";
import { config } from "../context";

/**
 *
 * @param {Discord.Client<boolean>} client
 * @param {Discord.Message} message
 */
export default async function (client, message) {
	if (
		!message.member.permissions.has(PermissionFlagsBits.Administrator) &&
		message.author.id !== config.myID
	) {
		return message.reply({
			embeds: [
				{
					title: "Erreur",
					color: Colors.Red,
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
				color: Colors.Green,
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
