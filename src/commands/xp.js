import Discord from "discord.js";
import { Member } from "../database/schemas/Member.js";
import { calcRequiredXPForLevel } from "../database/utils/xp.js";
import { parseInput, getMemberFromText } from "../utils/commands.js";

/**
 * ban a user
 *
 * !ban @utilisateur raison
 *
 * @param {Discord.Client<boolean>} client
 * @param {Discord.Message} message
 */
export default async function (client, message) {
	const [targetMention] = parseInput(message.content);
	const target = targetMention
		? await getMemberFromText(message.guild, targetMention)
		: message.member;

	if (!target) return await message.reply("user not found");

	/** @type {import("../../types/db/Member.js").IMember} */
	const foundTarget = await Member.findOne({
		guildID: message.guild.id,
		userID: target.id,
	});

	// CALCULATE RANK

	/**@type {import("../../types/db/Member.js").IMember} */
	const lead = await Member.find(
		{
			guildID: message.guild.id,
		},
		"xp level"
	).sort("-level -xp");

	const rank = [...lead].map((m) => m.id).indexOf(foundTarget.id) + 1;

	message.reply({
		embeds: [
			{
				title: `XP de ${target.user.username}`,
				thumbnail: {
					url: target.user.avatarURL(),
				},
				description: "Envoie des messages pour monter de niveau  👍",
				fields: [
					{
						name: "xp:",
						value: `\`\`\`${foundTarget.xp}/${calcRequiredXPForLevel(foundTarget.level)}\`\`\``,
					},
					{
						name: "level    🏆",
						value: `\`\`\`${foundTarget.level}\`\`\``,
					},
					{
						name: "rank    🥇",
						value: `\`\`\`${rank}\`\`\``,
					},
				],
			},
		],
	});
}
