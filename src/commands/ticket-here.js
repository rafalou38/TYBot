import Discord, { ButtonStyle, ComponentType } from "discord.js";
import { context } from "../context";
import { Member } from "../database/schemas/Member";
import { addXP, calcRequiredXPForLevel } from "../database/utils/xp";
import { parseInput, getMemberFromText } from "../utils/commands";
import ShowRank from "./xp";

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
				type: ComponentType.ActionRow,
				components: [
					{
						type: ComponentType.Button,
						style: ButtonStyle.Primary,
						label: "CRÉER UN TICKET",
						customId: "create-ticket",
					},
				],
			},
		],
	});
}
