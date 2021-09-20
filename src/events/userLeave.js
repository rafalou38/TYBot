import Discord from "discord.js";
import { config } from "../context.js";
import { Member } from "../database/schemas/Member.js";
import { getChanelById } from "../utils/channels.js";

/**
 *
 * @param {Discord.GuildMember} member
 */
export async function userLeave(member) {
	const channel = await getChanelById(config.userJoinChannelID);
	if (!channel || !channel.isText()) return;

	/** @type {IMember} */
	const DBMemberLeave = await Member.findOne({
		guildID: member.guild.id,
		userID: member.id,
	});

	if (!DBMemberLeave) return;

	const DBMemberInviter = await Member.findOneAndUpdate(
		{
			guildID: member.guild.id,
			userID: DBMemberLeave.invitedBy,
		},
		{ $inc: { invites: -1 } },
		{
			new: true,
		}
	);

	channel.send({
		embeds: [
			{
				title: `Bye ${member.user.tag}`,
				description: `<@${member.id}> nous a quittées`,
				thumbnail: {
					url: member.user.avatarURL(),
				},
				fields: [
					{
						name: "Il avait été invité par",
						value: `<@${DBMemberInviter.userID}>`,
					},
					{
						name: "Qui à désormais:",
						value: `${DBMemberInviter.invites} invites`,
					},
				],
			},
		],
	});
}
