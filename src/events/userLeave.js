import Discord from "discord.js";
import { config } from "../context.js";
import { Member } from "../database/schemas/Member.js";
import { getChanelById } from "../utils/channels.js";

/**
 *
 * @param {Discord.GuildMember} member
 */
export async function userLeave(member) {
	const channel = await getChanelById(config.guilds[member.id].userJoinChannelID);
	if (!channel || !channel.isText()) return;

	/** @type {import("../../types/db/Member.js").IMember} */
	const DBMemberLeave = await Member.findOne({
		guildID: member.guild.id,
		userID: member.id,
	});
	/** @type {import("../../types/db/Member.js").IMember} */
	let DBMemberInviter;
	if (DBMemberLeave) {
		DBMemberInviter = await Member.findOneAndUpdate(
			{
				guildID: member.guild.id,
				userID: DBMemberLeave.invitedBy,
			},
			{ $inc: { invites: -1 } },
			{
				new: true,
			}
		);
	}

	channel.send({
		embeds: [
			{
				title: `Bye ${member.user.tag}`,
				description: `<@${member.id}> nous a quittées`,
				color: "RED",
				thumbnail: {
					url: member.user.avatarURL(),
				},
				fields: DBMemberInviter
					? [
							{
								name: "Il avait été invité par",
								value: `<@${DBMemberInviter.userID}>`,
							},
							{
								name: "Qui à désormais:",
								value: `${DBMemberInviter.invites} invites`,
							},
					  ]
					: [],
			},
		],
	});
}
