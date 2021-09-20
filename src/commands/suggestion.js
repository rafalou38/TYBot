import Discord from "discord.js";
import { config } from "../context.js";
import { Member } from "../database/schemas/Member.js";
import { addXP, calcRequiredXPForLevel } from "../database/utils/xp.js";
import { parseInput, getMemberFromText } from "../utils/commands.js";
import ShowRank from "./xp.js";

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
					color: "RED",
					fields: syntax,
				},
			],
		});
	}

	/** @type {Discord.TextChannel} */
	const channel = message.guild.channels.cache.get(config.suggestionsChannelID);
	const sentMessage = await channel.send({
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
