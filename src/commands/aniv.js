import Discord, { Colors } from "discord.js";
import { Member } from "../database/schemas/Member";
import { parseInput, getMemberFromText } from "../utils/commands";

/**@type {Discord.EmbedField[] | Discord.EmbedFieldData[]} */
const syntax = [
	{
		name: "syntaxe:",
		value: "```-aniv jour/mois``` exemple: ```-aniv 03/01``` -> 3 janvier",
	},
];

/**
 *
 * @param {Discord.Client<boolean>} client
 * @param {Discord.Message} message
 */
export default async function (client, message) {
	const [date] = parseInput(message.content);
	if (!date.match(/\d{2}\/\d{2}/)) {
		return message.reply({
			embeds: [
				{
					title: "Erreur",
					description: "Mauvaise date",
					color: Colors.Red,
					fields: syntax,
				},
			],
		});
	}

	/** @type {import("../../types/db/Member.js").IMember} */
	let foundTarget = await Member.findOne({
		guildID: message.guild.id,
		userID: message.author.id,
	});
	if (foundTarget) {
		foundTarget.birthday = date;
		await foundTarget.save();
	} else {
		foundTarget = new Member({
			guildID: message.guild.id,
			userID: message.author.id,
			birthday: date,
		});
	}

	message.reply({
		embeds: [
			{
				title: "Anniversaire défini",
				thumbnail: {
					url: message.author.avatarURL(),
				},
				description:
					`<@${message.author.id}> ton anniversaire à été défini: ` + "```" + date + "```",
			},
		],
	});
}
