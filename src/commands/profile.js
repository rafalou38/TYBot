import Discord, { ActivityType } from "discord.js";
import { Member } from "../database/schemas/Member";
import { parseInput, getMemberFromText } from "../utils/commands";
import { formatDate, timeDiff } from "../utils/time";
/**
 *
 * @param {Discord.Client<boolean>} client
 * @param {Discord.Message} message
 */
export default async function (client, message) {
	const [targetMention] = parseInput(message.content);
	const target = targetMention
		? await getMemberFromText(message.guild, targetMention)
		: message.member;

	/** @type {import("../../types/db/Member.js").IMember | null} */
	const foundTarget = await Member.findOne({
		guildID: message.guild.id,
		userID: target.id,
	});

	/**@type {Discord.EmbedFieldData[]} */
	let DBfields = [];
	if (foundTarget) {
		DBfields = [
			{
				name: "Invitations",
				value: foundTarget.invites.toString() || 0,
				inline: true,
			},
			{
				name: "Invité par",
				value: "<@" + (foundTarget.invitedBy || "inconnu") + ">",
				inline: true,
			},
			{
				name: "Anniversaire",
				value: foundTarget.birthday || "inconnu",
				inline: true,
			},
			// {
			// 	name: "Niveau",
			// 	value: foundTarget.level.toString() || 0,
			// 	inline: true,
			// },
			{
				name: "Compte crée le",
				value: formatDate(target.user.createdAt),
				inline: true,
			},
			{
				name: "A rejoint le",
				value: formatDate(target.joinedAt),
				inline: true,
			},
		];
	}
	DBfields.push({
		name: "Roles",
		value: target.roles.cache.map((r) => `<@&${r.id}>`).join(" ") || "aucuns",
	});
	if (target.presence) {
		const status = target.presence.activities.find((act) => act.type === ActivityType.Custom);
		if (status) {
			DBfields.push({
				name: "Status:",
				value: "```" + status.state + "```",
			});
		}
	}

	message.reply({
		embeds: [
			{
				title: `Profile de ${target.user.username}`,
				thumbnail: {
					url: target.user.avatarURL(),
				},
				description: `Profile de <@${target.id}>`,
				fields: DBfields,
			},
		],
	});
}
