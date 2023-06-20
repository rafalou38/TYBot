import Discord, { Colors, PermissionFlagsBits } from "discord.js";
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
	const admin =
		message.member.permissions.has(PermissionFlagsBits.Administrator)
		|| message.member.roles.cache.has(config.guilds[message.guildId].communityRoleID)
		|| message.member.roles.cache.has(config.guilds[message.guildId].modRoleID);
	if (!admin)
		return message.reply({
			embeds: [
				{
					title: "Erreur",
					description: "Tu n'as pas la permission d'utiliser cette commande",
					color: Colors.Red,
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
					color: Colors.Red,
					fields: syntax,
				},
			],
		});
	}

	/** @type {Discord.TextChannel} */
	const sentMessage = await message.channel.send({
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
