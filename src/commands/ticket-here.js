import Discord from "discord.js";
import { context } from "../context.js";
import { Member } from "../database/schemas/Member.js";
import { addXP, calcRequiredXPForLevel } from "../database/utils/xp.js";
import { parseInput, getMemberFromText } from "../utils/commands.js";
import ShowRank from "./xp.js";

/**@type {Discord.EmbedField[] | Discord.EmbedFieldData[]} */

/**
 *
 * @param {Discord.Client<boolean>} client
 * @param {Discord.Message} message
 */
export default async function (client, message) {
	await message.channel.send({
		content: "Cliquez ci-dessous pour créer un ticket",
		components: [
			{
				type: "ACTION_ROW",
				components: [
					{
						type: "BUTTON",
						style: "PRIMARY",
						label: "CRÉER UN TICKET",
						customId: "create-ticket",
					},
				],
			},
		],
	});
}
