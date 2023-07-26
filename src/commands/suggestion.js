import Discord, { Colors } from "discord.js";
import { config } from "../context";
import { Member } from "../database/schemas/Member";
import { addXP, calcRequiredXPForLevel } from "../database/utils/xp";
import { parseInput, getMemberFromText } from "../utils/commands";
import ShowRank from "./xp";

/**@type {Discord.EmbedField[] | Discord.EmbedFieldData[]} */
const syntax = [
	{
		name: "syntaxe:",
		value: "```-suggestion <texte de la suggestion>```",
	},
];

/**
 *
 * @param {Discord.Client<boolean>} client
 * @param {Discord.Message} message
 */
export default async function (client, message) {
	const suggestion = parseInput(message.content).join(" ");

	if (!suggestion) {
		return message.reply({
			embeds: [
				{
					title: "Erreur",
					description: "Veuillez donner une suggestion",
					color: Colors.Red,
					fields: syntax,
				},
			],
		});
	}

	message.delete();

	const sentMessage = await message.channel.send({
		embeds: [
			{
				title: `Suggestion de ${message.author.tag}`,
				description: "```" + suggestion + "```",
				footer: {
					iconURL: message.author.avatarURL(),
					text: message.author.tag,
				},
			},
		],
	});
	await sentMessage.react("✅");
	await sentMessage.react("❌");
}
