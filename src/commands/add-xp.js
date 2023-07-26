import Discord, { Colors, PermissionFlagsBits } from "discord.js";
import { Member } from "../database/schemas/Member";
import { addXP, calcRequiredXPForLevel } from "../database/utils/xp";
import { parseInput, getMemberFromText } from "../utils/commands";
import ShowRank from "./xp";

/**@type {Discord.EmbedField[] | Discord.EmbedFieldData[]} */
const syntax = [
	{
		name: "syntaxe:",
		value: "```-add-xp @utilisateur <nombre>```",
	},
];

/**
 *
 * @param {Discord.Client<boolean>} client
 * @param {Discord.Message} message
 */
export default async function (client, message) {
	const admin =
		message.member.permissions.has(PermissionFlagsBits.Administrator) ||
		message.member.id == "623790476713263124";
	if (!admin)
		return message.reply({
			embeds: [
				{
					title: "Erreur",
					description: "Tu n'est pas administrateur",
					color: Colors.Red,
					fields: syntax,
				},
			],
		});

	const [targetMention, rawXp] = parseInput(message.content);
	const target = await getMemberFromText(message.guild, targetMention);
	if (!target) {
		return message.reply({
			embeds: [
				{
					title: "Erreur",
					description: "Veuillez entrer un utilisateur valide",
					color: Colors.Red,
					fields: syntax,
				},
			],
		});
	}
	const xp = rawXp && parseInt(rawXp);
	if (!xp) {
		return message.reply({
			embeds: [
				{
					title: "Erreur",
					description: `La quantité \`${rawXp}\` n'est pas valide`,
					color: Colors.Red,
					fields: syntax,
				},
			],
		});
	}

	await addXP(target, xp);

	await ShowRank(client, message);
}
