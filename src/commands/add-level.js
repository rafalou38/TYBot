import Discord, { Colors, PermissionFlagsBits } from "discord.js";
import { Member } from "../database/schemas/Member.js";
import { addLvl, addXP, calcRequiredXPForLevel } from "../database/utils/xp.js";
import { parseInput, getMemberFromText } from "../utils/commands.js";
import ShowRank from "./xp.js";

/**@type {Discord.EmbedField[] | Discord.EmbedFieldData[]} */
const syntax = [
	{
		name: "syntaxe:",
		value: "```-add-level @utilisateur <nombre>```",
	},
];

/**
 *
 * @param {Discord.Client<boolean>} client
 * @param {Discord.Message} message
 */
export default async function (client, message) {
	const admin = message.member.permissions.has(PermissionFlagsBits.Administrator);
	// const admin = true;
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

	const [targetMention, rawLvl] = parseInput(message.content);
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
	const Lvl = rawLvl && parseInt(rawLvl);
	if (!Lvl) {
		return message.reply({
			embeds: [
				{
					title: "Erreur",
					description: `La quantité \`${rawLvl}\` n'est pas valide`,
					color: Colors.Red,
					fields: syntax,
				},
			],
		});
	}

	await addLvl(target, Lvl);

	await ShowRank(client, message);
}
