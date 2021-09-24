import Discord from "discord.js";
import { Member } from "../database/schemas/Member.js";
import { parseInput, getMemberFromText } from "../utils/commands.js";

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

	if (!target) return await message.reply("Cet utilisateur n'existe pas");
	/** @type {IMember} */
	const foundTarget = await Member.findOne({
		guildID: message.guild.id,
		userID: target.id,
	});

	message.reply({
		embeds: [
			{
				title: `Invitations de ${target.user.username}`,
				thumbnail: {
					url: target.user.avatarURL(),
				},
				description: `<@${target.id}> a actuellement ${foundTarget.invites} invitations`,
			},
		],
	});
}
