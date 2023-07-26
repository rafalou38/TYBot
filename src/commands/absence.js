import Discord, { Colors, PermissionFlagsBits } from "discord.js";
import { config } from "../context";
import { Member } from "../database/schemas/Member";
import { addXP, calcRequiredXPForLevel } from "../database/utils/xp";
import { parseInput, getMemberFromText } from "../utils/commands";
import ShowRank from "./xp";
import { Absence } from "../database/schemas/Absence";
import { absenceEmbed } from "../database/utils/embed";

/**@type {Discord.EmbedField[] | Discord.EmbedFieldData[]} */
const syntax = [
	{
		name: "syntaxe:",
		value: "```-absence ( début ) JJ/MM ( fin ) JJ/MM  motif ....```",
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
		message.member.roles.cache.has(config.guilds[message.guildId].staffRoleID);
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

	const [start, end, ...reasonRaw] = parseInput(message.content);
	const reason = reasonRaw.join(" ");

	if (!start.match(/\d\d\/\d\d/) || !end.match(/\d\d\/\d\d/) || !reason) {
		message.reply({
			embeds: [
				{
					title: "Erreur",
					description: "La commande n'est pas valide",
					fields: syntax,
					color: Colors.Red,
				},
			],
		});
	}

	const dateEnd = new Date();
	dateEnd.setMonth(parseInt(end.match(/\d\d\/(\d\d)/)[1]) - 1);
	dateEnd.setDate(parseInt(end.match(/(\d\d)\/\d\d/)[1]));
	const dateStart = new Date();
	dateStart.setMonth(parseInt(start.match(/\d\d\/(\d\d)/)[1]) - 1);
	dateStart.setDate(parseInt(start.match(/(\d\d)\/\d\d/)[1]));

	await message.delete();
	const doc = new Absence({
		guildID: message.guildId,
		channelID: message.channel.id,
		messageID: "",
		userID: message.author.id,
		thumbnail: message.author.displayAvatarURL(),
		dateEnd,
		dateStart,
		reason,
	});

	const msgSent = await message.channel.send({
		embeds: [absenceEmbed(doc)],
	});
	doc.messageID = msgSent.id;
	await doc.save();
}
