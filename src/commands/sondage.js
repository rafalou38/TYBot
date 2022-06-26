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
		value: "```-sondage <texte du sondage>```",
	},
];

/**
 *
 * @param {Discord.Client<boolean>} client
 * @param {Discord.Message} message
 */
export default async function (client, message) {
	const admin = message.member.permissions.has("ADMINISTRATOR");
	if (!admin)
		return message.reply({
			embeds: [
				{
					title: "Erreur",
					description: "Tu n'est pas administrateur",
					color: "RED",
					fields: syntax,
				},
			],
		});

	const sondage = parseInput(message.content).join(" ");

	if (!sondage) {
		return message.reply({
			embeds: [
				{
					title: "Erreur",
					description: "Veuillez donner un sondage",
					color: "RED",
					fields: syntax,
				},
			],
		});
	}

	/** @type {Discord.TextChannel} */
	const channel = message.guild.channels.cache.get(config.guilds[message.guildId].sondageChannelID);
	const sentMessage = await channel.send({
		embeds: [
			{
				title: `Sondage de ${message.author.tag}`,
				description: sondage,
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
